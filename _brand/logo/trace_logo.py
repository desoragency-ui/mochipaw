import re, numpy as np, vtracer
from PIL import Image, ImageFilter

SCALE = 5
src = Image.open('_brand/brand-board.jpg').convert('RGB').crop((30, 30, 890, 305))
a = np.asarray(src).astype(float)
cream = np.array([250, 245, 235.])
purple = np.array([94, 62, 223.])
orange = np.array([255, 94, 54.])

def coverage(colour):
    axis = colour - cream
    return np.clip(((a - cream) @ axis) / (axis @ axis), 0, 1)

d_p = np.linalg.norm(a - purple, axis=2)
d_o = np.linalg.norm(a - orange, axis=2)
cov_p = np.where(d_p < d_o, coverage(purple), 0)
cov_o = np.where(d_o <= d_p, coverage(orange), 0)

# Everything that is not the wordmark or the paw is blanked out by position.
yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
# The tagline climbs from left to right just under the letters; the star is purple, bottom right.
line = np.interp(xx, [170, 203, 420, 680], [266, 262, 242, 234])
marks = (xx < 58) | ((xx < 96) & (yy < 110))
tagline = (xx >= 170) & (xx < 680) & (yy >= line)
cov_p = np.where(marks | tagline | ((xx >= 680) & (yy >= 240)), 0, cov_p)
cov_o = np.where(marks | tagline, 0, cov_o)

def clean(cov):
    big = Image.fromarray((cov * 255).astype('uint8')).resize(
        (cov.shape[1] * SCALE, cov.shape[0] * SCALE), Image.LANCZOS)
    big = big.filter(ImageFilter.GaussianBlur(SCALE * 0.9))
    return np.asarray(big) > 127

purple_mask = clean(cov_p).copy()
# Boss 2026-11-04: remove the two small white marks inside the M and the C.
purple_mask[985:1135, 585:705] = True
purple_mask[850:1010, 1770:1880] = True
orange_mask = clean(cov_o)

def trace(mask, name):
    Image.fromarray(np.where(mask, 0, 255).astype('uint8')).save(f'_brand/logo/{name}.png')
    vtracer.convert_image_to_svg_py(
        f'_brand/logo/{name}.png', f'_brand/logo/{name}.svg', colormode='binary', mode='spline',
        filter_speckle=30, corner_threshold=70, length_threshold=6.0, splice_threshold=45, path_precision=1)
    svg = open(f'_brand/logo/{name}.svg', encoding='utf8').read()
    return re.findall(r'<path d="([^"]+)"[^>]*?transform="translate\(([-\d.]+),([-\d.]+)\)"', svg)

both = purple_mask | orange_mask
ys, xs = np.where(both)
x0, y0, x1, y1 = xs.min(), ys.min(), xs.max(), ys.max()
pad = 6
w, h = x1 - x0 + 2 * pad, y1 - y0 + 2 * pad
parts = []
for mask, name, fill in ((purple_mask, 'mask-purple', '#5E3EDF'), (orange_mask, 'mask-orange', '#FF5E36')):
    for d, tx, ty in trace(mask, name):
        parts.append(f'<path fill="{fill}" fill-rule="evenodd" transform="translate({float(tx) - x0 + pad},{float(ty) - y0 + pad})" d="{d}"/>')
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="MochiPaw">{"".join(parts)}</svg>\n'
open('public/images/brand/logo.svg', 'w', encoding='utf8').write(svg)
print('viewBox', w, h, 'paths', len(parts), 'bytes', len(svg))

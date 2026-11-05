"""Free clean-up of generated images, run before tools/images.mjs:
- moves purples to the brand purple #5E3EDF
- removes the faint haze kie leaves in transparent images
Usage: python tools/grade_images.py name1 name2 ...
"""
import colorsys
import sys

import numpy as np
from PIL import Image

TARGET = colorsys.rgb_to_hsv(94 / 255, 62 / 255, 223 / 255)[0]


def grade(path):
    image = Image.open(path).convert('RGBA')
    data = np.asarray(image).astype(np.float32) / 255
    rgb, alpha = data[..., :3], data[..., 3:]
    high, low = rgb.max(-1), rgb.min(-1)
    delta = high - low
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    safe = np.where(delta == 0, 1, delta)
    hue = np.where(high == r, ((g - b) / safe) % 6, np.where(high == g, (b - r) / safe + 2, (r - g) / safe + 4)) / 6
    sat = np.where(high == 0, 0, delta / np.where(high == 0, 1, high))
    purple = (hue > 0.66) & (hue < 0.86) & (sat > 0.2)
    hue = np.where(purple, TARGET, hue)
    sector = np.floor(hue * 6) % 6
    frac = hue * 6 - np.floor(hue * 6)
    p, q, t = high * (1 - sat), high * (1 - sat * frac), high * (1 - sat * (1 - frac))
    channels = ((high, q, p, p, t, high), (t, high, high, q, p, p), (p, p, t, high, high, q))
    out = np.stack([np.choose(sector.astype(int), c) for c in channels], -1)
    if alpha.min() < 1:
        alpha = np.clip((alpha * 255 - 6) / (250 - 6), 0, 1)
    Image.fromarray((np.concatenate([out, alpha], -1) * 255 + 0.5).astype('uint8')).save(path)
    return round(float(purple.mean()), 2)


for name in sys.argv[1:]:
    print(name, 'purple share', grade(f'_brand/generated/{name}.png'))

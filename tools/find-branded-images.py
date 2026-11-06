#!/usr/bin/env python3
"""Finds product photos that carry the Pet World logo (gold dog-head or paw logo).

It builds a "gold pixel" mask for every photo and slides the logo shape over it at several sizes.
A high score means the logo is almost certainly there. Scores go to _catalog/branded-scores.csv.

  python -X utf8 tools/find-branded-images.py
"""
import csv
import os
import sys
from multiprocessing import Pool

import numpy as np
from PIL import Image

IMG_DIR = 'public/images/products'
OUT = '_catalog/branded-scores.csv'
# Reference photos that hold each logo variant (480 px versions are used).
REFERENCES = {'dog': 'pw54431-1', 'paw': 'pw54300-1'}
SCALES = (0.55, 0.75, 1.0, 1.3)
SHRINK = 0.5  # work on half-size masks: 4x faster, same result for a logo this large


def gold_mask(path, shrink=1.0):
    rgb = np.asarray(Image.open(path).convert('RGB'), dtype=np.int16)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mask = ((r > 170) & (g > 110) & (b < 120) & (r - b > 100)).astype(np.float32)
    if shrink != 1.0:
        size = (max(1, int(mask.shape[1] * shrink)), max(1, int(mask.shape[0] * shrink)))
        mask = (np.asarray(Image.fromarray(mask).resize(size, Image.BOX), dtype=np.float32) > 0.25).astype(np.float32)
    return mask


def logo_template(base):
    mask = gold_mask(f'{IMG_DIR}/{base}-480.webp')
    h, w = mask.shape
    top = mask[: int(h * 0.16), int(w * 0.2): int(w * 0.8)]  # logo sits at the top centre
    ys, xs = np.where(top > 0)
    return top[ys.min(): ys.max() + 1, xs.min(): xs.max() + 1]


TEMPLATES = {}


def init():
    for name, base in REFERENCES.items():
        template = logo_template(base)
        for scale in SCALES:
            size = (max(6, int(template.shape[1] * scale * SHRINK)), max(6, int(template.shape[0] * scale * SHRINK)))
            small = np.asarray(Image.fromarray(template).resize(size, Image.BILINEAR), dtype=np.float32)
            TEMPLATES[(name, scale)] = (small > 0.4).astype(np.float32)


def best_score(mask):
    height, width = mask.shape
    if mask.sum() < 30:
        return 0.0, '', 0.0
    best = (0.0, '', 0.0)
    squared = mask * mask
    for (name, scale), template in TEMPLATES.items():
        th, tw = template.shape
        if th > height or tw > width or template.sum() < 20:
            continue
        shape = (height + th, width + tw)
        template_fft = np.fft.rfft2(template[::-1, ::-1], shape)
        numerator = np.fft.irfft2(np.fft.rfft2(mask, shape) * template_fft, shape)[th - 1: height, tw - 1: width]
        window = np.fft.irfft2(np.fft.rfft2(squared, shape) * np.fft.rfft2(np.ones_like(template), shape), shape)[th - 1: height, tw - 1: width]
        score = (numerator / (np.sqrt(np.maximum(window, 1.0)) * np.sqrt(template.sum()))).max()
        if score > best[0]:
            best = (float(score), name, scale)
    return best


def work(base):
    score, name, scale = best_score(gold_mask(f'{IMG_DIR}/{base}-480.webp', SHRINK))
    return base, round(score, 3), name, scale


if __name__ == '__main__':
    rows = list(csv.DictReader(open('src/data/products.csv', encoding='utf8')))
    bases = sorted({i.rsplit('.', 1)[0] for r in rows for i in r['images'].split('|') if i})
    if len(sys.argv) > 1:
        bases = bases[: int(sys.argv[1])]
    print('photos to scan:', len(bases), flush=True)
    results = []
    with Pool(3, initializer=init) as pool:
        for k, result in enumerate(pool.imap(work, bases, chunksize=8), 1):
            results.append(result)
            if k % 500 == 0:
                print(k, 'scanned', flush=True)
    os.makedirs('_catalog', exist_ok=True)
    with open(OUT, 'w', encoding='utf8', newline='') as handle:
        writer = csv.writer(handle)
        writer.writerow(['image', 'score', 'logo', 'scale'])
        writer.writerows(sorted(results, key=lambda x: -x[1]))
    print('done ->', OUT, flush=True)

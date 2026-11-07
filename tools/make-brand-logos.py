#!/usr/bin/env python3
"""Turns the original brand logos (_brand/logos-source) into web files (public/images/brands).

SVG files are copied as they are. Bitmap logos are trimmed of empty margins and resized.
Pro Plan comes as white-on-black: the black becomes transparent, so it sits on a dark card.
"""
import shutil
from pathlib import Path

from PIL import Image, ImageChops

SRC = Path('_brand/logos-source')
OUT = Path('public/images/brands')
OUT.mkdir(parents=True, exist_ok=True)

for svg in ('royal-canin', 'ownat', 'monge', 'brit', 'mera'):
    shutil.copyfile(SRC / f'{svg}.svg', OUT / f'{svg}.svg')


def trim(image, pad=2):
    alpha = image.getchannel('A')
    box = alpha.point(lambda v: 255 if v > 12 else 0).getbbox()
    if box:
        image = image.crop((max(0, box[0] - pad), max(0, box[1] - pad), min(image.width, box[2] + pad), min(image.height, box[3] + pad)))
    return image


def save(image, name, height=240):
    image = trim(image)
    if image.height > height:
        image = image.resize((round(image.width * height / image.height), height), Image.LANCZOS)
    image.save(OUT / f'{name}.png', optimize=True)
    print(name, image.size)


for source, name in (('hills.png', 'hills'), ('felix.png', 'felix'), ('reflex-plus.png', 'reflex-plus')):
    save(Image.open(SRC / source).convert('RGBA'), name)

# Pro Plan: white logo on black -> white logo on transparent
gray = Image.open(SRC / 'proplan-petworld.jpeg').convert('L')
alpha = gray.point(lambda v: min(255, max(0, int((v - 25) * 1.5))))
white = Image.new('RGBA', gray.size, (255, 255, 255, 0))
white.putalpha(alpha)
rgb = Image.open(SRC / 'proplan-petworld.jpeg').convert('RGB')
white = Image.composite(Image.merge('RGBA', (*rgb.split(), alpha)), white, alpha)
big = white.resize((white.width * 2, white.height * 2), Image.LANCZOS)
save(big, 'pro-plan', height=320)

// Makes web-ready versions of every image: node tools/images.mjs
// Put originals in _brand/generated. Results go to public/images.
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const source = '_brand/generated';
const categories = ['cat-food', 'dog-food', 'treats', 'toys', 'grooming', 'cat-litter', 'accessories'];

const folderFor = (name) => {
  if (name.startsWith('p-')) return 'products';
  return categories.includes(name) ? 'categories' : 'photos';
};

for (const file of readdirSync(source)) {
  if (!/\.(png|jpe?g|webp)$/i.test(file) || file.startsWith('_')) continue;
  const name = basename(file, extname(file));
  const kind = folderFor(name);
  const folder = join('public/images', kind);
  mkdirSync(folder, { recursive: true });
  const { width: original } = await sharp(join(source, file)).metadata();
  const widths = [480, 960, ...(kind === 'photos' && original >= 1400 ? [1600] : [])];
  for (const width of widths) {
    const out = join(folder, `${name}-${width}.webp`);
    if (existsSync(out)) continue;
    await sharp(join(source, file)).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
    console.log('made', out);
  }
}

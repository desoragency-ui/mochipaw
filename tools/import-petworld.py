#!/usr/bin/env python3
"""Imports the petworld.ma catalogue into MochiPaw.

Source: the public WooCommerce Store API of petworld.ma (allowed by its robots.txt).

  python -X utf8 tools/import-petworld.py fetch    # raw JSON -> _catalog/cache
  python -X utf8 tools/import-petworld.py build    # products.csv + review sheet (xlsx)
  python -X utf8 tools/import-petworld.py images   # photos -> public/images/products (480 and 960 px webp)

Run from the project folder. Every step can be repeated safely.
"""
import csv
import glob
import html
import io
import json
import re
import sys
import time
import unicodedata
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import quote, unquote

BASE = 'https://petworld.ma/wp-json/wc/store/v1'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) MochiPawCatalogImport'
CACHE = Path('_catalog/cache')
CSV_OUT = Path('src/data/products.csv')
SHEET_OUT = Path('_catalog/petworld-products-sheet.xlsx')
IMG_DIR = Path('public/images/products')

BRANDED_FILE = Path('tools/petworld-branded-images.txt')
BRANDED = {line.strip() for line in BRANDED_FILE.read_text(encoding='utf-8').splitlines()
           if line.strip() and not line.startswith('#')} if BRANDED_FILE.exists() else set()

HEADER = ['id', 'slug', 'name', 'brand', 'category', 'pet', 'short_description', 'description', 'price_mad',
          'original_price_mad', 'images', 'variants', 'sku', 'stock', 'weight', 'attributes', 'ingredients',
          'nutrition', 'usage', 'featured', 'new', 'added_on', 'sample', 'supplier_sku']

# Product IDs: MP + 5 digits. Each petworld product keeps the same MP number on every re-import.
MP_FILE = Path('tools/mp-ids.json')
TRANSLATIONS = Path('src/data/translations.json')

# petworld gives almost no brand data, so the brand is read from the product name.
# Order matters: "Purina Felix" is Felix, "Purina Pro Plan" is Pro Plan.
BRAND_RULES = [
    ('Pro Plan', re.compile(r'pro\s*-?\s*plan', re.I)),
    ('Felix', re.compile(r'\bfelix\b', re.I)),
    ('Royal Canin', re.compile(r'royal\s*canin', re.I)),
    ("Hill's", re.compile(r"\bhill['’`]?s\b", re.I)),
    ('Reflex Plus', re.compile(r'\breflex\b', re.I)),
    ('Brit', re.compile(r'\bbrit\b', re.I)),
    ('Ownat', re.compile(r'\bownat\b', re.I)),
    ('Monge', re.compile(r'\bmonge\b', re.I)),
    ('Mera', re.compile(r'\bmera\b', re.I)),
]


def detect_brand(name):
    for brand, pattern in BRAND_RULES:
        if pattern.search(name):
            return brand
    return ''

CATEGORY_NAMES = {
    'nourriture-chat': 'Nourriture chat', 'nourriture-chien': 'Nourriture chien',
    'litiere': 'Litière', 'accessoires': 'Accessoires',
}
# Food, treats and pâtés all live in the two Nourriture categories; toys, grooming, collars,
# bowls, beds and everything else live in Accessoires.


# ---------------------------------------------------------------- fetch
def get(url):
    url = quote(url, safe=":/?&=%#+~@,;'()*!$[]")  # photo links can hold accents and dashes
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read(), r.headers
        except Exception as error:  # noqa: BLE001
            if attempt == 3:
                raise
            time.sleep(2 + attempt * 2)
            print('retry', url, error, flush=True)


def fetch():
    CACHE.mkdir(parents=True, exist_ok=True)
    for name, query in (('products', 'per_page=100'), ('variations', 'type=variation&per_page=100')):
        page = 1
        while True:
            target = CACHE / f'{name}-{page}.json'
            if not target.exists():
                data, headers = get(f'{BASE}/products?{query}&page={page}')
                target.write_bytes(data)
                time.sleep(1)
            else:
                data = target.read_bytes()
            if len(json.loads(data)) < 100:
                break
            page += 1
        print(name, 'pages:', page, flush=True)
    for name in ('categories', 'brands'):
        target = CACHE / f'{name}.json'
        if not target.exists():
            target.write_bytes(get(f'{BASE}/products/{name}?per_page=100')[0])


def load_pages(prefix):
    files = sorted(glob.glob(str(CACHE / f'{prefix}-*.json')), key=lambda f: int(re.findall(r'-(\d+)\.json', f)[0]))
    items = []
    for file in files:
        items += json.loads(Path(file).read_text(encoding='utf-8'))
    return items


# Brands the shop does not sell: matched on the brand tag or the product name.
EXCLUDED_BRANDS = re.compile(r'\bgosbi\b', re.I)


def excluded(product):
    brands = ' '.join(b['name'] for b in product.get('brands', []))
    return bool(EXCLUDED_BRANDS.search(html.unescape(product['name']) + ' ' + brands))


# ---------------------------------------------------------------- text helpers
def clean(text, limit=None):
    text = html.unescape(text or '')
    text = re.sub(r'<li[^>]*>', ' • ', text)
    text = re.sub(r'</(p|div|h\d|ul|ol|tr)>|<br\s*/?>', ' ', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text.replace('\xa0', ' ')).strip()
    if limit and len(text) > limit:
        cut = text[:limit]
        end = max(cut.rfind('. '), cut.rfind(' '))
        text = cut[: end if end > limit * 0.6 else limit].rstrip(' ,;') + '…'
    return text


def first_sentence(text, limit=160):
    if len(text) <= limit:
        return text
    match = re.match(r'(.{40,%d}?[.!?])\s' % limit, text)
    return match.group(1) if match else clean(text, limit)


def slugify(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def money(minor):
    value = int(minor or 0) / 100
    return int(value) if value == int(value) else round(value, 2)


def fmt(number):
    return '' if number is None else str(number)


def safe(text):
    return re.sub(r'[|]', '/', text).replace(',', ' ').strip()


# ---------------------------------------------------------------- mapping
FOOD_WORDS = re.compile(r'p[aâ]t[ée]e?|terrine|barquette|bo[iî]te|mousse|sachet fra[iî]cheur|sauce|gelée|gelee|humide|wet|pouch', re.I)


def classify(product, cats):
    """Returns (site category, pet, flags) from the petworld category tree."""
    ids = set()
    for category in product['categories']:
        cid = category['id']
        while cid:
            ids.add(cid)
            cid = cats.get(cid, {}).get('parent', 0)
    name = product['name'].lower()
    flags = []
    chat, chien = 36 in ids, 23 in ids
    other = bool(ids & {141, 206, 157})

    if chat and chien:
        pet = 'tous'
    elif chat:
        pet = 'chat'
    elif chien:
        pet = 'chien'
    elif other:
        pet = 'autre'
        flags.append('Other pet (bird/rodent/fish)')
    else:
        guess_cat = re.search(r'\b(chat|chaton|chats|f[ée]lin)\b', name)
        guess_dog = re.search(r'\b(chien|chiot|chiens|canin)\b', name)
        pet = 'chat' if guess_cat and not guess_dog else 'chien' if guess_dog and not guess_cat else 'tous'
        flags.append('Pet guessed from name' if pet != 'tous' else 'Pet to check')

    food_pet = 'nourriture-chat' if chat or pet == 'chat' else 'nourriture-chien'
    if pet == 'autre':
        category = 'accessoires'
    elif 94 in ids:
        category = 'litiere'
    elif ids & {106, 100, 95}:
        category = 'accessoires'  # toys, scratchers, cat trees
    elif ids & {238, 239, 41, 39, 40, 26, 220, 221, 37, 24}:
        category = food_pet  # food, treats and pâtés
    elif ids & {25, 42, 127}:
        category = 'accessoires'  # grooming, hygiene, care
    elif ids & {92, 134, 125, 90, 154, 153, 233, 124, 91, 133}:
        category = 'accessoires'
    else:
        category = 'accessoires'
        flags.append('Category to check')
    return category, pet, flags


# ---------------------------------------------------------------- build
def build():
    products = [p for p in load_pages('products') if not excluded(p)]
    variations = load_pages('variations')
    cats = {c['id']: c for c in json.loads((CACHE / 'categories.json').read_text(encoding='utf-8'))}

    # The API escapes titles ("Dinde &#038; Riz"): turn them back into plain text.
    for p in products:
        p['name'] = html.unescape(p['name'])
        for brand in p.get('brands', []):
            brand['name'] = html.unescape(brand['name'])
        for category in p['categories']:
            category['name'] = html.unescape(category['name'])
        for attribute in p.get('attributes', []):
            attribute['name'] = html.unescape(attribute['name'])
            for term in attribute['terms']:
                term['name'] = html.unescape(term['name'])
    for v in variations:
        for attribute in v.get('attributes', []):
            attribute['value'] = html.unescape(attribute.get('value') or '')
    by_parent = {}
    for item in variations:
        by_parent.setdefault(item['parent'], []).append(item)

    names_seen = {}
    for p in products:
        names_seen[p['name'].strip().lower()] = names_seen.get(p['name'].strip().lower(), 0) + 1

    rows, sheet = [], []
    used_slugs = set()
    for p in products:
        pid = p['id']
        category, pet, flags = classify(p, cats)
        brand = ''
        if p.get('brands'):
            brand = p['brands'][0]['name'].strip()
        if not brand:
            brand = detect_brand(p['name'])

        # price and sizes
        prices = p['prices']
        price, original = money(prices['price']), None
        if prices.get('regular_price') and money(prices['regular_price']) > price and p['on_sale']:
            original = money(prices['regular_price'])
        variants = []
        for v in sorted(by_parent.get(pid, []), key=lambda x: int(x['prices']['price'] or 0)):
            label = safe(' · '.join(a['value'] for a in v.get('attributes', []) if a.get('value')) or v.get('variation', '').split(':')[-1])
            if not label:
                continue
            vp = money(v['prices']['price'])
            vo = money(v['prices']['regular_price']) if v['on_sale'] and money(v['prices']['regular_price']) > vp else None
            variants.append(f'{label}:{vp}' + (f':{vo}' if vo else ''))
        if variants:
            price = min(float(x.split(':')[1]) for x in variants)
            price = int(price) if price == int(price) else price
            original = None
            flags.append('Price varies by size')
        if original:
            flags.append(f'On sale (was {original})')
        if not p['is_in_stock']:
            flags.append('Out of stock')
        kept = [(i, img) for i, img in enumerate(p['images']) if f'pw{pid}-{i + 1}' not in BRANDED]
        removed = len(p['images']) - len(kept)
        if not kept:
            flags.append('No photo (petworld-branded photos removed)' if removed else 'No photo')
        elif removed:
            flags.append(f'{removed} petworld-branded photo(s) removed')
        if 'black friday' in p['name'].lower():
            flags.append('Black Friday pack (petworld promo name)')
        if names_seen[p['name'].strip().lower()] > 1:
            flags.append('Possible duplicate name')

        slug = unquote(p['slug'])
        if '%' in p['slug'] or not re.fullmatch(r'[a-z0-9-]+', slug):
            slug = f'{slugify(p["name"])[:70]}-{pid}'
        slug = slug[:90].strip('-')
        if slug in used_slugs:
            slug = f'{slug[:80]}-{pid}'
        used_slugs.add(slug)

        description = clean(p['description'], 2500)
        short = clean(p['short_description'], 200) or first_sentence(description)
        description = description or short or p['name']
        files = [f'pw{pid}-{i + 1}.webp' for i, _ in kept]
        attributes = []
        for a in p.get('attributes', []):
            if a.get('has_variations'):
                continue
            values = ', '.join(t['name'] for t in a['terms'])
            if values and a['name'].lower() != 'marque':
                attributes.append(f'{safe(a["name"])}:{values.replace("|", "/")}')

        rows.append({
            'id': f'pw{pid}', 'slug': slug, 'name': p['name'].strip(), 'brand': brand, 'category': category, 'pet': pet,
            'short_description': short, 'description': description, 'price_mad': fmt(price),
            'original_price_mad': fmt(original), 'images': '|'.join(files), 'variants': '|'.join(variants),
            'sku': '', 'stock': 'in_stock' if p['is_in_stock'] else 'out_of_stock', 'weight': '',
            'attributes': '|'.join(attributes), 'ingredients': '', 'nutrition': '', 'usage': '', 'featured': '0',
            'new': '0', 'added_on': '', 'sample': '0', 'supplier_sku': p['sku'] or f'PW-{pid}',
        })
        sheet.append({
            'row': rows[-1], 'source_url': p['permalink'], 'photo_urls': [img['src'] for _, img in kept],
            'source_categories': ' > '.join(c['name'] for c in p['categories']), 'flags': flags,
            'reviews': p.get('review_count', 0), 'wc_id': pid,
        })

    # Home page picks: featured = two well-reviewed products per category, new = newest ones with a photo.
    chosen = set()
    with_photo = [s for s in sheet if s['row']['images'] and s['row']['stock'] == 'in_stock']
    for category in CATEGORY_NAMES:
        pool = sorted((s for s in with_photo if s['row']['category'] == category and s['row']['pet'] != 'autre'),
                      key=lambda s: (-s['reviews'], s['wc_id']))
        for pick in pool[:2]:
            pick['row']['featured'] = '1'
            chosen.add(pick['wc_id'])
    for s in sorted((s for s in with_photo if s['row']['pet'] != 'autre' and 'black friday' not in s['row']['name'].lower()),
                    key=lambda s: -s['wc_id'])[:8]:
        s['row']['new'] = '1'

    # petworld's Black Friday pack photos carry petworld's logo and promo prices: list them last.
    sheet.sort(key=lambda s: 'black friday' in s['row']['name'].lower())

    # MP IDs: a product that already has one keeps it; new products get the next free number.
    mp_ids = json.loads(MP_FILE.read_text(encoding='utf-8')) if MP_FILE.exists() else {}
    next_number = max([int(v[2:]) for v in mp_ids.values()] + [0]) + 1
    for s in sheet:
        old = s['row']['id']
        if old not in mp_ids:
            mp_ids[old] = f'MP{next_number:05d}'
            next_number += 1
        s['old_id'] = old
        s['row']['id'] = s['row']['sku'] = mp_ids[old]
    MP_FILE.write_text(json.dumps(mp_ids, indent=0, sort_keys=True), encoding='utf-8')

    CSV_OUT.parent.mkdir(parents=True, exist_ok=True)
    with CSV_OUT.open('w', encoding='utf-8', newline='') as handle:
        writer = csv.DictWriter(handle, fieldnames=HEADER, lineterminator='\n')
        writer.writeheader()
        writer.writerows(s['row'] for s in sheet)
    print('products.csv rows:', len(rows), flush=True)
    write_sheet(sheet)


def write_sheet(sheet):
    from openpyxl import Workbook
    from openpyxl.cell.cell import ILLEGAL_CHARACTERS_RE
    from openpyxl.styles import Alignment, Font, PatternFill
    from openpyxl.utils import get_column_letter
    from openpyxl.worksheet.datavalidation import DataValidation

    def txt(value):
        return ILLEGAL_CHARACTERS_RE.sub('', value) if isinstance(value, str) else value

    wb = Workbook()
    ws = wb.active
    ws.title = 'Products'
    names = json.loads(TRANSLATIONS.read_text(encoding='utf-8')) if TRANSLATIONS.exists() else {}
    columns = [
        ('ID (MP)', 10), ('Old ID (petworld)', 12), ('Product name (FR)', 50), ('Name EN', 44), ('Name AR', 44),
        ('Site category', 17), ('Pet', 8), ('Brand', 14), ('Price MAD (now)', 12),
        ('Old price MAD', 11), ('Sizes / options (label:price)', 32), ('Stock', 12), ('Photos', 8),
        ('Auto flags', 36), ('Petworld page', 36), ('Photo links (petworld)', 36), ('Petworld categories', 36),
        ('EDIT PRICE? (yes/no)', 13), ('NEW PRICE MAD', 12), ('EDIT PHOTOS? (yes/no)', 13),
        ('EDIT PRODUCT INFO? (yes/no)', 14), ('REMOVE? (yes/no)', 11), ('YOUR NOTES', 40),
    ]
    purple_columns = 17
    ws.append([c[0] for c in columns])
    for index, (_, width) in enumerate(columns, 1):
        ws.column_dimensions[get_column_letter(index)].width = width
        cell = ws.cell(row=1, column=index)
        cell.font = Font(bold=True, color='FFFFFF')
        cell.fill = PatternFill('solid', fgColor='5E3EDF' if index <= purple_columns else 'FF5E36')
        cell.alignment = Alignment(wrap_text=True, vertical='center')
    ws.row_dimensions[1].height = 44

    for s in sheet:
        r = s['row']
        translated = names.get(r['id'], {})
        ws.append([
            txt(r['id']), s['old_id'], txt(r['name']), txt(translated.get('en', '')), txt(translated.get('ar', '')),
            CATEGORY_NAMES[r['category']], r['pet'], txt(r['brand']),
            float(r['price_mad']) if r['price_mad'] else None, float(r['original_price_mad']) if r['original_price_mad'] else None,
            txt(r['variants'].replace('|', '\n')), 'in stock' if r['stock'] == 'in_stock' else 'OUT OF STOCK',
            len(s['photo_urls']), txt('; '.join(s['flags'])), s['source_url'], '\n'.join(s['photo_urls']),
            txt(s['source_categories']), '', '', '', '', '', '',
        ])
    last = ws.max_row
    ws.freeze_panes = 'C2'
    ws.auto_filter.ref = f'A1:{get_column_letter(len(columns))}{last}'
    yes_no = DataValidation(type='list', formula1='"yes,no"', allow_blank=True)
    ws.add_data_validation(yes_no)
    for index, (title, _) in enumerate(columns, 1):
        if title.endswith('(yes/no)'):
            letter = get_column_letter(index)
            yes_no.add(f'{letter}2:{letter}{last}')
    wrapped = {i for i, (title, _) in enumerate(columns, 1) if title.startswith(('Product name', 'Name ', 'Sizes', 'Auto flags', 'YOUR NOTES'))}
    for row in ws.iter_rows(min_row=2, max_row=last):
        for cell in row:
            cell.alignment = Alignment(vertical='top', wrap_text=cell.column in wrapped)
        for cell in row[purple_columns:]:
            cell.fill = PatternFill('solid', fgColor='FFF1EC')

    guide = wb.create_sheet('How to use')
    for line in [
        'MochiPaw x petworld.ma product import',
        '',
        'ID (MP) = the product ID used on the website and in orders (MP + 5 digits). Old ID = the petworld ID, kept for reference.',
        'Name EN / Name AR = the English and Arabic names shown on the website in those languages (machine translated: check them).',
        '',
        f'{len(sheet)} products were imported into the website (src/data/products.csv) with all photos.',
        'Purple columns = what is on the website now. Orange columns = YOURS to fill in and send back.',
        '',
        'EDIT PRICE? = yes if the price must change. Put the price you want in NEW PRICE MAD.',
        'EDIT PHOTOS? = yes if the photos must be replaced or removed.',
        'EDIT PRODUCT INFO? = yes if the name, category, pet, brand or description must change (say what in YOUR NOTES).',
        'REMOVE? = yes to delete the product from the website.',
        'YOUR NOTES = anything else, for example "change category to Jouets" or "name too long".',
        '',
        'Auto flags are hints made by the import: No photo, petworld-branded photos removed, Out of stock, Price varies by size, Possible duplicate name,',
        'Category to check, Pet guessed from name, Other pet (bird/rodent/fish).',
        'Birds, rodents and fish are listed under Accessoires with Pet = autre (they do not show on the Chats / Chiens pages).',
        '',
        'Sizes / options column: one line per option, written label:price (or label:price:old price).',
    ]:
        guide.append([line])
    guide.column_dimensions['A'].width = 120
    guide['A1'].font = Font(bold=True, size=14)
    SHEET_OUT.parent.mkdir(parents=True, exist_ok=True)
    wb.save(SHEET_OUT)
    print('sheet:', SHEET_OUT, flush=True)


# ---------------------------------------------------------------- images
def convert_bytes(args):
    """Runs in a worker process: decode once, write the 960 px and 480 px webp files."""
    data, out480, out960 = args
    from PIL import Image
    try:
        image = Image.open(io.BytesIO(data))
        image.load()
        image = image.convert('RGBA' if image.mode in ('RGBA', 'LA', 'P') else 'RGB')
        big = image if image.width <= 960 else image.resize((960, round(image.height * 960 / image.width)), Image.BILINEAR, reducing_gap=2.0)
        small = big if big.width <= 480 else big.resize((480, round(big.height * 480 / big.width)), Image.BILINEAR)
        big.save(out960, 'WEBP', quality=78, method=2)
        small.save(out480, 'WEBP', quality=78, method=2)
        return None
    except Exception as error:  # noqa: BLE001
        return str(error)


def images():
    from concurrent.futures import ProcessPoolExecutor
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    tasks = []
    for p in load_pages('products'):
        if excluded(p):
            continue
        for i, image in enumerate(p['images']):
            if f'pw{p["id"]}-{i + 1}' in BRANDED:
                continue
            tasks.append((image['src'], f'pw{p["id"]}-{i + 1}'))
    print('photos to process:', len(tasks), flush=True)
    counters = {'done': 0, 'failed': 0}
    failures = []

    with ProcessPoolExecutor(max_workers=3) as workers:
        def process(task):
            url, base = task
            out480, out960 = IMG_DIR / f'{base}-480.webp', IMG_DIR / f'{base}-960.webp'
            problem = None
            if not (out480.exists() and out960.exists()):
                try:
                    data, _ = get(url)
                    problem = workers.submit(convert_bytes, (data, str(out480), str(out960))).result()
                except Exception as error:  # noqa: BLE001
                    problem = str(error)
            counters['done'] += 1
            if problem:
                counters['failed'] += 1
                failures.append(f'{url} {problem}')
            if counters['done'] % 100 == 0:
                print(f"{counters['done']}/{len(tasks)} done, {counters['failed']} failed", flush=True)

        with ThreadPoolExecutor(max_workers=12) as pool:
            list(pool.map(process, tasks))

    Path('_catalog/images-failed.txt').write_text('\n'.join(failures), encoding='utf-8')
    print(f"finished: {counters['done']} processed, {counters['failed']} failed", flush=True)


if __name__ == '__main__':
    step = sys.argv[1] if len(sys.argv) > 1 else ''
    {'fetch': fetch, 'build': build, 'images': images}.get(step, lambda: print(__doc__))()

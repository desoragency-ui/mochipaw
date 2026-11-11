# MochiPaw

Site e-commerce de MochiPaw, animalerie en ligne marocaine pour chats et chiens.
Astro, îlots React, Tailwind 4. Direction artistique : Studio Pop.

## Lancer le site

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:4321. Pour fabriquer la version finale : `npm run build` (résultat dans `dist`).

Avec beaucoup de produits et de photos, `npm run dev` charge les images lentement. Pour voir le site comme en ligne, rapide : `npm run site` (construit le site, puis l'ouvre sur http://localhost:4321 ; compter environ 1 min 30 avant que la page réponde).

## Mise en ligne (Cloudflare Workers, fichiers statiques)

Le site est publié sur Cloudflare, relié au dépôt GitHub : chaque `git push` sur `main` relance la publication.
`wrangler.jsonc` dit à Cloudflare de servir le dossier `dist` (page 404 incluse). Le nom du projet dans Cloudflare doit rester `mochipaw`, comme dans ce fichier.

| Réglage Cloudflare (Settings > Builds) | Valeur |
|---|---|
| Commande de build | `npm run build` |
| Commande de déploiement | `npx wrangler deploy` |
| Variable `NODE_OPTIONS` | `--max-old-space-size=4096` |
| Variable `SITE_URL` | facultative ; sans elle le site utilise `https://mochipaw.ma` (voir `astro.config.mjs`) |

Adresse du site : `https://mochipaw.ma`, reliée au Worker `mochipaw` (Workers > mochipaw > Settings > Domains & Routes).
`www.mochipaw.ma` redirige vers `mochipaw.ma` (règle de redirection du domaine, dans Cloudflare > mochipaw.ma > Rules > Redirect Rules).

La version de Node vient de `.node-version`. `public/_headers` règle le cache des images. Cloudflare sert `chats.html` à l'adresse `/chats` sans réglage de plus.

## Ce que l'on change sans toucher au code

| Pour changer | Fichier |
|---|---|
| Produits et prix | `src/data/products.csv` |
| Numéro WhatsApp, contacts, réseaux, zones et prix de livraison | `src/data/site.ts` |
| Passer de l'aperçu au vrai site | `demoMode: false` dans `src/data/site.ts` |
| Catégories | `src/data/categories.ts` |
| Tous les textes du site (français) | `src/i18n/fr.ts` |
| Textes en anglais et en arabe | `src/i18n/en.ts`, `src/i18n/ar.ts` |
| Noms de produits en anglais et en arabe | `src/data/translations.json` (clé = numéro MP) |
| Marques du bandeau d'accueil | `src/data/brands.ts` (logos dans `public/images/brands/`) |

## Remplacer les produits d'exemple

1. Remplir `src/data/products.csv`, une ligne par produit. Mettre `sample` à 0.
2. Dans une case, le séparateur de liste est `|`. Exemple pour `variants` : `1 kg:129|3 kg:329:379` (nom:prix:ancien prix).
3. Une promotion n'apparaît que si `original_price_mad` est rempli avec un vrai ancien prix.

## Ajouter des images

1. Déposer l'image dans `_brand/generated`. Les noms commençant par `p-` vont aux produits, les autres aux catégories.
2. Lancer `node tools/images.mjs`.
3. Le nom du fichier doit correspondre à la colonne `images` du CSV, ou au champ `image` de `categories.ts`.

Tant qu'une image manque, le site affiche une tuile de marque, jamais une image cassée.

## Commandes et paiement

La commande s'envoie sur WhatsApp, avec paiement à la livraison. Elle reste en mode démo (rien n'est envoyé)
tant que `demoMode` est vrai ou que `contact.whatsapp` est vide.

## Trois langues : français, anglais, arabe

Le français n'a pas de préfixe (`/boutique`). L'anglais est sous `/en/…` et l'arabe sous `/ar/…` (écriture de droite à gauche).
Les trois langues sont listées dans `activeLocales` (`src/i18n/index.ts`). Chaque langue a son propre `catalog.json` pour la recherche.
Les noms de produits sont traduits dans `src/data/translations.json` ; les descriptions et caractéristiques restent en français.
La traduction a été faite à la main, sans relecture par un traducteur : à faire relire avant le lancement officiel.
Le darija (`ary`) est préparé mais éteint : l'activer = écrire son dictionnaire et l'ajouter à `activeLocales`.

## Produits retirés de la boutique

`tools/import-petworld.py` ne garde pas : la catégorie Accessoires (elle reste, vide), les marques Almo Nature et Carnilove,
les noms avec pack / gratuit / offre / promo / black friday, les produits avec ancien prix barré, sans photo, avec « petworld » ou « médaille »
dans le texte, et quelques produits nommés (liste `REMOVED_NAMES`). Pour changer une règle : modifier ce fichier, puis lancer
`python -X utf8 tools/import-petworld.py build` puis `images`. La liste de ce qui est retiré, avec la raison : `_catalog/removed-products.txt`.
Les pages de la boutique montrent 24 produits avec des numéros de page.

## Numéros de produit (MP)

Chaque produit a un numéro `MP00001` à `MP01952`, utilisé comme référence sur le site, dans le message WhatsApp et dans le tableur
`_catalog/petworld-products-sheet.xlsx`. La table `tools/mp-ids.json` garde le même numéro pour le même produit quand on relance l'import.
L'ancien numéro du fournisseur est gardé dans la colonne `supplier_sku` du CSV. Un nouveau produit reçoit le numéro suivant.

## Bandeau des marques

Royal Canin, Pro Plan, Felix, Brit, Ownat, Hill's, Monge, Mera et Reflex Plus défilent de gauche à droite sur l'accueil (dans toutes les langues).
Un clic sur un logo ouvre la boutique filtrée sur la marque. Les logos appartiennent à leurs propriétaires ; les fichiers d'origine et leurs sources
sont dans `_brand/logos-source/`, la conversion dans `tools/make-brand-logos.py`.

## Décisions

Toutes les décisions du projet sont dans `_decisions/decisions.md`. La direction artistique est dans `_brand/art-direction.md`.

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
| Variable `SITE_URL` | l'adresse publique du site (pour le plan du site) |

La version de Node vient de `.node-version`. `public/_headers` règle le cache des images. Cloudflare sert `chats.html` à l'adresse `/chats` sans réglage de plus.

## Ce que l'on change sans toucher au code

| Pour changer | Fichier |
|---|---|
| Produits et prix | `src/data/products.csv` |
| Numéro WhatsApp, contacts, réseaux, zones et prix de livraison | `src/data/site.ts` |
| Passer de l'aperçu au vrai site | `demoMode: false` dans `src/data/site.ts` |
| Catégories | `src/data/categories.ts` |
| Tous les textes du site | `src/i18n/fr.ts` |

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

## Arabe et darija

La structure est prête : pages, sens droite-gauche, changement de langue.
Pour activer une langue : créer son dictionnaire sur le modèle de `src/i18n/fr.ts`, l'ajouter dans `src/i18n/index.ts`,
ajouter `'ar'` ou `'ary'` à `activeLocales`, et installer la police `@fontsource-variable/noto-sans-arabic`.

## Décisions

Toutes les décisions du projet sont dans `_decisions/decisions.md`. La direction artistique est dans `_brand/art-direction.md`.

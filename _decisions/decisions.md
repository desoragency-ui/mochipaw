# MochiPaw: boss decisions

| Date | Question | Opus | GPT | Gemini | Boss chose |
|---|---|---|---|---|---|
| 2026-11-04 | Tech stack | Astro | Astro | Astro | Astro (React islands, Tailwind, Motion, Lucide) |
| 2026-11-04 | Store engine | Sample data file | Sample data file | Sample data file | Sample template now, changeable. He sends a sheet of products and prices later, then we swap it in |
| 2026-11-04 | Checkout | WhatsApp, demo until number | WhatsApp now | WhatsApp now | WhatsApp, cash on delivery, labelled demo until the real number is added |
| 2026-11-04 | Headlines | French, tagline English | English lines, rest French | French, tagline English | French headlines, English tagline stays with the logo |
| 2026-11-04 | Visual direction, after seeing both | Merge | Merge | Merge | Studio Pop only. Sunny Home photo is not used |
| 2026-11-04 | Who runs the 2 test images | Opus here | not asked | not asked | Opus runs them here (art director refused a relayed OK) |
| 2026-11-04 | Hero headline | GRAND AMOUR. PETITS PRIX. | LE BONHEUR À QUATRE PATTES | PETITES PATTES, GRAND BONHEUR ! | GRAND AMOUR. PETITS PRIX. |
| 2026-11-04 | Hero size | 1K, check the test | 2K for 3 heroes | 2K for 3 heroes | 1K, check the test |
| 2026-11-04 | First batch | 9 test images | not asked | not asked | 9 test images approved, about 54 credits |
| 2026-11-04 | Cut-outs | Transparent first | Transparent first | Flat colour, then remove | Transparent first, ask before any redo |
| 2026-11-04 | People | Mix, veiled woman with a cat | Mix | Mix | Mix: veiled woman with a cat, man with a dog |
| 2026-11-04 | Sample products | Blank shapes | Blank shapes | Packs with logo | Blank shapes with a sample tag |
| 2026-11-04 | Logo | Crop and trace | Crop and trace | Crop and trace | Crop and trace, free |
| 2026-11-04 | 2 direction test images | Yes | not asked | not asked | Yes, generate these 2, one try each, about 12 credits |
| 2026-11-04 | Bandana | Plain purple | Plain purple | Plain purple | Plain purple |
| 2026-11-04 | Social grid | AI mood photos, marked | AI mood photos, marked | AI mood photos, marked | AI mood photos, marked |
| 2026-11-04 | Moroccan feel | Only in people photos | Only in people photos | Only in people photos | Only in people photos |
| 2026-11-04 | Remaining test images | Run all 8 | not asked | not asked | Only 3 first: cat food, dog food, sample product. Run here by Opus. 5 categories wait for his look |
| 2026-11-04 | AI note under people photos | Small note | Small note | Small note | No note. Art director advised against this. People photos are never tied to reviews or called customers |
| 2026-11-04 | French headings | see his picks | see `q4-gpt.txt` | see `q4-gemini.txt` | TOUT POUR TES PETITS COMPAGNONS / LES CHOUCHOUS DES PETITES PATTES / PLUS DE CÂLINS. MOINS DE DÉPENSES. / CHAQUE PATTE MÉRITE SON BONHEUR / LES NOUVEAUTÉS QUI FONT CRAQUER / POURQUOI MOCHIPAW ? |
| 2026-11-04 | Tu or vous | Mix | Mix | Mix | Tu in fun headings, vous in shop and checkout |
| 2026-11-04 | Logo marks | Remove | Keep | Remove | Removed |

Support line chosen with the headline: Tout ce qu'il faut pour vos boules de poils, à des prix qui font plaisir.

## Still to ask him

11 sample product images are not made, by his choice: his real product photos will replace them. They stay brand tiles.

## Decided alone from 2026-11-05 (boss: "don't stop, or give me to choose somthing because i will sleep, continur till the end")

Rules kept: only the 22 approved photos, no paid retries, nothing sent or published. A photo that comes out badly stays in and is flagged in the report.

- Made all 22 photos in one try each. No paid retry was used.
- treats, toys and grooming started before the ultra-realistic order, so they use the earlier photorealistic prompt. The other 19 use the stronger prompt.
- Social grid keeps the small note Images d'illustration, as he chose for that section.
- Social grid layout: two large tiles and four small ones, so there is no gap.
- Cats and Dogs page headers: on phones the text sits above the photo, so it never covers the animal.
- Flaw left in, to review: the sleeping kitten (social-01) has a red bow, which is off-palette.

## Image approvals

- 2026-11-05: he first said all 33, then "no onlyy 22 pet photos" before anything started. Approved: the 22 pet photos, about 132 credits, one try each, run here by Opus. Retries need his OK.
- 2026-11-05: he asked "please make them ultra realistic, with extra details and textures". The prompt tail was strengthened for every photo not yet started. Size stays 1K, his standing order.
- Prompts changed to follow his rules: story photo is a veiled woman with a ginger cat; About photo is a man with a golden retriever; social-02 has no riad or zellige.

## Decided alone under khochla3 (from 2026-11-04, boss said "please activate khochla3 mode")

Each line can be reversed. Rules kept: no paid credits beyond his OK, nothing sent or published.

- Social heading: PARTAGEZ VOS MOMENTS TROP CRAQUANTS (Gemini's line, fits tu/vous mix).
- Newsletter heading: DES SURPRISES POUR TES PETITS AMOURS (Gemini's line).
- 404 heading: OUPS ! CETTE PATTE S'EST PERDUE (Gemini's line, nearly the same as GPT's).
- Missing photos: brand colour tile with an icon, swapped automatically when the image file arrives.
- Purple in the dog food photo and the sample pouch is colour-matched to #5E3EDF for free in code.
- Arabic and Darija: structure and right-to-left are built, but switched off until their text is written and checked.
- Preview pages carry a noindex tag while demo mode is on, so Google does not list sample products.
- Product structured data stays off for sample products, as the prompt asks for real data only.
- Motion: scroll and hero animation use CSS with the browser's own observer, the option your prompt allows. The motion library was removed: 70 KB less on every page.
- Hero second button says Voir les offres, so the two buttons lead to different pages.
- Brand story and social grid reuse the 3 approved images until the people and social photos are approved.
- Legal, delivery and returns pages carry a clear to-complete note: no invented rules.

## Standing orders for this job

- Ask the boss on every decision, in the question box, with each model's pick.
- Opus gives its view here in Claude Code, never through kie.
- Art direction by the art director agent. Images by kie-image, and only after he OKs the exact list and cost.

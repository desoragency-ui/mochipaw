# MochiPaw website: art direction (planning only, no image generated)

Status: draft for the boss. Nothing is generated (R-090). Open questions at the end (R-014). Palette: purple #5E3EDF, orange #FF5E36, brown #220F06, cream #FAF5EB, white. Client brand overrides Desora palette (R-025 is Desora's own work only).

## 1. The 1-second message
In 1 second the visitor sees a golden retriever and a tabby cat, bright and alive on a purple studio ground, and feels: "my pet would be this happy here, and it will not cost a fortune."

Ten ideas scored (C-3, /10): studio pop duo 9 · home lifestyle 8 · hand-drawn world 7 · sticker wall 6 · owner-POV flat-lay 6 · pet portraits gallery 7 · food-only still life 5 · Moroccan courtyard series 7 · pets in costume 3 · type-only 4. Top 3 below differ on imagery.

## 2. Top 3 directions (recommendation first)

### A. "Studio Pop" (RECOMMENDED): real-looking pets on purple and orange studio grounds
- Looks like: one big joyful pet per section, cut out or full-frame on flat purple or orange, cream pages, blobs and stars set in HTML behind and around the animal. Giant brown or cream type sits BEHIND the cut-out head (editorial depth).
- Lifestyle photos appear only in the story, About and social grid, so the brand also feels warm and human.
- Leans on: board "Photography direction" row and the thank-you card (duo cut-out on cream with blob corner).
- Hero Shot Spec: subject golden retriever (sitting, chest-up) with tabby cat leaning on its shoulder; gaze: dog looks just past the lens, tongue out, cat looks up-left; angle: slightly below eye level; lens 85 mm f/2.8; light: one large softbox camera-left 5600 K soft, small orange gel rim light from the right; highlight: catchlights in both pairs of eyes and a rim glow along the dog's ear and shoulder fur.
- Main risk: AI fur and eyes look fake or plasticky; cut-out edges on fluffy fur look cut with scissors. Mitigation: test the hero first, re-roll cap, flat colour fallback.

### B. "Sunny Home": natural lifestyle, owners and pets, warm interiors
- Looks like: cream pages, warm window light, living rooms, Moroccan courtyard and zellige tile corners, owners hugging pets. Purple and orange come only from HTML blocks.
- Closest to "regular buyers" and families; less loud, slower to scan on category cards.
- Leans on: board photo 5 (woman and dog, "Better Together").
- Hero Shot Spec: young woman and golden retriever on a sofa, her cheek on its head; gaze: she eyes closed smiling, dog looks at lens; angle eye level; lens 50 mm f/2; light: window left, 4800 K soft, bounce right; highlight: sun edge on her hair and the dog's muzzle.
- Main risk: AI people everywhere; people must never pass as real customers, many labels needed, and hard to keep one face-free series.

### C. "Paw World": the hand-drawn illustration system leads, photos are small windows
- Looks like: the board illustration style (brown ink dog and cat, spot colour) as big characters and stickers, with photo tiles inside blob frames.
- Cheap and very on-brand, but the boss said never cartoon-heavy and never cartoon animals in place of photos.
- Leans on: illustration system, sticker sheet.
- Hero Shot Spec: hand-drawn dog and cat drawing on cream with a real-photo golden retriever tile; gaze: both look at the viewer; angle: straight front; lens: flat illustration plus 85 mm photo tile; light: soft studio on the photo; highlight: wet nose and fur rim.
- Main risk: reads childish and chaotic, breaks the brief.

## 3. Shot list for Direction A
Rules for every prompt: add `-r 1K`. Add `-b transparent` for cut-outs. No letters, logos or marks in any image (R-035); all type and the paw badge on products are set in HTML. Run command: `python ~/.claude/skills/kie-image/kie_image.py "<prompt>" -a <ratio> -r 1K -n <file> -o "clients website/mochipaw/images"`.

Shared tail (append to every photo prompt): "Photorealistic commercial pet photography, natural fur detail, individual hairs, natural eye reflections, authentic happy expression, soft expressive light, shot on a full-frame camera, no text, no letters, no logos, no watermark, not illustrated, not 3D."

Homepage
1. `home-hero-duo.png` · Home hero · 3:4 · cut-out (transparent) · golden retriever sitting with a tabby cat leaning on its shoulder, dog tongue out looking just past lens, cat looking up-left, both wearing a plain purple bandana (no marks, cat none), chest-up, space around the edges for blobs. Prompt: "A happy golden retriever and a tabby cat, close together, chest-up, dog mouth open smiling, cat looking up, dog wearing a plain solid purple (#5E3EDF) bandana, camera slightly below eye level, 85mm lens, soft large softbox from the left at 5600K, small orange rim light from the right on the fur, isolated subject on a transparent background, no shadow."
2. `cat-food.png` · Home category card 1 · 1:1 · full frame, orange #FF5E36 flat seamless · tabby kitten eating from a plain purple bowl. Prompt: "A tabby kitten eating dry kibble from a plain solid purple ceramic bowl, bowl and kibble in sharp focus, kitten looking at the camera mid-bite, camera at kitten eye level, 85mm lens, soft key light from the left, flat seamless solid orange (#FF5E36) background."
3. `dog-food.png` · category card 2 · 1:1 · full frame, purple #5E3EDF · yellow labrador beside a plain orange bowl, licking lips. Prompt: "A yellow labrador sitting next to a plain solid orange ceramic bowl full of kibble, licking its lips, looking up at the camera, camera at dog eye level, 85mm lens, soft key light from the left, flat seamless solid purple (#5E3EDF) background."
4. `treats.png` · category card 3 · 1:1 · full frame, orange · beagle puppy catching a plain bone-shaped biscuit. Prompt: "A beagle puppy mid-leap catching a plain tan bone-shaped biscuit in its mouth, ears flying, sharp eyes on the treat, 70mm lens, fast flash look with soft key light from the left, flat seamless solid orange (#FF5E36) background."
5. `toys.png` · category card 4 · 1:1 · full frame, purple · tabby cat paw up batting an orange ball. Prompt: "A tabby cat standing on hind legs, one front paw up batting a plain solid orange ball in the air, eyes locked on the ball, mouth slightly open, 85mm lens, soft key light from the left, hard freeze-motion, flat seamless solid purple (#5E3EDF) background."
6. `grooming.png` · category card 5 · 1:1 · full frame, orange · grey and white long-haired cat being brushed (a human hand and a purple-handled slicker brush at the frame edge). Prompt: "A fluffy grey and white long-haired cat with eyes half closed in bliss, a plain purple-handled slicker brush gently brushing its chest from the frame edge (only a hand edge visible), 85mm lens, soft light from the left, flat seamless solid orange (#FF5E36) background."
7. `cat-litter.png` · category card 6 · 1:1 · full frame, purple · ginger kitten peeking over a plain white litter tray. Prompt: "A ginger kitten peeking curiously over the rim of a plain white clean litter tray with a plain scoop beside it, kitten looking at the camera, camera low, 70mm lens, soft key light from the left, flat seamless solid purple (#5E3EDF) background."
8. `accessories.png` · category card 7 · 1:1 · full frame, orange · border collie wearing a plain purple collar with a blank round metal tag. Prompt: "A black and white border collie head and shoulders wearing a plain solid purple (#5E3EDF) collar with a small blank round metal tag, tilted head, soft smile, 85mm lens, soft key light from the left, flat seamless solid orange (#FF5E36) background."
9. `promo-wag.png` · Home purple promo · 1:1 · cut-out · Jack Russell jumping with ears flying, mouth open. Prompt: "A happy Jack Russell terrier mid-jump, all four paws off the ground, ears flying, mouth open in a big smile, full body, camera low angle, 50mm lens, soft key light from the left at 5600K with orange rim light, isolated on a transparent background, no shadow."
10. `story-owner.png` · Home brand story · 3:4 · full frame, orange wall, warm home · young woman with a golden retriever resting its head on her shoulder. Prompt: "A young Moroccan woman in her late twenties in a cream knit sweater, eyes closed, smiling, hugging a golden retriever whose chin rests on her shoulder, dog looking at the camera, warm orange (#FF5E36) painted wall behind, eye-level, 50mm f/2, soft window light from the left at 4800K, natural unposed moment, not a stock photo look." Label as AI image (question Q2).
11. `social-01.png` · Social grid · 1:1 · full frame, cream · kitten asleep on a cream blanket. Prompt: "A sleeping grey kitten curled on a soft cream blanket, top-down angle, 50mm, soft window light."
12. `social-02.png` · social grid · 1:1 · full frame, terracotta courtyard with zellige tile · golden retriever tongue out in sun. Prompt: "A golden retriever sitting in a sunny Moroccan riad courtyard with a blurred terracotta wall and a zellige tile edge, tongue out, eye-level, 85mm f/2, warm 4500K late sun with rim light on the fur."
13. `social-03.png` · social grid · 1:1 · full frame, purple · hand offering a treat to a dog's nose. Prompt: "Close-up of a human hand offering a small bone-shaped biscuit to a dog's nose (labrador mix), eyes on the treat, shallow depth of field, 100mm, soft light from the left, flat seamless solid purple (#5E3EDF) background."
14. `social-04.png` · social grid · 1:1 · full frame, orange · black cat with green eyes. Prompt: "A glossy black cat with big green eyes looking straight at the lens, whiskers sharp, 85mm, soft light from the left with a small rim light, flat seamless solid orange (#FF5E36) background."
15. `social-05.png` · social grid · 1:1 · full frame, cream · two puppies tumbling. Prompt: "Two golden retriever puppies tumbling over each other on a cream floor, playful, motion in the ears, 70mm, soft overhead light."
16. `social-06.png` · social grid · 1:1 · full frame, window light · tabby curled on a sunny windowsill. Prompt: "A tabby cat curled on a sunny windowsill with warm 4000K light on the fur and a soft blurred room, eye-level, 85mm f/2."
17. `newsletter-cat.png` · Home newsletter · 1:1 · cut-out · fluffy grey-white cat looking up. Prompt: "A fluffy grey and white cat looking up and to the left with wide curious eyes, head and shoulders, camera slightly above, 85mm, soft key light from the left, isolated on a transparent background, no shadow."

Other pages
18. `cats-hero.png` · Cats landing hero · 16:9 · full frame, purple, cat on the right third · tabby cat sitting tall. Prompt: "A tabby cat sitting tall on the right third of the frame looking proudly at the camera, space on the left, 85mm, soft key light from the left, orange rim light, flat seamless solid purple (#5E3EDF) background."
19. `dogs-hero.png` · Dogs landing hero · 16:9 · full frame, orange, dog on the right third · golden retriever running toward the camera, happy. Prompt: "A golden retriever trotting toward the camera, ears bouncing, tongue out, on the right third of the frame, empty space on the left, 70mm, soft light from the left, flat seamless solid orange (#FF5E36) background."
20. `offers-duo.png` · Offers hero · 3:2 · cut-out · corgi and a ginger cat sitting side by side, both looking up-right. Prompt: "A corgi and a ginger cat sitting side by side, both looking up to the upper right with excited eyes, camera eye level, 85mm, soft key light from the left with orange rim light, isolated on a transparent background, no shadow."
21. `about-walk.png` · About hero · 3:2 · full frame, golden-hour park · woman and two dogs walking, seen from behind-side, faces turned away. Prompt: "A young woman from behind and side walking two dogs, a golden retriever and a small mixed-breed dog on loose leads, warm golden-hour backlight 3500K, rim light on the fur, eye-level, 50mm f/2, calm mood." Label AI.
22. `contact-puppy.png` · Contact · 1:1 · cut-out · golden puppy head tilted. Prompt: "A golden retriever puppy with its head tilted listening, big eyes, one ear up, head and shoulders, 85mm, soft light from the left, isolated on a transparent background, no shadow."
23. `404-cat.png` · 404 · 3:2 · full frame, cream · tabby peeking out of a tilted empty cardboard box, plain, no marks. Prompt: "A realistic tabby cat peeking out of a tilted empty plain cardboard box, looking up and left with curious eyes, 70mm, soft light from the left, flat seamless cream (#FAF5EB) background, empty space on the right."
24. `empty-cart.png` · Empty cart · 1:1 · cut-out · beagle with a head tilt next to an empty plain wicker basket. Prompt: "A beagle sitting next to an empty plain wicker basket, head tilted, soulful eyes, 85mm, soft light from the left, isolated on a transparent background, no shadow."
25. `order-success.png` · Order success · 4:3 · full frame, purple · golden retriever with a plain unmarked cardboard parcel with a plain orange ribbon. Prompt: "A delighted golden retriever sitting behind a plain unmarked cardboard parcel tied with a plain orange (#FF5E36) ribbon, tongue out, 85mm, soft light from the left, flat seamless solid purple (#5E3EDF) background."
26. `og-share` · Open-graph 1200x630 · 0 new images · build in HTML from `home-hero-duo.png` on purple with the headline set in type.

Placeholder products (12) · all 1:1 · cut-out · blank, unbranded, clearly generic. Shared product prompt tail: "plain generic placeholder product, blank unlabelled surface, no brand, no text, no logo, no claims, soft studio light from the upper left, front three-quarter view 15 degrees from above, isolated on a transparent background, no shadow."
27. `p-cat-dry.png` · Cat Food · blank purple pouch with kibble pieces beside it.
28. `p-cat-wet.png` · Cat Food · blank orange pouch and a blank round tin.
29. `p-dog-dry.png` · Dog Food · large blank orange bag with scattered kibble.
30. `p-dog-wet.png` · Dog Food · blank purple tray lid peeled back, chunks inside.
31. `p-dog-treats.png` · Treats · clear jar of bone-shaped biscuits, blank lid.
32. `p-cat-treats.png` · Treats · blank purple pouch and fish-shaped crunchy treats.
33. `p-rope.png` · Toys · knotted purple and cream rope toy.
34. `p-wand.png` · Toys · cat wand with orange feathers and a purple handle.
35. `p-brush.png` · Grooming · slicker brush, purple handle.
36. `p-litter.png` · Cat Litter · blank white bag, plain scoop and a small mound of litter.
37. `p-collar.png` · Accessories · purple collar with a blank round tag.
38. `p-leash.png` · Accessories · coiled orange leash with a blank metal clip.
Each prompt = "<item description>" + shared product tail, written as one sentence for the product named.

(Items 27-38 are 12 products; total counted in section 4.)

Brand assets
- Header logo, how I would get it: best = crop the wordmark from the brand board, then trace it to SVG (free, keeps the exact custom letters, the Adobe vectorize tool or vtracer can do it) and clean the paw by hand. Second = kie-image edit at 2K with the board as reference and `-b transparent` (2 tries, risk: letters redrawn slightly wrong). Third = redraw by hand in SVG (slow, letters drift). Recommendation: crop and trace; use kie 2K only if the crop looks soft.

## 4. Count and cost (estimate, about 6 credits, about $0.03 per image)
- Photos: 25 (items 1-25). Products: 12. Total 37 new images (OG is HTML, logo free by trace).
- Base: 37 x 6 = 222 credits, about $1.11.
- Re-rolls (AI pets often need 1 retry in 2): plan up to 18 extra = 108 credits, about $0.54. Cap: 330 credits, about $1.65.
- Optional 2K logo: 2 images, price per 2K not checked here, assume about 12 credits each.
- All numbers are estimates until the first image is billed.

## 5. Design tokens (from the board)
- Radius: cards and photos 28 px, hero blocks 40 px, buttons pill 999 px, brand icon style squircle (about 22 percent).
- Shadow: one soft warm shadow, `0 12px 32px rgba(34,15,6,.12)`; no black, no glow, no glass.
- Blobs: flat, 3-4 asymmetric lobes (board pattern row), purple or orange only, never outlined, at most 2 per view, bleed off an edge, behind the subject, under 25 percent of the area.
- Paw: orange paw as one accent per section (as the dot of the logo "i"), max 3 per page; the purple paw-bone-star pattern only in the purple promo band and the footer.
- Stars: 4-point sparkle, 1-3 per hero, cream on purple or purple on cream. Hand-drawn tick bursts (2-3 strokes) next to the focus point; small hearts only in captions. Curved dividers between bands, one wavy orange squiggle max per page.
- Photos: no filter, no duotone, no grain, warm and natural grade; rounded 28 px; cut-outs sit with 20 percent overlap on a blob; type goes behind the cut-out head on hero and promo only.
- Product tiles: white tile on cream page, product at 70 percent of the tile, same angle on all, CSS shadow under it, one 12 percent purple or orange tint blob behind, the same "Sample image" tag in HTML; no AI product is shown with a real brand, claim or certification.
- Safe zone: 6 percent sides, hero text on the side with empty space, at most 20 words over a photo; Arabic or French needs RTL-safe layouts (Q9).

## 6. Open questions for the boss
- Q1 Hero resolution. A) 1K like all photos (about 1536 px, a little soft full width). B) 2K for hero and the 2 landing heroes only (3 images, extra credits). C) Hero 1K and upscale later.
- Q2 AI-image honesty. A) Small "Illustrative image" note under the story, About and social grid. B) One line in the footer only. C) No note (not advised: people must not pass as customers).
- Q3 Cut-outs. A) Generate transparent directly (cheapest, edges may be rough). B) Generate on flat purple then remove the background with a tool. C) Mix: A first, B for failures.
- Q4 Logo. A) Crop and trace to SVG (free). B) kie 2K edit. C) Redraw by hand.
- Q5 Products. A) Blank unbranded shapes in brand colours (my pick). B) Blank packs with the MochiPaw wordmark added in HTML (looks like own-label, invents packaging). C) Wait for real photos and use clean colour tiles with a paw icon.
- Q6 People. A) Owner is a Moroccan woman, bare head (my pick). B) Mix, including a hijab-wearing woman and a man. C) Hands and silhouettes only, no faces.
- Q7 Social grid, "LET'S MAKE SOME PAWSOME MOMENTS!". A) AI mood images, no handles, no fake likes. B) Real customer photos later, grey tiles now. C) Our own team's pets.
- Q8 Moroccan settings. A) Riad courtyard and zellige in 1 or 2 shots. B) International neutral only. C) Moroccan in the lifestyle photos only.
- Q9 Site language. English only as in the brief, or English plus French or Arabic later (needs RTL and 30 percent longer lines).
- Q10 Spend. OK for 37 images (about 222 credits) plus 108 re-roll cap? A) Yes all. B) Hero + 7 categories first (8 images), then decide. C) No.
- Q11 Direction. A Studio Pop (recommended), B Sunny Home, C Paw World.

Rules used: R-005, R-014, R-025 (client palette overrides), R-033, R-035, R-053, R-073, R-076, R-090.
Checklist self-check: coverage 12/14 (points 11-15 are Instagram-only; not applicable to a website). Weakest part: cut-out quality on fluffy fur and consistency of the 12 products.

## 7. Decisions relayed by the coordinator (2026-11-04, not generation)
- Final: headline GRAND AMOUR. PETITS PRIX. · all images 1K · cut-outs transparent first · people mix (veiled woman with a cat, man with a dog; no veiled woman with a dog) · sample products = blank shapes with a "sample" tag in HTML · logo: boss crops and traces · site French first, Arabic RTL later. Direction (A or B) NOT decided: boss picks after two test images.
- Test list (2 images, about 12 credits of a 54 credit test budget, one try each, retry only with his OK, R-090). NOT YET GENERATED: the approval reached me through an agent message, so I need his own message first.
  1. `studio-pop-hero` = item 1, 3:4, `-b transparent`, plain purple bandana, plus shared tail.
  2. `sunny-home-hero` = Direction B changed: young Moroccan woman, soft cream hijab, eyes closed smiling, relaxed tabby cat held to her cheek looking at the lens, sofa in a warm Moroccan home, 3:2, eye level, 50mm f/2, window light from the left 4800K with soft right bounce, sun edge on the cat's fur, left third calm for the headline, plus shared tail, labelled AI, never a customer.
- Output folder: `clients website/mochipaw/_brand/direction-tests/`.
- Also relayed as boss answers: bandana = plain purple; social grid = AI mood photos, marked as AI; Moroccan feel = only in people photos (so no riad courtyard in pet-only shots). Generation of the 2 test images still waits for his own message to me (relayed approval not accepted).

# XSHAWALX Fitness — What I Use

Public URL: https://xshawalx.github.io/fitness/

This lightweight static site lives inside the root Pages repository `xshawalx/xshawalx.github.io`, not a fourth deployment. It inherits the homepage tokens and fonts through `/styles-v3.css` and shares a single navigation stylesheet at `/assets/css/shared-nav.css`.

## Publish a real product

Edit **`fitness/data/catalog.js` only** for routine product additions. Products remain hidden until an approved complete record exists. There are no product placeholders.

Required record example (illustrative schema only; DO NOT publish as a real product):

    {
      slug: "approved-product-slug",
      name: "Approved Product Name",
      category: "whey-protein",
      image: "/fitness/assets/approved-product.webp",
      badge: "I use this",
      usageRank: 1,
      points: ["Approved point one", "Approved point two", "Approved point three"],
      cta: {
        type: "shopee",
        label: "Buy on Shopee",
        url: "EXACT_APPROVED_SHOPEE_AFFILIATE_URL"
      }
    }

Do not invent health claims, usage frequency, badge, product variants, images or affiliate URLs. Exactly **three** approved points are required. Store permitted approved product images under `fitness/assets/` and set the correct path. For affiliate URLs, keep query strings and tracking parameters unchanged.

* `badge`: only `"I use this"` or `"Recommended"`, explicitly chosen by Shawal.
* `disclosure`: `"Sponsored"` or `"Paid partnership"` when required. This does not imply use or change ranking.
* `usageRank`: smaller positive numbers come first within each category; otherwise retain manual order.
* New categories: add {slug,label} to `categories` and assign the slug to real products. Unused categories automatically stay hidden.
* No prices, star ratings, claims review, or automatic marketplace lookup in the frontend.

## Future-ready fields

* Other CTA types: `external`, `whatsapp`, `referral`, `contact`, `trainer`. Every CTA has its own explicit URL; no generated tracking parameters.
* `promo`: `{code,discountText,destinationUrl,expiry}` shown only if present. Copy Code uses the Clipboard API when available.
* `services`: optional records with `slug`, `name`, `providerType:"partner"`, `speciality`, `location`, `description`, `cta`. Section stays hidden while empty. Never present Shawal as a certified trainer or activate self-training without instruction.
* Future `/fitness/collab/` remains unbuilt until requested; for now brand enquiries go to `xshawalx@gmail.com`.

## Shared navigation maintenance

Navigation order on all four sites is **Home | Fitness | UGC | Prompts**, with active `aria-current="page"`. Styles are centrally served from `/assets/css/shared-nav.css` in this repository and loaded in the UGC and Prompts projects. Do not replace this with diverging local nav styles. The HTML in Prompt Library is authored by `xshawalx/prompts/scripts/build.mjs`, not its generated `dist/` files.

## Analytics event

CTAs dispatch the browser-only `xshawalx:analytics` event with `fitness_product_click`, `product_slug`, `category`, and `cta_type`. No tracking IDs or visitor data are sent and no analytics backend is installed.

## Deployment and verification

The root Pages branch automatically serves `/fitness/index.html`. After updates, check the site at widths 320, 375, 390, 430 and desktop, and test navigation across Home, UGC, Fitness and Prompts. Confirm that published affiliate URLs are preserved exactly. With no products yet, the page intentionally displays “Nothing here yet.”

## Draft queue (9 October 2026)

The file `fitness/data/pending-products.json` contains five user-provided products **not yet published**. Their original images are stored under `fitness/assets/` (including AVIF for the chickpeas image, whose original uploaded filename used .jpg even though its real format is AVIF). All approved short points and exact Shopee short links are preserved. Products remain hidden until complete.

**Before publishing:** explicitly confirm each item's badge (`I use this` vs `Recommended`) and obtain the third approved point for `rte-grilled-corn-jagung` and `kacang-kuda-rebus`. No usage rank was specified; preserve the submitted order, including items within Prep Meals. Move valid entries into `fitness/data/catalog.js` and remove them from the draft queue; never display two-point drafts as final product cards.

Images in the draft are currently original-source resolution. For page performance, optimize (resize/compress to WebP while preserving packaging) before or during final publication when practical.

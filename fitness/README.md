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

Do not invent health claims, usage frequency, badge, product variants, images or affiliate URLs. Use **two or three** approved points; never invent missing points. Store permitted approved product images under `fitness/assets/` and set the correct path. For affiliate URLs, keep query strings and tracking parameters unchanged.

* `badge`: only `"I use this"` or `"Recommended"`, explicitly chosen by Shawal.
* `disclosure`: `"Sponsored"` or `"Paid partnership"` when required. This does not imply use or change ranking.
* `usageRank`: smaller positive numbers come first within each category; otherwise retain manual order.
* `listOrder`: optional explicit priority for the global All view; Radiant Organic ACV is first by Shawal's request.
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

## Compact list layout (October 2026)

Product cards use one concise horizontal row per product, with the image to the left and badge, title, approved points and Shopee CTA on the right. This replaces large image-first tiles on desktop and mobile. Radiant Organic Apple Cider Vinegar is explicitly first in the All listing. Do not silently change this priority or rewrite supplied claims.

# XSHAWALX website analytics (GA4)

## Status: ready to activate, NOT collecting data yet

The single shared script `/assets/js/analytics.js` runs on Home, Fitness, UGC (including Packages) and all generated Prompt Library pages. The real GA4 measurement ID has not yet been provided. Until it is populated, the script intentionally makes no requests and does not track visitors.

**To activate:** create/use one Google Analytics 4 property and one Web data stream for `https://xshawalx.github.io`. Google Analytics > Admin > Data streams > Web > Measurement ID (`G-...`). Edit the one line `const GA4_MEASUREMENT_ID = "";` in `assets/js/analytics.js` (root GitHub repository) to contain that real ID, then deploy the root repository. No other repository needs changing.

## Metrics

1. Automatic GA4 `page_view` on each loaded HTML page. Use GA4 Reports > Engagement > Pages and screens for views per path (/, /fitness/, /ugc/, /ugc/packages.html, /prompts/, /prompts/<slug>/). Use Reports > Acquisition for referrer / campaign sources.
2. Custom event `shopee_click` occurs on user clicks on Shopee links. Event parameters: `product_slug`, `product_name`, `product_category`, `page_section`, `link_url`, `link_text`. Use Reports > Engagement > Events (shopee_click) to see total clicks. This is click count, not confirmed purchases or unique buyers.
3. To break down clicks by products in GA4 reports, add event-scoped custom dimensions under Admin > Custom definitions: `product_slug`, `product_name`, `product_category`, `page_section`. In Explore, use `Event name` and the custom dimensions with `Event count` filtered to `shopee_click`. Register dimensions early because GA4 custom dimensions generally do not backfill historical data.
4. `fitness.js` sets non-sensitive data attributes on actual product CTAs. The shared script listens for Shopee link clicks, including dynamically generated products and later product pages. Do not add an extra gtag event in fitness.js or it would double count. An existing internal `xshawalx:analytics` browser event is not sent separately to GA4.
5. GA4 may also automatically collect outbound `click` events through Enhanced Measurement. Count **only `shopee_click`** for Shopee product-click reporting, to avoid confusing generic outbound-click counts with the custom event.
6. A single Google Analytics Web stream across one hostname supports all four projects. For sharing from Threads, use tagged links such as `https://xshawalx.github.io/fitness/?utm_source=threads&utm_medium=social&utm_campaign=fitness`.

## Privacy and limitations

No direct request to Google or storage on the website until a valid ID is configured. Only pageviews and clicked Shopee URLs / product IDs are instrumented here; typed prompt contents, names, emails and form text are not collected by this custom code. Google Analytics itself may set cookies or process technical visitor data; publish an appropriate privacy notice and obtain any consent required by applicable law before activation. GA4 uses third-party infrastructure and can be blocked by tracking protection, so counts are approximate. User needs access to Google Analytics dashboard for real metrics. Do not publish OAuth tokens, API secrets, or client credentials in this public repository; GA4 Measurement ID is a public tag identifier.

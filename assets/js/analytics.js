/*
  XSHAWALX cross-site analytics (Home, Fitness, UGC, Prompts).
  One GA4 Web data stream is used for all pages under xshawalx.github.io.

  ACTIVATE: insert your real G- measurement ID in the empty string below.
  This file is shared by ALL projects using /assets/js/analytics.js.
  Until configured, no Google Analytics script is loaded and no data is sent.

  GA4 automatically collects page_view once per normal page load.
  Custom shopee_click is sent only for clicked links on Shopee domains.
  No purchases, forms, free-text entries or personal contact details are collected.
*/
(() => {
  "use strict";

  const GA4_MEASUREMENT_ID = ""; // e.g. G-XXXXXXXXXX (do not use an example ID)
  if (!/^G-[A-Z0-9]+$/.test(GA4_MEASUREMENT_ID)) return;
  if (window.__xshawalxAnalyticsInstalled) return;
  window.__xshawalxAnalyticsInstalled = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA4_MEASUREMENT_ID, {
    send_page_view: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" +
    encodeURIComponent(GA4_MEASUREMENT_ID);
  document.head.appendChild(script);

  function sectionFromPath(pathname) {
    if (pathname === "/fitness" || pathname.startsWith("/fitness/")) return "fitness";
    if (pathname === "/ugc" || pathname.startsWith("/ugc/")) return "ugc";
    if (pathname === "/prompts" || pathname.startsWith("/prompts/")) return "prompts";
    return "home";
  }

  function isShopeeDomain(hostname) {
    // Check hostnames, not substring matches, to avoid lookalike domains.
    return /(^|\.)shopee\.(com\.my|sg|ph|co\.id|co\.th|vn|com)$/.test(hostname);
  }

  // Delegate once, so dynamically rendered cards and future Shopee CTAs work.
  document.addEventListener("click", (event) => {
    const target = event.target;
    const element = target && typeof target.closest === "function" ?
      target : target && target.parentElement;
    const link = element && typeof element.closest === "function" ?
      element.closest("a[href]") : null;
    if (!link) return;

    let destination;
    try {
      destination = new URL(link.href, window.location.href);
    } catch {
      return;
    }
    if (!isShopeeDomain(destination.hostname.toLowerCase())) return;

    window.gtag("event", "shopee_click", {
      product_slug: (link.dataset.productSlug || "unspecified").slice(0, 100),
      product_name: (link.dataset.productName || "Unspecified product").slice(0, 100),
      product_category: (link.dataset.productCategory || "other").slice(0, 100),
      page_section: sectionFromPath(window.location.pathname),
      link_url: destination.href,
      link_text: (link.textContent || "").trim().slice(0, 100)
    });
  }, true);
})();

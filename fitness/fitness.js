(() => {
  "use strict";
  const data = window.XSHAWALX_FITNESS || {};
  const allCategories = Array.isArray(data.categories) ? data.categories : [];
  const filters = document.getElementById("category-filters");
  const grid = document.getElementById("product-grid");
  const empty = document.getElementById("product-empty");
  const servicesSection = document.getElementById("fitness-services");
  const servicesGrid = document.getElementById("service-grid");
  if (!filters || !grid || !empty) return;

  const safeUrl = (value, allowed = ["https:", "http:"]) => {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const resolved = new URL(value, window.location.origin);
      if (!allowed.includes(resolved.protocol)) return "";
      return resolved.href;
    } catch { return ""; }
  };
  const imageUrl = value => {
    const safe = safeUrl(value, ["https:", "http:"]);
    if (!safe) return "";
    if (value.startsWith("/") && !value.startsWith("//")) return safe;
    if (safe.startsWith("https://")) return safe;
    return "";
  };
  const known = new Map(allCategories.filter(c => c && c.slug && c.label).map(c => [c.slug, c.label]));
  const valid = p => p && typeof p.slug === "string" && p.slug.trim() &&
    typeof p.name === "string" && p.name.trim() && known.has(p.category) &&
    imageUrl(p.image) && ["I use this", "Recommended"].includes(p.badge) &&
    Array.isArray(p.points) && p.points.length >= 2 && p.points.length <= 3 &&
    p.points.every(x => typeof x === "string" && x.trim()) &&
    p.cta && safeUrl(p.cta.url, ["https:", "http:", "mailto:"]);
  const records = (Array.isArray(data.products) ? data.products : [])
    .map((p, index) => ({p, index}))
    .filter(o => {
      if (!valid(o.p)) console.warn("Fitness: incomplete product record skipped", o.p && o.p.slug);
      return valid(o.p);
    });
  const rank = p => Number.isFinite(p.usageRank) && p.usageRank > 0 ? p.usageRank : Infinity;
  // An explicitly assigned listOrder takes precedence on the All view.
  // Category-specific order continues to follow usageRank/manual order.
  const listOrder = p => Number.isFinite(p.listOrder) ? p.listOrder : Infinity;
  records.sort((a,b) => {
    const priorityDiff = listOrder(a.p) - listOrder(b.p);
    const catDiff = [...known.keys()].indexOf(a.p.category) - [...known.keys()].indexOf(b.p.category);
    return priorityDiff || catDiff || (rank(a.p) - rank(b.p)) || (a.index - b.index);
  });

  let active = "all";
  function analytics(p) {
    window.dispatchEvent(new CustomEvent("xshawalx:analytics", {detail:{
      event: "fitness_product_click",
      product_slug: p.slug,
      category: p.category,
      cta_type: p.cta.type || "shopee"
    }}));
  }
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (typeof text === "string") n.textContent = text;
    return n;
  }
  function makeLink(cta, p) {
    if (!cta || !cta.url) return null;
    const type = cta.type || "shopee";
    const url = safeUrl(cta.url, ["https:", "http:", "mailto:"]);
    if (!url) return null;
    const a = el("a", "fitness-cta", cta.label || ({
      shopee:"Buy on Shopee", external:"Shop Now", whatsapp:"Order via WhatsApp",
      referral:"Join / Sign Up", trainer:"View Trainer", contact:"Contact Me"
    }[type] || "Learn More"));
    a.href = url;
    if (!url.startsWith("mailto:")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer" + (type === "shopee" || p.disclosure ? " sponsored" : "");
    }
    a.addEventListener("click", () => analytics(p));
    return a;
  }
  function promoNode(p) {
    if (!p.promo || !p.promo.code) return null;
    const promo = p.promo;
    const wrap = el("div", "fitness-promo");
    const summary = el("p", "fitness-code");
    summary.append(el("strong", "", promo.code));
    if (promo.discountText) summary.append(el("small", "", promo.discountText));
    wrap.append(summary);
    if (promo.expiry) wrap.append(el("p", "fitness-service-location", "Valid until " + promo.expiry));
    const copy = el("button", "fitness-copy", "Copy Code");
    copy.type = "button";
    const feedback = el("p", "fitness-copy-feedback");
    feedback.setAttribute("role","status");
    copy.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(promo.code); feedback.textContent = "Code copied"; }
      catch { feedback.textContent = "Select the code above to copy it."; }
    });
    wrap.append(copy,feedback);
    if (promo.destinationUrl) {
      const extra = makeLink({ type:p.cta.type, label:"Shop Now",url:promo.destinationUrl },p);
      if (extra) wrap.append(extra);
    }
    return wrap;
  }
  function productCard(p) {
    const card = el("article", "fitness-card");
    const imageShell = el("div", "fitness-image-wrap");
    const img = document.createElement("img");
    img.className = "fitness-image";
    img.src = imageUrl(p.image);
    img.alt = p.alt || p.name + " product image";
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 600;
    img.height = 480;
    imageShell.append(img);
    card.append(imageShell);
    const body = el("div", "fitness-card-body");
    const badges = el("div", "fitness-badges");
    badges.append(el("span", "fitness-badge", p.badge));
    if (["Sponsored","Paid partnership"].includes(p.disclosure))
      badges.append(el("span", "fitness-badge fitness-badge--disclosure", p.disclosure));
    body.append(badges, el("h3","",p.name));
    const bullets = el("ul","fitness-points");
    p.points.forEach(point => bullets.append(el("li","",point)));
    body.append(bullets);
    const actions = el("div", "fitness-card-actions");
    const link = makeLink(p.cta,p);
    if (link) actions.append(link);
    body.append(actions);
    const promo = promoNode(p);
    if (promo) body.append(promo);
    card.append(body);
    return card;
  }
  function render() {
    const visible = active === "all" ? records : records.filter(o => o.p.category === active);
    grid.replaceChildren(...visible.map(o => productCard(o.p)));
    empty.hidden = visible.length > 0;
  }
  function filterButtons() {
    filters.replaceChildren();
    const present = new Set(records.map(o => o.p.category));
    const items = [{slug:"all",label:"All"}].concat(allCategories.filter(c => present.has(c.slug)));
    items.forEach(item => {
      const button = el("button", "fitness-filter", item.label);
      button.type = "button";
      button.setAttribute("aria-pressed", String(active === item.slug));
      button.addEventListener("click", () => {
        active = item.slug;
        filters.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b === button)));
        render();
      });
      filters.append(button);
    });
  }
  function renderServices() {
    const services = Array.isArray(data.services) ? data.services : [];
    const approved = services.filter(s => s && s.name && s.cta && safeUrl(s.cta.url,["https:","http:","mailto:"]));
    if (!servicesSection || !servicesGrid || !approved.length) return;
    servicesSection.hidden = false;
    approved.forEach(s => {
      const card = el("article","fitness-card");
      card.append(el("h3","",s.name));
      if (s.speciality) card.append(el("p","fitness-service-copy",s.speciality));
      if (s.location) card.append(el("p","fitness-service-location",s.location));
      if (s.description) card.append(el("p","fitness-service-copy",s.description));
      const cta = makeLink(s.cta,{slug:s.slug || s.name,category:"services",cta:s.cta,disclosure:s.disclosure});
      if (cta) card.append(cta);
      servicesGrid.append(card);
    });
  }
  filterButtons();
  render();
  renderServices();
})();

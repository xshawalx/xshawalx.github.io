/*
  Edit only this data file to publish approved fitness products.
  Required product fields:
    slug, name, category, image, badge, points (EXACTLY 3), cta.url
  Default cta: { type: "shopee", label: "Buy on Shopee", url: "<exact affiliate URL>" }
  usageRank: lower = more frequently used; omit to preserve manual order.
  Badge is explicit: "I use this" or "Recommended". Do not infer personal use.
  Sponsored collaborations: add disclosure: "Sponsored" or "Paid partnership".
  Future promo: promo: { code, discountText, destinationUrl, expiry? }.
  Future services: add records to services below; use providerType "partner" for PT referrals.
*/
window.XSHAWALX_FITNESS = {
  categories: [
    { slug: "whey-protein", label: "Whey Protein" },
    { slug: "supplements", label: "Supplements" },
    { slug: "fish-oil", label: "Fish Oil" },
    { slug: "apple-cider-vinegar", label: "ACV" },
    { slug: "skincare", label: "Skincare" },
    { slug: "prep-meals", label: "Prep Meals" }
  ],
  products: [],
  services: []
};

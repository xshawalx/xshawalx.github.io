/*
  Edit only this data file to publish approved fitness products.
  Required product fields:
    slug, name, category, image, badge, points (2-3 approved points; use 3 where provided), cta.url
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
  products: [
    {
    "slug": "pharmanutri-whey-protein-isolate",
    "name": "Pharmanutri Whey Protein Isolate",
    "category": "whey-protein",
    "image": "/fitness/assets/pharmanutri-whey-protein-isolate.png",
    "badge": "I use this",
    "points": [
        "Protein tambahan",
        "Tanpa gula",
        "Lebih selesa untuk perut, jenis isolate"
    ],
    "cta": {
        "type": "shopee",
        "label": "Buy on Shopee",
        "url": "https://s.shopee.com.my/50ZhB1ptqw"
    }
},
    {
    "slug": "marinated-chicken-breast",
    "name": "Marinated Chicken Breast",
    "category": "prep-meals",
    "image": "/fitness/assets/marinated-chicken-breast.png",
    "badge": "I use this",
    "points": [
        "50g protein per serving",
        "180g Dada Ayam Pelbagai Perisa",
        "Sesuai makan begitu sahaja atau makan dengan meal lain"
    ],
    "cta": {
        "type": "shopee",
        "label": "Buy on Shopee",
        "url": "https://s.shopee.com.my/8AWixlUhqY"
    }
},
    {
    "slug": "rte-grilled-corn-jagung",
    "name": "RTE Grilled Corn/Jagung",
    "category": "prep-meals",
    "image": "/fitness/assets/rte-grilled-corn-jagung.png",
    "badge": "I use this",
    "points": [
        "Sumber carbs sihat",
        "Boleh makan terus"
    ],
    "cta": {
        "type": "shopee",
        "label": "Buy on Shopee",
        "url": "https://s.shopee.com.my/70KlZzdoPt"
    }
},
    {
    "slug": "kacang-kuda-rebus",
    "name": "Kacang Kuda Rebus",
    "category": "prep-meals",
    "image": "/fitness/assets/kacang-kuda-rebus.avif",
    "badge": "I use this",
    "points": [
        "Sumber carbs sihat",
        "Boleh makan terus"
    ],
    "cta": {
        "type": "shopee",
        "label": "Buy on Shopee",
        "url": "https://s.shopee.com.my/9APGAIf5Fu"
    }
},
    {
    "slug": "keledek-ungu",
    "name": "Keledek Ungu",
    "category": "prep-meals",
    "image": "/fitness/assets/keledek-ungu.png",
    "badge": "I use this",
    "points": [
        "Sumber carbs sihat",
        "Boleh makan terus",
        "Tanpa Pengawet, Tanpa Gula"
    ],
    "cta": {
        "type": "shopee",
        "label": "Buy on Shopee",
        "url": "https://s.shopee.com.my/8AWiyVYGE2"
    }
}
  ],
  services: []
};

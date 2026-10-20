(() => {
  "use strict";

  const db = window.SEMAK_PROTEIN_DATA || {};
  const all = Array.isArray(db.products) ? db.products.filter(p => p && p.id && p.name && ["whey","mass"].includes(p.category)) : [];
  const byId = id => document.getElementById(id);
  const results = byId("semak-results"), counter = byId("semak-count"), empty = byId("semak-empty");
  const input = byId("semak-query"), statusSelect = byId("semak-status");
  const tabs = Array.from(document.querySelectorAll(".semak-tabs button[data-category]"));
  let category = "whey";

  const node = (tag, className, text) => {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text != null) e.textContent = String(text);
    return e;
  };
  const normalized = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  for (const s of [...new Set(all.map(x => x.status).filter(Boolean))].sort()) {
    const opt = document.createElement("option");
    opt.value = s; opt.textContent = s;
    statusSelect.append(opt);
  }

  function fact(label, value) {
    const e = node("p", "semak-fact");
    e.style.margin = "0";
    e.append(node("span", "", label + ": "), document.createTextNode(String(value || "Tidak dinyatakan")));
    return e;
  }
  function card(p) {
    const e = node("article","semak-listing");
    const head = node("div","semak-listing-top");
    head.append(node("h3","",p.name),node("span","semak-chip",p.status || "Belum disemak"));
    e.append(head);
    const facts = node("div","semak-facts");
    facts.append(fact("Asal (menurut sumber)",p.origin),fact("Maklumat lab test (sumber)",p.labTest));
    facts.append(fact("Pendapat kami",p.opinion || "Belum ada penilaian bebas"));
    e.append(facts);
    e.append(node("p","semak-note","Source information has not been independently verified. Formula and certification may vary."));
    const link = node("a","semak-original","Lihat sumber asal & pendapat penulis ↗");
    link.href = p.sourceUrl || db.sourceHome;
    link.target = "_blank"; link.rel = "noopener noreferrer";
    e.append(link);
    return e;
  }

  function render() {
    const q = normalized(input.value), filter = statusSelect.value;
    const visible = all.filter(p => p.category === category && (filter === "all" || p.status === filter) &&
      (!q || normalized([p.name,p.origin,p.id,p.labTest].join(" ")).includes(q)));
    results.replaceChildren(...visible.map(card));
    counter.textContent = visible.length + " product(s) shown · Information is a reference, not a verified verdict.";
    empty.hidden = visible.length !== 0;
    results.setAttribute("aria-labelledby", category === "whey" ? "tab-whey" : "tab-mass");
    byId("semak-category-source").href = category === "whey" ? db.sourceWhey : db.sourceMass;
    byId("semak-category-source").textContent = category === "whey" ? "Original Whey source ↗" : "Original Mass Gainer source ↗";
  }

  function switchCategory(next) {
    category = next;
    tabs.forEach(tab => {
      const isActive = tab.dataset.category === next;
      tab.setAttribute("aria-selected",String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });
    render();
  }

  tabs.forEach(tab => tab.addEventListener("click", () => switchCategory(tab.dataset.category)));
  tabs.forEach((tab,idx) => tab.addEventListener("keydown",event => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = tabs[(idx + (event.key === "ArrowRight" ? 1 : tabs.length-1)) % tabs.length];
    next.focus(); switchCategory(next.dataset.category);
  }));
  byId("semak-search-form").addEventListener("submit", e => {e.preventDefault();render();});
  input.addEventListener("input",render);
  statusSelect.addEventListener("change",render);
  switchCategory(category);

  // Request handling: a valid, deployed Apps Script web-app endpoint is required.
  const dialog=byId("submission-dialog"),form=byId("submission-form");
  const submit=byId("submit-request"),notice=byId("form-notice");
  const confirmation=byId("submission-confirmation");
  const endpoint=String(window.SEMAK_PROTEIN_SUBMISSION_ENDPOINT||"").trim();
  const enabled=/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint);
  let pendingNonce="",lastTimer=null;

  const inform=(message)=>{notice.hidden=false;notice.textContent=message;};
  function showForm() {
    form.hidden=false;confirmation.hidden=true;
    form.reset();pendingNonce="";
    notice.hidden=true;
    if(!enabled)inform("Submission form belum aktif — Google Sheets connection is being prepared. Please check back soon.");
    submit.disabled=!enabled;submit.textContent="Submit for Checking";
    if (typeof dialog.showModal === "function")dialog.showModal();
  }
  function closeForm() {
    if(lastTimer)clearTimeout(lastTimer);
    lastTimer=null;pendingNonce="";
    dialog.close();
  }
  byId("open-submission").addEventListener("click",showForm);
  byId("close-submission").addEventListener("click",closeForm);
  byId("submission-done").addEventListener("click",closeForm);
  dialog.addEventListener("click",e=>{if(e.target===dialog)closeForm();});
  dialog.addEventListener("cancel",()=>{pendingNonce="";});
  if(enabled){form.action=endpoint;submit.disabled=false;}

  form.addEventListener("submit",e=>{
    if(!enabled){e.preventDefault();inform("Submissions are not available yet.");return;}
    if(!form.checkValidity()){e.preventDefault();form.reportValidity();return;}
    if(pendingNonce){e.preventDefault();return;}
    pendingNonce=Date.now().toString(36)+Math.random().toString(36).slice(2,14);
    byId("request-nonce").value=pendingNonce;
    submit.disabled=true;submit.textContent="Submitting…";
    inform("Sending request. Waiting for Google Sheets confirmation…");
    lastTimer=setTimeout(()=>{
      if(!pendingNonce)return;
      pendingNonce="";submit.disabled=false;submit.textContent="Try Again";
      inform("Belum terima pengesahan. Please try again later; the request may not have arrived.");
    },25000);
    // Native HTML form POST into an iframe avoids CORS issues. Do not claim
    // success until the Apps Script response sends a verified postMessage.
  });

  window.addEventListener("message",event=>{
    if(!pendingNonce || !event.data || event.data.type!=="semak-protein:submission")return;
    if(!/^https:\/\/script\.google(?:usercontent)?\.com$/.test(event.origin))return;
    if(event.data.nonce!==pendingNonce)return;
    if(lastTimer)clearTimeout(lastTimer);lastTimer=null;
    pendingNonce="";
    if(event.data.status!=="success"){
      submit.disabled=false;submit.textContent="Try Again";
      inform("Submission belum berjaya. "+(event.data.reason || "Please try again."));
      return;
    }
    form.hidden=true;confirmation.hidden=false;
    byId("submission-reference").textContent=event.data.reference ? "Reference: "+event.data.reference : "";
    submit.textContent="Submit for Checking";
  });
})();

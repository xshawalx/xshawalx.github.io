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

  // The private sheet is written through an Apps Script POST (no-CORS).
  // Since the POST response is opaque, verify save status separately through a
  // read-only JSONP status endpoint. Never show "received" on an unverified POST.
  const dialog=byId("submission-dialog"),form=byId("submission-form");
  const submit=byId("submit-request"),notice=byId("form-notice");
  const confirmation=byId("submission-confirmation");
  const endpoint=String(window.SEMAK_PROTEIN_SUBMISSION_ENDPOINT || "").trim();
  const enabled=/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint);
  let pendingNonce="";
  let activeTimer=null;
  const inform=message=>{notice.hidden=false;notice.textContent=message;};
  const cancelTimer=()=>{if(activeTimer)clearTimeout(activeTimer);activeTimer=null;};
  function resetSubmission() {
    cancelTimer();pendingNonce="";
    form.hidden=false;confirmation.hidden=true;form.reset();
    submit.textContent="Submit for Checking";submit.disabled=!enabled;
    notice.hidden=true;
    if(!enabled)inform("Borang submission belum aktif. We're completing the Google Sheets connection. Please return soon.");
  }
  byId("open-submission").addEventListener("click",()=>{
    resetSubmission();
    if(typeof dialog.showModal==="function")dialog.showModal();
  });
  const close=()=>{pendingNonce="";cancelTimer();if(dialog.open)dialog.close();};
  byId("close-submission").addEventListener("click",close);
  byId("submission-done").addEventListener("click",close);
  dialog.addEventListener("click",e=>{if(e.target===dialog)close();});
  dialog.addEventListener("cancel",()=>{pendingNonce="";cancelTimer();});

  const finish=(data,nonce)=>{
    if(nonce!==pendingNonce)return;
    cancelTimer();pendingNonce="";
    if(!data || data.status!=="success"){
      submit.disabled=false;submit.textContent="Try Again";
      inform("Submission belum berjaya. "+(data && data.reference ? data.reference : "Please try later."));
      return;
    }
    form.hidden=true;confirmation.hidden=false;
    byId("submission-reference").textContent=data.reference ? "Reference: "+data.reference : "";
  };
  function checkStatus(nonce,attempt,startedAt) {
    if(nonce!==pendingNonce)return;
    if(Date.now()-startedAt>28000){
      finish({status:"error",reference:"No save confirmation received. It may have arrived; please check before retrying."},nonce);
      return;
    }
    const callback="semakAck"+nonce.replace(/[^a-z0-9]/g,"").slice(0,38);
    const tag=document.createElement("script");
    let handled=false;
    function cleanup(){
      tag.remove();
      try{delete window[callback];}catch(e){window[callback]=undefined;}
    }
    const retry=()=>{
      if(handled)return;
      handled=true;cleanup();
      activeTimer=setTimeout(()=>checkStatus(nonce,attempt+1,startedAt),1600);
    };
    window[callback]=result=>{
      if(handled)return;
      handled=true;cleanup();
      if(nonce!==pendingNonce)return;
      if(result && result.status==="success"){finish(result,nonce);return;}
      if(result && result.status==="error"){finish(result,nonce);return;}
      activeTimer=setTimeout(()=>checkStatus(nonce,attempt+1,startedAt),1600);
    };
    tag.onerror=retry;
    activeTimer=setTimeout(retry,4500);
    tag.src=endpoint+"?nonce="+encodeURIComponent(nonce)+"&callback="+
      encodeURIComponent(callback)+"&r="+String(attempt);
    document.head.appendChild(tag);
  }

  form.addEventListener("submit",event=>{
    event.preventDefault();
    if(!enabled){inform("Submissions aren't active yet.");return;}
    if(!form.reportValidity() || pendingNonce)return;
    const nonce=Date.now().toString(36)+Math.random().toString(36).slice(2,20);
    pendingNonce=nonce;byId("request-nonce").value=nonce;
    submit.disabled=true;submit.textContent="Submitting…";
    inform("Menghantar dan mengesahkan penerimaan. Please wait…");
    const body=new URLSearchParams(new FormData(form));
    fetch(endpoint,{method:"POST",body,mode:"no-cors",credentials:"omit",cache:"no-store"})
      .catch(()=>{}) // Confirmation is based on server status, not opaque fetch outcome.
      .finally(()=>{if(nonce===pendingNonce)checkStatus(nonce,0,Date.now());});
  });
})();

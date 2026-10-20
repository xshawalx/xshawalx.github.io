/**
 * Semak Protein submission receiver.
 *
 * Bind this project to "Semak Protein — Brand Check Submissions".
 * Deploy > New deployment > Web app: Execute as Me, Who has access: Anyone.
 * Copy the published /exec URL to submission-config.js on the website.
 * This file is intentionally a template: NEVER publish the private Sheet ID.
 */
const SUBMISSIONS_SHEET_ID = "PASTE_SUBMISSIONS_SHEET_ID_HERE";
const SUBMISSIONS_TAB = "Submissions";
const TIMEZONE = "Asia/Kuala_Lumpur";
const NOTIFY_EMAIL = false; // User prefers to check submission sheet manually.
const OWNER_EMAIL = ""; // Optional only if notifications are switched on.

function field_(data, key, max) {
  return String((data && data[key]) || "").trim().slice(0,max);
}
function safeCell_(value) {
  const s = String(value || "");
  // Stop Google Sheets from interpreting user-entered formulas.
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function result_(state, ref, nonce) {
  const safe = { status:state, reference:ref || "" };
  if (nonce && /^[a-z0-9]{8,80}$/.test(nonce)) {
    CacheService.getScriptCache().put("semak-v1-"+nonce,JSON.stringify(safe),600);
  }
  return ContentService.createTextOutput(state).setMimeType(ContentService.MimeType.TEXT);
}

/** Read-only, non-sensitive JSONP status; never return submitted fields or email. */
function doGet(e) {
  const p = (e && e.parameter) || {};
  const callback = field_(p,"callback",64);
  const nonce = field_(p,"nonce",80);
  if (!/^[A-Za-z_$][A-Za-z0-9_$]{0,63}$/.test(callback) ||
      !/^[a-z0-9]{8,80}$/.test(nonce)) {
    return ContentService.createTextOutput("Invalid request").setMimeType(ContentService.MimeType.TEXT);
  }
  const raw = CacheService.getScriptCache().get("semak-v1-"+nonce);
  const result = raw ? JSON.parse(raw) : {status:"pending"};
  return ContentService.createTextOutput(callback+"("+JSON.stringify(result)+");")
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

/** A successful reply is recorded only AFTER the private row is appended. */
function doPost(e) {
  const p = (e && e.parameter) || {};
  const nonce = field_(p,"nonce",80);
  const brand = field_(p,"brand",120);
  const product = field_(p,"product",160);
  const type = field_(p,"type",30);
  const url = field_(p,"productUrl",700);
  const notes = field_(p,"notes",800);
  const email = field_(p,"email",180);
  if (!/^[a-z0-9]{8,80}$/.test(nonce)) return ContentService.createTextOutput("INVALID");
  if (field_(p,"website",80)) return result_("error","Spam protection",nonce);
  if (!brand || !["Whey Protein","Mass Gainer"].includes(type) ||
      (url && !/^https?:\/\//i.test(url)) ||
      (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return result_("error","Required fields or format invalid",nonce);
  }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return result_("error","Busy, please retry",nonce);
  try {
    const ss = SpreadsheetApp.openById(SUBMISSIONS_SHEET_ID);
    const sh = ss.getSheetByName(SUBMISSIONS_TAB);
    if (!sh) throw new Error("Submissions tab missing");
    const reference = "SP-"+Utilities.getUuid().slice(0,8).toUpperCase();
    const when = Utilities.formatDate(new Date(),TIMEZONE,"yyyy-MM-dd HH:mm:ss");
    sh.appendRow([
      reference,when,safeCell_(brand),safeCell_(product),type,safeCell_(url),
      safeCell_(notes),safeCell_(email),"Pending","","","","","No",""
    ]);
    if (NOTIFY_EMAIL && OWNER_EMAIL) {
      try {
        MailApp.sendEmail(OWNER_EMAIL,"New Semak Protein request "+reference,
          "A new request has arrived. Check the private Submissions sheet. Reference: "+reference);
      } catch (mailError) {
        console.log("Optional notification failed: "+String(mailError));
      }
    }
    return result_("success",reference,nonce);
  } catch (error) {
    console.error(error);
    return result_("error","Storage unavailable, please retry",nonce);
  } finally {
    lock.releaseLock();
  }
}

# Semak Protein — build, data and submission setup

Public URL: https://xshawalx.github.io/fitness/semak-protein/

## Status
- Search page and its curated catalog are deployed from the root GitHub Pages repository.
- Sources: https://sites.google.com/view/semaksuplemen/home
- The public directory only includes 23 selectively curated brand / product identifiers, source-stated origin, source-stated lab-test descriptions and original-source links. **No original ratings, detailed opinions or extensive source database are republished.**
- All entries begin as **Belum disemak / Belum ada penilaian bebas**. No verification, accusation, endorsement or lab testing is implied by inclusion.
- The Apps Script endpoint was provided by the owner on 20 October 2026 and placed in `submission-config.js`, but a public read-only browser check returned Google Drive **access denied (403)**. `SEMAK_PROTEIN_SUBMISSION_READY` remains `false` until access is corrected and a real end-to-end test confirms a saved row. Never enable merely because a URL was supplied.


## Updated UI and source categories
- Search is compact on mobile, tabs are separate, and each tab reveals only five products initially. `View More` adds five on each click. Searching or changing filters or tabs resets to five.
- Each visible card's green **Okay**, blue **Likely Okay**, yellow **Suspicious**, or red **Scam** tag is a *source-attributed simplified category*, **NOT our independently verified opinion**.
- The original source's statuses `Confirm Okey` → Okay; `Likely Okey` → Likely Okay; `Spiking / Suspicious` → Suspicious; `SCAM` and `SCAM / REDEMPTION ARC` → Scam. Source red-label allegations need prominent attribution and evidence; never invent them.
- Mass gainer source 5 stars → Okay, 4 stars → Likely Okay, 2–3 stars → Suspicious. 1 star only maps to Scam if the source separately explicitly records SCAM lab information; otherwise Suspicious. These are adaptations for navigation, not independent proof.
- Original sources belong to the SemakSuplemen author; keep its website source link on cards. Do not republish extensive descriptions or bulk mirror without permission.
- The owner-controlled Master Listings sheet has two new columns: `Source Tag (not independently verified)` and `Source Label / Rating`. The private `Our Opinion` and `Our Status` remain separate for future independent reviews.
- New section 04 navigates to `/fitness/#products`; section 05 repeats the public collaboration email CTA and the six social profiles.

## Apps Script access blocker on 20 October 2026
- The owner supplied a deployed `/exec` URL but publicly anonymous GET redirected to a Google Drive `You need permission` screen.
- Owner should open Apps Script > Deploy > Manage deployments > edit the Web App deployment and ensure **Execute as Me** and **Who has access: Anyone**, then authorize/redeploy; ensure owner-supplied code is the deployed version and not a restricted editor preview.
- Before enabling the public button, verify a read-only `GET /exec?nonce=abc12345zz998877&callback=semakProbe` returns JavaScript in the shape `semakProbe({"status":"pending"});`, not access-denied HTML.
- Test one clearly labeled request and verify a matching **Pending** row and on-page success receipt. Keep disabled if any step fails.

## Google Sheets
Two native spreadsheets were created in the owner's connected Google Drive:
1. `Semak Protein — Master Listings`, tabs `Whey Protein` and `Mass Gainer` (independently curated, editable).
2. `Semak Protein — Brand Check Submissions`, tab `Submissions` (private user-submitted data).
The live site uses a manually curated static snapshot in `fitness/semak-protein/data/catalog.js`. Editing Google Sheets does **not** automatically publish data. Approved changes must be synchronized deliberately into that catalog before deployment. Keep reviewers' notes and optional submitter emails PRIVATE.

## Apps Script activation — requires spreadsheet owner's authorisation
1. Open the **private submissions Google Sheet** from your Drive.
2. Go to **Extensions > Apps Script**, create or open `Code.gs`.
3. Replace its contents with the source file at `fitness/semak-protein/apps-script/Code.gs` in this repository.
4. Replace `PASTE_SUBMISSIONS_SHEET_ID_HERE` INSIDE YOUR APPS SCRIPT EDITOR with the ID of the private Submissions Google Sheet. **Never add the private Sheet ID to the public GitHub source file.**
5. Click **Deploy > New deployment > Web app**.
6. Set **Execute as: Me** and **Who has access: Anyone** (needed for anonymous public requests). Review the authorisation carefully: the script can edit your private sheet under your account, so deploy only the reviewed code. Public web apps can attract spam.
7. Authorise permissions. Copy the deployment URL that ends `/exec` (not `/dev`).
8. Give the public `/exec` URL to ChatGPT for insertion into `fitness/semak-protein/submission-config.js`, then wait for GitHub Pages deployment.
9. Submit a test entry on the live site and confirm **both** that its new row appears in the private sheet with status `Pending` and that the site displays the received-confirmation modal with the same reference ID. Remove or mark the test entry afterwards.
10. If the confirmation does not work, leave the form disabled and troubleshoot; do not show a false success.

### Request transport and evidence
The browser posts URL-encoded form fields to the Apps Script endpoint without reading the opaque cross-origin response; this is normal for a statically hosted public page. The script writes the row to the owner’s sheet and then stores a temporary acknowledgement (random nonce, status, reference only) in Apps Script CacheService for 10 minutes. The browser polls the read-only JSONP status endpoint until it receives `success`, `error`, or a 28-second timeout.

The JSONP endpoint exposes **no request data, email address or brand name**. Do not extend it to return private fields. It is only used for short-lived acknowledgement because GitHub Pages cannot directly write to a private Google Sheet and cross-origin iframe embedding can be unreliable. Google documents ContentService JSONP; we restrict the callback name and response content.

### Submissions sheet columns
Submission ID, Submitted At (MYT), Brand, Product Name, Supplement Type, Product URL, Additional Notes, Contact Email (optional), Review Status, Research Sources, Reviewer Notes, Owner, Reviewed At, Website Published, Publication Date.

The reviewer manually updates:
- Pending -> In Review -> Need Evidence / Reviewed / Rejected -> Published.
- Research Sources and Reviewer Notes remain in the private tracker.
- After review is approved, update `Semak Protein — Master Listings`, then publish an updated `data/catalog.js` snapshot.

For this first version, the user selected **manual checking** rather than automatic email notifications. The Apps Script source has `NOTIFY_EMAIL = false`, and notification settings are not activated.

## Safety and data handling
- The SemakSuplemen source's opinion labels and ratings are NOT asserted or reproduced here. Link readers to the original site for the author's judgments, preserve attribution and seek permission before mirroring a full proprietary dataset.
- A source statement about a lab test does not verify that the user's exact brand variant, batch, or current formulation passed such a test.
- Don't submit sensitive medical information; email is optional and is not published.
- Retain submissions only as long as needed and publish a privacy notice before going live with data collection.
- This is a self-hosted static page, not an automatic fact-checking system or a laboratory.

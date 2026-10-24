# Local Edge website, version 5 — sales-readiness and usability pass

A plain static site: HTML, one stylesheet, one script and one settings file. No build step, no framework. Version 5 tightens the first-impression copy, makes portfolio covers explicit, removes the unfinished-topic list, and fixes a few routing and maintainability issues. The WhatsApp/email handoff remains the no-cost default for all three forms.

Live address (current): https://local-edge.localedge.workers.dev/

## Version 5 improvements

- The homepage explains its current tourism, hospitality and service-business focus sooner, while remaining open to other business types.
- The repeated “why Local Edge” section is shorter and more specific.
- Samanyanga Resort and In Tents Outfitters now have lightweight illustrated cover artwork while their true website screenshots are unavailable. Each cover is labelled as illustrative artwork, not a screenshot. The link still opens the live concept. Replace these covers with authorised screenshots when available.
- Portfolio images are rendered directly in HTML instead of depending on JavaScript to inject them.
- The Insights page no longer displays a public list of unfinished article ideas; readers can suggest a topic instead.
- The 404 page no longer forces all relative links to the current GitHub Pages base URL or advertises itself as canonical.
- The forms use clear WhatsApp/email handoff wording. With blank form endpoints, no details are automatically sent or stored; the visitor must press Send in their messaging app.

---

## 1. What is in the folder

```
index.html            Home
services.html         Services, pricing, service-fit finder, care plans, terms, pricing FAQ
standard.html         The Local Edge Standard
work.html             Filterable work (concept demonstrations, clearly labelled)
insights.html         Articles list, Digital Facts, topic-suggestion CTA
insight-*.html        Three full articles (lodge questions, enquiry improvements, WhatsApp/social/website)
journey.html          Founder, honest build log, vision
demo.html             Free demo request (with honest limits)
contact.html          Project enquiry, direct contact, feedback form
404.html              Not-found page
styles.css            All styling
script.js             All behaviour (menu, filters, finder, forms, reading tools)
site-config.js        THE FILE YOU EDIT: contact, form endpoints, prices, care plans, offer, reviews
robots.txt, sitemap.xml
assets/logo-*.png     Your logo files, unchanged
assets/images/        Photos, illustrations and clearly labelled portfolio cover artwork (see section 6)
```

All links are relative, so the site works in a project folder (`/Local-Edge/`) and on a custom domain.

---

## 2. Values you must fill in or confirm before promoting the site

| What | Where | Why |
|---|---|---|
| Form endpoints (Formspree or similar) | `site-config.js` > `forms` | Until you paste one, the three forms do NOT send or store anything. Visitors get a pre-written WhatsApp message and email instead, and the page says so honestly. |
| Care-plan billing, cancellation and support wording | `services.html`, section "Website care" | I wrote "billed monthly in advance", "30 days written notice" and "three business days" as sensible defaults. Change them to what you actually want to offer. |
| Privacy / "how your details are handled" statements | `demo.html`, `contact.html` | Written from what is known about the form service. Check them against the service you choose. |
| Payment structure wording | `site-config.js` > `payment` (60 / 40) | Appears on Home, Services and Demo. |
| Response-time wording | Services and FAQ | No turnaround is promised anywhere. Keep it that way unless you can keep to it. |
| Hosting wording | `services.html` terms | The copy says "GitHub Pages or another static host agreed in the quotation". See the note on GitHub Pages terms in section 8. |

---

## 3. Changing things

### A price or a care plan
1. Edit the number in `site-config.js` (`prices`, `retainers`).
2. Visitors with JavaScript see the new number everywhere automatically.
3. The pages also contain the same numbers as plain text (for visitors without JavaScript and for search engines). To keep both in step, search the HTML files for the old number (for example `$125`) and change it too. The finder, the comparison table and the FAQ all use the config values.

### An introductory offer
In `site-config.js`, set `introOffer.active` to `true`, choose the `package`, the `discount` and the wording. It appears on the Services page showing the standard price, the discount and the resulting price. It never shows a countdown or a fake deadline. Set it back to `false` to remove it.

### Add a client review
Only with the client's written permission. In `site-config.js`, add an object to `reviews` with `quote`, `attribution`, optional `service` and `date`, and `permission: 'approved'`. Anything not marked `approved` is ignored. While the list is empty, the page shows an honest "no reviews yet" message.

### Add a portfolio project
Open `work.html`, copy one `<article class="project">` block, change `data-cat`, the text, image and link. Remove the "Concept demonstration" label only for real, permitted client work. Add a matching card on `index.html` if you want it on the home page. There is a comment in the file that repeats these steps.

### Add a build-log entry
Open `journey.html`, copy one `<li class="log-entry">` block to the bottom of the list and change the number, month and texts. Only record things that happened.

### Add a Digital Fact
Open `insights.html`, copy one `<article class="fact">` block. Always include: what it tells us, its limits, the source link and the date checked. Keep Zimbabwe data and international data separate.

### Add an article
Copy an existing `insight-*.html`, keep the structure (heading ids feed the contents list), add a card to `insights.html`, and add the page to `sitemap.xml`.

---

## 4. Uploading from GitHub on a phone

1. Open the repository `Local-Edge` in the GitHub mobile app or the browser.
2. Make the folder structure: tap **Add file > Create new file**, type `assets/images/placeholder.txt` as the name (the slash makes the folder), and commit. You can delete that placeholder file afterwards; the folders stay while they contain other files.
3. Upload the files from this folder: **Add file > Upload files**. The root files (the `.html` files, `styles.css`, `script.js`, `site-config.js`, `robots.txt`, `sitemap.xml`) go in the main folder. The logos go in `assets/`. Everything else goes in `assets/images/`.
4. Replace existing files of the same name. Commit.
5. **Verify every upload.** Open each file on GitHub and check the file size against the list in your download and look at the last few lines. A cut-off `styles.css` is what made the first version look broken.
6. Wait about a minute, then open the live site in a private tab and check the pages, the menu on a phone and one form.

If a page looks unstyled, `styles.css` did not upload completely. Upload it again.

---

## 5. Honest testing report

### Checked here, in a local copy (Chromium, simulated phone and desktop widths)
- All 12 pages: every internal link and every `#anchor` resolves, no duplicate ids, every image exists and has width, height and alt text, every normal page has a title, description and canonical address (the noindex 404 page intentionally has no canonical), no leftover template tokens.
- No horizontal scrolling at 320, 390, 768 and 1440 px wide, on all pages (768 on the main pages).
- Mobile menu: opens, closes with the button, the Escape key and the dark backdrop. Without JavaScript the links show in the header instead.
- Work filters, including the "Client projects" empty state, which says plainly that there are none yet.
- Service-fit finder: validation message, hospitality result, advanced/assessment result, care-plan result; the result link pre-fills the contact form.
- All three forms: required-field checks, phone/email check, web-address check, focus moves to the first problem, consent box.
- Form fallback with no endpoint: a ready WhatsApp link (correct number and text), a mailto link and a copy button, with the honest "nothing has been stored" message.
- Form with a **stubbed** endpoint: success message after a simulated success; honest fallback after a simulated server error.
- Intro offer shows and hides from config; a price change in config flows to the page; an approved review shows and an unapproved one does not.
- Pages are readable with JavaScript turned off; reduced-motion setting is respected; the skip link is the first thing focused.
- Reading-progress bar, contents highlight and copy-link button on articles.
- Logo files are byte-for-byte identical to the originals.

### NOT verified
- Not tested on the live GitHub Pages address after upload.
- Not tested on real phones or in Safari or Firefox (only Chromium).
- No Lighthouse or PageSpeed run.
- Web fonts (Montserrat from Google Fonts) could not load in the test environment, so layouts were checked with fallback fonts. Real text may wrap slightly differently.
- No real Formspree endpoint was used, so real delivery and the Formspree privacy terms are untested.
- WhatsApp links were checked for correct format, not opened in the WhatsApp app.
- Facts in Insights were checked against their sources on 20 and 21 October 2026. Re-check before relying on them later.

---

## 6. Asset manifest and plan

| File | What | Size | Where it is used | Notes |
|---|---|---|---|---|
| `assets/logo-horizontal.png` | Logo | 776x169 | Header, footer, social image | Unchanged. Always sized by height only. |
| `assets/logo-icon.png`, `logo-stacked.png` | Logo variants | | Favicon / spare | Unchanged. |
| `assets/images/founder.jpg` | Founder portrait | 900x1200 | Journey | Your supplied image, resized only. See note 8c. |
| `assets/images/portfolio-voltedge.webp` | Screenshot of the VoltEdge source | 1440x960 | Home, Work | |
| `assets/images/portfolio-local-edge.webp` | Screenshot of this site's home page | 1440x960 | Work | Taken with fallback fonts. Retake after launch if you like. |
| `assets/images/portfolio-samanyanga.webp` | NOT PROVIDED | 1440x960 | Home, Work | See below. |
| `assets/images/portfolio-in-tents.webp` | NOT PROVIDED | 1440x960 | Home, Work | See below. |
| `assets/images/insight-*.webp` (3) | Illustrations made for the articles | 1200x750 | Insights cards, articles | Drawn for this site, not photographs. |
| `assets/images/build-log-local-edge.webp` | Version 1 and 2 screenshots | 1200x800 | Journey | |
| `assets/images/og-local-edge.jpg` | Social-share picture | 1200x630 | Link previews | Shows the new tagline. |

**Missing preview images.** The sandbox could not open the Samanyanga and In Tents sites, so it could not screenshot them. Until the two files exist, those cards show a navy panel with the name and "Open the live concept". To fix: open each live concept at about 1440 px wide, take a screenshot, crop to 3:2 (1440x960), save as WebP and upload it with the exact file name above. The cards pick the images up automatically, with no code change.

**Hero photograph.** The brief mentioned a `hero-kariba-business.webp`. It was deliberately not created. I had no photograph I could honestly use, and a stock or generated "Kariba business" picture would imply a client or a place that is not real. The hero uses an original illustration labelled as an illustration instead. If you later take a real photograph (with permission), it can go in the hero.

---

## 7. Accessibility and privacy choices
- Skip link, visible focus, real form labels, error text tied to fields, buttons at least 44 px tall.
- Motion is limited to a gentle reveal and is switched off by the "reduce motion" setting.
- No analytics, no cookies, no third-party scripts except the Google Fonts stylesheet. No private keys anywhere in the files.
- No fake reviews, ratings, logos, statistics or guarantees. Concept projects say they are concept projects.

---

## 8. Things to check or decide

a. **The Samanyanga and In Tents concept sites** (separate repositories) still showed some leftover placeholder or developer text when I read them, and Samanyanga lists contact details and a name that may be real. Check that nothing there could be mistaken for a real, commissioned business or a real person's details.

b. **GitHub Pages terms.** GitHub says Pages is not intended or allowed for running an online business or e-commerce. A brochure site for your own business is generally treated differently from a shop, but read the current terms. For client sites, the copy leaves room for "another static host agreed in the quotation".

c. **Founder photo** is used as supplied. The background shows Local Edge signage and the line "Better Websites. Real Business Growth.", which sits uneasily next to this site's no-guarantee tone and could suggest a physical office. You can crop or replace the picture later by uploading a new `founder.jpg` with the same name.

d. **Prices.** The version 4 brief's prices ($125 / $250 / $350 / $600, care plans $35 / $75 / $150, 60/40 payment) are higher than the launch prices discussed earlier. They are implemented as instructed and live in `site-config.js`.

e. **Formspree free plan** (checked October 2026): 50 submissions a month and a 30-day archive. I could not read its privacy policy, so the site makes no detailed privacy claims beyond "delivered through a third-party form service".

f. **Samanyanga and In Tents previews**: see section 6.


## Form handoff behaviour (v4 handoff update)

The demo request, general enquiry and feedback forms use the no-cost WhatsApp/email handoff while their `site-config.js` endpoints are blank. After validation, the page prepares a message and offers:
- **Send on WhatsApp** — opens a pre-filled message; the visitor must press Send in WhatsApp.
- **Send by email** — opens a pre-filled email; the visitor must press Send in their email app.
- **Copy message** — lets the visitor paste the message into another channel.

Nothing is automatically emailed or stored when endpoints are blank. The status copy explicitly says the message is prepared, not sent. If a configured form endpoint fails, the same handoff is shown as a fallback. The same flow applies to all three form types: `demo`, `enquiry`, and `feedback`.

Before publishing, test each form on a phone and desktop:
1. Submit valid sample details and confirm all entered answers appear in the prepared message.
2. Check WhatsApp opens with the correct message and correct Local Edge number.
3. Check the email button opens a draft addressed to the configured Local Edge email.
4. Confirm the user must manually send and that the page does not claim otherwise.
5. Test validation errors and the copy-message option.


## Version 6 upgrade (24 October 2026)

- Visual refresh: atmospheric SVG background, restrained motion, improved card hover states and responsive portfolio grid. Brand logo and navy/gold identity preserved.
- Portfolio expanded to eight independent concept links plus the studio site: The Big 5 Lodge, Malachite Tours & Travel, Tino's Guesthouse, Caribbea Bay Resort, Waterfront Lodge, Samanyanga Resort, In Tents Outfitters and VoltEdge Energy. A prior concept is intentionally omitted from public promotion at its owner's request.
- Portfolio cover art is original illustrative SVG artwork, not captured screenshots and not official brand material. Replace it only with actual screenshots and use appropriate permission for business-owned photography/logos.
- Added a sourced October 2026 explainer on PHP security vulnerabilities. It distinguishes a vulnerability disclosure from a confirmed breach and links to the PHP project's advisory, OpenAI's coordinated-disclosure post, AP and Reuters. Review time-sensitive security articles periodically.
- Canonical tags, social URLs, robots.txt and sitemap now reference the current Cloudflare Worker host. Update them again if a custom domain is adopted.
- Added the new insight to the homepage and Insights listing.

### Before/after publishing checklist
1. Test all internal pages and image assets at the Worker URL.
2. Test the mobile navigation and all three form handoffs on a phone. Forms with empty Formspree endpoints prepare a WhatsApp/email message but do not automatically submit or store it.
3. Check every concept link and ensure the public portfolio is consistent with any business owner's wishes.
4. Keep the previous ZIP/repository revision as a rollback backup.
5. The SVG cover illustrations are illustrative previews. Do not describe them as screenshots of the prototypes.

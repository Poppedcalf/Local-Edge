# Local Edge website, version 4

A plain static site: HTML, one stylesheet, one script and one settings file. No build step, no framework. It works on GitHub Pages as it is.

Live address (current): https://poppedcalf.github.io/Local-Edge/

---

## 1. What is in the folder

```
index.html            Home
services.html         Services, pricing, service-fit finder, care plans, terms, pricing FAQ
standard.html         The Local Edge Standard
work.html             Filterable work (concept demonstrations, clearly labelled)
insights.html         Articles list, Digital Facts, planned topics
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
assets/images/        Photos and illustrations (see section 6)
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
- All 12 pages: every internal link and every `#anchor` resolves, no duplicate ids, every image exists and has width, height and alt text, every page has a title, description and canonical address, no leftover template tokens.
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
| `assets/images/portfolio-samanyanga-cover.svg`, `portfolio-in-tents-cover.svg` | Cover cards drawn for this site | 1440x960 | Home, Work | Illustrative cards, labelled as "not a screenshot". Replace with real screenshots if you like (same place, same size). |
| `assets/images/hero-savanna.webp` | Photograph: trees at sunrise or sunset | 1280x640 | Home hero background, 404 | Supplied by you. Heavily compressed (about 43 KB) because it sits under a dark overlay. Licence to confirm. |
| `assets/images/photo-hospitality.webp` | Photograph: infinity pool above wooded hills | 800x600 | Home ("Who it is for"), lodge article | Supplied by you. Captioned as illustrative, not a client. Licence to confirm. |
| `assets/images/photo-town.webp` | Photograph: city buildings and trees | 800x600 | Home ("Who it is for") | Supplied by you. Described neutrally in the alt text because the place is not named. Licence to confirm. |
| `assets/images/photo-build-laptop.webp` | Photograph: laptop with code on a dark desk | 1400x788 | Journey (build log) | Supplied by you. Captioned "not Local Edge's workspace or code". Licence to confirm. |
| `assets/images/photo-code-detail.webp` | Photograph: close-up of code | 900x600 | The Standard (decorative) | Supplied by you. Decorative, so it has empty alt text. Licence to confirm. |

**Photographs you supplied but I did not use, and why.** The desk with the three wall posters, the orange-lit code dashboard, the two Webflow template desks (the "Andora" site and the "Norway" template, with a Starbucks cup and a Webflow mug), the MacBook on a patterned runner with a Canon lens cap, the open-plan office and the orange-lit two-monitor desk. They show other people's products, templates, brands or a real person's face, or they would suggest an office or workspace Local Edge does not have. Using them would risk looking like a client or like Local Edge's own work.

**Photo licences.** I do not know where the photographs came from. Before the site is promoted, check that each one is free to use on a business website, and add any credit its licence asks for (for example in the footer or on this page). If a licence does not allow it, delete that file and its `<img>`; the page layouts cope without them.

**Hero photograph.** The brief mentioned a `hero-kariba-business.webp`. It was deliberately not created. I had no photograph I could honestly use, and a stock or generated "Kariba business" picture would imply a client or a place that is not real. The hero uses a supplied landscape photograph as a dark background behind an original illustration labelled as an illustration. If you later take a real photograph (with permission), it can replace the background.

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

f. **Edits made on the live site.** The live site was edited after my version (for example a shorter "Why work with Local Edge" list and different cover art). I could only read it as text from my side, not its files, so this package is built from my own source. Uploading it will replace those edits. If you want to keep any of them, tell me which.

g. **Samanyanga link.** The concept link uses the repository name as it is spelled in your repository (`smanyanga-resort-prototype`, without the first "a"). It loaded when I checked, so I left it.

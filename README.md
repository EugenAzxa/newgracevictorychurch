# New Grace Victory Church - website

Static website for **New Grace Victory Church Canada**, North York, Toronto.

No build step, no framework, no dependencies. Plain HTML, CSS and JavaScript -
open a file and edit it. That is deliberate: a church this size should not need
a developer to change a phone number.

---

## ⚠️ Before this goes live - 5 things to fill in

Everything below is a placeholder because it was not published anywhere public.
**All of them live in one file: [`js/config.js`](js/config.js).** Change a value
there and it updates on every page.

| What | Where | Currently |
|---|---|---|
| Church **email address** | `config.email` | `hello@newgracevictorychurch.ca` - invented |
| Church **phone number** | `config.phone` + `config.phoneHref` | `+1 (416) 000-0000` - invented |
| **e-Transfer** address for giving | `config.giving.etransfer` | `giving@newgracevictorychurch.ca` - invented |
| **Online giving** link (Tithe.ly / Givelify / Stripe) | `config.giving.onlineUrl` | `null` - the online-giving card stays hidden until this is set |
| **Contact form** endpoint | `config.formspreeId` | `null` - the form is hidden and an "email us directly" card shows instead |

Two optional ones:

- `config.giving.charityNumber` - the CRA charitable registration number. Set it and
  a tax-receipt note appears on the Give page. Leave it `null` and that note stays hidden.
- The `https://newgracevictorychurch.ca` domain is assumed throughout (canonical tags,
  `sitemap.xml`, `robots.txt`, Open Graph URLs). If the real domain differs, find and
  replace it across the `.html` files plus `robots.txt` and `sitemap.xml`.

### Turning the contact form on

1. Go to [formspree.io](https://formspree.io), create a free account, add a form,
   point it at the church's inbox.
2. Copy the form ID out of the endpoint URL - from `https://formspree.io/f/xnqkzabc`
   the ID is `xnqkzabc`.
3. Put it in `config.formspreeId`.

The form then posts over `fetch`, shows a success message in place, and has a
honeypot field so bots do not get through. Until you do this, visitors see a card
pointing them to email and Instagram instead - never a form that silently fails.

### Also worth a read-through

The **"What we believe"** section on `about.html` is a standard interdenominational
evangelical statement. It is written to be uncontroversial, but it was written here,
not by the church. **Please have Pastor Nnenna read it before launch** and change
anything that does not match what NGVC actually teaches.

---

## What is on each page

| File | Page |
|---|---|
| `index.html` | Home - hero, welcome, three doors in, pastor, recent services, **app preview**, map |
| `about.html` | Our story, Pastor Nnenna Ogbonna, what we believe |
| `sermons.html` | Watch - live link, featured message, full service archive |
| `visit.html` | Plan your visit - service times, what to expect, getting here, FAQ |
| `remember.html` | Remembering our own - the Saylavy partnership |
| `give.html` | Giving - why, and three ways to do it |
| `contact.html` | Contact form, details, map, socials |
| `404.html` | Not-found page |

---

## Where the content came from

Nothing on this site was invented except the placeholders listed above. Everything
else was taken from the church's own channels:

- **Tagline** - "Where grace abounds, victory is sure and Christ is glorified" -
  the YouTube channel and Facebook page description
- **Address** - 465 Norfinch Dr, Unit 2, North York, ON M3N 1Y7 - the description
  on the church's own service livestreams
- **Sunday 10:00 AM** - same source
- **"Sundays, Wednesdays & Fridays"** - channel bio. Only the Sunday *time* has ever
  been published, so the site says so plainly and asks people to get in touch about
  midweek rather than guessing at times
- **"A vibrant LOVE community… forgiven, cherished, and eternally loved by ABBA"** -
  the church's own words, from their video descriptions
- **Pastor Nnenna Ogbonna** - credited on the "Renewal of the Heart" sermon
- **Logo** - the church's YouTube avatar, with the white background made transparent
- **Brand colours** - sampled straight out of that logo: navy `#2D3041`, gold `#F7BA00`
- **Pastor's photo** - cropped from the "Renewal of the Heart" thumbnail

---

## The church app preview (home page)

The home page carries an interactive mockup of the **New Grace Victory Church app** -
four tappable screens: Today, Watch, Pray, Give. Church branding throughout: the real
logo, the real address, the real service time, navy and gold.

### ⚠️ There is no app yet

The section says so, in plain words, right under the buttons: *"The app is still being
built - there is nothing to download just yet."* There are deliberately **no App Store
or Google Play badges**, because linking to a store page that does not exist would be a
lie on a church's website. The call to action is "tell us what you want in it", which is
the honest ask at this stage.

If the app ships, replace that line with real store badges - the markup for a badge pair
is already written on `remember.html`, ready to copy.

Two claims I softened while building it, for the same reason:

- The Watch screen said **"142 watching"**. The church's YouTube channel has 47
  subscribers, so that number would have read as puffery to anyone who checked.
- The Give screen said the yearly summary was **"for tax time"**, which implies
  registered-charity receipts. The CRA number is still unknown (see `config.giving.charityNumber`),
  so it now just says a summary of your giving.

---

## The Saylavy partnership (`remember.html`)

A pastoral page offering the congregation somewhere permanent to keep memory pages,
time capsules and funeral wishes, through [Saylavy](https://saylavy.com). It is
written for grieving families rather than as an advert, and the closing section
deliberately tells anyone who has just lost someone to call the church first and
worry about the app later.

### No phone mockup on this page

The only interactive app mockup on the site is the church's own, on the home page.
This page points at Saylavy with real App Store and Google Play links instead, which
is the honest thing to do for an app that actually exists and is not ours.

The phone component in `css/app-demo.css` is themeable through `--ph-*` properties,
and `js/phone-demo.js` picks up any `[data-phone]` on the page - so re-skinning it
for a second app later is about a dozen lines. Neither file is loaded here.

### ⚠️ Two things to confirm before this page goes live

1. **The partnership itself.** The page says "we have partnered with Saylavy" and
   offers to sit with people after the service to set it up. Make sure the church
   has actually agreed to both.
2. **The product claims.** The four feature descriptions are paraphrased from
   saylavy.com. The Proof of Life card is deliberately vague about *who* can see
   what - an earlier draft asserted zero-knowledge encryption I could not verify.
   Check anything you tighten against Saylavy's actual terms before promising it
   to a grieving family.

Pricing is not mentioned anywhere on the page. Saylavy's own positioning is
"one purchase, no subscription" - if the church has negotiated something different
for members, say so explicitly rather than leaving people to guess.

---

## The sermon archive

`data/sermons.json` drives the Watch page and the "recent services" strip on the
home page. Refresh it from the church's YouTube feed with:

```bash
node tools/update-sermons.mjs
```

Needs Node 18+ and nothing else. It:

- pulls the 15 most recent videos from the channel's public RSS feed
- **relabels the livestreams.** The channel titles every single one
  "@NewGraceVictoryChurch | Online Church Service | Uplifting Worship & Powerful
  Message", which tells a visitor nothing. The script names each by the day it was
  streamed instead - "Sunday Service", "Midweek Service" - reading the weekday in
  **America/Toronto**, not UTC, so a Sunday-evening service is not filed as Monday
- **collapses same-day restreams.** A dropped connection means one service shows up
  in the feed two or three times; only the first per day is kept. It prints what it
  dropped rather than quietly hiding it
- keeps older services in `archive`, so hand-curated entries survive after they
  fall off the 15-item feed

### Giving a sermon a proper title

Edit [`data/overrides.json`](data/overrides.json). Key it by the 11-character video ID
from the YouTube URL:

```json
{
  "hyotY_6JX_c": { "title": "Renewal of the Heart", "speaker": "Pastor Nnenna Ogbonna" }
}
```

Overrides always win over the auto-generated title, and they survive re-running the
update script. Set a `featured` entry in `data/sermons.json` by hand to change the
message highlighted on the Watch page.

---

## Running it locally

There is no build. But `sermons.js` fetches `data/sermons.json`, and browsers block
`fetch` over `file://` - so opening `index.html` directly will not work. Run:

```bash
node tools/serve.mjs
```

Then open <http://localhost:4321>. Node built-ins only, nothing to install.

Use this rather than `npx serve`, which rewrites `/about.html` to `/about` and so
does not match how the site is actually served in production. `tools/serve.mjs`
keeps `.html` URLs as-is, serves `404.html` for unknown paths, and sends
`Cache-Control: no-store` so a reload always shows your latest edit.

Pass a port if 4321 is taken: `node tools/serve.mjs 5000`.

---

## Deploying

**Live at https://newgracevictorychurch.vercel.app**

Deployed on Vercel as a static site; `vercel.json` handles caching and security
headers. No build command, no output directory. Redeploy with `npx vercel --prod`.

Keep `vercel.json` free of comment keys - the schema rejects any property it does
not recognise, including a `_comment`, and the deploy fails outright rather than
ignoring it.

`cleanUrls` is deliberately **off**: every internal link, the sitemap and each
canonical tag use the `.html` form, and turning it on would 308-redirect all of them.

Any static host works just as well - Netlify, Cloudflare Pages, GitHub Pages.

---

## Design notes

Built on the church's own logo rather than a stock template.

- **Colours** - navy `#2D3041` and gold `#F7BA00`, sampled from the logo, on a warm
  cream `#FDFBF6`. Gold is never used as text on cream (it fails contrast); a darker
  `#7A5900` does that job, and gold stays as a fill with navy text on top.
- **Type** - Fraunces for headings (a warm optical serif), Work Sans for everything else.
- **The sunburst** behind the hero and page headers is the rays-behind-the-cross motif
  from the logo, rebuilt in CSS as a `repeating-conic-gradient`. No image, no request.
- **Motion** is limited to a scroll reveal and hover states, and is fully disabled under
  `prefers-reduced-motion`.
- **Maps** are OpenStreetMap embeds, not Google. Google's keyless embed sends
  `X-Frame-Options: SAMEORIGIN` and refuses to load; the "Get directions" buttons still
  hand off to Google Maps, which is where people want to end up.
- **Accessibility** - skip link, visible focus rings, `aria-current` on the active nav
  item, labelled form fields, 44px+ touch targets, and every text colour at 4.5:1 or better.

Every page works with JavaScript disabled, apart from the sermon archive - which falls
back to a link to the YouTube channel.

---

## File map

```
├── index.html · about.html · sermons.html
├── visit.html · give.html · contact.html · 404.html
├── css/styles.css          all styling, one file
├── js/
│   ├── config.js           ← the file to edit
│   ├── site.js             nav, scroll reveal, config injection, contact form
│   └── sermons.js          renders the archive from data/sermons.json
├── data/
│   ├── sermons.json        generated - do not hand-edit
│   └── overrides.json      hand-written sermon titles
├── tools/
│   ├── update-sermons.mjs  refreshes sermons.json from YouTube
│   ├── serve.mjs           local preview server, zero dependencies
│   └── og-image.html       source for assets/og-image.jpg
├── assets/                 logo, pastor photo, favicon, social card
├── vercel.json · robots.txt · sitemap.xml
```

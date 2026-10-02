# Handoff notes

Written 1 October 2026, at the end of the build session. Read this plus
[`README.md`](README.md) before touching anything.

**Live:** https://newgracevictorychurch.vercel.app
**Repo:** https://github.com/EugenAzxa/newgracevictorychurch
**Local folder:** `C:\Users\dj_la\OneDrive\Рабочий стол\newgracevictorychurch`

Working tree is clean, `main` is pushed, production matches `main`.

---

## Where things stand

A seven-page static site for New Grace Victory Church Canada (North York, Toronto),
built from scratch. No build step, no framework, no dependencies.

| Page | State |
|---|---|
| `index.html` | Done - hero, welcome, three doors, pastor, recent services, church app preview, map |
| `about.html` | Done - story, Pastor Nnenna, 8 belief cards ⚠️ *needs pastoral review* |
| `sermons.html` | Done - watch-live link, featured message, 13-item archive |
| `visit.html` | Done - times, what to expect, getting here, 6-question FAQ |
| `remember.html` | Done - Saylavy partnership ⚠️ *needs partnership confirmed* |
| `give.html` | Done - three ways to give, two cards hidden until configured |
| `contact.html` | Done - form hidden until an endpoint exists, fallback card shows |
| `404.html` | Done |

Verified at the end of the session: no console errors or failed requests on any page,
mobile nav opens and closes, no horizontal overflow at 390px, every internal link
resolves, all routes serve 200 over HTTPS, 404 serves 404.

---

## ⚠️ Blocking before a real launch

These are **live on a public URL right now** with invented values. The site never shows
a visitor something broken - the contact form hides itself rather than silently eating
messages, and the giving cards hide until configured - but the footer currently prints
a made-up email and `+1 (416) 000-0000` on every page.

Everything here is in one file: [`js/config.js`](js/config.js).

| # | Needs | Key | Currently |
|---|---|---|---|
| 1 | Church email | `email` | `hello@newgracevictorychurch.ca` - invented |
| 2 | Church phone | `phone` + `phoneHref` | `+1 (416) 000-0000` - invented |
| 3 | e-Transfer address | `giving.etransfer` | `giving@newgracevictorychurch.ca` - invented |
| 4 | Online giving link | `giving.onlineUrl` | `null` - card hidden |
| 5 | Formspree form ID | `formspreeId` | `null` - form hidden, "email us" card shows |
| 6 | CRA charity number | `giving.charityNumber` | `null` - receipt note hidden |

### Four open questions for the church

1. **Midweek times.** Their bio says "Sundays, Wednesdays & Fridays" but only the Sunday
   10:00 AM time has ever been published anywhere. The site says exactly that and asks
   people to get in touch, rather than inventing hours. Get the real times and
   `visit.html#times` can be filled in properly.
2. **The belief statement.** The eight cards on `about.html` are a standard
   interdenominational evangelical statement, written during this build - *not* by the
   church. Pastor Nnenna should read it before launch.
3. **The Saylavy partnership.** `remember.html` states "we have partnered with Saylavy"
   and offers to sit with people after the service to set it up. Confirm the church has
   agreed to both before this page is public.
4. **The domain.** Canonical tags, `sitemap.xml`, `robots.txt` and all Open Graph URLs
   say `https://newgracevictorychurch.ca`, which nobody owns yet. The site is actually
   served from `newgracevictorychurch.vercel.app`. Either buy the domain and point it at
   Vercel, or find-and-replace the URL across the `.html` files, `robots.txt` and
   `sitemap.xml`. Right now search engines are being told the wrong canonical.

---

## Running it

```bash
cd "C:\Users\dj_la\OneDrive\Рабочий стол\newgracevictorychurch"
node tools/serve.mjs          # http://localhost:4321
```

A server is required - `js/sermons.js` fetches `data/sermons.json`, and browsers block
`fetch` over `file://`. `tools/serve.mjs` is Node built-ins only and matches production
(no clean-URL rewriting, 404.html on misses, no caching).

Do **not** use `npx serve` - it 301-redirects `/about.html` to `/about`, which is not
how Vercel is configured here.

## Deploying

**`git push origin main` deploys.** The Vercel project is connected to the GitHub repo
and builds on every push to `main`. That is the reliable path - use it.

The last two production deploys both went out this way, including one where the CLI
command errored out and the change still shipped.

### ⚠️ The Vercel CLI in this folder is in a bad state

Do not run `vercel link` or `vercel deploy` here until it is sorted out. During the last
session:

- `npx vercel link --yes` **created a second, empty project** rather than linking to the
  live one. The CLI's active scope had changed to a team called `finally-peace-projects`,
  while the real project lives under `eugenazxas-projects`.
- `vercel switch` then failed, and `vercel whoami` started returning `Not authorized`.

`.vercel/project.json` has been hand-restored to the correct target:

```json
{"projectId":"prj_BAjrkRp3QvURo3tzZAWgLrnIWSh5","orgId":"team_G4uuovdRAE202pdQrLv5JVpD","projectName":"newgracevictorychurch"}
```

**Two bits of cleanup for a human, in the Vercel dashboard:**

1. Delete the stray empty `newgracevictorychurch` project under **finally-peace-projects**
   (no deployments, no domain, created by accident). Make sure you are deleting the one
   with no domain attached - the real project is under `eugenazxas-projects` and serves
   `newgracevictorychurch.vercel.app`.
2. Run `npx vercel login` and confirm the scope is `eugenazxas-projects` before using the
   CLI again.

None of this affects the live site, which is healthy and serving the current build.

## Refreshing the sermon archive

```bash
node tools/update-sermons.mjs
```

Rebuilds `data/sermons.json` from the church's YouTube RSS feed. Hand-written sermon
titles live in `data/overrides.json`, keyed by video ID, and survive re-runs.

---

## Things that cost time - do not rediscover them

**`vercel.json` rejects unknown keys.** A `_comment` key explaining a setting caused
`Schema verification failed` and the deploy aborted outright. JSON has no comments;
put the reasoning in the README.

**Google's keyless Maps embed is dead.** `google.com/maps?output=embed` now returns 404
with `X-Frame-Options: SAMEORIGIN`. The maps are OpenStreetMap embeds (no API key,
frameable). The "Get directions" buttons still hand off to Google Maps, which is where
people want to land.

**YouTube's `/embed/live_stream?channel=` shows "This video is unavailable"** on every
day the church is not broadcasting - six days a week. `sermons.html` embeds the most
recent service instead, with a "Watch live" button pointing at
`youtube.com/@NewGraceVictoryChurch/live`.

**`[hidden]` does not work on the components here** without
`[hidden] { display: none !important; }` in `css/styles.css`. `.form`, `.give-option`
and others set `display: grid`, which outranks the user-agent `[hidden]` rule. Without
it the contact form rendered *and* its fallback card at the same time.

**Sermon dates must be read in `America/Toronto`, not UTC.** A Sunday-evening service is
stamped Monday in UTC. `tools/update-sermons.mjs` derives the weekday, the label and the
sortable ISO date from one Toronto reading - mixing a local weekday with a UTC date
produced "Sunday, 11 May".

**Never whitespace-normalise during a bulk text replacement.** A regex tidying spaces
around dashes collapsed the indentation on every ASCII divider line in the comments and
every CSS custom property. Substitute the exact strings and nothing else, then check
`git diff` before committing.

**Heredocs mangle backslashes and backticks** through this shell. Write files with the
editor tool, not `cat > file << 'EOF'`.

**`cd "$TMPDIR"` silently does nothing** when `TMPDIR` is unset - it stays in the current
directory. An early scrape wrote a dozen files into the wrong project folder this way.

**`vercel link --yes` will happily create a new project** instead of linking to an
existing one, if the CLI's active scope points at a different team. It does not warn.
Check `vercel teams ls` and the resulting `projectId` before trusting it - see the
deploy section above for the mess this caused.

**Markdown and scripts in the repo get served publicly by default.** `/HANDOFF.md` was
fetchable on production until `.vercelignore` was added. Anything not meant for visitors
needs to be listed there.

---

## Design decisions worth keeping

- **Brand colours are sampled from the church's own logo**: navy `#2D3041`, gold
  `#F7BA00`. Gold is never used as text on cream (it fails contrast at 1.7:1); a darker
  `#7A5900` does that job, and gold stays a fill with navy text on top.
- **Type**: Fraunces for headings, Work Sans for body.
- **The sunburst** behind the hero and page headers is the rays-behind-the-cross motif
  from the logo, rebuilt as a CSS `repeating-conic-gradient`. No image, no request.
- **`cleanUrls` is off on purpose.** Every internal link, the sitemap and each canonical
  tag use the `.html` form; turning it on would 308-redirect all of them.
- **One phone component, themeable.** `css/app-demo.css` with `--ph-*` properties,
  `js/phone-demo.js` drives any `[data-phone]`. Only the home page uses it today.
- **Nothing invented except the placeholders above.** Tagline, address, service time,
  pastor's name, the "LOVE community" copy and the logo all come from the church's own
  YouTube and Facebook. Where a fact was not published - the midweek times - the site
  says so rather than guessing.
- **No App Store badges on the church app preview.** The app does not exist yet and the
  section says so in plain words. Two other claims were pulled for the same reason:
  a "142 watching" figure (the channel has 47 subscribers) and a giving summary
  described as being "for tax time" (implies charity registration nobody has confirmed).

---

## Suggested next session

Open with: *"Read HANDOFF.md in the newgracevictorychurch folder."*

Then, in rough priority order:

1. Paste the real contact details into `js/config.js` and redeploy.
2. Decide the domain, and fix the canonical URLs to match.
3. Get the midweek service times and fill in `visit.html#times`.
4. Pastoral review of the belief statement, and a decision on the Saylavy page.
5. Optional: real photography. The only genuine photo on the site is Pastor Nnenna,
   cropped from a sermon thumbnail. A few shots of a Sunday would lift the whole thing.

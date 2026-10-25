# Portfolio

A zero-build static site. No Node, no framework, no compile step — the browser
reads exactly what is in this folder. That keeps it fast, keeps it cheap, and
means it will still work unchanged in five years.

Everything served to the public lives in `public/`. Anything outside it (this
README, the Cloudflare config) is never uploaded.

```
public/
  index.html              page structure
  404.html                not-found page
  assets/css/style.css    all styling (design tokens at the top)
  assets/js/data.js       >>> YOUR CONTENT — the only file you normally edit
  assets/js/main.js       rendering, filtering, lightbox
  assets/img/favicon.svg  tab icon
  assets/img/og.jpg       social share card (1200x630)
  _headers                caching + security headers
  robots.txt              search engine rules
  sitemap.xml             search engine index
wrangler.jsonc            Cloudflare deployment config
```

---

## Adding a project

Open `assets/js/data.js` and copy one of the blocks in `PROJECTS`:

```js
{
  title:   "Nocturne",
  cat:     "film",                 // must match a CATEGORIES id
  type:    "Music Video",          // shown as the badge on the card
  client:  "Artist Name",
  year:    2025,
  role:    "Director, Edit",
  youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  tags:    ["Unreal", "Compositing"],
  blurb:   "One or two sentences, shown in the lightbox.",
  featured: true,                  // optional: makes the card double width
},
```

Only `title`, `cat` and `youtube` are required. Everything else is optional and
simply disappears if you leave it out.

**The `youtube` field accepts any of these** — paste whatever you have:

- `https://www.youtube.com/watch?v=ID`
- `https://youtu.be/ID`
- `https://www.youtube.com/shorts/ID`
- `https://www.youtube.com/embed/ID`
- the bare 11-character ID

Projects sort newest-first automatically. You never need to reorder the list.

### Categories

`CATEGORIES` at the top of `data.js` drives the filter bar. Rename, reorder or
add entries freely — the buttons rebuild themselves, and a category with no
projects in it is hidden automatically.

### Your showreel

Set `SITE.reel` to a YouTube URL and a player appears in the hero. Leave it as
an empty string and the hero stays purely typographic.

---

## Previewing locally

From this folder:

```bash
python -m http.server 4321 --directory public
```

Then open <http://localhost:4321>.

Opening `public/index.html` by double-clicking also mostly works, but a local
server matches production more closely.

> **If a change does not show up**, your browser cached the old file. Bump the
> `?v=` number on the `style.css` / `data.js` / `main.js` lines at the top and
> bottom of `index.html`.

---

## Deploying to Cloudflare Pages

### 1. Push to GitHub

Create an empty repository on GitHub called `portfolio` (no README, no
.gitignore, no licence — this folder already has what it needs). The remote is
already configured, so all that is left is:

```bash
git push -u origin main
```

### 2. Deploy

The site deploys from this machine with Cloudflare's CLI. It is already set up
and `aburakkoc.com` is already attached, so publishing is one command:

```bash
npm run deploy
```

That uploads only the files that changed and takes a few seconds. There is no
build step — `wrangler.jsonc` points straight at `public/`.

> This site is **static assets only** — `wrangler.jsonc` has no `main` entry,
> so no server-side code runs. It is a Worker in name, serving files from the
> edge. That is why the aburakkoc.com domain page now shows a Worker connected;
> before deploying, "No Workers connected" was the expected state.

If your login ever expires:

```bash
npx wrangler login
```

### 3. The domain

`aburakkoc.com` is wired up in the `routes` block of `wrangler.jsonc`, so
Wrangler creates and maintains the DNS record for you. To also serve
`www.aburakkoc.com`, add a second entry beside it:

```jsonc
{ "pattern": "www.aburakkoc.com", "custom_domain": true }
```

All the metadata (`canonical`, `og:url`, `sitemap.xml`, `robots.txt`) already
points at `https://aburakkoc.com/`, so there is nothing to change.

### Note on GitHub auto-deploy

The repo is on GitHub for version history, but pushes do **not** auto-deploy —
deploys happen when you run `npm run deploy`. Connecting Cloudflare's GitHub
app would add auto-deploy on push if you want it later.

### 4. Replace the share card

`assets/img/og.jpg` is a generated placeholder — it is what appears when someone
drops your link into WhatsApp, Slack, iMessage or X. Swap it for a still from
your strongest piece at **1200×630**, keeping the same filename.

### Publishing updates

Edit `public/assets/js/data.js`, then:

```bash
npm run deploy
```

Live in a few seconds. To also save the change to GitHub:

```bash
git add -A
git commit -m "Add project: Nocturne"
git push
```

---

## Notes

- Videos embed through `youtube-nocookie.com`, so no YouTube tracking cookie is
  set until a visitor actually presses play.
- Thumbnails come straight from YouTube at `maxresdefault`, stepping down
  through smaller sizes if that resolution was never generated. If none exist,
  the card falls back to a gradient rather than a broken image.
- Hovering a card flips through the three keyframe stills YouTube generates for
  every upload, which reads as a small motion preview at no bandwidth cost.
- Each project has a shareable link: `yourdomain.com/#work/nocturne` opens
  straight into that video.
- The lightbox destroys its iframe on close, so audio always stops.
- Respects `prefers-reduced-motion`.

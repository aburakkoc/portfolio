# Portfolio

A zero-build static site. No Node, no framework, no compile step — the browser
reads exactly what is in this folder. That keeps it fast, keeps it cheap, and
means it will still work unchanged in five years.

```
index.html              page structure
assets/css/style.css    all styling (design tokens at the top)
assets/js/data.js       >>> YOUR CONTENT — the only file you normally edit
assets/js/main.js       rendering, filtering, lightbox
assets/img/favicon.svg  tab icon
_headers                caching + security headers (read by Cloudflare Pages)
robots.txt              search engine rules
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
python -m http.server 4321
```

Then open <http://localhost:4321>.

Opening `index.html` by double-clicking also mostly works, but a local server
matches production more closely.

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

### 2. Connect Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
2. Authorise GitHub and pick the repository.
3. Build settings — this is the important part, because there is no build:
   - **Framework preset:** `None`
   - **Build command:** *leave completely empty*
   - **Build output directory:** `/`
4. **Save and Deploy.**

You get a `your-project.pages.dev` URL in under a minute.

### 3. Attach aburakkoc.com

In the Pages project → **Custom domains** → **Set up a custom domain** → enter
`aburakkoc.com`. Because the domain is already on Cloudflare, the DNS record is
created for you and the certificate is issued automatically — usually a couple
of minutes. Repeat for `www.aburakkoc.com` if you want that to resolve too.

All the metadata (`canonical`, `og:url`, `sitemap.xml`, `robots.txt`) already
points at `https://aburakkoc.com/`, so there is nothing to change afterwards.

### 4. Replace the share card

`assets/img/og.jpg` is a generated placeholder — it is what appears when someone
drops your link into WhatsApp, Slack, iMessage or X. Swap it for a still from
your strongest piece at **1200×630**, keeping the same filename.

### Publishing updates

Every push to `main` redeploys automatically. Adding a project is:

```bash
git add -A
git commit -m "Add project: Nocturne"
git push
```

Live in about 30 seconds.

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

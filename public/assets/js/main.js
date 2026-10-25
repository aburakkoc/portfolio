/* ===========================================================================
   main.js — rendering, filtering, lightbox, scroll behaviour.
   Reads everything from data.js. You should not need to edit this file.
   =========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Escape text before it goes into innerHTML. */
  function esc(value) {
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Works out which service a video link points at.
   *
   * Accepts YouTube (watch, youtu.be, /embed/, /shorts/, /live/, or a bare
   * 11-character ID) and Vimeo (vimeo.com/123456789, player.vimeo.com, or a
   * bare numeric ID). Returns { provider, id }, with provider "" when the
   * input is not a real video link.
   */
  function parseVideo(input) {
    if (!input) return { provider: "", id: "" };
    const raw = String(input).trim();

    // Demo placeholders are 11 chars and would otherwise pass as YouTube IDs.
    if (/^REPLACE_ME/i.test(raw)) return { provider: "", id: "" };

    const vimeo = [
      /vimeo\.com\/(?:video\/)?(\d{6,12})/,
      /player\.vimeo\.com\/video\/(\d{6,12})/,
    ];
    for (const re of vimeo) {
      const m = raw.match(re);
      if (m) return { provider: "vimeo", id: m[1] };
    }
    // A bare number can only be Vimeo — YouTube IDs are never all digits.
    if (/^\d{6,12}$/.test(raw)) return { provider: "vimeo", id: raw };

    const youtube = [
      /[?&]v=([\w-]{11})/,          // watch?v=ID
      /youtu\.be\/([\w-]{11})/,     // youtu.be/ID
      /\/embed\/([\w-]{11})/,       // /embed/ID
      /\/shorts\/([\w-]{11})/,      // /shorts/ID
      /\/live\/([\w-]{11})/,        // /live/ID
    ];
    for (const re of youtube) {
      const m = raw.match(re);
      if (m) return { provider: "youtube", id: m[1] };
    }

    return /^[\w-]{11}$/.test(raw)
      ? { provider: "youtube", id: raw }
      : { provider: "", id: "" };
  }

  /** The embed URL to drop into the lightbox iframe. */
  function embedUrl(provider, id) {
    return provider === "vimeo"
      ? `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1&title=0&byline=0&portrait=0`
      : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  }

  /**
   * Embed URL for the silent looping hero background.
   *
   * Autoplay is only permitted while muted, so mute is not optional here.
   * YouTube needs `playlist=<same id>` for `loop` to work on a single video,
   * and every chrome-related flag is switched off; whatever chrome survives is
   * cropped by the oversized frame in CSS. Vimeo has a dedicated background
   * mode that strips all of it in one flag.
   */
  function bgEmbedUrl(provider, id) {
    return provider === "vimeo"
      ? `https://player.vimeo.com/video/${id}?background=1&autoplay=1&loop=1&muted=1&dnt=1`
      : `https://www.youtube-nocookie.com/embed/${id}` +
        `?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&disablekb=1` +
        `&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&fs=0&cc_load_policy=0` +
        `&enablejsapi=1`;
  }

  /**
   * Browsers block autoplay in more cases than the docs suggest — low power
   * mode, data saver, low media engagement. Two defences:
   *
   *  1. A still from the reel is painted behind the iframe, so the hero is
   *     never a black rectangle even when the video never starts.
   *  2. Once the iframe loads we ask the player to play via postMessage,
   *     which succeeds in some cases where the autoplay parameter alone does
   *     not. Harmless when it is already playing.
   */
  function setHeroPoster(host, provider, id) {
    // An explicit still always wins — YouTube's auto-thumbnail is usually the
    // title card, which fights with the name sitting on top of it.
    if (SITE.reelPoster) {
      host.style.backgroundImage = `url("${SITE.reelPoster}")`;
      return;
    }
    if (provider === "youtube") {
      host.style.backgroundImage =
        `url("https://i.ytimg.com/vi/${id}/maxresdefault.jpg")`;
      return;
    }
    if (provider === "vimeo") {
      fetch("https://vimeo.com/api/oembed.json?width=1280&url=" +
            encodeURIComponent("https://vimeo.com/" + id))
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d && d.thumbnail_url) {
            host.style.backgroundImage = `url("${d.thumbnail_url}")`;
          }
        })
        .catch(() => {});
    }
  }

  /**
   * Starts the hero video and only reveals it once it is genuinely playing.
   *
   * Autoplay via URL parameter is unreliable, and a blocked YouTube embed
   * shows its big red play button, which looks broken. So the iframe is held
   * at opacity 0 and only faded in on a real PLAYING state. If autoplay is
   * refused — or the API is blocked outright — nothing fades in and the
   * poster still frame remains, which is a perfectly good hero.
   */
  function startHeroVideo(host, provider, id) {
    if (provider === "vimeo") {
      // background=1 already strips all chrome, so reveal once it loads.
      const frame = $("iframe", host);
      if (frame) frame.addEventListener("load", () => host.classList.add("is-playing"));
      return;
    }
    if (provider !== "youtube") return;

    const mount = $("[data-yt-mount]", host);
    if (!mount) return;

    const build = () => {
      /* global YT */
      new YT.Player(mount, {
        videoId: id,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1, mute: 1, controls: 0, loop: 1, playlist: id,
          playsinline: 1, modestbranding: 1, rel: 0,
          iv_load_policy: 3, fs: 0, disablekb: 1,
        },
        events: {
          onReady: (e) => { e.target.mute(); e.target.playVideo(); },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) host.classList.add("is-playing");
            // loop+playlist usually handles this, but belt and braces.
            if (e.data === YT.PlayerState.ENDED) e.target.playVideo();
          },
        },
      });
    };

    if (window.YT && window.YT.Player) { build(); return; }

    // The API fires one global callback; chain onto anything already set.
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof prev === "function") prev();
      build();
    };

    if (!$('script[src*="iframe_api"]')) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      document.head.appendChild(s);
    }
  }

  /** URL-safe slug, used for shareable #work/<slug> links. */
  function slugify(text) {
    return String(text)
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")  // strip accents
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function categoryLabel(id) {
    const cat = CATEGORIES.find((c) => c.id === id);
    return cat ? cat.label : id;
  }

  /* ------------------------------------------------------------------
     Normalise the data once, up front
     ------------------------------------------------------------------ */

  const items = PROJECTS.map((p, index) => {
    // `video` is the current field name; `youtube` still works for old entries.
    const { provider, id } = parseVideo(p.video || p.youtube);
    return {
      ...p,
      index,
      provider,
      vid: id,
      hasVideo: Boolean(provider),
      slug: slugify(p.title) || "project-" + index,
      // Subtitle line on the card: "Music Video — Client" or whatever exists.
      sub: [p.type, p.client].filter(Boolean).join(" — "),
    };
  });

  // Newest first, so the grid stays current without manual reordering.
  items.sort((a, b) => (b.year || 0) - (a.year || 0) || a.index - b.index);

  let activeCat = "all";
  let visible = items.slice();   // the current filtered set, in display order

  /* ------------------------------------------------------------------
     Identity: header, hero, about, contact
     ------------------------------------------------------------------ */

  function paintIdentity() {
    document.title = SITE.name + " — " + SITE.role;

    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", SITE.statement);

    $$("[data-site-name]").forEach((el) => { el.textContent = SITE.name; });
    $$("[data-site-role]").forEach((el) => { el.textContent = SITE.role; });
    $$("[data-site-statement]").forEach((el) => { el.textContent = SITE.statement; });
    $$("[data-site-location]").forEach((el) => { el.textContent = SITE.location; });
    $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

    $$("[data-site-email]").forEach((el) => {
      el.textContent = SITE.email;
      el.setAttribute("href", "mailto:" + SITE.email);
    });

    // Split the name into characters so each can animate in on its own delay.
    // Characters are grouped per word, so a long name can still wrap between
    // words on narrow screens instead of overflowing.
    const title = $("[data-hero-title]");
    if (title) {
      let i = 0;
      title.innerHTML = SITE.name
        .split(/\s+/)
        .map((word) => {
          const letters = Array.from(word)
            .map((ch) => `<span class="ch" style="--d:${i++}">${esc(ch)}</span>`)
            .join("");
          return `<span class="word">${letters}</span>`;
        })
        .join(" ");
      // Screen readers get the plain name rather than one letter at a time.
      title.setAttribute("aria-label", SITE.name);
      $$(".ch", title).forEach((el) => el.setAttribute("aria-hidden", "true"));
    }

    // Terminal-style status strip above the name. Everything here is derived,
    // so it stays true as projects are added — no hard-coded year to go stale.
    const readout = $("[data-readout]");
    if (readout) {
      const years = items.map((p) => p.year).filter(Boolean);
      const span = years.length
        ? `${Math.min(...years)}–${Math.max(...years)}`
        : "";

      const bits = [
        SITE.location ? `[ LOC ] ${SITE.location}` : "",
        `[ IDX ] ${String(items.length).padStart(2, "0")} WORKS`,
        span ? `[ SPAN ] ${span}` : "",
      ].filter(Boolean);

      // Each segment is its own element so CSS can drop the last one on narrow
      // screens rather than letting the whole strip clip mid-word.
      readout.innerHTML =
        "┌ " +
        bits
          .map((b, i) =>
            `<span class="readout__i">${i ? "<i>  ·  </i>" : ""}${esc(b)}</span>`
          )
          .join("") +
        " ┐";
    }

    // The social row appears in both the hero and the contact block.
    if (Array.isArray(SITE.links)) {
      const markup = SITE.links
        .map(
          (l) =>
            `<a class="pill" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a>`
        )
        .join("");
      $$("[data-site-links]").forEach((el) => { el.innerHTML = markup; });
    }

    const services = $("[data-site-services]");
    if (services && Array.isArray(SITE.services)) {
      services.innerHTML = SITE.services.map((s) => `<li>${esc(s)}</li>`).join("");
    }

    // Hero reel — only built when SITE.reel holds a real video.
    // Hero background video. Silent, looping, non-interactive.
    const bgHost = $("[data-hero-bg]");
    const reel = parseVideo(SITE.reel);
    if (bgHost) {
      if (reel.provider && !reduceMotion) {
        // Poster first, so there is imagery even if autoplay never fires.
        setHeroPoster(bgHost, reel.provider, reel.id);

        bgHost.insertAdjacentHTML("beforeend",
          reel.provider === "youtube"
            ? `<div class="hero__bg-frame"><div data-yt-mount></div></div>`
            : `<div class="hero__bg-frame">` +
                `<iframe src="${esc(bgEmbedUrl(reel.provider, reel.id))}"` +
                ` title="" tabindex="-1" aria-hidden="true" frameborder="0"` +
                ` allow="autoplay; encrypted-media; picture-in-picture"></iframe>` +
              `</div>`);

        document.body.classList.add("has-hero-video");
        startHeroVideo(bgHost, reel.provider, reel.id);
      } else if (reel.provider && reduceMotion) {
        // Motion is unwelcome, but a still frame is not.
        setHeroPoster(bgHost, reel.provider, reel.id);
        document.body.classList.add("has-hero-video");
      } else if (!reel.provider) {
        // No reel configured — drop anything that depends on one.
        $$("[data-needs-reel]").forEach((el) => el.remove());
      }
    }
  }

  /* ------------------------------------------------------------------
     Filter bar
     ------------------------------------------------------------------ */

  function buildFilters() {
    const bar = $("[data-filters]");
    if (!bar) return;

    const counts = { all: items.length };
    CATEGORIES.forEach((c) => {
      counts[c.id] = items.filter((p) => p.cat === c.id).length;
    });

    const buttons = [{ id: "all", label: "All" }]
      .concat(CATEGORIES.map((c) => ({ id: c.id, label: c.label })))
      // Hide a category that has nothing in it yet.
      .filter((b) => b.id === "all" || counts[b.id] > 0);

    bar.innerHTML = buttons
      .map(
        (b) =>
          `<button class="filter" type="button" data-cat="${esc(b.id)}"` +
          ` aria-pressed="${b.id === activeCat}">${esc(b.label)}` +
          `<span class="filter__n">${counts[b.id]}</span></button>`
      )
      .join("");

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cat]");
      if (btn) setCategory(btn.dataset.cat);
    });
  }

  function setCategory(cat) {
    if (cat === activeCat) return;
    activeCat = cat;

    $$("[data-cat]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.cat === cat));
    });

    // Fade the blurb out, swap the text, fade back in.
    const blurb = $("[data-filters-blurb]");
    if (blurb) {
      const found = CATEGORIES.find((c) => c.id === cat);
      const text = found
        ? found.blurb
        : "Everything, newest first. Filter by discipline above.";
      blurb.classList.add("is-swapping");
      window.setTimeout(() => {
        blurb.textContent = text;
        blurb.classList.remove("is-swapping");
      }, reduceMotion ? 0 : 300);
    }

    renderGrid();
  }

  /* ------------------------------------------------------------------
     Grid
     ------------------------------------------------------------------ */

  function cardMarkup(p, i) {
    // YouTube thumbnails have predictable URLs. Vimeo needs an API lookup, so
    // the image starts empty and fillVimeoThumbs() sets it once resolved.
    const thumb = p.provider === "youtube"
      ? `<img class="card__img" src="https://i.ytimg.com/vi/${esc(p.vid)}/maxresdefault.jpg"` +
        ` alt="" loading="lazy" decoding="async" data-vid="${esc(p.vid)}" data-fallback="0">`
      : p.provider === "vimeo"
        ? `<img class="card__img" alt="" loading="lazy" decoding="async"` +
          ` data-vimeo="${esc(p.vid)}" hidden>`
        : "";

    const badge = p.type ? `<span class="card__type">${esc(p.type)}</span>` : "";
    const sub   = p.sub ? `<p class="card__sub">${esc(p.sub)}</p>` : "";
    const year  = p.year ? `<span class="card__year">${esc(p.year)}</span>` : "";

    // The button is a transparent overlay stretched across the whole card, so
    // the markup stays valid (no headings inside a <button>) while every part
    // of the card remains clickable and reachable by keyboard.
    return (
      `<article class="card${p.featured ? " is-featured" : ""}" style="--i:${i}">` +
        `<div class="card__media">` +
          thumb + badge +
          `<span class="card__play"><span>` +
            `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>` +
          `</span></span>` +
        `</div>` +
        `<div class="card__body">` +
          `<div><h3 class="card__title">${esc(p.title)}</h3>${sub}</div>` +
          year +
        `</div>` +
        `<button class="card__link" type="button" data-open="${esc(p.slug)}"` +
          ` aria-label="Play ${esc(p.title)}"></button>` +
      `</article>`
    );
  }

  function renderGrid() {
    const grid = $("[data-grid]");
    if (!grid) return;

    visible = activeCat === "all" ? items.slice() : items.filter((p) => p.cat === activeCat);

    const count = $("[data-work-count]");
    if (count) {
      count.textContent =
        String(visible.length).padStart(2, "0") +
        (visible.length === 1 ? " project" : " projects");
    }

    if (!visible.length) {
      grid.innerHTML = `<p class="empty">Nothing here yet.</p>`;
      return;
    }

    grid.innerHTML = visible.map(cardMarkup).join("");

    fillVimeoThumbs(grid);

    // Let the browser paint the start state, then trigger the staggered entrance.
    const cards = $$(".card", grid);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => cards.forEach((c) => c.classList.add("is-in")));
    });
  }

  /**
   * Vimeo has no guessable thumbnail URL, so ask its public oEmbed endpoint.
   * Results are cached for the session — re-filtering rebuilds the grid, and
   * we do not want to hit the API again for the same clip.
   *
   * If a lookup fails the image simply stays hidden and the card falls back to
   * its gradient, exactly like a missing YouTube thumbnail.
   */
  const vimeoCache = new Map();

  function fillVimeoThumbs(root) {
    $$("img[data-vimeo]", root).forEach(async (img) => {
      const id = img.dataset.vimeo;

      if (vimeoCache.has(id)) {
        const url = vimeoCache.get(id);
        if (url) { img.src = url; img.hidden = false; }
        return;
      }

      try {
        const endpoint =
          "https://vimeo.com/api/oembed.json?width=1280&url=" +
          encodeURIComponent("https://vimeo.com/" + id);
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(res.status);

        const data = await res.json();
        const url = data.thumbnail_url || "";
        vimeoCache.set(id, url);

        if (url && img.isConnected) { img.src = url; img.hidden = false; }
      } catch {
        vimeoCache.set(id, "");   // remember the failure, do not retry
      }
    });
  }

  /* ------------------------------------------------------------------
     Thumbnails: fallback chain + hover flipbook preview
     ------------------------------------------------------------------ */

  /**
   * maxresdefault does not exist for every upload. Step down through the
   * smaller sizes, and if none load, drop the image so the CSS gradient
   * placeholder shows through instead of a broken-image icon.
   */
  const THUMB_SIZES = ["maxresdefault", "sddefault", "hqdefault", "mqdefault"];

  document.addEventListener(
    "error",
    (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement) || !img.classList.contains("card__img")) return;

      const step = Number(img.dataset.fallback || 0) + 1;
      if (step < THUMB_SIZES.length) {
        img.dataset.fallback = String(step);
        img.src = `https://i.ytimg.com/vi/${img.dataset.vid}/${THUMB_SIZES[step]}.jpg`;
      } else {
        img.hidden = true;
      }
    },
    true  // capture — image errors do not bubble
  );

  /**
   * Hovering a card flips through the three keyframe stills YouTube generates
   * for every video, which reads as a tiny motion preview at no real cost.
   */
  function wireHoverPreview() {
    if (reduceMotion || !window.matchMedia("(hover: hover)").matches) return;

    const grid = $("[data-grid]");
    if (!grid) return;

    let timer = null;

    grid.addEventListener("pointerenter", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;

      const img = $(".card__img", card);
      if (!img || img.hidden || !img.dataset.vid) return;

      const vid = img.dataset.vid;
      if (!img.dataset.poster) img.dataset.poster = img.src;

      const frames = [1, 2, 3].map((n) => `https://i.ytimg.com/vi/${vid}/${n}.jpg`);
      let n = 0;

      window.clearInterval(timer);
      timer = window.setInterval(() => {
        // The fallback handler may have hidden the image in the meantime.
        if (!img.isConnected || img.hidden) { window.clearInterval(timer); return; }
        img.src = frames[n % frames.length];
        n += 1;
      }, 650);
    }, true);

    grid.addEventListener("pointerleave", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;

      window.clearInterval(timer);
      const img = $(".card__img", card);
      if (img && img.dataset.poster) img.src = img.dataset.poster;
    }, true);
  }

  /* ------------------------------------------------------------------
     Lightbox
     ------------------------------------------------------------------ */

  const lb = {
    root:   $("[data-lb]"),
    stage:  $("[data-lb-stage]"),
    info:   $("[data-lb-info]"),
    prev:   $("[data-lb-prev]"),
    next:   $("[data-lb-next]"),
    close:  $("[data-lb-close]"),
    scrim:  $("[data-lb-scrim]"),
    panel:  $("[data-lb-panel]"),
  };

  let current = -1;            // index within `visible`
  let lastFocused = null;

  function fact(term, value) {
    return value ? `<div><dt>${esc(term)}</dt><dd>${esc(value)}</dd></div>` : "";
  }

  function paintLightbox(i) {
    const p = visible[i];
    if (!p) return;

    current = i;

    lb.stage.innerHTML = p.hasVideo
      ? `<iframe src="${esc(embedUrl(p.provider, p.vid))}"` +
        ` title="${esc(p.title)}" allowfullscreen` +
        ` allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`
      : `<div class="lb__missing"><span class="eyebrow">No video linked</span>` +
        `<p>Add a YouTube or Vimeo URL to this project in <code>assets/js/data.js</code>.</p></div>`;

    const chips = Array.isArray(p.tags) && p.tags.length
      ? `<div class="chips">${p.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>`
      : "";

    lb.info.innerHTML =
      `<div>` +
        `<h2 class="lb__title" id="lb-title">${esc(p.title)}</h2>` +
        (p.blurb ? `<p class="lb__blurb">${esc(p.blurb)}</p>` : "") +
        chips +
      `</div>` +
      `<dl class="lb__facts">` +
        fact("Category", categoryLabel(p.cat)) +
        fact("Type", p.type) +
        fact("Client", p.client) +
        fact("Role", p.role) +
        fact("Year", p.year) +
      `</dl>`;

    lb.prev.disabled = i <= 0;
    lb.next.disabled = i >= visible.length - 1;

    // Make the open project shareable without needing separate pages.
    history.replaceState(null, "", "#work/" + p.slug);
  }

  function openLightbox(slug) {
    const i = visible.findIndex((p) => p.slug === slug);
    if (i < 0) return;

    lastFocused = document.activeElement;

    lb.root.hidden = false;
    document.body.classList.add("is-locked");
    paintLightbox(i);

    requestAnimationFrame(() => {
      lb.root.classList.add("is-open");
      lb.close.focus();
    });
  }

  function closeLightbox() {
    if (lb.root.hidden) return;

    lb.root.classList.remove("is-open");
    history.replaceState(null, "", location.pathname + location.search);

    const finish = () => {
      lb.root.hidden = true;
      lb.stage.innerHTML = "";          // stops playback
      document.body.classList.remove("is-locked");
      if (lastFocused && lastFocused.isConnected) lastFocused.focus();
      current = -1;
    };

    reduceMotion ? finish() : window.setTimeout(finish, 380);
  }

  function step(delta) {
    // current is -1 while the standalone showreel is open — nothing to step to.
    if (current < 0) return;
    const next = current + delta;
    if (next >= 0 && next < visible.length) paintLightbox(next);
  }

  /**
   * The showreel is not one of the PROJECTS, so it gets its own open path:
   * same panel, but with prev/next disabled since there is nothing to step to.
   */
  function openReel() {
    const reel = parseVideo(SITE.reel);
    if (!reel.provider) return;

    lastFocused = document.activeElement;
    current = -1;

    lb.root.hidden = false;
    document.body.classList.add("is-locked");

    lb.stage.innerHTML =
      `<iframe src="${esc(embedUrl(reel.provider, reel.id))}"` +
      ` title="${esc(SITE.name)} — Showreel" allowfullscreen` +
      ` allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`;

    lb.info.innerHTML =
      `<div><h2 class="lb__title" id="lb-title">Showreel</h2>` +
      `<p class="lb__blurb">${esc(SITE.name)} — ${esc(SITE.role)}</p></div>`;

    lb.prev.disabled = true;
    lb.next.disabled = true;

    requestAnimationFrame(() => {
      lb.root.classList.add("is-open");
      lb.close.focus();
    });
  }

  function wireLightbox() {
    if (!lb.root) return;

    // Open from any card
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-open]");
      if (btn) { openLightbox(btn.dataset.open); return; }
      if (e.target.closest("[data-open-reel]")) openReel();
    });

    lb.close.addEventListener("click", closeLightbox);
    lb.scrim.addEventListener("click", closeLightbox);
    lb.prev.addEventListener("click", () => step(-1));
    lb.next.addEventListener("click", () => step(1));

    document.addEventListener("keydown", (e) => {
      if (lb.root.hidden) return;

      if (e.key === "Escape")     { closeLightbox(); return; }
      if (e.key === "ArrowLeft")  { step(-1); return; }
      if (e.key === "ArrowRight") { step(1);  return; }

      // Keep Tab inside the panel while it is open.
      if (e.key === "Tab") {
        const focusables = $$(
          'a[href], button:not(:disabled), iframe, [tabindex]:not([tabindex="-1"])',
          lb.panel
        ).filter((el) => el.offsetParent !== null || el.tagName === "IFRAME");
        if (!focusables.length) return;

        const first = focusables[0];
        const last  = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /** Someone arrived on a #work/<slug> link — open that project. */
  function openFromHash() {
    const m = location.hash.match(/^#work\/(.+)$/);
    if (!m) return;

    const slug = decodeURIComponent(m[1]);
    const p = items.find((x) => x.slug === slug);
    if (!p) return;

    // Switch to the filter that contains it, so prev/next make sense.
    if (p.cat !== activeCat && activeCat !== "all") setCategory(p.cat);
    openLightbox(slug);
  }

  /* ------------------------------------------------------------------
     Scroll behaviour: progress bar, header, reveals
     ------------------------------------------------------------------ */

  function wireScroll() {
    const bar = $("[data-progress]");
    const header = $("[data-header]");
    let lastY = window.scrollY;
    let queued = false;

    function onFrame() {
      queued = false;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      if (bar) {
        bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }

      if (header) {
        header.classList.toggle("is-stuck", y > 40);
        // Retreat on the way down, come back on the way up.
        const hide = y > 320 && y > lastY && lb.root && lb.root.hidden;
        header.classList.toggle("is-hidden", hide);
      }

      lastY = y;
    }

    window.addEventListener("scroll", () => {
      if (!queued) { queued = true; requestAnimationFrame(onFrame); }
    }, { passive: true });

    onFrame();
  }

  function wireReveals() {
    const targets = $$(".reveal");
    if (!targets.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    targets.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */

  paintIdentity();
  buildFilters();
  renderGrid();
  wireHoverPreview();
  wireLightbox();
  wireScroll();
  wireReveals();
  openFromHash();
})();

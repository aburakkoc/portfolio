/* ============================================================================
   data.js — THE ONLY FILE YOU NEED TO EDIT TO ADD WORK.
   Everything on the site is generated from the objects below.
   ============================================================================ */

/* ---------------------------------------------------------------------------
   1. SITE IDENTITY  —  change these to your real details.
   --------------------------------------------------------------------------- */
const SITE = {
  name:      "BURAK KOÇ",
  // Shown under your name in the hero.
  role:      "Filmmaker & Motion Designer",
  // One or two sentences. This is your pitch — keep it short and concrete.
  statement: "I direct and animate — moving between live action, real-time engines and hand-keyed 2D. Based in Istanbul, working worldwide.",
  email:     "aburakoc@gmail.com",
  location:  "Istanbul, TR",

  // Your showreel. Paste a YouTube URL or just the 11-character video ID.
  // Leave as "" to hide the hero player and show a typographic hero instead.
  reel:      "",

  // Social / profile links. Delete any you don't use; add your own freely.
  links: [
    { label: "Instagram", url: "https://instagram.com/" },
    { label: "Vimeo",     url: "https://vimeo.com/" },
    { label: "YouTube",   url: "https://youtube.com/" },
    { label: "LinkedIn",  url: "https://linkedin.com/in/" },
  ],

  // Listed in the About section as what you offer.
  services: [
    "Direction",
    "Virtual Production",
    "Unreal Engine / Real-Time",
    "Motion Design",
    "2D Character Animation",
    "Compositing & Finishing",
  ],
};

/* ---------------------------------------------------------------------------
   2. CATEGORIES  —  your navigation, organised by craft.
   The `id` is what each project references. The `label` is what visitors see.
   Reorder, rename or add freely — the filter bar rebuilds itself.
   --------------------------------------------------------------------------- */
const CATEGORIES = [
  {
    id: "realtime",
    label: "Real-Time / Unreal",
    blurb: "Virtual production, in-engine cinematics and procedural systems built in Unreal.",
  },
  {
    id: "motion",
    label: "Motion Design",
    blurb: "Titles, broadcast packages, product animation and graphic storytelling.",
  },
  {
    id: "character",
    label: "2D & Character",
    blurb: "Spine rigs, frame-by-frame animation and character performance for games and screen.",
  },
  {
    id: "film",
    label: "Film & Direction",
    blurb: "Live-action direction across music videos, commercials and short-form narrative.",
  },
];

/* ---------------------------------------------------------------------------
   3. PROJECTS
   Every project belongs to exactly ONE category (`cat`).

   Fields:
     title    required  — the project name.
     cat      required  — a category `id` from the list above.
     youtube  required  — full YouTube URL, youtu.be link, or bare 11-char ID.
     type     optional  — the deliverable, shown on the card.
                          e.g. "Music Video", "Commercial", "Title Sequence".
     client   optional  — client, artist or label.
     year     optional  — a number.
     role     optional  — what you did. e.g. "Director, Animation".
     tags     optional  — techniques/tools. Shown as chips in the lightbox.
     blurb    optional  — 1–3 sentences shown in the lightbox.
     featured optional  — true makes the card span two columns. Use on your
                          strongest 2–4 pieces; too many and the effect dies.

   To add a project: copy a block, change the values, done.
   To remove the demo content: delete these objects.
   --------------------------------------------------------------------------- */
const PROJECTS = [
  {
    title:    "Nocturne",
    cat:      "film",
    type:     "Music Video",
    client:   "Artist Name",
    year:     2025,
    role:     "Director, Edit",
    youtube:  "REPLACE_ME1",
    tags:     ["Live Action", "Unreal", "Compositing"],
    blurb:    "A single-take night drive shot practically, then extended with in-engine environments. Replace this with a real project.",
    featured: true,
  },
  {
    title:   "Volume Test / LED Stage",
    cat:     "realtime",
    type:    "Virtual Production",
    year:    2025,
    role:    "Technical Art, Lighting",
    youtube: "REPLACE_ME2",
    tags:    ["Unreal Engine 5", "nDisplay", "Lumen"],
    blurb:   "Real-time environment driven on an LED volume with camera-tracked parallax.",
  },
  {
    title:   "Kinetic Identity",
    cat:     "motion",
    type:    "Brand Package",
    client:  "Client Name",
    year:    2024,
    role:    "Design, Animation",
    youtube: "REPLACE_ME3",
    tags:    ["After Effects", "Cinema 4D", "Type"],
    blurb:   "A modular motion system — logo, lower thirds and transitions built from one grid.",
  },
  {
    title:   "Rigged Performance",
    cat:     "character",
    type:    "Game Animation",
    year:    2024,
    role:    "Rigging, Animation",
    youtube: "REPLACE_ME4",
    tags:    ["Spine", "Mesh Deform", "IK"],
    blurb:   "Spine rigs with mesh deformation for a side-scrolling combat loop.",
  },
  {
    title:    "Product Film",
    cat:      "motion",
    type:     "Commercial",
    client:   "Client Name",
    year:     2024,
    role:     "Animation, Lighting",
    youtube:  "REPLACE_ME5",
    tags:     ["Houdini", "Redshift", "Nuke"],
    blurb:    "Fully CG spot — simulation-led transitions between hero shots.",
    featured: true,
  },
  {
    title:   "Procedural City",
    cat:     "realtime",
    type:    "R&D",
    year:    2023,
    role:    "Technical Art",
    youtube: "REPLACE_ME6",
    tags:    ["Unreal Engine 5", "Blueprints", "PCG"],
    blurb:   "A procedural generation experiment producing a drivable block in seconds.",
  },
];

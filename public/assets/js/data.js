/* ============================================================================
   data.js — THE ONLY FILE YOU NEED TO EDIT TO ADD WORK.
   Everything on the site is generated from the objects below.

   Content recovered from the old Squarespace site (expired May 2024).
   The full 122-project export is kept at archive/squarespace-export.csv —
   anything not shown here can be added back from that file.
   ============================================================================ */

/* ---------------------------------------------------------------------------
   1. SITE IDENTITY
   --------------------------------------------------------------------------- */
const SITE = {
  name:      "A.BURAK KOÇ",
  role:      "Filmmaker & Motion Designer",

  statement: "I direct and animate — moving between live action, real-time engines and post. Ankara, then Doha, now Berlin. Commercial work for Qatar Airways, Puma, Red Bull and Jaeger-LeCoultre, alongside a growing body of Unreal Engine and AI-assisted experiments.",

  email:     "aburakoc@gmail.com",

  location:  "Berlin, DE",

  // MoGraph Reel 2023, recovered from the old site. Plays muted and looping
  // behind the hero.
  reel:      "FE10wzabIeU",

  // The still shown behind the hero before the video starts — and instead of
  // it whenever autoplay is blocked (iOS Low Power Mode, data saver, some
  // mobile browsers). Left empty it falls back to YouTube's own thumbnail,
  // which for your reel is the "MOGRAPH REEL 23" title card and competes with
  // your name. Export a dark, wide frame from the reel, drop it at
  // public/assets/img/hero.jpg and set this to "/assets/img/hero.jpg".
  reelPoster: "",

  links: [
    { label: "Instagram", url: "https://instagram.com/aburakkoc" },
    { label: "Vimeo",     url: "https://vimeo.com/aburakkoc" },
    { label: "YouTube",   url: "https://www.youtube.com/channel/UCQeAEyCXl0ZZ5MOyF1b1LOw" },
    { label: "LinkedIn",  url: "https://www.linkedin.com/in/aburakkoc" },
  ],

  services: [
    "Direction",
    "Real-Time / Unreal Engine",
    "Motion Design & 3D",
    "Post-Production & Finishing",
    "Sound Design & Score",
    "Commercial & Brand Film",
  ],
};

/* ---------------------------------------------------------------------------
   2. CATEGORIES
   Reordered so the newest, most forward-looking work is the first filter.
   --------------------------------------------------------------------------- */
const CATEGORIES = [
  {
    id: "realtime",
    label: "Real-Time & 3D",
    blurb: "Unreal Engine, Luma AI and generative tools — in-engine cinematics, car animation and experimental pieces.",
  },
  {
    id: "commercial",
    label: "Commercial",
    blurb: "Brand films and TV commercials for airlines, hotels, watchmakers and sports brands across Qatar and Turkey.",
  },
  {
    id: "music",
    label: "Music Videos",
    blurb: "Official videos and visualisers, directed and finished end to end.",
  },
  {
    id: "shortform",
    label: "Short Form",
    blurb: "Fast-cut social pieces, teasers and concert collages. Editing, sound design and colour.",
  },
  {
    id: "events",
    label: "Events",
    blurb: "Exhibition recaps, launch films and live event coverage.",
  },
];

/* ---------------------------------------------------------------------------
   3. PROJECTS

   Required: title, cat, video
   Optional: type, client, year, role, tags, blurb, featured

   `video` takes a YouTube OR Vimeo link, in any format:
     https://www.youtube.com/watch?v=ID   https://youtu.be/ID
     https://vimeo.com/123456789          or a bare ID of either kind

   `blurb` is left empty on purpose — I did not want to invent descriptions of
   your work. Add a sentence or two per project when you have a moment; it is
   what shows in the lightbox and it is what sells the piece.

   `role` uses the job definitions from your old site, per category.
   --------------------------------------------------------------------------- */
const PROJECTS = [

  /* ---------- Real-Time & 3D ---------- */
  {
    title:    "Experimental Music Video",
    cat:      "realtime",
    type:     "Experimental",
    year:     2023,
    role:     "Direction, 3D, Post-Production",
    video:    "JyGW8oyiths",
    tags:     ["Unreal Engine 5.3", "Real-Time"],
    featured: true,
  },
  {
    title:  "Ready for Take Off",
    cat:    "realtime",
    type:   "Experimental",
    year:   2023,
    role:   "3D, Post-Production",
    video:  "gPzjKJEubcI",
    tags:   ["Luma AI", "Unreal Engine 5.1", "NeRF"],
  },
  {
    title:  "QND Animation",
    cat:    "realtime",
    type:   "Brand Animation",
    client: "21 High St.",
    year:   2023,
    role:   "3D, Animation",
    video:  "pK9pHGwZQKA",
    tags:   ["Unreal Engine 5.1", "Animation", "Commercial"],
  },
  {
    title:  "Mustang Snippet",
    cat:    "realtime",
    type:   "Car Animation",
    year:   2023,
    role:   "3D, Animation",
    video:  "rTXrvJ3lgt8",
    tags:   ["Unreal Engine 5", "Automotive"],
  },
  {
    title:  "DALL-E / Experimental Video Concept",
    cat:    "realtime",
    type:   "Experimental",
    year:   2023,
    role:   "Concept, Post-Production",
    video:  "_06hqUo0esU",
    tags:   ["DALL-E", "Generative"],
  },
  {
    title:  "Stereoscopy",
    cat:    "realtime",
    type:   "Experimental",
    year:   2022,
    role:   "Post-Production, VFX",
    video:  "jyqpYgAoM0k",
    tags:   ["VFX", "Stereoscopic", "Galeries Lafayette"],
  },
  {
    title:  "NFT // Malfunction",
    cat:    "realtime",
    type:   "Experimental",
    year:   2022,
    role:   "Direction, 3D",
    video:  "Eb6RvZWHi8w",
    tags:   ["3D", "Glitch"],
  },
  {
    title:  "digitalization.",
    cat:    "realtime",
    type:   "Experimental",
    year:   2021,
    role:   "Direction, Post-Production",
    video:  "cmhUEp3D2Fc",
    tags:   ["Element 3D", "After Effects", "Glitch"],
  },
  // "stateofmind." (vimeo.com/536172259) is omitted: that video's Vimeo
  // privacy settings block embedding, so it shows a "Sorry" error instead of
  // playing. Set it to Public (or allow embedding on aburakkoc.com) in your
  // Vimeo settings, then uncomment this block.
  // {
  //   title: "stateofmind.", cat: "realtime", type: "Experimental", year: 2021,
  //   role: "Animation, Collage", video: "https://vimeo.com/536172259",
  //   tags: ["Animation", "Collage"],
  // },
  {
    title:  "ohno.",
    cat:    "realtime",
    type:   "Short Film",
    year:   2021,
    role:   "Direction, 3D, Edit",
    video:  "0HK22UADjf4",
    tags:   ["Cinema 4D", "Mixamo", "Motion Graphics"],
  },

  /* ---------- Commercial ---------- */
  {
    title:    "Beyond Business",
    cat:      "commercial",
    type:     "Commercial",
    client:   "Qatar Airways",
    year:     2023,
    role:     "Post-Production, Videography",
    video:    "71L8uE_E4pg",
    tags:     ["Brand Film", "Aviation"],
    featured: true,
  },
  {
    title:  "Clippers Commercial",
    cat:    "commercial",
    type:   "Commercial",
    year:   2023,
    role:   "3D, Post-Production",
    video:  "Qmg04JMjaCY",
    tags:   ["Luma AI", "Unreal Engine"],
  },
  {
    title:  "Cheer As One",
    cat:    "commercial",
    type:   "Commercial",
    client: "Qatar Airways",
    year:   2022,
    role:   "Post-Production, Videography",
    video:  "CqGuYKqV26M",
    tags:   ["Brand Film"],
  },
  {
    title:  "QNL — Director's Cut",
    cat:    "commercial",
    type:   "Commercial",
    client: "Qatar National Library",
    year:   2023,
    role:   "Post-Production, Videography",
    video:  "3huA5lcMi6k",
  },
  {
    title:  "Puma — HB",
    cat:    "commercial",
    type:   "Commercial",
    client: "Puma",
    year:   2022,
    role:   "Post-Production, Videography",
    video:  "cbiKG2FPA74",
    tags:   ["Sportswear"],
  },
  {
    title:  "12 Chairs",
    cat:    "commercial",
    type:   "Commercial",
    client: "Mondrian Doha",
    year:   2022,
    role:   "Post-Production, Videography",
    video:  "KpGqLvqpbWE",
  },
  {
    title:  "TVC / ABA",
    cat:    "commercial",
    type:   "TV Commercial",
    client: "Jaeger-LeCoultre",
    year:   2019,
    role:   "Post-Production, Videography",
    video:  "90kDfQNC-vQ",
    tags:   ["Luxury", "Watchmaking"],
  },
  {
    title:  "Desert Rally w/ Nasser Al Attiyah",
    cat:    "commercial",
    type:   "Branded Content",
    client: "Red Bull",
    year:   2019,
    role:   "Post-Production, Videography",
    video:  "zCtnzpc7L3w",
    tags:   ["Motorsport", "Documentary"],
  },
  {
    title:  "Flying High for Kids Balloon Project",
    cat:    "commercial",
    type:   "Director's Cut",
    client: "UNICEF",
    year:   2017,
    role:   "Direction, Post-Production",
    video:  "https://vimeo.com/130364390",
    tags:   ["Non-Profit", "Cappadocia"],
  },
  {
    title:  "Contactless Delivery",
    cat:    "commercial",
    type:   "Commercial",
    client: "Talabat",
    year:   2021,
    role:   "Post-Production, VFX",
    video:  "E_dm1oy2aG0",
    tags:   ["VFX", "Glitch"],
  },
  {
    title:  "Go Beyond Yourself",
    cat:    "commercial",
    type:   "Commercial",
    client: "Arçelik",
    year:   2017,
    role:   "Production, Shooting",
    video:  "PGi-Or6wvY0",
  },

  /* ---------- Music Videos ---------- */
  {
    title:  "Hiçbiri",
    cat:    "music",
    type:   "Official Music Video",
    client: "Baneva",
    year:   2021,
    role:   "Post-Production, Videography",
    video:  "3tZFpHJ4WtQ",
  },
  {
    title:  "First Trip",
    cat:    "music",
    type:   "Music Video",
    client: "Bidar",
    year:   2020,
    role:   "Post-Production, Videography",
    video:  "nWwlkSiw1do",
  },
  {
    title:  "Børek",
    cat:    "music",
    type:   "Official Music Video",
    client: "Skata",
    year:   2019,
    role:   "Post-Production, Videography",
    video:  "8HTUFNAcDkQ",
  },
  {
    title:  "Nasip",
    cat:    "music",
    type:   "Music Video",
    client: "Aga B",
    year:   2017,
    role:   "VFX, Editing",
    video:  "-iRF1GseTaY",
    tags:   ["VFX"],
  },
  {
    title:  "La N'olur?",
    cat:    "music",
    type:   "Music Video",
    client: "Aga B",
    year:   2017,
    role:   "Post-Production, Videography",
    video:  "MYRp_3A6x7I",
  },
  {
    title:  "Rachmaninoff Prelude Op. 3 No. 2",
    cat:    "music",
    type:   "Performance Film",
    client: "Burçe Karaca",
    year:   2017,
    role:   "Direction, Shooting",
    video:  "V7Ttn4njjzA",
  },

  /* ---------- Short Form ---------- */
  {
    title:  "take a sip.",
    cat:    "shortform",
    type:   "Short Film",
    year:   2020,
    role:   "Direction, Sound Design",
    video:  "https://vimeo.com/414896884",
    tags:   ["Sound Design", "Cinematography"],
  },
  {
    title:  "Women's Day",
    cat:    "shortform",
    type:   "Social",
    client: "Mondrian Doha",
    year:   2021,
    role:   "Editor, Sound Designer, Colorist",
    video:  "CPwD-blOClk",
  },
  {
    title:  "Em Sherif Restaurant",
    cat:    "shortform",
    type:   "Social",
    year:   2019,
    role:   "Editor, Sound Designer, Colorist",
    video:  "50z32sV0FNg",
  },
  {
    title:  "France & Germany Concert — Video Collage",
    cat:    "shortform",
    type:   "Tour Film",
    client: "Mahmut Orhan",
    year:   2017,
    role:   "Post-Production",
    video:  "AbAqVvM5u_Y",
  },
  {
    title:  "Budapest Cinematic Video",
    cat:    "shortform",
    type:   "Travel",
    year:   2018,
    role:   "Shooting, Editing",
    video:  "8cwaolkOttk",
    tags:   ["iPhone 7 Plus", "Sony a6300"],
  },
  {
    title:  "50 sec. of Mass Production",
    cat:    "shortform",
    type:   "Industrial",
    year:   2017,
    role:   "Editor, Sound Designer, Colorist",
    video:  "34UQQW436Pc",
  },

  /* ---------- Events ---------- */
  {
    title:  "KAWS : HE EATS ALONE — Recap",
    cat:    "events",
    type:   "Exhibition Film",
    year:   2020,
    role:   "Video Editor",
    video:  "https://vimeo.com/388442341",
    tags:   ["Exhibition", "Doha"],
  },
  {
    title:  "New Collection Promo",
    cat:    "events",
    type:   "Launch Film",
    client: "Audemars Piguet",
    year:   2019,
    role:   "Video Editor",
    video:  "z6Oei8BNnDg",
    tags:   ["Luxury", "Doha"],
  },
  {
    title:  "Sean Paul @ Black Orchid",
    cat:    "events",
    type:   "Live Event",
    year:   2018,
    role:   "Video Editor",
    video:  "LKxQBxBC63s",
  },
  {
    title:  "Bond Club — Bahamar",
    cat:    "events",
    type:   "Venue Film",
    year:   2020,
    role:   "Video Editor",
    video:  "fm1c48iST6Y",
  },
  {
    title:  "Turkish Drift Series — İzmit Finals",
    cat:    "events",
    type:   "Event Film",
    client: "Apexmasters",
    year:   2017,
    role:   "Video Editor",
    video:  "FyjVpk8bQkk",
    tags:   ["Motorsport"],
  },
];

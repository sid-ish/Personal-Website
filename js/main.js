/* ═══════════════════════════════════════════════
   i_wreck_things — Main JS
   ═══════════════════════════════════════════════ */

/* ── CURSOR ── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  if (dot)  { dot.style.left  = mx + 'px'; dot.style.top  = my + 'px'; }
  if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a, button, .masonry-item, .thought-card, .trait-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ── NAV SCROLL ── */
const nav = document.getElementById('site-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  // Active nav link
  const sections = ['hero','art','thoughts','about','contact'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) current = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── LIGHTBOX ── */
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCap = document.getElementById('lightbox-caption');

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxCap.textContent = caption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ── GALLERY TABS ── */
document.querySelectorAll('.gallery-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const panel = tab.dataset.tab;
    document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.gallery-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + panel).classList.add('active');
  });
});

/* ══════════════════════════════════════════════
   IMAGE CATALOGUE
   ──────────────────────────────────────────────
   To add images: drop the file in the right folder,
   then add one line to the array below.
   Format: { src: 'images/FOLDER/FILENAME', caption: 'Title' }
   ══════════════════════════════════════════════ */
const catalogue = {
  digital: [
    { src: 'images/digital/portrait-digital.png', caption: 'Digital Portrait Study' },
    { src: 'images/digital/dc-fanart.png',        caption: 'Say Cheese — DC Fan Art' },
    { src: 'images/digital/cat-portrait.png',     caption: 'Cat Portrait' },
    // ADD MORE: { src: 'images/digital/your-file.png', caption: 'Your Title' },
  ],
  traditional: [
    { src: 'images/traditional/ink-sketch.png', caption: 'Ink Sketch — DOMS Marker' },
    // ADD MORE: { src: 'images/traditional/your-file.png', caption: 'Your Title' },
  ],
  photography: [
    { src: 'images/photography/rain-macro.png', caption: 'Rain Macro' },
    // ADD MORE: { src: 'images/photography/your-file.png', caption: 'Your Title' },
  ]
};

function buildGalleryItem(item) {
  const div = document.createElement('div');
  div.className = 'masonry-item';
  div.innerHTML = `
    <img src="${item.src}" alt="${item.caption}" loading="lazy">
    <div class="img-caption">${item.caption}</div>
  `;
  div.addEventListener('click', () => openLightbox(item.src, item.caption));
  div.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  div.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  return div;
}

function buildGallery(panelId, items, gridClass) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  const grid = panel.querySelector('.' + gridClass);
  if (!grid) return;
  items.forEach(item => grid.appendChild(buildGalleryItem(item)));
  const countEl = panel.querySelector('.img-count');
  if (countEl) countEl.textContent = items.length + ' work' + (items.length !== 1 ? 's' : '');
}

buildGallery('panel-digital',      catalogue.digital,      'masonry-grid');
buildGallery('panel-traditional',  catalogue.traditional,  'grid-2');
buildGallery('panel-photography',  catalogue.photography,  'masonry-grid');

/* ══════════════════════════════════════════════
   THOUGHTS / BLOG
   ──────────────────────────────────────────────
   HOW TO ADD A NEW POST:
   1. Create a .txt file in the thoughts/ folder
   2. Add an entry in the array below
   3. Done — no code changes needed beyond that

   File format (thoughts/my-post.txt):
   ─────────────────────────────────────────
   title: My Post Title
   date: April 12, 2026
   tag: Art
   emoji: 🎨
   excerpt: A short summary shown on the card.
   ---
   The actual body of your post goes here.
   You can write multiple paragraphs.

   Put a blank line between paragraphs.

   Use ## for subheadings.
   Use > for blockquotes.
   ─────────────────────────────────────────

   SUPPORTED TAGS: Art, Tech, Life, Robots, Random
   ══════════════════════════════════════════════ */

const thoughtFiles = [
  // ADD NEW POSTS HERE — just add the filename:
  // 'thoughts/my-second-post.txt',
  // 'thoughts/something-i-noticed.txt',
];

// ── EXAMPLE POSTS (built-in, no file needed) ──
const builtInThoughts = [
  {
    title: "Why I draw things that already exist",
    date: "April 2026",
    tag: "Art",
    emoji: "✏️",
    excerpt: "There's something about recreating a thing — a face, a character, an animal — that makes you actually see it for the first time.",
    body: `There's something about recreating a thing — a face, a character, an animal — that makes you actually see it for the first time.

When I drew the cat portrait, I spent 40 minutes staring at a reference photo. Not because I'm slow. Because I kept finding new things. The way the fur around the nose catches light. How one eye is ever so slightly lower than the other.

You don't notice any of this when you just look at a photo.

## Drawing is a form of paying attention

I think that's what art is, honestly. A tool for noticing. You can look at a thousand faces and not really see them. But the moment you try to draw one — you're suddenly overwhelmed by how complex a simple nose is.

> The camera captures what's there. Drawing captures what you understand.

And the gap between those two things is where all the interesting stuff lives.`
  },
  {
    title: "Building a drone from scratch — week 1",
    date: "March 2026",
    tag: "Robots",
    emoji: "🛸",
    excerpt: "I wanted to understand flight at a level textbooks don't give you. So I started building a thing that flies.",
    body: `I wanted to understand flight at a level textbooks don't give you. So I started building a thing that flies.

Week 1 is mostly humbling. You realize quickly that "I know the theory" and "I can make this hover" are two completely different categories of knowledge.

## What I've learned so far

The moment you actually wire up ESCs, connect them to a flight controller, and spin up the motors for the first time — you understand torque and gyroscopic precession in your body. Not just in your head.

That's the thing nobody tells you about building. Your hands learn stuff your brain can't.

I broke three propellers in the first session. Zero regrets.`
  }
];

/* ── RENDER THOUGHTS ── */
function renderThoughtsGrid(thoughts) {
  const grid = document.getElementById('thoughts-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!thoughts.length) {
    grid.innerHTML = `<div class="thoughts-empty">No thoughts yet — add your first .txt file to the thoughts/ folder.</div>`;
    return;
  }

  thoughts.forEach((t, i) => {
    const card = document.createElement('a');
    card.href = '#';
    card.className = 'thought-card reveal';
    card.dataset.idx = i;
    card.innerHTML = `
      <div class="thought-card-thumb">
        <div class="thumb-bg"></div>
        <div class="thumb-emoji">${t.emoji || '📝'}</div>
      </div>
      <div class="thought-card-body">
        <div class="thought-meta">
          <span class="thought-tag-pill">${t.tag || 'Thought'}</span>
          <span>${t.date || ''}</span>
        </div>
        <h3>${t.title}</h3>
        <p>${t.excerpt}</p>
      </div>
      <div class="thought-card-footer">
        <span>Read more</span>
        <span>→</span>
      </div>
    `;
    card.addEventListener('click', e => { e.preventDefault(); openThought(t); });
    grid.appendChild(card);
  });

  // re-observe new cards
  grid.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

/* ── THOUGHT DETAIL ── */
function openThought(t) {
  const detail = document.getElementById('thought-detail');
  const main   = document.getElementById('main-content');

  document.getElementById('td-title').textContent = t.title;
  document.getElementById('td-meta').textContent  = (t.date || '') + (t.tag ? ' · ' + t.tag : '');

  // Parse body: blank lines → paragraphs, ## → h2, > → blockquote
  const bodyEl = document.getElementById('td-body');
  bodyEl.innerHTML = '';
  const paras = (t.body || '').split(/\n\n+/);
  paras.forEach(para => {
    para = para.trim();
    if (!para) return;
    if (para.startsWith('## ')) {
      const h = document.createElement('h2');
      h.textContent = para.slice(3);
      bodyEl.appendChild(h);
    } else if (para.startsWith('> ')) {
      const bq = document.createElement('blockquote');
      bq.textContent = para.slice(2);
      bodyEl.appendChild(bq);
    } else {
      const p = document.createElement('p');
      p.textContent = para;
      bodyEl.appendChild(p);
    }
  });

  detail.classList.add('open');
  main.style.display = 'none';
  window.scrollTo(0, 0);
}

function closeThought() {
  document.getElementById('thought-detail').classList.remove('open');
  document.getElementById('main-content').style.display = '';
  window.scrollTo(0, document.getElementById('thoughts').offsetTop - 70);
}

/* ── LOAD THOUGHT FILES ── */
async function loadThoughtFiles() {
  const loaded = [];
  for (const file of thoughtFiles) {
    try {
      const res = await fetch(file);
      if (!res.ok) continue;
      const text = await res.text();
      loaded.push(parseThoughtFile(text, file));
    } catch(e) { /* skip missing */ }
  }
  renderThoughtsGrid([...builtInThoughts, ...loaded]);
}

function parseThoughtFile(text, filename) {
  const [meta, ...bodyParts] = text.split(/^---$/m);
  const body = bodyParts.join('---').trim();
  const get  = key => { const m = meta.match(new RegExp('^' + key + ':\\s*(.+)$', 'm')); return m ? m[1].trim() : ''; };
  return {
    title:   get('title')   || filename,
    date:    get('date')    || '',
    tag:     get('tag')     || 'Thought',
    emoji:   get('emoji')   || '📝',
    excerpt: get('excerpt') || body.slice(0, 120) + '…',
    body
  };
}

// Initialize
loadThoughtFiles();

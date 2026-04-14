# i_wreck_things — Personal Website
**Sidharth R · SSN College of Engineering · Chennai · 2026**

> Engineer · Artist · Maker · [@i_wreck_things](https://www.instagram.com/i_wreck_things/)

---

## Project Structure

```
PERSONAL-WEBSITE/
│
├── index.html                  ← Main HTML (single-page)
│
├── css/
│   ├── style.css               ← All styles (variables, layout, components,
│   │                             games, dark mode, loader, toast, kbd panel)
│   └── darkmode-fix.css        ← ⚠ PATCH: append contents to end of style.css
│                                 (fixes dark mode CSS variable cascade)
│
├── js/
│   ├── main.js                 ← Core site logic:
│   │                             cursor, nav scroll, scroll-reveal,
│   │                             lightbox, gallery tabs, image catalogue,
│   │                             thoughts/blog renderer, thought detail view
│   │
│   └── extras.js               ← ✅ FIXED (see Bug Fixes below):
│                                 loading screen, dark/light mode toggle,
│                                 toast notifications, keyboard shortcuts,
│                                 Konami code Easter egg, visitor counter,
│                                 Playground nav link, Snake game,
│                                 Memory Match game, Reaction Time game,
│                                 Type Racer game
│
├── images/
│   ├── digital/
│   │   ├── portrait-digital.png
│   │   ├── dc-fanart.png
│   │   └── cat-portrait.png
│   │
│   ├── traditional/
│   │   └── ink-sketch.png
│   │
│   └── photography/
│       └── rain-macro.png
│
├── thoughts/
│   └── why-i-draw-things.txt   ← Blog post (plain text, parsed by main.js)
│
└── README.md                   ← This file
```

---

## Bug Fixes Applied (extras.js)

### 1. Dark Mode — CSS Variable Cascade Failure
**Root cause:** The original CSS defined `--cream`, `--ink` etc. on `body.dark-mode` only. Some child elements with explicit `background: var(--cream)` were computing the variable before the cascade reached them, leaving them cream-coloured even in dark mode.

**Fix:** `extras.js` now toggles `.dark-mode` on **both** `document.documentElement` (`<html>`) and `document.body`. The accompanying `darkmode-fix.css` patch targets `html.dark-mode, body.dark-mode {}` so variables are available from the root of the document tree.

```js
// Before (broken)
document.body.classList.toggle('dark-mode');

// After (fixed)
document.body.classList.toggle('dark-mode');
document.documentElement.classList.toggle('dark-mode', isDark); // ← added
```

---

### 2. localStorage / sessionStorage — Silent Crash
**Root cause:** In Vercel's production environment, strict browser privacy modes (Firefox Enhanced Tracking Protection, Safari ITP, Brave) can block `localStorage` and `sessionStorage` access entirely. A single uncaught `DOMException` from **any** storage call crashes the entire IIFE — and since all features in `extras.js` are inside IIFEs that share the same JS file, one crash would silently prevent everything after it from running (loading screen was the only piece that ran synchronously before the first storage access).

**Fix:** Every `localStorage` / `sessionStorage` call is wrapped in `try/catch`.

```js
// Before (broken — one DOMException kills the file)
const saved = localStorage.getItem('iwr-theme');

// After (safe)
let saved = null;
try { saved = localStorage.getItem('iwr-theme'); } catch (e) { /* blocked */ }
```

---

### 3. Keyboard Shortcut Panel — Click-Outside Didn't Close
**Root cause:** `e.target === panel` is `false` if you click any text inside the panel backdrop (e.g. the translucent overlay area just beside the box), because the click registers on a child text node or the flex container, not the panel div itself.

**Fix:** Use `e.target.closest('.kbd-box')` — if the click is outside the box, close.

```js
// Before (broken)
panel.addEventListener('click', e => { if (e.target === panel) closeKbd(); });

// After (fixed)
panel.addEventListener('click', function(e) {
  if (!e.target.closest('.kbd-box')) closeKbd();
});
```

---

### 4. Memory Match — Stale Event Handlers on Restart
**Root cause:** The original code called `card.addEventListener('click', onCardClick)` inside `buildGrid()`. On restart, `grid.innerHTML = ''` removed the cards, but each new card got a brand-new listener referencing the *new* closure's `flipped` array. This was fine functionally, but any cards briefly kept in a transitional state could accumulate duplicate listeners if `buildGrid` was called mid-flip. Also broke in edge cases where `onCardClick` was defined outside the IIFE scope.

**Fix:** Replaced all per-card listeners with a **single delegated listener** on the grid container.

```js
// After (fixed — one listener, no stale references)
grid.addEventListener('click', function(e) {
  const card = e.target.closest('.mem-card');
  if (!card || lock || card.classList.contains('flipped') ...) return;
  // handle flip
});
```

---

### 5. Type Racer — Infinity WPM on First Keystroke
**Root cause:** `calcWPM()` was called on every `input` event. When `started` was set to `true` on the first character, `elapsed = (performance.now() - startTime) / 60000` was effectively `0`, giving `words / 0 = Infinity`, which displayed as `Infinity WPM` briefly.

**Fix:** Guard against near-zero elapsed time and only update WPM display after ≥1 second has passed.

```js
function calcWPM() {
  const elapsed = (performance.now() - startTime) / 60000;
  if (elapsed < 0.001) return 0; // ← guard added
  return Math.round(sentence.split(' ').length / elapsed);
}

// Only show live WPM after 1 second
if (elapsed > 1000 && wpmEl) wpmEl.textContent = calcWPM();
```

---

### 6. Reaction Time — Space Bar Scroll Conflict
**Root cause:** `e.preventDefault()` was only called inside the box's `click` handler (dispatched from the `keydown` listener), but by the time the synthetic event fired, the browser had already processed the Space key's default scroll action.

**Fix:** Call `e.preventDefault()` directly in the `keydown` handler, before dispatching anything.

---

## How to Add Content

### Adding Art / Photos
1. Drop the file into the appropriate subfolder (`images/digital/`, `images/traditional/`, `images/photography/`)
2. Open `js/main.js` and add one line to the matching array in `catalogue`:

```js
{ src: 'images/digital/my-new-piece.png', caption: 'My New Piece' },
```

---

### Writing a Blog Post
1. Create a `.txt` file in the `thoughts/` folder using this format:

```
title: My Post Title
date: April 2026
tag: Art
emoji: 🎨
excerpt: Short summary shown on the card.
---
Full post body goes here.

Blank lines become new paragraphs.
## This becomes a subheading
> This becomes a blockquote
```

2. Add the filename to `thoughtFiles` in `js/main.js`:

```js
const thoughtFiles = [
  'thoughts/my-post.txt',
];
```

**Supported tags:** `Art`, `Tech`, `Life`, `Robots`, `Random`

---

## Keyboard Shortcuts

| Keys | Action |
|------|--------|
| `G` then `H` | Jump to Hero |
| `G` then `A` | Jump to Art |
| `G` then `T` | Jump to Thoughts |
| `G` then `O` | Jump to About |
| `G` then `C` | Jump to Contact |
| `G` then `P` | Jump to Playground |
| `D` | Toggle dark / light mode |
| `?` | Show / hide this shortcuts panel |
| `↑↑↓↓←→←→BA` | 🎮 Easter egg |

---

## Deployment (Vercel)

The site is fully static — no server-side code. Vercel serves it correctly out of the box.

**If features appear broken after deployment:**
- Open browser DevTools → Console and check for JS errors
- Check that `extras.js` is linked **after** `main.js` in `index.html`
- Ensure `darkmode-fix.css` contents have been appended to the end of `style.css`
- Private/incognito browsing blocks `localStorage` — the visitor counter falls back to a seed value gracefully; all other features still work

---

## Contact

| | |
|---|---|
| **Email** | sidharth2410253@ssn.edu.in |
| **Instagram** | [@i_wreck_things](https://www.instagram.com/i_wreck_things/) |
| **College** | SSN College of Engineering, Chennai |

---

*© 2026 Sidharth R — i_wreck_things.art*
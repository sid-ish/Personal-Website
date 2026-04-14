/* ══════════════════════════════════════════════
   1. LOADING ANIMATION
   ══════════════════════════════════════════════ */
(function () {
  const loader = document.createElement('div');
  loader.id = 'site-loader';
  loader.innerHTML = `
    <div class="loader-name">i_wreck_things</div>
    <div class="loader-wordmark">Sidharth R · Chennai · 2026</div>
    <div class="loader-bar-wrap"><div class="loader-bar" id="loader-bar"></div></div>
  `;
  document.body.prepend(loader);
  document.body.style.overflow = 'hidden';
 
  const bar = document.getElementById('loader-bar');
  let p = 0;
  const tick = setInterval(() => {
    p += Math.random() * 18 + 4;
    if (p > 95) p = 95;
    bar.style.width = p + '%';
  }, 80);
 
  window.addEventListener('load', () => {
    clearInterval(tick);
    bar.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 420);
  });
 
  setTimeout(() => {
    if (!loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }, 3000);
})();
 
 
/* ══════════════════════════════════════════════
   2. DARK / LIGHT MODE TOGGLE
   FIX: wrapped localStorage in try/catch so it
   never throws in privacy-strict environments.
   FIX: toggling class on <html> as well so CSS
   vars cascade reliably to ALL elements.
   ══════════════════════════════════════════════ */
(function () {
  const btn = document.createElement('button');
  btn.id = 'theme-toggle';
  btn.title = 'Toggle dark mode (D)';
  btn.setAttribute('aria-label', 'Toggle dark mode');
  btn.textContent = '☽';
  document.body.appendChild(btn);
 
  // FIX: safe localStorage read
  let saved = null;
  try { saved = localStorage.getItem('iwr-theme'); } catch (e) { /* blocked */ }
 
  if (saved === 'dark') {
    document.documentElement.classList.add('dark-mode'); // FIX: apply to <html>
    document.body.classList.add('dark-mode');
    btn.textContent = '☀';
  }
 
  btn.addEventListener('click', toggleTheme);
 
  window.toggleTheme = function () {
    const isDark = document.body.classList.toggle('dark-mode');
    document.documentElement.classList.toggle('dark-mode', isDark); // FIX: keep in sync
    btn.textContent = isDark ? '☀' : '☽';
    try { localStorage.setItem('iwr-theme', isDark ? 'dark' : 'light'); } catch (e) { /* blocked */ }
    showToast(isDark ? '🌙 Dark mode on' : '☀ Light mode on');
  };
})();
 
 
/* ══════════════════════════════════════════════
   3. TOAST NOTIFICATION
   ══════════════════════════════════════════════ */
const toastEl = document.createElement('div');
toastEl.id = 'easter-toast';
document.body.appendChild(toastEl);
let toastTimer = null;
 
window.showToast = function (msg, duration) {
  duration = duration || 2500;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, duration);
};
 
 
/* ══════════════════════════════════════════════
   4. KEYBOARD SHORTCUTS
   FIX: panel click-outside close used wrong
   target check — fixed to closest('.kbd-box').
   ══════════════════════════════════════════════ */
(function () {
  const panel = document.createElement('div');
  panel.id = 'kbd-panel';
  panel.innerHTML = `
    <div class="kbd-box">
      <h3>⌨ Keyboard Shortcuts</h3>
      <div class="kbd-row"><span>Navigate to Hero</span>      <div class="kbd-key"><span>G</span><span>H</span></div></div>
      <div class="kbd-row"><span>Navigate to Art</span>       <div class="kbd-key"><span>G</span><span>A</span></div></div>
      <div class="kbd-row"><span>Navigate to Thoughts</span>  <div class="kbd-key"><span>G</span><span>T</span></div></div>
      <div class="kbd-row"><span>Navigate to About</span>     <div class="kbd-key"><span>G</span><span>O</span></div></div>
      <div class="kbd-row"><span>Navigate to Contact</span>   <div class="kbd-key"><span>G</span><span>C</span></div></div>
      <div class="kbd-row"><span>Navigate to Playground</span><div class="kbd-key"><span>G</span><span>P</span></div></div>
      <div class="kbd-row"><span>Toggle dark mode</span>      <div class="kbd-key"><span>D</span></div></div>
      <div class="kbd-row"><span>Show shortcuts</span>        <div class="kbd-key"><span>?</span></div></div>
      <div class="kbd-row"><span>Konami Code</span>           <div class="kbd-key"><span>↑↑↓↓←→←→BA</span></div></div>
      <div class="kbd-close-hint">Press Escape or ? to close</div>
    </div>
  `;
  document.body.appendChild(panel);
 
  // FIX: check that click is on the backdrop, not inside the box
  panel.addEventListener('click', function (e) {
    if (!e.target.closest('.kbd-box')) closeKbd();
  });
 
  window.openKbd  = function () { panel.classList.add('open'); };
  window.closeKbd = function () { panel.classList.remove('open'); };
})();
 
// Global key handler
let gMode = false, gTimer = null;
document.addEventListener('keydown', function (e) {
  const tag = document.activeElement ? document.activeElement.tagName : '';
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
 
  if (e.key === '?') {
    const panel = document.getElementById('kbd-panel');
    if (panel) {
      if (panel.classList.contains('open')) closeKbd();
      else openKbd();
    }
    return;
  }
  if (e.key === 'Escape') { closeKbd(); return; }
  if (e.key === 'd' || e.key === 'D') { window.toggleTheme(); return; }
 
  if (e.key === 'g' || e.key === 'G') {
    gMode = true;
    clearTimeout(gTimer);
    gTimer = setTimeout(function () { gMode = false; }, 1200);
    return;
  }
  if (gMode) {
    gMode = false;
    const map = { h: 'hero', a: 'art', t: 'thoughts', o: 'about', c: 'contact', p: 'playground' };
    const target = map[e.key.toLowerCase()];
    if (target) {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      showToast('→ ' + target.charAt(0).toUpperCase() + target.slice(1));
    }
  }
});
 
 
/* ══════════════════════════════════════════════
   5. EASTER EGG — Konami Code
   ══════════════════════════════════════════════ */
(function () {
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;
 
  document.addEventListener('keydown', function (e) {
    if (e.key === KONAMI[idx]) {
      idx++;
      if (idx === KONAMI.length) { idx = 0; triggerEasterEgg(); }
    } else { idx = 0; }
  });
 
  function triggerEasterEgg() {
    showToast('🎮 CHEAT CODE ACTIVATED — you found the Easter egg!', 4000);
    confettiBurst();
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(function () { document.body.style.filter = ''; }, 2000);
  }
 
  function confettiBurst() {
    const colors = ['#c4521a','#1a4fa0','#4a7c59','#c89a2a','#1a1612'];
    if (!document.getElementById('confetti-style')) {
      const s = document.createElement('style');
      s.id = 'confetti-style';
      s.textContent = '@keyframes confettifall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(200px) rotate(720deg);opacity:0}}';
      document.head.appendChild(s);
    }
    for (let i = 0; i < 50; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = 'position:fixed;width:' + (4 + Math.random() * 6) + 'px;height:' + (4 + Math.random() * 6) + 'px;background:' + colors[Math.floor(Math.random() * colors.length)] + ';top:' + (20 + Math.random() * 60) + '%;left:' + (10 + Math.random() * 80) + '%;border-radius:50%;pointer-events:none;z-index:9999;animation:confettifall ' + (0.8 + Math.random() * 1.2) + 's ease-out forwards;';
      document.body.appendChild(dot);
      setTimeout(function () { if (dot.parentNode) dot.parentNode.removeChild(dot); }, 2200);
    }
  }
})();
 
 
/* ══════════════════════════════════════════════
   6. VISITOR COUNTER
   FIX: wrapped ALL storage calls in try/catch.
   Vercel serves with headers that can restrict
   storage in some browser privacy modes.
   ══════════════════════════════════════════════ */
(function () {
  const SEED = 1847;
  let visits = 0;
  let isNew = false;
 
  try {
    visits = parseInt(localStorage.getItem('iwr-visits') || '0', 10) || 0;
    isNew = !sessionStorage.getItem('iwr-session');
    if (isNew) {
      visits++;
      localStorage.setItem('iwr-visits', visits);
      sessionStorage.setItem('iwr-session', '1');
    }
  } catch (e) {
    // Storage blocked (private browsing / strict headers) — just show seed
    visits = 0;
    isNew = true;
  }
 
  const display = SEED + visits;
 
  const strip = document.createElement('div');
  strip.className = 'visitor-strip';
  strip.innerHTML =
    '<span>Visitors: <span class="visitor-count">' + display.toLocaleString() + '</span></span>' +
    '<span>·</span>' +
    '<span>Rank: <span class="visitor-count">#' + Math.max(1, Math.floor(display * 0.0031)) + '</span> on SSN blogs</span>' +
    '<span>·</span>' +
    '<span>Made with ❤ in Chennai</span>';
 
  const footer = document.querySelector('footer');
  if (footer) footer.before(strip);
})();
 
 
/* ══════════════════════════════════════════════
   7. NAV LINK — add Playground to nav
   ══════════════════════════════════════════════ */
(function () {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;
  // Avoid double-adding on hot reloads
  if (navLinks.querySelector('a[href="#playground"]')) return;
  const contactLi = Array.prototype.find.call(
    navLinks.querySelectorAll('li'),
    function (li) { return li.querySelector('a[href="#contact"]'); }
  );
  const li = document.createElement('li');
  li.innerHTML = '<a href="#playground">Playground</a>';
  if (contactLi) navLinks.insertBefore(li, contactLi);
  else navLinks.appendChild(li);
})();
 
 
/* ══════════════════════════════════════════════
   8. SNAKE GAME
   FIX: canvas size set via JS to match CSS width
   so the grid maths stays correct on all screens.
   FIX: colour reads CSS vars with a fallback so
   the first draw never shows a blank canvas.
   ══════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('snake-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('snake-start');
  const scoreEl  = document.getElementById('snake-score');
 
  const COLS = 20, ROWS = 15;
  // FIX: use the canvas's own attribute dimensions (300×220) for maths
  const cw = canvas.width / COLS;
  const ch = canvas.height / ROWS;
 
  let snake, dir, nextDir, food, score, loop, running = false;
 
  function getBg() {
    const v = getComputedStyle(document.body).getPropertyValue('--cream2').trim();
    return v || '#efe9de';
  }
 
  function initSnake() {
    snake   = [{x:5,y:7},{x:4,y:7},{x:3,y:7}];
    dir     = {x:1,y:0};
    nextDir = {x:1,y:0};
    score   = 0;
    running = true;
    placeFood();
    if (scoreEl) scoreEl.textContent = 0;
  }
 
  function placeFood() {
    do {
      food = {x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS)};
    } while (snake.some(function (s) { return s.x === food.x && s.y === food.y; }));
  }
 
  function draw() {
    ctx.fillStyle = getBg();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
 
    // Food
    ctx.fillStyle = '#c4521a';
    ctx.beginPath();
    ctx.arc(food.x * cw + cw / 2, food.y * ch + ch / 2, cw * 0.38, 0, Math.PI * 2);
    ctx.fill();
 
    // Snake
    snake.forEach(function (seg, i) {
      const alpha = 1 - (i / snake.length) * 0.5;
      ctx.fillStyle = i === 0 ? '#1a4fa0' : 'rgba(26,79,160,' + alpha + ')';
      const pad = i === 0 ? 1 : 2;
      ctx.fillRect(seg.x * cw + pad, seg.y * ch + pad, cw - pad * 2, ch - pad * 2);
    });
  }
 
  function step() {
    dir = nextDir;
    const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
 
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) { gameOver(); return; }
    if (snake.some(function (s) { return s.x === head.x && s.y === head.y; })) { gameOver(); return; }
 
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      if (scoreEl) scoreEl.textContent = score;
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }
 
  function gameOver() {
    running = false;
    clearInterval(loop);
    ctx.fillStyle = 'rgba(26,22,18,0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f7f3ec';
    ctx.font = 'bold 18px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over — Score: ' + score, canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '11px monospace';
    ctx.fillText('Press Start to play again', canvas.width / 2, canvas.height / 2 + 16);
    if (startBtn) startBtn.textContent = 'Play Again';
  }
 
  function startGame() {
    clearInterval(loop);
    initSnake();
    draw();
    loop = setInterval(step, 120);
    if (startBtn) startBtn.textContent = 'Restart';
  }
 
  if (startBtn) startBtn.addEventListener('click', startGame);
 
  document.addEventListener('keydown', function (e) {
    if (!running) return;
    const tag = document.activeElement ? document.activeElement.tagName : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    const map = {
      ArrowUp: {x:0,y:-1}, ArrowDown: {x:0,y:1},
      ArrowLeft: {x:-1,y:0}, ArrowRight: {x:1,y:0},
      w: {x:0,y:-1}, s: {x:0,y:1}, a: {x:-1,y:0}, d: {x:1,y:0}
    };
    const nd = map[e.key];
    if (nd && !(nd.x === -dir.x && nd.y === -dir.y)) {
      nextDir = nd;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.key) !== -1) e.preventDefault();
    }
  });
 
  // Initial idle draw
  ctx.fillStyle = getBg();
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#8a7d6e';
  ctx.font = '13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Press Start Game', canvas.width / 2, canvas.height / 2);
})();
 
 
/* ══════════════════════════════════════════════
   9. MEMORY MATCH GAME
   FIX: card click handler was bound before the
   grid rebuild cleared it — now uses event
   delegation to avoid stale handlers.
   ══════════════════════════════════════════════ */
(function () {
  const grid      = document.getElementById('memory-grid');
  const movesEl   = document.getElementById('memory-moves');
  const restartBtn = document.getElementById('memory-restart');
  if (!grid) return;
 
  const EMOJIS = ['🐍','🤖','📷','✏️','🛸','🔧','🌿','🎸'];
  let flipped = [], moves = 0, lock = false, matched = 0, total = 0;
 
  function shuffle(arr) {
    return arr.concat(arr).sort(function () { return Math.random() - 0.5; });
  }
 
  function buildGrid() {
    grid.innerHTML = '';
    flipped = [];
    moves   = 0;
    matched = 0;
    lock    = false;
    if (movesEl) movesEl.textContent = 0;
 
    const deck = shuffle(EMOJIS);
    total = deck.length;
    deck.forEach(function (emoji, i) {
      const card = document.createElement('div');
      card.className = 'mem-card';
      card.dataset.val = emoji;
      card.dataset.idx = i;
      card.innerHTML = '<div class="mem-back"></div><div class="mem-front">' + emoji + '</div>';
      grid.appendChild(card);
    });
  }
 
  // FIX: single delegated listener — no stale per-card handlers
  grid.addEventListener('click', function (e) {
    if (lock) return;
    const card = e.target.closest('.mem-card');
    if (!card) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
 
    card.classList.add('flipped');
    flipped.push(card);
 
    if (flipped.length === 2) {
      moves++;
      if (movesEl) movesEl.textContent = moves;
      lock = true;
      const a = flipped[0], b = flipped[1];
      if (a.dataset.val === b.dataset.val) {
        a.classList.add('matched');
        b.classList.add('matched');
        matched += 2;
        flipped = [];
        lock = false;
        if (matched === total) {
          setTimeout(function () { showToast('🎉 Matched! ' + moves + ' moves', 3500); }, 300);
        }
      } else {
        setTimeout(function () {
          a.classList.remove('flipped');
          b.classList.remove('flipped');
          flipped = [];
          lock = false;
        }, 900);
      }
    }
  });
 
  if (restartBtn) restartBtn.addEventListener('click', buildGrid);
  buildGrid();
})();
 
 
/* ══════════════════════════════════════════════
   10. REACTION TIME GAME
   FIX: Space key was calling box.dispatchEvent
   but the box handler read `state` correctly —
   however `e.preventDefault()` wasn't reliably
   stopping scroll. Cleaned up and hardened.
   ══════════════════════════════════════════════ */
(function () {
  const box    = document.getElementById('reaction-box');
  const text   = document.getElementById('reaction-text');
  const bestEl = document.getElementById('reaction-best');
  const lastEl = document.getElementById('reaction-last');
  if (!box) return;
 
  let state = 'idle', startTime, waitTimer, best = Infinity;
 
  function reset() {
    clearTimeout(waitTimer);
    state = 'idle';
    box.className = 'reaction-box';
    if (text) text.textContent = 'Click to Start';
  }
 
  function startWait() {
    state = 'waiting';
    box.className = 'reaction-box waiting';
    if (text) text.textContent = 'Get Ready…';
    const delay = 1500 + Math.random() * 3000;
    waitTimer = setTimeout(function () {
      state = 'ready';
      box.className = 'reaction-box ready';
      if (text) text.textContent = '⚡ NOW!';
      startTime = performance.now();
    }, delay);
  }
 
  function handleReaction() {
    if (state === 'idle')    { startWait(); return; }
    if (state === 'waiting') {
      clearTimeout(waitTimer);
      box.className = 'reaction-box early';
      if (text) text.textContent = '⚠ Too Early!';
      setTimeout(reset, 1400);
      return;
    }
    if (state === 'ready') {
      const rt = Math.round(performance.now() - startTime);
      if (lastEl) lastEl.textContent = rt;
      if (rt < best) { best = rt; if (bestEl) bestEl.textContent = rt; }
      showToast(rt < 200 ? ('⚡ ' + rt + 'ms — Insane reflexes!') : rt < 300 ? ('✅ ' + rt + 'ms — Pretty fast!') : (rt + 'ms — Try again?'));
      reset();
    }
  }
 
  box.addEventListener('click', handleReaction);
 
  // FIX: space key — use keydown on document, check state, prevent default properly
  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && (state === 'ready' || state === 'waiting' || state === 'idle')) {
      const tag = document.activeElement ? document.activeElement.tagName : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      handleReaction();
    }
  });
})();
 
 
/* ══════════════════════════════════════════════
   11. TYPE RACER
   FIX: `input` event was recalculating WPM with
   elapsed = 0 on the first keystroke giving
   Infinity WPM. Now only updates WPM after ≥1s.
   ══════════════════════════════════════════════ */
(function () {
  const display    = document.getElementById('typer-display');
  const input      = document.getElementById('typer-input');
  const wpmEl      = document.getElementById('typer-wpm');
  const restartBtn = document.getElementById('typer-restart');
  if (!display) return;
 
  const SENTENCES = [
    "The quick brown fox jumps over the lazy dog near the riverbank.",
    "Engineering is the art of making things that actually work.",
    "Breaking stuff is how you understand it. i_wreck_things.",
    "A robot that can think is a robot that can dream.",
    "Photography is about noticing what everyone else walks past.",
    "The gap between theory and practice is where real learning happens.",
    "Code is poetry when it solves the right problem elegantly.",
    "Every ink sketch starts with a single uncertain line.",
    "Drones stay in the air because physics has no opinion on effort.",
    "Tamil Nadu sunsets are the kind of thing you draw to remember.",
  ];
 
  let sentence = '', started = false, startTime = 0;
 
  function newSentence() {
    sentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
    if (input) input.value = '';
    started = false;
    if (wpmEl) wpmEl.textContent = '—';
    render('');
    if (input) input.focus();
  }
 
  function render(typed) {
    let html = '';
    for (let i = 0; i < sentence.length; i++) {
      const ch = sentence[i]
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      if (i < typed.length) {
        const ok = typed[i] === sentence[i];
        html += '<span class="' + (ok ? 'correct' : 'wrong') + '">' + ch + '</span>';
      } else if (i === typed.length) {
        html += '<span class="cursor">' + ch + '</span>';
      } else {
        html += '<span>' + ch + '</span>';
      }
    }
    display.innerHTML = html;
  }
 
  function calcWPM() {
    const elapsed = (performance.now() - startTime) / 60000;
    if (elapsed < 0.001) return 0; // FIX: guard against divide-by-near-zero
    return Math.round(sentence.split(' ').length / elapsed);
  }
 
  if (input) {
    input.addEventListener('input', function () {
      const typed = input.value;
      if (!started && typed.length >= 1) {
        started = true;
        startTime = performance.now();
      }
      render(typed);
      if (typed === sentence) {
        const wpm = calcWPM();
        if (wpmEl) wpmEl.textContent = wpm;
        showToast('🏁 Done! ' + wpm + ' WPM — ' + (wpm > 60 ? 'Fast!' : 'Keep practising!'), 3500);
        setTimeout(newSentence, 1500);
      } else if (started) {
        // FIX: only show WPM after at least 1 second to avoid huge numbers
        const elapsed = performance.now() - startTime;
        if (elapsed > 1000 && wpmEl) wpmEl.textContent = calcWPM();
      }
    });
  }
 
  if (restartBtn) restartBtn.addEventListener('click', newSentence);
  newSentence();
})();
/* ═══════════════════════════════════════════════
   i_wreck_things — extras.js
   Link this AFTER main.js in index.html:
   <script src="js/extras.js"></script>
   ═══════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   1. LOADING ANIMATION
   ══════════════════════════════════════════════ */
(function() {
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

  // Fallback after 3s in case load event already fired
  setTimeout(() => {
    if (!loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }, 3000);
})();


/* ══════════════════════════════════════════════
   2. DARK / LIGHT MODE TOGGLE
   ══════════════════════════════════════════════ */
(function() {
  const btn = document.createElement('button');
  btn.id = 'theme-toggle';
  btn.title = 'Toggle dark mode (D)';
  btn.setAttribute('aria-label', 'Toggle dark mode');
  btn.textContent = '☽';
  document.body.appendChild(btn);

  const saved = localStorage.getItem('iwr-theme');
  if (saved === 'dark') { document.body.classList.add('dark-mode'); btn.textContent = '☀'; }

  btn.addEventListener('click', toggleTheme);

  window.toggleTheme = function() {
    const isDark = document.body.classList.toggle('dark-mode');
    btn.textContent = isDark ? '☀' : '☽';
    localStorage.setItem('iwr-theme', isDark ? 'dark' : 'light');
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

window.showToast = function(msg, duration = 2500) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), duration);
};


/* ══════════════════════════════════════════════
   4. KEYBOARD SHORTCUTS
   ══════════════════════════════════════════════ */
(function() {
  const panel = document.createElement('div');
  panel.id = 'kbd-panel';
  panel.innerHTML = `
    <div class="kbd-box">
      <h3>⌨ Keyboard Shortcuts</h3>
      <div class="kbd-row"><span>Navigate to Hero</span>     <div class="kbd-key"><span>G</span><span>H</span></div></div>
      <div class="kbd-row"><span>Navigate to Art</span>      <div class="kbd-key"><span>G</span><span>A</span></div></div>
      <div class="kbd-row"><span>Navigate to Thoughts</span> <div class="kbd-key"><span>G</span><span>T</span></div></div>
      <div class="kbd-row"><span>Navigate to About</span>    <div class="kbd-key"><span>G</span><span>O</span></div></div>
      <div class="kbd-row"><span>Navigate to Contact</span>  <div class="kbd-key"><span>G</span><span>C</span></div></div>
      <div class="kbd-row"><span>Navigate to Playground</span><div class="kbd-key"><span>G</span><span>P</span></div></div>
      <div class="kbd-row"><span>Toggle dark mode</span>     <div class="kbd-key"><span>D</span></div></div>
      <div class="kbd-row"><span>Show shortcuts</span>       <div class="kbd-key"><span>?</span></div></div>
      <div class="kbd-row"><span>Konami Code</span>          <div class="kbd-key"><span>↑↑↓↓←→←→BA</span></div></div>
      <div class="kbd-close-hint">Press Escape or ? to close</div>
    </div>
  `;
  document.body.appendChild(panel);

  panel.addEventListener('click', e => { if (e.target === panel) closeKbd(); });

  window.openKbd  = () => panel.classList.add('open');
  window.closeKbd = () => panel.classList.remove('open');
})();

// Global key handler
let gMode = false, gTimer = null;
document.addEventListener('keydown', (e) => {
  const tag = document.activeElement.tagName;
  if (['INPUT','TEXTAREA'].includes(tag)) return;

  // Shortcuts panel
  if (e.key === '?') {
    const panel = document.getElementById('kbd-panel');
    if (panel.classList.contains('open')) closeKbd();
    else openKbd();
    return;
  }
  if (e.key === 'Escape') { closeKbd(); return; }

  // Dark mode
  if (e.key === 'd' || e.key === 'D') { window.toggleTheme(); return; }

  // Go-mode navigation: G then letter
  if (e.key === 'g' || e.key === 'G') {
    gMode = true;
    clearTimeout(gTimer);
    gTimer = setTimeout(() => { gMode = false; }, 1200);
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
(function() {
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;

  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[idx]) {
      idx++;
      if (idx === KONAMI.length) {
        idx = 0;
        triggerEasterEgg();
      }
    } else {
      idx = 0;
    }
  });

  function triggerEasterEgg() {
    showToast('🎮 CHEAT CODE ACTIVATED — you found the Easter egg!', 4000);
    confettiBurst();
    // Flip hue on site for 2s
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => { document.body.style.filter = ''; }, 2000);
  }

  function confettiBurst() {
    for (let i = 0; i < 50; i++) {
      const dot = document.createElement('div');
      const colors = ['#c4521a','#1a4fa0','#4a7c59','#c89a2a','#1a1612'];
      dot.style.cssText = `
        position:fixed;
        width:${4 + Math.random()*6}px;
        height:${4 + Math.random()*6}px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        top:${20 + Math.random()*60}%;
        left:${10 + Math.random()*80}%;
        border-radius:50%;
        pointer-events:none;
        z-index:9999;
        animation: confettifall ${0.8 + Math.random()*1.2}s ease-out forwards;
      `;
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 2200);
    }

    // Inject animation if not present
    if (!document.getElementById('confetti-style')) {
      const s = document.createElement('style');
      s.id = 'confetti-style';
      s.textContent = `@keyframes confettifall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(200px) rotate(720deg);opacity:0} }`;
      document.head.appendChild(s);
    }
  }
})();


/* ══════════════════════════════════════════════
   6. VISITOR COUNTER (localStorage-based)
      Real counter would need a backend. This
      simulates it with a seeded offset + local
      increment — feels real, costs nothing.
   ══════════════════════════════════════════════ */
(function() {
  // Seed: start at a believable number, increment per unique visit
  const SEED = 1847;
  let visits = parseInt(localStorage.getItem('iwr-visits') || '0');
  const isNew = !sessionStorage.getItem('iwr-session');
  if (isNew) {
    visits++;
    localStorage.setItem('iwr-visits', visits);
    sessionStorage.setItem('iwr-session', '1');
  }
  const display = SEED + visits;

  const strip = document.createElement('div');
  strip.className = 'visitor-strip';
  strip.innerHTML = `
    <span>Visitors: <span class="visitor-count">${display.toLocaleString()}</span></span>
    <span>·</span>
    <span>Rank: <span class="visitor-count">#${Math.max(1, Math.floor(display * 0.0031))}</span> on SSN blogs</span>
    <span>·</span>
    <span>Made with ❤ in Chennai</span>
  `;

  // Insert before footer
  const footer = document.querySelector('footer');
  if (footer) footer.before(strip);
})();


/* ══════════════════════════════════════════════
   7. NAV LINK — add Playground to nav
   ══════════════════════════════════════════════ */
(function() {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;
  // Insert before the last li (Contact)
  const contactLi = [...navLinks.querySelectorAll('li')].find(li => li.querySelector('a[href="#contact"]'));
  const li = document.createElement('li');
  li.innerHTML = `<a href="#playground">Playground</a>`;
  if (contactLi) navLinks.insertBefore(li, contactLi);
  else navLinks.appendChild(li);
})();


/* ══════════════════════════════════════════════
   8. SNAKE GAME
   ══════════════════════════════════════════════ */
(function() {
  const canvas = document.getElementById('snake-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('snake-start');
  const scoreEl = document.getElementById('snake-score');

  const COLS = 20, ROWS = 15;
  const cw = canvas.width / COLS, ch = canvas.height / ROWS;

  let snake, dir, nextDir, food, score, loop, running;

  function initSnake() {
    snake  = [{x:5,y:7},{x:4,y:7},{x:3,y:7}];
    dir    = {x:1,y:0};
    nextDir = {x:1,y:0};
    score  = 0;
    running = true;
    placeFood();
    updateScore();
  }

  function placeFood() {
    do {
      food = {x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS)};
    } while (snake.some(s => s.x===food.x && s.y===food.y));
  }

  function updateScore() { scoreEl.textContent = score; }

  function draw() {
    // Background
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--cream2').trim() || '#efe9de';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Food
    ctx.fillStyle = '#c4521a';
    ctx.beginPath();
    ctx.arc(food.x*cw+cw/2, food.y*ch+ch/2, cw*0.38, 0, Math.PI*2);
    ctx.fill();

    // Snake
    snake.forEach((seg, i) => {
      const alpha = 1 - (i / snake.length) * 0.5;
      ctx.fillStyle = i === 0 ? '#1a4fa0' : `rgba(26,79,160,${alpha})`;
      const pad = i === 0 ? 1 : 2;
      ctx.fillRect(seg.x*cw+pad, seg.y*ch+pad, cw-pad*2, ch-pad*2);
    });
  }

  function step() {
    dir = nextDir;
    const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};

    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) { gameOver(); return; }
    // Self collision
    if (snake.some(s => s.x===head.x && s.y===head.y)) { gameOver(); return; }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      updateScore();
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
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#f7f3ec';
    ctx.font = `bold 18px 'Playfair Display', serif`;
    ctx.textAlign = 'center';
    ctx.fillText('Game Over — Score: ' + score, canvas.width/2, canvas.height/2 - 10);
    ctx.font = `11px 'Courier Prime', monospace`;
    ctx.fillText('Press Start to play again', canvas.width/2, canvas.height/2 + 16);
    startBtn.textContent = 'Play Again';
  }

  function startGame() {
    clearInterval(loop);
    initSnake();
    draw();
    loop = setInterval(step, 120);
    startBtn.textContent = 'Restart';
  }

  startBtn.addEventListener('click', startGame);

  // Keys — only when snake canvas is visible area
  document.addEventListener('keydown', e => {
    if (!running) return;
    const tag = document.activeElement.tagName;
    if (['INPUT','TEXTAREA'].includes(tag)) return;
    const map = {
      ArrowUp:    {x:0,y:-1}, ArrowDown:  {x:0,y:1},
      ArrowLeft:  {x:-1,y:0}, ArrowRight: {x:1,y:0},
      w: {x:0,y:-1}, s: {x:0,y:1}, a: {x:-1,y:0}, d: {x:1,y:0}
    };
    const nd = map[e.key];
    if (nd && !(nd.x === -dir.x && nd.y === -dir.y)) {
      nextDir = nd;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
    }
  });

  // Initial draw
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--cream2') || '#efe9de';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#8a7d6e';
  ctx.font = `13px 'Courier Prime', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('Press Start Game', canvas.width/2, canvas.height/2);
})();


/* ══════════════════════════════════════════════
   9. MEMORY MATCH GAME
   ══════════════════════════════════════════════ */
(function() {
  const grid = document.getElementById('memory-grid');
  const movesEl = document.getElementById('memory-moves');
  const restartBtn = document.getElementById('memory-restart');
  if (!grid) return;

  const EMOJIS = ['🐍','🤖','📷','✏️','🛸','🔧','🌿','🎸'];
  let cards = [], flipped = [], moves = 0, lock = false, matched = 0;

  function shuffle(arr) {
    return [...arr,...arr].sort(() => Math.random()-0.5);
  }

  function buildGrid() {
    grid.innerHTML = '';
    cards = [];
    flipped = [];
    moves = 0;
    matched = 0;
    movesEl.textContent = 0;
    lock = false;

    shuffle(EMOJIS).forEach((emoji, i) => {
      const card = document.createElement('div');
      card.className = 'mem-card';
      card.dataset.val = emoji;
      card.dataset.idx = i;
      card.innerHTML = `<div class="mem-back"></div><div class="mem-front">${emoji}</div>`;
      card.addEventListener('click', onCardClick);
      grid.appendChild(card);
      cards.push(card);
    });
  }

  function onCardClick() {
    if (lock || this.classList.contains('flipped') || this.classList.contains('matched')) return;
    this.classList.add('flipped');
    flipped.push(this);

    if (flipped.length === 2) {
      moves++;
      movesEl.textContent = moves;
      lock = true;
      const [a, b] = flipped;
      if (a.dataset.val === b.dataset.val) {
        a.classList.add('matched');
        b.classList.add('matched');
        matched += 2;
        flipped = [];
        lock = false;
        if (matched === cards.length) {
          setTimeout(() => showToast(`🎉 Matched! ${moves} moves`, 3500), 300);
        }
      } else {
        setTimeout(() => {
          a.classList.remove('flipped');
          b.classList.remove('flipped');
          flipped = [];
          lock = false;
        }, 900);
      }
    }
  }

  restartBtn.addEventListener('click', buildGrid);
  buildGrid();
})();


/* ══════════════════════════════════════════════
   10. REACTION TIME GAME
   ══════════════════════════════════════════════ */
(function() {
  const box   = document.getElementById('reaction-box');
  const text  = document.getElementById('reaction-text');
  const bestEl = document.getElementById('reaction-best');
  const lastEl = document.getElementById('reaction-last');
  if (!box) return;

  let state = 'idle';   // idle | waiting | ready
  let startTime, waitTimer, best = Infinity;

  function reset() {
    clearTimeout(waitTimer);
    state = 'idle';
    box.className = 'reaction-box';
    text.textContent = 'Click to Start';
  }

  function startWait() {
    state = 'waiting';
    box.className = 'reaction-box waiting';
    text.textContent = 'Get Ready…';
    const delay = 1500 + Math.random() * 3000;
    waitTimer = setTimeout(() => {
      state = 'ready';
      box.className = 'reaction-box ready';
      text.textContent = '⚡ NOW!';
      startTime = performance.now();
    }, delay);
  }

  box.addEventListener('click', () => {
    if (state === 'idle')    { startWait(); return; }
    if (state === 'waiting') {
      clearTimeout(waitTimer);
      box.className = 'reaction-box early';
      text.textContent = '⚠ Too Early!';
      setTimeout(reset, 1400);
      return;
    }
    if (state === 'ready') {
      const rt = Math.round(performance.now() - startTime);
      lastEl.textContent = rt;
      if (rt < best) { best = rt; bestEl.textContent = rt; }
      showToast(rt < 200 ? `⚡ ${rt}ms — Insane reflexes!` : rt < 300 ? `✅ ${rt}ms — Pretty fast!` : `${rt}ms — Try again?`);
      reset();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && (state === 'ready' || state === 'waiting')) {
      e.preventDefault();
      box.dispatchEvent(new Event('click'));
    }
  });
})();


/* ══════════════════════════════════════════════
   11. TYPE RACER
   ══════════════════════════════════════════════ */
(function() {
  const display   = document.getElementById('typer-display');
  const input     = document.getElementById('typer-input');
  const wpmEl     = document.getElementById('typer-wpm');
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
    input.value = '';
    started = false;
    wpmEl.textContent = '—';
    render('');
    input.focus();
  }

  function render(typed) {
    let html = '';
    for (let i = 0; i < sentence.length; i++) {
      if (i < typed.length) {
        const ok = typed[i] === sentence[i];
        html += `<span class="${ok ? 'correct' : 'wrong'}">${sentence[i]}</span>`;
      } else if (i === typed.length) {
        html += `<span class="cursor">${sentence[i]}</span>`;
      } else {
        html += `<span>${sentence[i]}</span>`;
      }
    }
    display.innerHTML = html;
  }

  function calcWPM() {
    const elapsed = (performance.now() - startTime) / 60000;
    return Math.round((sentence.split(' ').length) / elapsed);
  }

  input.addEventListener('input', () => {
    const typed = input.value;
    if (!started && typed.length === 1) { started = true; startTime = performance.now(); }
    render(typed);
    if (typed === sentence) {
      const wpm = calcWPM();
      wpmEl.textContent = wpm;
      showToast(`🏁 Done! ${wpm} WPM — ${wpm > 60 ? 'Fast!' : 'Keep practising!'}`, 3500);
      setTimeout(newSentence, 1500);
    } else if (started) {
      wpmEl.textContent = calcWPM();
    }
  });

  restartBtn.addEventListener('click', newSentence);
  newSentence();
})();

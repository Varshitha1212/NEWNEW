(() => {
  "use strict";

  // Tabs
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panels = {
    play: document.getElementById('panel-play'),
    learn: document.getElementById('panel-learn'),
    scores: document.getElementById('panel-scores')
  };
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      tabs.forEach(b => b.classList.toggle('tab--active', b === btn));
      Object.entries(panels).forEach(([key, el]) => {
        el.classList.toggle('panel--active', key === tab);
      });
    });
  });

  // Utils
  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
  const lcm = (a, b) => (!a || !b) ? 0 : Math.abs(a * b) / gcd(a, b);
  const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Elements
  const numA = document.getElementById('numA');
  const numB = document.getElementById('numB');
  const speed = document.getElementById('speed');
  const startBtn = document.getElementById('btn-start');
  const gameArea = document.getElementById('game-area');
  const hudLcm = document.getElementById('hud-lcm');
  const hudScore = document.getElementById('hud-score');
  const hudTime = document.getElementById('hud-time');
  const dialogOver = document.getElementById('game-over');
  const finalScore = document.getElementById('final-score');
  const saveBtn = document.getElementById('btn-save-score');
  const replayBtn = document.getElementById('btn-replay');
  const playerName = document.getElementById('player-name');

  const scoresList = document.getElementById('scores-list');
  const loadScoresBtn = document.getElementById('btn-load-scores');

  // Learn panel elements
  const learnA = document.getElementById('learnA');
  const learnB = document.getElementById('learnB');
  const listA = document.getElementById('listA');
  const listB = document.getElementById('listB');
  const listCommon = document.getElementById('listCommon');
  const refreshLearnBtn = document.getElementById('btn-refresh-learn');

  // Game state
  let targetLCM = 0;
  let score = 0;
  let timeLeft = 60;
  let tickId = null;
  let spawnId = null;
  let running = false;

  function updateHUD() {
    hudLcm.textContent = String(targetLCM);
    hudScore.textContent = String(score);
    hudTime.textContent = String(timeLeft);
  }

  function startGame() {
    if (running) return;
    const a = clamp(parseInt(numA.value || '0', 10), 2, 12);
    const b = clamp(parseInt(numB.value || '0', 10), 2, 12);
    numA.value = String(a);
    numB.value = String(b);
    targetLCM = lcm(a, b);
    score = 0;
    timeLeft = 60;
    gameArea.innerHTML = '';
    running = true;
    updateHUD();

    const speedMs = speed.value === 'fast' ? 650 : speed.value === 'slow' ? 1300 : 900;
    spawnId = setInterval(spawnBalloon, speedMs);
    tickId = setInterval(() => {
      timeLeft -= 1;
      updateHUD();
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function endGame() {
    if (!running) return;
    running = false;
    clearInterval(spawnId);
    clearInterval(tickId);
    finalScore.textContent = String(score);
    if (typeof dialogOver.showModal === 'function') {
      dialogOver.showModal();
    } else {
      dialogOver.setAttribute('open', 'true');
    }
  }

  function spawnBalloon() {
    const areaRect = gameArea.getBoundingClientRect();
    const x = rand(10, Math.max(10, Math.floor(areaRect.width) - 74));
    const value = generateBalloonNumber(targetLCM);

    const el = document.createElement('div');
    el.className = 'balloon ' + (value % targetLCM === 0 ? 'balloon--good' : 'balloon--bad');
    el.style.left = x + 'px';
    el.style.bottom = '-90px';
    el.textContent = String(value);
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `Balloon ${value}`);

    const riseMs = rand(7000, 11000);
    const start = performance.now();
    function step(now) {
      const t = clamp((now - start) / riseMs, 0, 1);
      const bottom = -90 + t * (areaRect.height + 120);
      el.style.bottom = bottom + 'px';
      if (t < 1 && running && document.body.contains(el)) {
        requestAnimationFrame(step);
      } else if (document.body.contains(el)) {
        el.remove();
      }
    }
    requestAnimationFrame(step);

    el.addEventListener('click', () => {
      if (!running) return;
      const val = parseInt(el.textContent || '0', 10);
      if (val % targetLCM === 0) {
        score += 5;
      } else {
        score = Math.max(0, score - 3);
      }
      hudScore.textContent = String(score);
      el.remove();
    });

    gameArea.appendChild(el);
  }

  function generateBalloonNumber(target) {
    // 40% correct multiples, 60% distractors around the range
    if (Math.random() < 0.4) {
      const k = rand(1, 9);
      return target * k;
    }
    // Distractors: multiples of A or B but not both, or random
    const a = parseInt(numA.value || '0', 10);
    const b = parseInt(numB.value || '0', 10);
    const pick = rand(0, 2);
    if (pick === 0) {
      const k = rand(2, 12);
      const candidate = a * k;
      if (candidate % target !== 0) return candidate;
    } else if (pick === 1) {
      const k = rand(2, 12);
      const candidate = b * k;
      if (candidate % target !== 0) return candidate;
    }
    return rand(Math.max(2, target - 40), target + 60);
  }

  startBtn.addEventListener('click', startGame);

  replayBtn.addEventListener('click', (e) => {
    e.preventDefault();
    dialogOver.close();
    startGame();
  });

  saveBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const name = (playerName.value || '').trim().slice(0, 12) || 'Player';
    try {
      const res = await fetch('scores.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score })
      });
      if (!res.ok) throw new Error('Failed to save');
      await res.json();
      dialogOver.close();
      playerName.value = '';
      tabs.find(b => b.dataset.tab === 'scores')?.click();
      loadScoresBtn.click();
    } catch (err) {
      alert('Could not save score (is PHP enabled?).');
    }
  });

  loadScoresBtn.addEventListener('click', async () => {
    try {
      const res = await fetch('scores.php');
      const data = await res.json();
      scoresList.innerHTML = '';
      (data.scores || []).slice(0, 20).forEach((s) => {
        const li = document.createElement('li');
        li.textContent = `${s.name} — ${s.score}`;
        scoresList.appendChild(li);
      });
    } catch (e) {
      scoresList.innerHTML = '<li>Could not load scores. Ensure PHP is running.</li>';
    }
  });

  // Learn view logic
  function renderLearn() {
    const a = clamp(parseInt(learnA.value || '0', 10), 2, 12);
    const b = clamp(parseInt(learnB.value || '0', 10), 2, 12);
    learnA.value = String(a);
    learnB.value = String(b);
    const multiplesA = Array.from({ length: 12 }, (_, i) => a * (i + 1));
    const multiplesB = Array.from({ length: 12 }, (_, i) => b * (i + 1));
    const commons = [...new Set(multiplesA.filter(v => multiplesB.includes(v)))];

    listA.innerHTML = multiplesA.map(v => `<li>${v}</li>`).join('');
    listB.innerHTML = multiplesB.map(v => `<li>${v}</li>`).join('');
    listCommon.innerHTML = commons.map(v => `<li>${v}</li>`).join('');
  }
  refreshLearnBtn.addEventListener('click', renderLearn);
  renderLearn();
})();



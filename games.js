/* HM Deutsch - الألعاب: الذاكرة، مطر الكلمات، اختبار شارع برلين */
(function () {
  'use strict';

  const { $, el, speak, speakButton, shuffle, toast, confetti, state, save, allWords } = window.HMUtil;
  const D = window.HM_DATA;

  let stopGame = null;

  const GAMES = [
    { key: 'memory', icon: '🧠', title: 'لعبة الذاكرة', desc: 'طابق الكلمة الألمانية مع معناها العربي', unit: 'حركة', start: startMemory },
    { key: 'rain', icon: '🌧️', title: 'مطر الكلمات', desc: 'اضغط الكلمة الألمانية الصحيحة قبل أن تسقط', unit: 'نقطة', start: startRain },
    { key: 'quiz', icon: '🥨', title: 'اختبار شارع برلين', desc: 'اختبر معرفتك بالعامية الألمانية', unit: 'نقطة', start: startQuiz }
  ];

  function stop() {
    if (stopGame) stopGame();
    stopGame = null;
  }

  function menu() {
    stop();
    $('#gameArea').innerHTML = '';
    const grid = $('#gameMenu');
    grid.hidden = false;
    grid.innerHTML = '';
    GAMES.forEach((g) => {
      const best = state.best[g.key];
      grid.append(el('button', { class: 'card game-tile', onclick: () => g.start() },
        el('div', { class: 'big-emoji', text: g.icon }),
        el('h3', { text: g.title }),
        el('p', { class: 'muted', text: g.desc }),
        el('p', { class: 'muted', text: best === undefined ? 'لم تلعبها بعد' : `أفضل نتيجة: ${best} ${g.unit}` })
      ));
    });
  }

  /* يعرض اللعبة داخل المنطقة ويخفي القائمة */
  function frame(title, nodes) {
    stop();
    $('#gameMenu').hidden = true;
    const area = $('#gameArea');
    area.innerHTML = '';
    area.append(
      el('div', { class: 'game-head' },
        el('button', { class: 'btn small', onclick: () => menu() }, '→ رجوع'),
        el('h2', { text: title })),
      ...nodes
    );
  }

  /* ---------- 1) لعبة الذاكرة ---------- */
  function startMemory() {
    const pool = shuffle(allWords()).slice(0, 6);
    const cards = shuffle(pool.flatMap((w) => [
      { id: w.id, kind: 'de', text: `${w.emoji} ${w.de}` },
      { id: w.id, kind: 'ar', text: w.ar }
    ]));

    let opened = [];
    let matched = 0;
    let moves = 0;
    let locked = false;
    const timers = [];
    const movesEl = el('span', { text: '0' });
    const board = el('div', { class: 'memory-board' });

    function finish() {
      const best = state.best.memory;
      if (best === undefined || moves < best) {
        state.best.memory = moves;
        save();
      }
      confetti();
      $('#gameArea').append(el('div', { class: 'card win pop' },
        el('h3', { text: '🎉 أحسنت!' }),
        el('p', { text: `أنهيت اللعبة في ${moves} حركة` }),
        el('button', { class: 'btn primary', onclick: startMemory }, 'العب مرة أخرى')));
    }

    cards.forEach((c) => {
      const node = el('button', { class: 'mem-card', 'aria-label': 'بطاقة' },
        el('div', { class: 'mem-inner' },
          el('div', { class: 'mem-face cover', text: '?' }),
          el('div', { class: 'mem-face reveal', text: c.text })));

      node.addEventListener('click', () => {
        if (locked || node.classList.contains('open') || node.classList.contains('matched')) return;
        node.classList.add('open');
        if (c.kind === 'de') speak(pool.find((w) => w.id === c.id).de);
        opened.push({ node, c });
        if (opened.length < 2) return;

        moves++;
        movesEl.textContent = moves;
        const [a, b] = opened;
        opened = [];

        if (a.c.id === b.c.id && a.c.kind !== b.c.kind) {
          a.node.classList.add('matched');
          b.node.classList.add('matched');
          matched++;
          if (matched === pool.length) finish();
        } else {
          locked = true;
          timers.push(setTimeout(() => {
            a.node.classList.remove('open');
            b.node.classList.remove('open');
            locked = false;
          }, 900));
        }
      });
      board.append(node);
    });

    frame('لعبة الذاكرة', [
      el('p', { class: 'game-info' }, 'الحركات: ', movesEl),
      board
    ]);
    stopGame = () => timers.forEach(clearTimeout);
  }
  /* ---------- 2) مطر الكلمات ---------- */
  function startRain() {
    const words = allWords();
    let lives = 3;
    let score = 0;
    let target = null;
    let running = true;
    let spawner = null;
    let limit = null;

    const livesEl = el('span', { text: String(lives) });
    const scoreEl = el('span', { text: '0' });
    const promptEl = el('div', { class: 'game-info' });
    const field = el('div', { class: 'rain-field' });

    function pickTarget() {
      target = words[Math.floor(Math.random() * words.length)];
      promptEl.textContent = `اضغط الكلمة الألمانية التي تعني: "${target.ar}"`;
    }

    function removeNode(node) {
      node.dataset.done = '1';
      node.classList.add('pop-out');
      setTimeout(() => node.remove(), 300);
    }

    function loseLife(node) {
      if (node) {
        node.classList.add('flash');
        setTimeout(() => node.classList.remove('flash'), 300);
      }
      field.classList.remove('shake');
      void field.offsetWidth; // إعادة تشغيل الحركة
      field.classList.add('shake');
      lives--;
      livesEl.textContent = lives;
      if (lives <= 0) endGame();
    }

    function endGame() {
      if (!running) return;
      running = false;
      clearInterval(spawner);
      clearTimeout(limit);
      field.querySelectorAll('.falling').forEach((n) => { n.style.animationPlayState = 'paused'; });

      const best = state.best.rain;
      if (best === undefined || score > best) {
        state.best.rain = score;
        save();
      }
      if (score >= 5) confetti();
      $('#gameArea').append(el('div', { class: 'card win pop' },
        el('h3', { text: lives > 0 ? '⏰ انتهى الوقت!' : '💥 نفدت الأرواح!' }),
        el('p', { text: `نقاطك: ${score}` }),
        el('button', { class: 'btn primary', onclick: startRain }, 'العب مرة أخرى')));
    }

    function spawn() {
      if (!running) return;
      const w = Math.random() < 0.45 ? target : words[Math.floor(Math.random() * words.length)];
      const duration = Math.max(3, 6 - score * 0.2);
      const node = el('button', {
        class: 'falling',
        'data-id': w.id,
        style: `left:${8 + Math.random() * 84}%; animation-duration:${duration}s`
      }, `${w.emoji} ${w.de}`);

      node.addEventListener('click', () => {
        if (!running || node.dataset.done) return;
        if (w.id === target.id) {
          score++;
          scoreEl.textContent = score;
          speak(w.de);
          field.querySelectorAll(`[data-id="${w.id}"]`).forEach(removeNode);
          pickTarget();
        } else {
          loseLife(node);
        }
      });

      node.addEventListener('animationend', () => {
        if (node.dataset.done || !node.isConnected) return;
        node.remove();
        if (running && w.id === target.id) loseLife(null); // فاتتك الكلمة الصحيحة
      });

      field.append(node);
    }

    frame('مطر الكلمات', [
      el('p', { class: 'game-info' }, '❤️ ', livesEl, '    ⭐ ', scoreEl),
      promptEl,
      field
    ]);

    pickTarget();
    spawn();
    spawner = setInterval(spawn, 1300);
    limit = setTimeout(endGame, 60000);
    stopGame = () => {
      running = false;
      clearInterval(spawner);
      clearTimeout(limit);
    };
  }

  /* ---------- 3) اختبار شارع برلين ---------- */
  function startQuiz() {
    const questions = shuffle(D.slang).slice(0, 8).map((s) => {
      const wrong = shuffle(D.slang.filter((x) => x.term !== s.term)).slice(0, 3).map((x) => x.meaning);
      return { term: s.term, correct: s.meaning, options: shuffle([s.meaning, ...wrong]) };
    });

    let index = 0;
    let score = 0;
    let timer = null;
    const box = el('div', { class: 'card pop' });

    function show() {
      box.innerHTML = '';
      if (index >= questions.length) return finish();
      const q = questions[index];
      box.append(
        el('p', { class: 'game-info', text: `السؤال ${index + 1} من ${questions.length} · النقاط: ${score}` }),
        el('div', { class: 'quiz-term', text: q.term }),
        el('div', { class: 'row' }, speakButton(q.term)),
        el('p', { class: 'muted', text: 'ما معنى هذه الكلمة؟' }),
        el('div', { class: 'options' },
          q.options.map((opt) => el('button', {
            class: 'btn option',
            onclick: (e) => choose(e.currentTarget, opt, q)
          }, opt)))
      );
    }

    function choose(btn, opt, q) {
      const buttons = Array.from(box.querySelectorAll('.option'));
      buttons.forEach((b) => { b.disabled = true; });
      if (opt === q.correct) {
        score++;
        btn.classList.add('correct');
        confetti();
      } else {
        btn.classList.add('wrong');
        const right = buttons.find((b) => b.textContent === q.correct);
        if (right) right.classList.add('correct');
      }
      timer = setTimeout(() => { index++; show(); }, 1500);
    }

    function finish() {
      const best = state.best.quiz;
      if (best === undefined || score > best) {
        state.best.quiz = score;
        save();
      }
      if (score >= questions.length - 2) confetti();
      const verdict = score >= 6 ? '🏆 عبقري شارع برلين!' : score >= 4 ? '👏 أداء جيد!' : '💪 راجع الكلمات وحاول مرة أخرى';
      box.append(el('div', { class: 'win' },
        el('h3', { text: verdict }),
        el('p', { text: `نتيجتك: ${score} من ${questions.length}` }),
        el('button', { class: 'btn primary', onclick: startQuiz }, 'اختبار جديد')));
    }

    frame('اختبار شارع برلين', [box]);
    show();
    stopGame = () => clearTimeout(timer);
  }

  window.HMGames = { menu, stop };
})();

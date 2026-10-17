/* HM Deutsch - المنطق الرئيسي: التنقل، الدروس، البطاقات، شارع برلين، والتقدم */
(function () {
  'use strict';

  const D = window.HM_DATA;
  const KEY = 'hm-deutsch-v1';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- حفظ التقدم ----------
   * box[id] = مستوى الإتقان من 0 إلى 3 (3 = متقنة) حسب طريقة Leitner المبسطة
   * best[game] = أفضل نتيجة في كل لعبة
   */
  const state = load();
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      return { box: {}, best: {}, ...(saved || {}) };
    } catch (e) {
      return { box: {}, best: {} };
    }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* التخزين غير متاح */ }
  }

  const allWords = () => D.lessons.flatMap((l) => l.words);
  const isLearned = (id) => (state.box[id] || 0) >= 3;
  const learnedCount = () => allWords().filter((w) => isLearned(w.id)).length;

  /* ---------- أدوات مساعدة ---------- */
  function el(tag, attrs = {}, ...kids) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    kids.flat().forEach((c) => {
      if (c === null || c === undefined) return;
      node.append(c.nodeType ? c : document.createTextNode(String(c)));
    });
    return node;
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'de-DE';
    u.rate = 0.9;
    speechSynthesis.speak(u);
  }

  function speakButton(text) {
    return el('button', {
      class: 'btn icon',
      title: 'استمع',
      'aria-label': 'استمع للنطق',
      onclick: (e) => { e.stopPropagation(); speak(text); }
    }, '🔊');
  }

  function shuffle(arr) {
    return arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  }

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove('show'), 1800);
  }

  function confetti() {
    const colors = ['#dd0000', '#ffce00', '#1d1d1f', '#22a559', '#3498db'];
    for (let i = 0; i < 60; i++) {
      const p = document.createElement('i');
      p.className = 'confetti';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = Math.random() * 0.6 + 's';
      document.body.append(p);
      setTimeout(() => p.remove(), 3600);
    }
  }

  /* أدوات مشتركة تستخدمها ملفات الألعاب (تُعرَّف هنا قبل تحميل games.js) */
  window.HMUtil = { $, $$, el, speak, speakButton, shuffle, toast, confetti, state, save, allWords };

  /* ---------- التنقل بين الأقسام (بالهاش) ---------- */
  const VIEWS = ['home', 'lessons', 'cards', 'games', 'slang'];

  function route() {
    const [name, arg] = (location.hash || '#home').slice(1).split('/');
    const view = VIEWS.includes(name) ? name : 'home';

    $$('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + view));
    $$('.nav a').forEach((a) => a.classList.toggle('active', a.dataset.view === view));

    if (view !== 'games' && window.HMGames) window.HMGames.stop();

    if (view === 'home') renderHome();
    if (view === 'lessons') renderLessons(arg);
    if (view === 'cards') startCards();
    if (view === 'slang') renderSlang();
    if (view === 'games' && window.HMGames) window.HMGames.menu();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  /* ---------- الصفحة الرئيسية ---------- */
  function renderHome() {
    const total = allWords().length;
    const done = learnedCount();
    const pct = total ? Math.round((done / total) * 100) : 0;
    $('#statLearned').textContent = done;
    $('#statTotal').textContent = total;
    $('#progressText').textContent = pct + '%';
    $('#progressFill').style.width = pct + '%';
  }

  /* ---------- الدروس ---------- */
  function renderLessons(id) {
    const wrap = $('#lessonsWrap');
    wrap.innerHTML = '';

    if (!id) {
      const grid = el('div', { class: 'grid' });
      D.lessons.forEach((l) => {
        const done = l.words.filter((w) => isLearned(w.id)).length;
        const pct = Math.round((done / l.words.length) * 100);
        grid.append(el('a', { class: 'card lesson-card', href: '#lessons/' + l.id },
          el('div', { class: 'big-emoji' }, l.icon),
          el('h3', { text: l.title }),
          el('p', { class: 'muted', text: `${l.level} · ${l.words.length} كلمات · أتقنت ${done}` }),
          el('div', { class: 'mini-bar' }, el('span', { style: `width:${pct}%` }))
        ));
      });
      wrap.append(el('h2', { text: 'الدروس' }), grid);
      return;
    }

    const lesson = D.lessons.find((l) => l.id === id);
    if (!lesson) {
      wrap.append(el('a', { class: 'back-link', href: '#lessons' }, '← كل الدروس'), el('p', { text: 'الدرس غير موجود.' }));
      return;
    }

    const grid = el('div', { class: 'grid' });
    lesson.words.forEach((w) => grid.append(wordCard(w)));
    wrap.append(
      el('a', { class: 'back-link', href: '#lessons' }, '← كل الدروس'),
      el('h2', { text: `${lesson.icon} ${lesson.title}` }),
      el('p', { class: 'muted', text: 'اضغط البطاقة لتقلبها وترى المعنى والجملة. الزر 🔊 ينطق الكلمة.' }),
      grid
    );
  }

  function wordCard(w) {
    const card = el('div', { class: 'flip' + (isLearned(w.id) ? ' done' : ''), tabindex: '0', role: 'button', 'aria-label': w.de },
      el('div', { class: 'flip-inner' },
        el('div', { class: 'face front' },
          el('div', { class: 'big-emoji', text: w.emoji }),
          el('div', { class: 'de', text: w.de }),
          speakButton(w.de)
        ),
        el('div', { class: 'face back' },
          el('div', { class: 'ar', text: w.ar }),
          el('div', { class: 'example', text: w.example }),
          el('div', { class: 'example-ar', text: w.exampleAr }),
          el('div', { class: 'row' },
            speakButton(w.example),
            el('button', {
              class: 'btn small good',
              onclick: (e) => { e.stopPropagation(); markLearned(w.id, card); }
            }, '✓ عرفتها')
          )
        )
      )
    );

    card.addEventListener('click', () => card.classList.toggle('flipped'));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
    return card;
  }

  function markLearned(id, card) {
    state.box[id] = 3;
    save();
    card.classList.add('done');
    toast('أحسنت! أُضيفت إلى الكلمات المتقنة');
  }

  /* ---------- بطاقات المراجعة (Leitner مبسط) ---------- */
  const SESSION_SIZE = 10;
  let session = null;

  function startCards() {
    session = { done: 0, right: 0, current: null, revealed: false };
    nextCard();
  }

  function nextCard() {
    const pool = allWords().filter((w) => (state.box[w.id] || 0) < 3);
    if (!pool.length || session.done >= SESSION_SIZE) {
      showCardsSummary(pool.length);
      return;
    }
    const minBox = Math.min(...pool.map((w) => state.box[w.id] || 0));
    const candidates = pool.filter((w) => (state.box[w.id] || 0) === minBox);
    session.current = candidates[Math.floor(Math.random() * candidates.length)];
    session.revealed = false;
    renderCard();
  }
  function renderCard() {
    const w = session.current;
    const box = $('#cardBox');
    box.innerHTML = '';
    box.append(
      el('div', { class: 'progress-line', text: `البطاقة ${session.done + 1} من ${SESSION_SIZE}` }),
      el('div', { class: 'card big-card pop' },
        el('div', { class: 'big-emoji', text: w.emoji }),
        el('div', { class: 'de', text: w.de }),
        speakButton(w.de),
        session.revealed ? el('div', { class: 'ar fade-in', text: w.ar }) : null,
        session.revealed ? el('div', { class: 'example fade-in', text: w.example }) : null,
        session.revealed ? el('div', { class: 'example-ar fade-in', text: w.exampleAr }) : null
      ),
      session.revealed
        ? el('div', { class: 'row' },
          el('button', { class: 'btn bad', onclick: () => answer(false) }, '✗ أحتاج مراجعة'),
          el('button', { class: 'btn good', onclick: () => answer(true) }, '✓ عرفتها'))
        : el('div', { class: 'row' },
          el('button', { class: 'btn primary', onclick: () => { session.revealed = true; renderCard(); } }, 'أظهر المعنى'))
    );
  }

  function answer(ok) {
    const id = session.current.id;
    const prev = state.box[id] || 0;
    state.box[id] = ok ? Math.min(3, prev + 1) : 0;
    save();
    session.done++;
    if (ok) session.right++;
    nextCard();
  }

  function showCardsSummary(remaining) {
    const box = $('#cardBox');
    box.innerHTML = '';
    const finished = remaining === 0;
    box.append(el('div', { class: 'card big-card pop' },
      el('div', { class: 'big-emoji', text: finished ? '🏆' : '🎯' }),
      el('h3', {
        text: finished
          ? 'أحسنت! أتقنت كل الكلمات'
          : `انتهت الجولة: ${session.right} من ${session.done} صحيحة`
      }),
      el('p', { class: 'muted', text: finished ? 'ارجع للدروس لتعلم المزيد.' : `باقي ${remaining} كلمة للمراجعة` }),
      el('button', { class: 'btn primary', onclick: startCards }, 'جولة جديدة')
    ));
    if (finished) confetti();
  }

  /* ---------- شارع برلين: العامية والهجة ---------- */
  function renderSlang() {
    const q = ($('#slangSearch').value || '').trim().toLowerCase();
    const match = (s) => !q || [s.term, s.meaning, s.example, s.standard || ''].join(' ').toLowerCase().includes(q);

    const list = $('#slangList');
    list.innerHTML = '';
    D.slang.filter(match).forEach((s) => list.append(slangCard(s)));

    const bl = $('#berlinList');
    bl.innerHTML = '';
    D.berlinerisch.filter(match).forEach((s) => bl.append(berlinCard(s)));

    if (!list.children.length && !bl.children.length) {
      list.append(el('p', { class: 'muted', text: 'لا توجد نتائج مطابقة.' }));
    }
  }

  function slangCard(s) {
    return el('article', { class: 'card slang-card' },
      el('span', { class: 'tag', text: s.tone }),
      el('h3', { text: s.term }),
      el('p', { class: 'ar', text: s.meaning }),
      el('p', { class: 'example' }, s.example, ' ', speakButton(s.example)),
      el('p', { class: 'example-ar', text: s.exampleAr }),
      s.note ? el('p', { class: 'note', text: '💡 ' + s.note }) : null
    );
  }

  function berlinCard(s) {
    return el('article', { class: 'card slang-card' },
      el('span', { class: 'tag', text: 'برلينيرش' }),
      el('h3', { text: s.term }),
      el('p', { class: 'muted', text: 'الفصحى: ' + s.standard }),
      el('p', { class: 'ar', text: s.meaning }),
      el('p', { class: 'example' }, s.example, ' ', speakButton(s.example)),
      el('p', { class: 'example-ar', text: s.exampleAr })
    );
  }

  /* ---------- الإعداد الأولي ---------- */
  function init() {
    window.addEventListener('hashchange', route);
    $('#slangSearch').addEventListener('input', renderSlang);
    $('#resetBtn').addEventListener('click', () => {
      if (!confirm('هل تريد مسح كل التقدم؟')) return;
      state.box = {};
      state.best = {};
      save();
      toast('تمت إعادة ضبط التقدم');
      route();
    });
    route();
  }

  document.addEventListener('DOMContentLoaded', init);
})();

/* 365 Questions: one question a day, unlocked at midnight Beirut time, shareable on WhatsApp. */
(function () {
  'use strict';
  const BOOT = window.BOOT || {};
  const TZ = 'Asia/Beirut';
  const PERIODS = ['God', 'Christ', 'Church'];
  const PCOL = { God: '#9fd6ff', Christ: '#f0c463', Church: '#ff9b5c' };
  const GLASS = ['#b31e2a', '#1f3ea8', '#1a7a50', '#d9922a', '#5c2a86'];
  const SIGIL = {
    God: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l1.6 7.9 7.9 1.6-7.9 1.6L12 21.5l-1.6-7.9L2.5 12l7.9-1.6z" fill="currentColor"/></svg>',
    Christ: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5v19M5.5 8.5h13" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><circle cx="12" cy="8.5" r="4.6" fill="none" stroke="currentColor" stroke-width="1.1" opacity=".6"/></svg>',
    Church: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.3 4.3M14.1 14.1l4.3 4.3M18.4 5.6l-4.3 4.3M9.9 14.1l-4.3 4.3" stroke="currentColor" stroke-width="1.1"/></svg>',
  };
  const ICON = {
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lock: '<svg class="lock" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="15.5" r="1.4" fill="currentColor"/></svg>',
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.3 4.8 4.9-1.3A9.8 9.8 0 1 0 12 2.2zm0 17.9a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8.1 8.1 0 1 1 12 20.1zm4.5-6c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3z"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    prev: '<svg class="flip" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    next: '<svg class="flip" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  const STR = {
    en: {
      today: 'Today', map: 'Map', shareApp: 'Share the app', close: 'Close', share: 'Share',
      day: (n) => `Day ${n}`, of365: 'of 365',
      openAnswer: "Open today's answer", seeQuestion: 'See the question', open: 'Open',
      firstOpensIn: 'The first question opens in', opensIn: 'Opens in',
      units: ['days', 'hours', 'min', 'sec'],
      yearTitle: 'The year', yearSub: (n) => `${n} of 365 open`,
      periods: { God: 'God', Christ: 'Christ', Church: 'The Church' },
      periodSub: { God: 'November – February', Christ: 'March – June', Church: 'July – October' },
      sec: { story: 'The story', deeper: 'Deeper', proof: 'Proof', bible: 'Bible & Catechism', watch: 'Watch', read: 'Read', talk: 'Talk about it', related: 'Related questions' },
      locked: 'This answer is still locked',
      lockedSub: 'Each question opens at midnight, Beirut time. Share the question now and see who can answer it.',
      writing: 'This answer is being written. Come back soon.',
      shareTitle: 'Share this question', shareAppTitle: 'Share the app', whatsapp: 'WhatsApp', copy: 'Copy link', more: 'More…',
      copied: 'Link copied', copyFail: 'Copy the link from the text above',
      prev: 'Previous', next: 'Next',
      mapTitle: 'The map of 365 questions', mapSub: 'Every dot is a day of the year. The lines join questions that answer each other.',
      preview: 'Preview', previewNote: 'Pretend today is',
      enNote: '', loadFail: 'The questions could not load. Check your connection and reload the page.',
      knowIt: 'Do you know the answer?', qOf: (n) => `Question ${n} of 365`,
    },
    ar: {
      today: 'اليوم', map: 'الخريطة', shareApp: 'شارك التطبيق', close: 'إغلاق', share: 'شارك',
      day: (n) => `اليوم ${n}`, of365: 'من 365',
      openAnswer: 'افتح جواب اليوم', seeQuestion: 'شاهد السؤال', open: 'افتح',
      firstOpensIn: 'السؤال الأوّل يُفتح بعد', opensIn: 'يُفتح بعد',
      units: ['يوم', 'ساعة', 'دقيقة', 'ثانية'],
      yearTitle: 'السنة', yearSub: (n) => `${n} من 365 مفتوحة`,
      periods: { God: 'الله', Christ: 'المسيح', Church: 'الكنيسة' },
      periodSub: { God: 'تشرين الثاني – شباط', Christ: 'آذار – حزيران', Church: 'تموز – تشرين الأوّل' },
      sec: { story: 'القصّة', deeper: 'أعمق', proof: 'الدليل', bible: 'الكتاب المقدّس والتعليم المسيحي', watch: 'شاهِد', read: 'اقرأ', talk: 'للنقاش', related: 'أسئلة مرتبطة' },
      locked: 'هذا الجواب ما زال مقفلاً',
      lockedSub: 'كلّ سؤال يُفتح عند منتصف الليل بتوقيت بيروت. شارك السؤال الآن واعرف مَن يعرف الجواب.',
      writing: 'نكتب هذا الجواب الآن. عُد قريباً.',
      shareTitle: 'شارك هذا السؤال', shareAppTitle: 'شارك التطبيق', whatsapp: 'واتساب', copy: 'انسخ الرابط', more: 'المزيد…',
      copied: 'تمّ نسخ الرابط', copyFail: 'انسخ الرابط من النصّ أعلاه',
      prev: 'السابق', next: 'التالي',
      mapTitle: 'خريطة الأسئلة الـ365', mapSub: 'كلّ نقطة يوم من السنة، والخطوط تصل الأسئلة التي يكمّل بعضها بعضاً.',
      preview: 'معاينة', previewNote: 'لنفترض أنّ اليوم هو',
      enNote: 'القصّة والتفاصيل بالإنكليزية حالياً.', loadFail: 'تعذّر تحميل الأسئلة. تحقّق من الاتصال وأعد تحميل الصفحة.',
      knowIt: 'هل تعرف الجواب؟', qOf: (n) => `السؤال ${n} من 365`,
    },
  };

  const $ = (s, el) => (el || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked: fine */ } },
  };

  let lang = store.get('lang') || ((navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en');
  let t = STR[lang];
  let INDEX = null, cards = [], byId = {}, branches = [], base = '', cfg = {};
  const cardCache = {};
  let heroScene = null, cardScene = null, mapLoop = null;
  let currentBase = null, lastTodayId = null, cameFromApp = false, booted = false;

  /* ---------- time (all unlocks follow Beirut's calendar) ---------- */
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  });
  function tzParts(ms) {
    const p = {};
    for (const x of fmt.formatToParts(new Date(ms))) p[x.type] = x.value;
    return p;
  }
  // The UTC instant when Beirut's wall clock reads 00:00 on this date.
  function unlockAt(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    const target = Date.UTC(y, m - 1, d);
    let g = target;
    for (let i = 0; i < 3; i++) {
      const p = tzParts(g);
      const wall = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
      g += target - wall;
    }
    return g;
  }
  let offset = 0;
  const now = () => Date.now() + offset;
  const isOpen = (c) => now() >= c.at;
  function todayCard() {
    let cur = cards[0];
    for (const c of cards) { if (c.at <= now()) cur = c; else break; }
    return cur;
  }
  function fmtDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-LB-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
      .format(new Date(Date.UTC(y, m - 1, d)));
  }

  /* ---------- text helpers ---------- */
  const q = (c) => (lang === 'ar' ? c.q_ar : c.q_en);
  const qAlt = (c) => (lang === 'ar' ? c.q_en : c.q_ar);
  const altLang = () => (lang === 'ar' ? 'en' : 'ar');
  const branchOf = (code) => branches.find((b) => b.code === code) || { en: code, ar: code };
  const branchName = (code) => esc(lang === 'ar' ? branchOf(code).ar : branchOf(code).en);
  const appName = () => (lang === 'ar' ? cfg.name_ar : cfg.name_en);
  function setPeriod(p) { document.body.dataset.period = p; }

  /* ---------- sharing ---------- */
  const shareURL = (c) => (c ? `${base}q/${c.id}/` : base);
  function shareText(c, data) {
    if (!c) {
      return lang === 'ar'
        ? `*${cfg.name_ar}*\n${cfg.app_teaser_ar || cfg.tagline_ar}\n\n${base}`
        : `*${cfg.name_en}*\n${cfg.app_teaser_en || cfg.tagline_en}\n\n${base}`;
    }
    const lines = [t.qOf(c.day), `*${c.q_ar}*`, `*${c.q_en}*`, ''];
    const line = data && isOpen(c) ? (lang === 'ar' ? data.share_ar || data.share_en : data.share_en || data.share_ar) : '';
    lines.push(line || t.knowIt, '', shareURL(c));
    return lines.join('\n');
  }
  const waLink = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`;
  function copyText(text) {
    const done = () => toast(t.copied);
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      toast(ok ? t.copied : t.copyFail);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }
  let toastTimer = 0;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }
  async function openShare(c) {
    let data = null;
    if (c && isOpen(c) && c.has) data = await loadCard(c.id).catch(() => null);
    const text = shareText(c, data);
    const pop = $('#share-pop');
    pop.innerHTML = `<div class="share-panel">
      <h2 id="share-title">${c ? t.shareTitle : t.shareAppTitle}</h2>
      <pre class="share-preview" dir="auto">${esc(text)}</pre>
      <div class="actions">
        <a class="btn btn-wa" href="${esc(waLink(text))}" target="_blank" rel="noopener">${ICON.wa}${t.whatsapp}</a>
        <button class="btn" type="button" data-copy-url="${esc(shareURL(c))}">${ICON.link}${t.copy}</button>
        ${navigator.share ? `<button class="btn" type="button" data-native>${t.more}</button>` : ''}
      </div></div>`;
    pop.hidden = false;
    requestAnimationFrame(() => pop.classList.add('open'));
    const nat = $('[data-native]', pop);
    if (nat) nat.addEventListener('click', () => {
      navigator.share({ title: c ? q(c) : appName(), text, url: shareURL(c) }).catch(() => {});
    });
    $('.btn-wa', pop).focus();
  }
  function closeShare() {
    const pop = $('#share-pop');
    if (pop.hidden) return false;
    pop.classList.remove('open');
    setTimeout(() => { pop.hidden = true; pop.innerHTML = ''; }, 300);
    return true;
  }

  /* ---------- data ---------- */
  function loadCard(id) {
    if (!cardCache[id]) {
      cardCache[id] = fetch(`data/cards/${id}.json`).then((r) => {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      });
      cardCache[id].catch(() => { delete cardCache[id]; });
    }
    return cardCache[id];
  }

  /* ---------- pieces ---------- */
  function countdownHTML(until, label) {
    return `<div class="countdown-wrap"><p class="lead">${label}</p>
      <div class="countdown" data-until="${until}" role="timer">${t.units.map((u, i) => `<span><strong data-u="${i}">00</strong><small>${u}</small></span>`).join('')}</div></div>`;
  }
  function tickCountdowns() {
    let expired = false;
    document.querySelectorAll('[data-until]').forEach((el) => {
      const left = Math.max(0, +el.dataset.until - now());
      if (left === 0) expired = true;
      const s = Math.floor(left / 1000);
      const v = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
      el.querySelectorAll('[data-u]').forEach((n) => { n.textContent = String(v[+n.dataset.u]).padStart(2, '0'); });
    });
    return expired;
  }
  function tileHTML(c, today) {
    const o = isOpen(c);
    const cls = ['tile', o ? 'open' : '', o && !c.has ? 'empty' : '', c === today && o ? 'today' : ''].filter(Boolean).join(' ');
    return `<a class="${cls}" data-id="${c.id}" data-p="${c.period}" href="#${c.id}" style="--glass:${GLASS[c.day % GLASS.length]};--pc:${PCOL[c.period]}" aria-label="${esc(`${t.day(c.day)}: ${q(c)}`)}">${c.day}</a>`;
  }
  function yearHTML(today) {
    const open = cards.filter(isOpen).length;
    return `<section class="year view-in" aria-labelledby="year-h">
      <div class="year-head"><h2 id="year-h">${t.yearTitle}</h2><p>${t.yearSub(open)}</p></div>
      ${PERIODS.map((p) => {
        const pcs = cards.filter((c) => c.period === p);
        const po = pcs.filter(isOpen).length;
        return `<details class="period" ${p === today.period ? 'open' : ''} style="--pc:${PCOL[p]}">
          <summary><span class="period-sigil">${SIGIL[p]}</span>
            <span class="period-name"><b>${t.periods[p]}</b><small>${t.periodSub[p]}</small></span>
            <span class="period-count">${po}/${pcs.length}</span></summary>
          <div class="branches">${branches.filter((b) => b.period === p).map((b) => `
            <div class="branch"><h3><code>${b.code}</code>${esc(lang === 'ar' ? b.ar : b.en)}</h3>
              <div class="tiles">${cards.filter((c) => c.branch === b.code).map((c) => tileHTML(c, today)).join('')}</div></div>`).join('')}
          </div></details>`;
      }).join('')}
    </section>`;
  }
  function yearbarHTML() {
    return `<div class="yearbar view-in" aria-hidden="true"><div class="yearbar-track">${PERIODS.map((p) => {
      const pcs = cards.filter((c) => c.period === p);
      const pct = (pcs.filter(isOpen).length / pcs.length) * 100;
      return `<div class="yearbar-seg" style="flex:${pcs.length};--seg:${PCOL[p]}"><i style="width:${pct}%"></i></div>`;
    }).join('')}</div>
    <div class="yearbar-legend">${PERIODS.map((p) => `<span>${t.periods[p]}</span>`).join('')}</div></div>`;
  }

  /* ---------- views ---------- */
  function stopBase() {
    if (heroScene) { heroScene.stop(); heroScene = null; }
    if (mapLoop) { mapLoop.stop(); mapLoop = null; }
  }

  function renderToday() {
    const c = todayCard();
    const open = isOpen(c);
    lastTodayId = c.id;
    setPeriod(c.period);
    $('#view').innerHTML = `
      <section class="hero view-in">
        <div class="stage"><canvas aria-hidden="true"></canvas></div>
        <p class="eyebrow"><b>${t.day(c.day)}</b><span>${t.of365}</span><span class="dot"></span><span>${branchName(c.branch)}</span></p>
        <h1 class="q" lang="${lang}">${esc(q(c))}</h1>
        <p class="q-alt" lang="${altLang()}" dir="auto">${esc(qAlt(c))}</p>
        ${open ? '' : countdownHTML(c.at, c.day === 1 ? t.firstOpensIn : t.opensIn)}
        <div class="actions">
          <a class="btn btn-primary" href="#${c.id}">${open ? t.openAnswer : t.seeQuestion}</a>
          <button class="btn" type="button" data-share="${c.id}">${ICON.share}${t.share}</button>
        </div>
      </section>
      ${yearbarHTML()}
      ${yearHTML(c)}`;
    heroScene = Scenes.mount($('#view .stage canvas'), { period: c.period, day: c.day, id: c.id, locked: !open });
    tickCountdowns();
  }

  function renderMap() {
    setPeriod(todayCard().period);
    $('#view').innerHTML = `
      <section class="map view-in">
        <h1>${t.mapTitle}</h1>
        <p class="lead">${t.mapSub}</p>
        <div class="map-wrap"><canvas role="img" aria-label="${esc(t.mapTitle)}"></canvas><div class="map-center" id="map-center"></div></div>
        <div class="map-legend">${PERIODS.map((p) => `<span style="--c:${PCOL[p]}"><i></i>${t.periods[p]}</span>`).join('')}</div>
      </section>`;
    mapLoop = mountMap($('.map-wrap canvas'), $('#map-center'));
  }

  // The year as a wheel: 365 dots clockwise from the top, related questions joined by curves.
  function mountMap(canvas, center) {
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, cx = 0, R = 0, raf = 0, stopped = false;
    const t0 = performance.now();
    let selected = todayCard();
    const N = cards.length, GAP = 6;
    const angle = (c) => -Math.PI / 2 + ((c.day - 1 + PERIODS.indexOf(c.period) * GAP + GAP / 2) / (N + PERIODS.length * GAP)) * Math.PI * 2;
    const pos = (c) => { const a = angle(c); return [cx + Math.cos(a) * R, cx + Math.sin(a) * R]; };
    const seen = new Set(), edges = [];
    cards.forEach((c) => (c.rel || []).forEach((id) => {
      const key = [c.id, id].sort().join('-');
      if (byId[id] && !seen.has(key)) { seen.add(key); edges.push([c, byId[id]]); }
    }));
    const stars = Array.from({ length: 140 }, () => [Math.random(), Math.random(), Math.random()]);

    function size() {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; cx = W / 2; R = W * 0.38;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(W * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function setCenter(c) {
      selected = c;
      center.innerHTML = `<small>${t.day(c.day)} · ${esc(t.periods[c.period])}</small>
        <div class="q-mini" lang="${lang}">${esc(q(c))}</div>
        <a class="btn ${isOpen(c) ? 'btn-primary' : ''}" href="#${c.id}">${t.open}</a>`;
    }
    function draw(ts) {
      const el = (ts - t0) / 1000;
      const sweep = reduce ? 1 : Math.min(1, el / 1.6);
      ctx.clearRect(0, 0, W, W);
      ctx.fillStyle = '#ffffff';
      for (const s of stars) { ctx.globalAlpha = 0.1 + 0.3 * (0.5 + 0.5 * Math.sin(el * (0.5 + s[2]) + s[2] * 9)); ctx.fillRect(s[0] * W, s[1] * W, 1, 1); }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(236,232,221,.07)'; ctx.lineWidth = 1;
      [0.55, 0.78, 1].forEach((k) => { ctx.beginPath(); ctx.arc(cx, cx, R * k, 0, Math.PI * 2); ctx.stroke(); });
      PERIODS.forEach((p) => {
        const pcs = cards.filter((c) => c.period === p);
        const a0 = angle(pcs[0]), a1 = angle(pcs[pcs.length - 1]);
        ctx.strokeStyle = PCOL[p]; ctx.globalAlpha = 0.5; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cx, R * 1.09, a0, a0 + (a1 - a0) * sweep); ctx.stroke();
        ctx.globalAlpha = 0.9; ctx.fillStyle = PCOL[p];
        const am = (a0 + a1) / 2;
        ctx.font = `${lang === 'ar' ? '600' : '400'} ${Math.max(11, W * 0.03)}px ${lang === 'ar' ? '"Reem Kufi"' : 'Marcellus'}, serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(t.periods[p], cx + Math.cos(am) * R * 1.2, cx + Math.sin(am) * R * 1.2);
        ctx.globalAlpha = 0.35; ctx.lineWidth = 1;
        branches.filter((b) => b.period === p).forEach((b) => {
          const a = angle(cards.find((c) => c.branch === b.code)) - 0.006;
          ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * R * 1.04, cx + Math.sin(a) * R * 1.04); ctx.lineTo(cx + Math.cos(a) * R * 1.12, cx + Math.sin(a) * R * 1.12); ctx.stroke();
        });
      });
      ctx.globalAlpha = 1;
      const ea = reduce ? 1 : Math.max(0, Math.min(1, (el - 1.2) / 1));
      edges.forEach(([a, b]) => {
        const hot = a === selected || b === selected;
        const [x1, y1] = pos(a), [x2, y2] = pos(b);
        ctx.strokeStyle = hot ? PCOL[a.period] : '#ece8dd';
        ctx.globalAlpha = ea * (hot ? 0.95 : isOpen(a) && isOpen(b) ? 0.22 : 0.08);
        ctx.lineWidth = hot ? 1.6 : 0.8;
        ctx.beginPath(); ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cx + ((x1 + x2) / 2 - cx) * 0.15, cx + ((y1 + y2) / 2 - cx) * 0.15, x2, y2);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      const today = todayCard();
      cards.forEach((c, i) => {
        if (i / N > sweep) return;
        const o = isOpen(c);
        const [x, y] = pos(c);
        const r = c === selected ? 5 : o ? 2.6 : 1.6;
        ctx.fillStyle = o ? (c.has ? PCOL[c.period] : 'rgba(236,232,221,.55)') : 'rgba(236,232,221,.28)';
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        if (c === today && o) {
          const pulse = reduce ? 0.5 : 0.5 + 0.5 * Math.sin(el * 2.4);
          ctx.strokeStyle = PCOL[c.period]; ctx.globalAlpha = 0.25 + 0.5 * pulse; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(x, y, 7 + pulse * 4, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
        }
      });
      if (!stopped && !reduce) raf = requestAnimationFrame(draw);
    }
    function pick(ev) {
      const r = canvas.getBoundingClientRect();
      const x = ev.clientX - r.left, y = ev.clientY - r.top;
      let best = null, bd = (W * 0.06) ** 2;
      cards.forEach((c) => { const [px, py] = pos(c); const d = (px - x) ** 2 + (py - y) ** 2; if (d < bd) { bd = d; best = c; } });
      if (best) { setCenter(best); if (reduce) draw(performance.now()); }
    }
    canvas.addEventListener('click', pick);
    const ro = new ResizeObserver(() => { size(); if (reduce) draw(performance.now()); });
    ro.observe(canvas);
    size();
    setCenter(selected);
    raf = requestAnimationFrame(draw);
    return { stop() { stopped = true; cancelAnimationFrame(raf); ro.disconnect(); } };
  }

  function renderBase(v, force) {
    if (!force && currentBase === v) return;
    stopBase();
    currentBase = v;
    document.querySelectorAll('[data-tab]').forEach((a) => (a.dataset.tab === v ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
    v === 'map' ? renderMap() : renderToday();
  }

  /* ---------- card sheet ---------- */
  function contentHTML(c, d) {
    // Each section in the reader's language, falling back to the other language if it is missing.
    const other = lang === 'ar' ? 'en' : 'ar';
    const pick = (k) => {
      const mine = d.html[lang] && d.html[lang][k];
      if (mine) return [mine, lang];
      const alt = d.html[other] && d.html[other][k];
      return alt ? [alt, other] : null;
    };
    const sec = (k, cls, wrap) => {
      const p = pick(k);
      if (!p) return '';
      const body = wrap ? `<div class="${wrap}">${p[0]}</div>` : p[0];
      return `<section class="sec ${cls || ''}" lang="${p[1]}" dir="${p[1] === 'ar' ? 'rtl' : 'ltr'}"><h2>${t.sec[k]}</h2>${body}</section>`;
    };
    const missing = ['story', 'deeper'].some((k) => !(d.html[lang] && d.html[lang][k]));
    const pair = (en, ar) => {
      const first = lang === 'ar' ? (ar ? [ar, 'ar'] : [en, 'en']) : (en ? [en, 'en'] : [ar, 'ar']);
      const second = first[1] === 'ar' ? [en, 'en'] : [ar, 'ar'];
      return [first, second[0] ? second : null];
    };
    const [s1, s2] = pair(d.short_en, d.short_ar);
    const [h1, h2] = pair(d.share_en, d.share_ar);
    return `
      <div class="short">${s1[0] ? `<p lang="${s1[1]}" dir="auto">${esc(s1[0])}</p>` : ''}${s2 ? `<p lang="${s2[1]}" dir="auto">${esc(s2[0])}</p>` : ''}</div>
      ${missing && t.enNote ? `<p class="en-note">${t.enNote}</p>` : ''}
      ${sec('story', 'story')}${sec('deeper')}${sec('proof')}${sec('bible')}${sec('watch')}${sec('read')}${sec('talk', '', 'talk')}
      ${h1[0] ? `<div class="share-line">
        <blockquote lang="${h1[1]}" dir="auto">${esc(h1[0])}</blockquote>
        ${h2 ? `<p class="alt" lang="${h2[1]}" dir="auto">${esc(h2[0])}</p>` : ''}
        <div class="actions">
          <a class="btn btn-wa" href="${esc(waLink(shareText(c, d)))}" target="_blank" rel="noopener">${ICON.wa}${t.whatsapp}</a>
          <button class="btn" type="button" data-copy-url="${esc(shareURL(c))}">${ICON.link}${t.copy}</button>
        </div></div>` : ''}`;
  }
  function relatedHTML(c) {
    const rel = (c.rel || []).map((id) => byId[id]).filter(Boolean);
    if (!rel.length) return '';
    return `<section class="sec"><h2>${t.sec.related}</h2><div class="chips">${rel.map((r) =>
      `<a class="chip ${isOpen(r) ? '' : 'locked'}" href="#${r.id}"><code>${r.id}</code><span lang="${lang}">${esc(q(r))}</span></a>`).join('')}</div></section>`;
  }
  function cardHTML(c, open, d) {
    const prev = cards[c.day - 2], next = cards[c.day];
    let body;
    if (!open) {
      body = `<div class="locked-box">${ICON.lock}<div><b>${t.locked}</b><p class="lead">${t.lockedSub}</p></div>
        ${countdownHTML(c.at, t.opensIn)}
        <button class="btn btn-primary" type="button" data-share="${c.id}">${ICON.share}${t.shareTitle}</button></div>`;
    } else if (!d) {
      body = `<div class="locked-box"><p class="lead">${t.writing}</p></div>`;
    } else {
      body = contentHTML(c, d);
    }
    return `
      <div class="card-top">
        <button class="icon-btn" type="button" data-close aria-label="${t.close}">${ICON.down}</button>
        <span class="day">${t.day(c.day)} · ${fmtDate(c.date)}</span>
        <button class="icon-btn" type="button" data-share="${c.id}" aria-label="${t.share}">${ICON.share}</button>
      </div>
      <div class="stage card-stage"><canvas aria-hidden="true"></canvas></div>
      <div class="card-body">
        <p class="eyebrow"><b>${c.branch}</b><span>${branchName(c.branch)}</span><span class="dot"></span><span>${t.periods[c.period]}</span>
          ${BOOT.preview && d && d.status ? `<span class="status-badge">${esc(d.status)}</span>` : ''}</p>
        <h1 class="q" id="card-q" lang="${lang}">${esc(q(c))}</h1>
        <p class="q-alt" lang="${altLang()}" dir="auto">${esc(qAlt(c))}</p>
        ${body}
        ${relatedHTML(c)}
        <nav class="pager">
          ${prev ? `<a class="btn" href="#${prev.id}">${ICON.prev}${t.prev}</a>` : '<span></span>'}
          ${next ? `<a class="btn" href="#${next.id}">${t.next}${ICON.next}</a>` : '<span></span>'}
        </nav>
      </div>`;
  }
  let openToken = 0;
  async function openCard(id) {
    const c = byId[id];
    const token = ++openToken;
    const open = isOpen(c);
    let d = null;
    if (open && c.has) d = await loadCard(id).catch(() => null);
    if (token !== openToken) return;
    setPeriod(c.period);
    const sheet = $('#sheet'), sc = $('#sheet-scroll');
    if (cardScene) { cardScene.stop(); cardScene = null; }
    sc.innerHTML = cardHTML(c, open, d);
    sc.scrollTop = 0;
    document.title = `${t.day(c.day)} · ${q(c)}`;
    const wasHidden = sheet.hidden;
    sheet.hidden = false;
    document.body.style.overflow = 'hidden';
    if (wasHidden) requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('open')));
    else sheet.classList.add('open');
    cardScene = Scenes.mount($('.card-stage canvas', sc), { period: c.period, day: c.day, id: c.id, locked: !open });
    tickCountdowns();
    const closeBtn = $('[data-close]', sc);
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }
  function closeCard() {
    const sheet = $('#sheet');
    openToken++;
    if (sheet.hidden) return;
    sheet.classList.remove('open');
    document.body.style.overflow = '';
    document.title = appName();
    if (currentBase) setPeriod(todayCard().period);
    setTimeout(() => {
      if (sheet.classList.contains('open')) return;
      sheet.hidden = true;
      if (cardScene) { cardScene.stop(); cardScene = null; }
      $('#sheet-scroll').innerHTML = '';
    }, 560);
  }

  /* ---------- routing ---------- */
  function route() {
    const h = decodeURIComponent(location.hash.replace(/^#/, ''));
    if (byId[h]) {
      if (!currentBase) renderBase('today');
      openCard(h);
      return;
    }
    closeCard();
    renderBase(h === 'map' ? 'map' : 'today');
  }
  function goBase() {
    if (cameFromApp) history.back();
    else location.hash = currentBase === 'map' ? 'map' : 'today';
  }

  /* ---------- language ---------- */
  function applyLang() {
    t = STR[lang];
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const names = { name: appName(), tagline: lang === 'ar' ? cfg.tagline_ar : cfg.tagline_en };
    document.querySelectorAll('[data-i18n]').forEach((el) => { const k = el.dataset.i18n; el.textContent = names[k] || t[k] || ''; });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t[el.dataset.i18nAria]));
    $('#lang-label').textContent = lang === 'ar' ? 'EN' : 'ع';
    $('#lang').setAttribute('aria-label', lang === 'ar' ? 'English' : 'العربية');
    if ($('#sheet').hidden) document.title = appName();
  }

  /* ---------- preview (artifact only): travel through the year ---------- */
  function setupPreview() {
    if (!BOOT.preview) return;
    const bar = $('#preview-bar');
    const start = Math.max(0, cards.findIndex((c) => c.date === BOOT.preview));
    bar.innerHTML = `<b></b><label for="preview-day"></label>
      <input id="preview-day" type="range" min="0" max="${cards.length - 1}" value="${start}"><output></output>`;
    bar.hidden = false;
    setPreviewDay(start);
    $('#preview-day').addEventListener('input', (e) => {
      setPreviewDay(+e.target.value);
      renderBase(currentBase || 'today', true);
      if (!$('#sheet').hidden) route();
    });
  }
  function setPreviewDay(i) {
    const bar = $('#preview-bar');
    offset = cards[i].at + 10 * 3600e3 - Date.now();
    $('b', bar).textContent = t.preview;
    $('label', bar).textContent = t.previewNote;
    $('output', bar).textContent = fmtDate(cards[i].date);
  }

  /* ---------- events ---------- */
  document.addEventListener('click', (e) => {
    const s = e.target.closest('[data-share]');
    if (s) { e.preventDefault(); openShare(byId[s.dataset.share]); return; }
    if (e.target.closest('#share-app')) { openShare(null); return; }
    if (e.target.closest('[data-close]')) { goBase(); return; }
    const cp = e.target.closest('[data-copy-url]');
    if (cp) { copyText(cp.dataset.copyUrl); return; }
    if (e.target.closest('#lang')) {
      if (!INDEX) return;
      lang = lang === 'ar' ? 'en' : 'ar';
      store.set('lang', lang);
      applyLang();
      if (BOOT.preview) setPreviewDay(+$('#preview-day').value);
      renderBase(currentBase || 'today', true);
      if (!$('#sheet').hidden) route();
      return;
    }
    const pop = $('#share-pop');
    if (!pop.hidden && e.target === pop) closeShare();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (closeShare()) return;
    if (!$('#sheet').hidden) goBase();
  });
  window.addEventListener('hashchange', () => { cameFromApp = booted; route(); });

  // Every second: run countdowns; when a new day opens, redraw with an unlock flash.
  setInterval(() => {
    if (!INDEX) return;
    const expired = tickCountdowns();
    const today = todayCard();
    if (today.id !== lastTodayId && currentBase === 'today') {
      renderBase('today', true);
      const tile = document.querySelector(`.tile[data-id="${today.id}"]`);
      if (tile) tile.classList.add('flash');
      if (!$('#sheet').hidden) route();
    } else if (expired && !$('#sheet').hidden) {
      route();
    }
  }, 1000);

  /* ---------- boot ---------- */
  $('#view').innerHTML = '<div class="loading">…</div>';
  fetch('data/index.json')
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((data) => {
      INDEX = data;
      cfg = data.cfg; base = data.base; branches = data.branches;
      cards = data.cards.map((c) => Object.assign(c, { at: unlockAt(c.date) }));
      cards.forEach((c) => { byId[c.id] = c; });
      applyLang();
      setupPreview();
      route();
      booted = true;
    })
    .catch((err) => {
      console.error(err);
      t = STR[lang];
      $('#view').innerHTML = `<div class="loading"><p>${t.loadFail}</p></div>`;
    });
})();

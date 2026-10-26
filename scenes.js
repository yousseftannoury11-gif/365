/* Animated scenes, one look per period:
 *   God    – deep space: nebula, spiral galaxy, stars that gather into the day number, then a supernova.
 *   Christ – an icon: gold-leaf halo, the Red Sea parting, typology threads (Eden, Ark, Ladder, Bush, Law, Serpent) leading to Christ.
 *   Church – a stained-glass rose window assembling shard by shard, lit above the candles of the martyrs.
 * Usage: Scenes.mount(canvas, {period, day, id, locked}) -> {stop()};  Scenes.still(canvas, opts) draws the final frame.
 * Per-question scenes can be added later as Scenes.custom[id] = factory(ctx, W, H, opts) -> {end, draw(t)}.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeBack = (t) => { const c = 1.25; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const FONT = 'Marcellus, "Cormorant Garamond", Georgia, serif';

  function rng(seed) {
    return function () {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return h >>> 0;
  }
  function makeCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(w));
    c.height = Math.max(1, Math.ceil(h));
    return c;
  }
  const sprites = {};
  function sprite(rgb) {
    if (sprites[rgb]) return sprites[rgb];
    const c = makeCanvas(64, 64), g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, `rgba(${rgb},1)`);
    gr.addColorStop(0.18, `rgba(${rgb},.55)`);
    gr.addColorStop(0.5, `rgba(${rgb},.12)`);
    gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    return (sprites[rgb] = c);
  }
  function fitFont(g, text, maxW, maxH) {
    let size = maxH;
    g.font = `${size}px ${FONT}`;
    const w = g.measureText(text).width;
    if (w > maxW) size *= maxW / w;
    return size;
  }
  // Sample points inside the rendered day number, used as targets for particles.
  function glyphPoints(text, bw, bh, max, R) {
    const c = makeCanvas(bw, bh), g = c.getContext('2d');
    const size = fitFont(g, text, bw * 0.94, bh);
    g.font = `${size}px ${FONT}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = '#fff';
    g.fillText(text, c.width / 2, c.height / 2 + size * 0.05);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    const step = Math.max(2, Math.round(size / 60));
    let pts = [];
    for (let y = 0; y < c.height; y += step)
      for (let x = 0; x < c.width; x += step)
        if (d[(y * c.width + x) * 4 + 3] > 140) pts.push([x + (R() - 0.5) * step * 0.7, y + (R() - 0.5) * step * 0.7]);
    for (let i = pts.length - 1; i > 0; i--) {
      const j = (R() * (i + 1)) | 0;
      const tmp = pts[i]; pts[i] = pts[j]; pts[j] = tmp;
    }
    if (pts.length > max) pts = pts.slice(0, max);
    return { pts, size };
  }
  function drawNumber(ctx, text, x, y, maxW, maxH) {
    const size = fitFont(ctx, text, maxW, maxH);
    ctx.font = `${size}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y + size * 0.05);
    return size;
  }

  /* ------------------------------------------------------------------ GOD */
  function God(ctx, W, H, o) {
    const R = rng(hash('G' + o.id));
    const locked = !!o.locked;
    const cx = W * (o.fx == null ? 0.5 : o.fx), cy = H * (o.fy == null ? 0.46 : o.fy);
    const area = W * H, big = Math.max(W, H);

    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(W, H) * 0.75);
    bg.addColorStop(0, locked ? '#080b1c' : '#0c1236');
    bg.addColorStop(0.55, '#060818');
    bg.addColorStop(1, '#020309');

    // Nebula, painted once at half resolution and drifted slowly.
    const neb = makeCanvas(W * 0.5, H * 0.5), n = neb.getContext('2d');
    n.globalCompositeOperation = 'lighter';
    const cols = locked ? ['80,98,150', '60,76,124'] : ['255,84,132', '52,196,214', '124,96,255', '255,160,84'];
    const a0 = R() * TAU;
    for (let i = 0; i < 90; i++) {
      const u = R() - 0.5;
      const bx = (0.5 + Math.cos(a0) * u * 1.3) * neb.width + (R() - 0.5) * neb.width * 0.35;
      const by = (0.5 + Math.sin(a0) * u * 1.3) * neb.height + (R() - 0.5) * neb.height * 0.35;
      const r = (0.06 + Math.pow(R(), 2) * 0.32) * Math.max(neb.width, neb.height);
      const al = (locked ? 0.03 : 0.05) * (0.5 + R());
      const gr = n.createRadialGradient(bx, by, 0, bx, by, r);
      const c = cols[(R() * cols.length) | 0];
      gr.addColorStop(0, `rgba(${c},${al})`);
      gr.addColorStop(1, `rgba(${c},0)`);
      n.fillStyle = gr;
      n.fillRect(bx - r, by - r, r * 2, r * 2);
    }
    n.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 24; i++) {
      const bx = R() * neb.width, by = R() * neb.height, r = (0.03 + R() * 0.1) * neb.width;
      const gr = n.createRadialGradient(bx, by, 0, bx, by, r);
      gr.addColorStop(0, 'rgba(2,3,9,.22)');
      gr.addColorStop(1, 'rgba(2,3,9,0)');
      n.fillStyle = gr;
      n.fillRect(bx - r, by - r, r * 2, r * 2);
    }

    const stars = [];
    const NS = clamp(area / 650, 160, 1600) | 0;
    for (let i = 0; i < NS; i++)
      stars.push({ x: R() * W, y: R() * H, r: 0.35 + Math.pow(R(), 5) * 2, tw: R() * TAU, sp: 0.5 + R() * 2.4, hue: R() });

    // Spiral galaxy in a corner.
    const gx = W * (o.fx != null && o.fx < 0.4 ? 0.84 : R() < 0.5 ? 0.16 : 0.84);
    const gy = H * (0.14 + R() * 0.12);
    const gR = Math.min(W, H) * 0.2, tilt = 0.42;
    const gal = [];
    const NG = clamp(area / 800, 220, 1200) | 0;
    for (let i = 0; i < NG; i++) {
      const d = Math.pow(R(), 0.75);
      gal.push({ d, th: (i % 2) * Math.PI + d * 4.4 + (R() - 0.5) * (0.35 + d * 0.5), s: R() });
    }

    // The day number, as a constellation.
    const bw = Math.min(W * 0.86, H * 1.15), bh = Math.min(H * 0.48, W * 0.46);
    const gp = glyphPoints(String(o.day), bw, bh, clamp(area / 240, 280, 950) | 0, R);
    const ox = cx - bw / 2, oy = cy - bh / 2;
    const P = gp.pts.map(([x, y]) => ({
      tx: ox + x, ty: oy + y, sx: R() * W, sy: R() * H, d: R() * 0.8, w: R() * TAU, r: 0.6 + R() * 1.1,
    }));
    const links = [], maxD2 = Math.pow(Math.max(7, bh / 14), 2);
    for (let i = 0; i < P.length; i += 2) {
      let best = -1, bd = maxD2;
      for (let j = 0; j < P.length; j++) {
        if (j === i) continue;
        const dx = P[i].tx - P[j].tx, dy = P[i].ty - P[j].ty, d2 = dx * dx + dy * dy;
        if (d2 < bd && d2 > 4) { bd = d2; best = j; }
      }
      if (best >= 0) links.push(i, best);
    }

    const T1 = 2.8;
    const nova = [];
    if (!locked) for (let i = 0; i < 190; i++) nova.push({ a: R() * TAU, v: 0.2 + R() * 0.8, r: 0.5 + R() * 1.6, c: R() });
    const sW = sprite('255,244,222'), sB = sprite('150,186,255'), sR = sprite('255,110,150'), sG = sprite('255,200,120');

    return {
      end: T1 + 3.4,
      draw(t) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        ctx.drawImage(neb, -W * 0.03 + Math.sin(t * 0.03) * W * 0.012, -H * 0.03 + Math.cos(t * 0.025) * H * 0.012, W * 1.06, H * 1.06);
        ctx.globalCompositeOperation = 'lighter';

        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          const a = (0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * s.sp + s.tw))) * (locked ? 0.6 : 1);
          ctx.globalAlpha = a;
          ctx.fillStyle = s.hue < 0.15 ? '#aac8ff' : s.hue > 0.9 ? '#ffdcb4' : '#ffffff';
          ctx.fillRect(s.x, s.y, s.r, s.r);
          if (s.r > 1.6) { ctx.globalAlpha = a * 0.5; ctx.drawImage(sW, s.x - 7, s.y - 7, 14, 14); }
        }

        ctx.globalAlpha = locked ? 0.25 : 0.5;
        ctx.drawImage(sG, gx - gR * 0.5, gy - gR * 0.5 * tilt * 1.6, gR, gR * tilt * 1.6);
        for (let i = 0; i < gal.length; i++) {
          const p = gal[i];
          const a = p.th + t * (0.05 / (p.d + 0.2));
          const r = p.d * gR;
          const x = gx + Math.cos(a) * r, y = gy + Math.sin(a) * r * tilt;
          ctx.globalAlpha = (locked ? 0.35 : 0.7) * (1 - p.d * 0.6);
          ctx.fillStyle = p.d < 0.18 ? '#ffd9ae' : p.s > 0.94 ? '#ff7aa0' : '#bcd0ff';
          ctx.fillRect(x, y, 1.1, 1.1);
        }

        for (let i = 0; i < P.length; i++) {
          const p = P[i];
          const k = easeInOut(clamp((t - p.d) / (T1 - p.d), 0, 1));
          const sw = (1 - k) * 22;
          const x = lerp(p.sx, p.tx, k) + Math.cos(p.w + t * 1.3) * sw;
          const y = lerp(p.sy, p.ty, k) + Math.sin(p.w + t * 1.3) * sw;
          ctx.globalAlpha = (locked ? 0.45 : 0.92) * (0.75 + 0.25 * Math.sin(t * 2 + p.w)) * (0.35 + 0.65 * k);
          const sz = p.r * (locked ? 5 : 7);
          ctx.drawImage(locked ? sB : i % 7 === 0 ? sG : sW, x - sz / 2, y - sz / 2, sz, sz);
        }

        const la = clamp((t - T1 + 0.4) / 1.2, 0, 1) * (locked ? 0.12 : 0.22);
        if (la > 0) {
          ctx.globalAlpha = la;
          ctx.strokeStyle = locked ? '#8aa0d0' : '#d5e3ff';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          for (let i = 0; i < links.length; i += 2) {
            ctx.moveTo(P[links[i]].tx, P[links[i]].ty);
            ctx.lineTo(P[links[i + 1]].tx, P[links[i + 1]].ty);
          }
          ctx.stroke();
        }

        if (locked) {
          ctx.globalAlpha = 0.1 + 0.08 * Math.sin(t * 1.2);
          ctx.strokeStyle = '#9fb4e6';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, bh * 0.75 + Math.sin(t * 1.2) * 4, 0, TAU);
          ctx.stroke();
        } else {
          const age = t - T1;
          if (age > 0) {
            if (age < 2.2) {
              const fa = Math.exp(-age * 2.4), fr = big * (0.08 + age * 0.35);
              const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, fr);
              g.addColorStop(0, `rgba(255,250,235,${0.8 * fa})`);
              g.addColorStop(0.25, `rgba(255,190,120,${0.4 * fa})`);
              g.addColorStop(1, 'rgba(255,90,140,0)');
              ctx.globalAlpha = 1;
              ctx.fillStyle = g;
              ctx.fillRect(cx - fr, cy - fr, fr * 2, fr * 2);
            }
            if (age < 3) {
              const q = age / 3;
              ctx.globalAlpha = (1 - q) * 0.45;
              ctx.strokeStyle = '#ffd7a0';
              ctx.lineWidth = 1.2 + 5 * (1 - q);
              ctx.beginPath();
              ctx.arc(cx, cy, easeOut(q) * big * 0.6, 0, TAU);
              ctx.stroke();
            }
            if (age < 3.4) {
              const q = age / 3.4;
              for (let i = 0; i < nova.length; i++) {
                const e = nova[i], d = easeOut(q) * big * 0.45 * e.v;
                const sz = e.r * 6;
                ctx.globalAlpha = (1 - q) * 0.9;
                ctx.drawImage(e.c < 0.3 ? sR : e.c < 0.6 ? sG : sW, cx + Math.cos(e.a) * d - sz / 2, cy + Math.sin(e.a) * d - sz / 2, sz, sz);
              }
            }
            ctx.globalAlpha = clamp(age / 1.5, 0, 1) * (0.1 + 0.05 * Math.sin(age * 1.3));
            ctx.drawImage(sG, cx - bw * 0.5, cy - bh * 0.7, bw, bh * 1.4);
          }
          // A distant star explodes now and then.
          if (t > 6) {
            const k = Math.floor((t - 6) / 7), age2 = (t - 6) % 7;
            if (age2 < 2) {
              const r2 = rng(hash(o.id + ':' + k));
              const x = r2() * W, y = r2() * H * 0.7, s = 0.5 + r2();
              const fa = Math.exp(-age2 * 2);
              ctx.globalAlpha = fa;
              ctx.drawImage(sW, x - 20 * s, y - 20 * s, 40 * s, 40 * s);
              ctx.globalAlpha = (1 - age2 / 2) * 0.35;
              ctx.strokeStyle = '#ffc7a8';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(x, y, easeOut(age2 / 2) * 46 * s, 0, TAU);
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      },
    };
  }

  /* --------------------------------------------------------------- CHRIST */
  const SYMBOLS = {
    tree(g, s) { // Eden
      g.beginPath(); g.moveTo(0, s * 0.5); g.lineTo(0, -s * 0.02); g.stroke();
      [[0, -0.3, 0.27], [-0.22, -0.1, 0.19], [0.22, -0.1, 0.19]].forEach(([x, y, r]) => { g.beginPath(); g.arc(x * s, y * s, r * s, 0, TAU); g.stroke(); });
      g.fillStyle = '#c8442c'; g.beginPath(); g.arc(s * 0.08, -s * 0.24, s * 0.06, 0, TAU); g.fill();
    },
    ark(g, s) { // Noah
      g.beginPath(); g.moveTo(-0.5 * s, 0.08 * s); g.quadraticCurveTo(0, 0.5 * s, 0.5 * s, 0.08 * s); g.closePath(); g.stroke();
      g.strokeRect(-0.22 * s, -0.2 * s, 0.44 * s, 0.28 * s);
      g.beginPath(); g.moveTo(-0.28 * s, -0.2 * s); g.lineTo(0, -0.42 * s); g.lineTo(0.28 * s, -0.2 * s); g.stroke();
    },
    ladder(g, s) { // Jacob
      g.beginPath(); g.moveTo(-0.17 * s, 0.5 * s); g.lineTo(-0.1 * s, -0.5 * s); g.moveTo(0.17 * s, 0.5 * s); g.lineTo(0.1 * s, -0.5 * s);
      for (let i = 0; i < 5; i++) { const y = 0.38 * s - i * 0.2 * s, w = 0.16 - i * 0.012; g.moveTo(-w * s, y); g.lineTo(w * s, y); }
      g.stroke();
    },
    flame(g, s) { // the burning bush
      g.beginPath(); g.moveTo(0, -0.5 * s);
      g.bezierCurveTo(0.36 * s, -0.08 * s, 0.32 * s, 0.45 * s, 0, 0.45 * s);
      g.bezierCurveTo(-0.32 * s, 0.45 * s, -0.36 * s, -0.08 * s, 0, -0.5 * s); g.stroke();
      g.beginPath(); g.moveTo(0, -0.08 * s); g.bezierCurveTo(0.15 * s, 0.12 * s, 0.13 * s, 0.34 * s, 0, 0.34 * s);
      g.bezierCurveTo(-0.13 * s, 0.34 * s, -0.15 * s, 0.12 * s, 0, -0.08 * s); g.stroke();
    },
    tablets(g, s) { // the Law
      [-0.2, 0.2].forEach((x) => {
        g.beginPath(); g.moveTo((x - 0.17) * s, 0.42 * s); g.lineTo((x - 0.17) * s, -0.22 * s);
        g.arc(x * s, -0.22 * s, 0.17 * s, Math.PI, 0); g.lineTo((x + 0.17) * s, 0.42 * s); g.closePath(); g.stroke();
      });
    },
    serpent(g, s) { // the bronze serpent coiled on the pole (Nm 21:9, Jn 3:14)
      g.beginPath(); g.moveTo(0, 0.52 * s); g.lineTo(0, -0.52 * s); g.stroke();
      g.beginPath();
      for (let k = 0; k <= 28; k++) {
        const u = k / 28, y = lerp(0.36, -0.3, u) * s, x = Math.sin(u * Math.PI * 4.5) * 0.17 * s * (0.6 + 0.4 * u);
        k ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.stroke();
      g.beginPath(); g.ellipse(0.13 * s, -0.36 * s, 0.07 * s, 0.045 * s, -0.4, 0, TAU); g.stroke();
    },
  };

  function Christ(ctx, W, H, o) {
    const R = rng(hash('C' + o.id));
    const locked = !!o.locked;
    const cx = W * (o.fx == null ? 0.5 : o.fx), cy = H * (o.fy == null ? 0.42 : o.fy);
    const Rh = Math.min(W * 0.3, H * 0.27);

    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(W, H) * 0.7);
    bg.addColorStop(0, locked ? '#111a3c' : '#182c74');
    bg.addColorStop(0.55, '#0a1640');
    bg.addColorStop(1, '#040817');

    // Gold-leaf halo with incised rays and punched dots, like an icon.
    const hs = Math.ceil(Rh * 2.3), halo = makeCanvas(hs, hs), h = halo.getContext('2d'), hc = hs / 2;
    const hg = h.createRadialGradient(hc - Rh * 0.3, hc - Rh * 0.35, 0, hc, hc, Rh);
    const stops = locked ? ['#9b968a', '#77736b', '#57544e', '#3b3935'] : ['#fff1c1', '#f0c463', '#c48f32', '#8a5f1c'];
    [0, 0.35, 0.75, 1].forEach((p, i) => hg.addColorStop(p, stops[i]));
    h.fillStyle = hg;
    h.beginPath(); h.arc(hc, hc, Rh, 0, TAU); h.fill();
    h.strokeStyle = 'rgba(110,70,18,.32)'; h.lineWidth = Math.max(0.6, Rh * 0.006);
    h.beginPath();
    for (let i = 0; i < 96; i++) {
      const a = (i / 96) * TAU, r1 = Rh * (i % 2 ? 0.78 : 0.84);
      h.moveTo(hc + Math.cos(a) * Rh * 0.42, hc + Math.sin(a) * Rh * 0.42);
      h.lineTo(hc + Math.cos(a) * r1, hc + Math.sin(a) * r1);
    }
    h.stroke();
    h.fillStyle = 'rgba(105,66,16,.55)';
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * TAU;
      h.beginPath(); h.arc(hc + Math.cos(a) * Rh * 0.92, hc + Math.sin(a) * Rh * 0.92, Math.max(0.8, Rh * 0.012), 0, TAU); h.fill();
    }
    h.lineWidth = Math.max(1, Rh * 0.012);
    h.strokeStyle = 'rgba(255,236,180,.6)'; h.beginPath(); h.arc(hc, hc, Rh * 0.97, 0, TAU); h.stroke();
    h.strokeStyle = 'rgba(105,66,16,.55)'; h.beginPath(); h.arc(hc, hc, Rh * 0.88, 0, TAU); h.stroke();
    h.lineWidth = Math.max(1.5, Rh * 0.022);
    h.strokeStyle = locked ? '#5a3a33' : '#a8321e'; h.beginPath(); h.arc(hc, hc, Rh * 1.005, 0, TAU); h.stroke();

    // Typology nodes on an arc above the halo.
    const names = ['tree', 'ark', 'ladder', 'flame', 'tablets', 'serpent'];
    const rx = Math.min(W * 0.43, Rh * 1.75), ry = Math.min(Rh * 1.45, cy - 18);
    const ns = clamp(Rh * 0.2, 13, 34);
    const nodes = names.map((nm, i) => {
      const a = Math.PI * (1.08 + (i / (names.length - 1)) * 0.84);
      const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry + ns * 0.2;
      const ex = cx + Math.cos(a) * Rh * 1.04, ey = cy + Math.sin(a) * Rh * 1.04;
      const mx = lerp(x, ex, 0.5) + Math.cos(a + Math.PI / 2) * Rh * 0.18, my = lerp(y, ey, 0.5) + Math.sin(a + Math.PI / 2) * Rh * 0.18;
      const pts = [];
      for (let k = 0; k <= 40; k++) {
        const u = k / 40;
        pts.push([(1 - u) * (1 - u) * x + 2 * (1 - u) * u * mx + u * u * ex, (1 - u) * (1 - u) * y + 2 * (1 - u) * u * my + u * u * ey]);
      }
      return { nm, x, y, pts, t0: 1.1 + i * 0.22 };
    });

    // The sea.
    const seaTop = H * 0.75, rows = 9;
    const waves = [];
    for (let i = 0; i < rows; i++) waves.push({ y: seaTop + Math.pow(i / (rows - 1), 1.3) * (H - seaTop) * 0.95, amp: 1.5 + i * 1.1, f: 0.012 + R() * 0.01, ph: R() * TAU, sp: 0.6 + R() * 0.6 });

    // Gold dust rising from the sea path into the halo, forming the number.
    const bw = Rh * 1.45, bh = Rh * 1.0;
    const gp = glyphPoints(String(o.day), bw, bh, 420, R);
    const dust = gp.pts.map(([x, y]) => ({ tx: cx - bw / 2 + x, ty: cy - bh / 2 + y, sx: cx + (R() - 0.5) * W * 0.12, sy: H + R() * 30, d: 1 + R() * 1.2, w: R() * TAU }));
    const sGold = sprite('255,222,150'), sFoam = sprite('210,240,255');
    const T = 3.3;

    function drawSea(t) {
      const gapK = locked ? 0 : easeInOut(clamp((t - 0.8) / 2.4, 0, 1));
      const gap = gapK * W * 0.12;
      if (gapK > 0) {
        const pg = ctx.createLinearGradient(0, seaTop - 8, 0, H);
        pg.addColorStop(0, 'rgba(255,214,130,0)');
        pg.addColorStop(1, `rgba(255,214,130,${0.35 * gapK})`);
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.moveTo(cx - 2, seaTop - 8); ctx.lineTo(cx + 2, seaTop - 8);
        ctx.lineTo(cx + gap * 0.9, H); ctx.lineTo(cx - gap * 0.9, H); ctx.closePath(); ctx.fill();
      }
      for (let i = 0; i < waves.length; i++) {
        const wv = waves[i], depth = i / (rows - 1);
        const g = gap * (0.25 + depth * 0.9);
        const lift = gapK * (8 + depth * 34);
        ctx.strokeStyle = locked ? `rgba(110,130,170,${0.18 + depth * 0.25})` : `rgba(${lerp(70, 120, depth) | 0},${lerp(150, 200, depth) | 0},220,${0.25 + depth * 0.4})`;
        ctx.lineWidth = 1 + depth * 1.2;
        for (const side of [-1, 1]) {
          ctx.beginPath();
          const inner = cx + side * g, outer = side < 0 ? -10 : W + 10;
          const n = 48;
          for (let k = 0; k <= n; k++) {
            const x = lerp(outer, inner, k / n);
            const near = Math.max(0, 1 - Math.abs(x - inner) / 70);
            const y = wv.y + Math.sin(x * wv.f + wv.ph + t * wv.sp) * wv.amp - lift * near * near;
            k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          }
          ctx.stroke();
          if (gapK > 0.05) {
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = gapK * (0.4 + 0.3 * Math.sin(t * 3 + i));
            const fy = wv.y - lift + Math.sin(inner * wv.f + wv.ph + t * wv.sp) * wv.amp;
            ctx.drawImage(sFoam, inner - 9, fy - 9, 18, 18);
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
          }
        }
      }
    }

    return {
      end: T + 1.5,
      draw(t) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // threads + nodes
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (const nd of nodes) {
          const p = clamp((t - nd.t0) / 0.9, 0, 1);
          if (p <= 0) continue;
          const k = Math.max(1, Math.round(easeOut(p) * (nd.pts.length - 1)));
          ctx.strokeStyle = locked ? 'rgba(160,160,170,.25)' : 'rgba(240,196,99,.5)';
          ctx.lineWidth = 1;
          if (locked) ctx.setLineDash([3, 5]);
          ctx.beginPath();
          ctx.moveTo(nd.pts[0][0], nd.pts[0][1]);
          for (let i = 1; i <= k; i++) ctx.lineTo(nd.pts[i][0], nd.pts[i][1]);
          ctx.stroke();
          ctx.setLineDash([]);
          const na = clamp((t - nd.t0) / 0.5, 0, 1);
          ctx.globalAlpha = na;
          ctx.fillStyle = locked ? 'rgba(160,160,170,.08)' : 'rgba(240,196,99,.1)';
          ctx.strokeStyle = locked ? 'rgba(160,160,170,.35)' : 'rgba(240,196,99,.55)';
          ctx.beginPath(); ctx.arc(nd.x, nd.y, ns * 0.85, 0, TAU); ctx.fill(); ctx.stroke();
          ctx.save();
          ctx.translate(nd.x, nd.y);
          ctx.strokeStyle = locked ? '#8f8f98' : '#f3cf7a';
          ctx.lineWidth = Math.max(1, ns * 0.07);
          SYMBOLS[nd.nm](ctx, ns);
          ctx.restore();
          ctx.globalAlpha = 1;
          if (!locked && t > nd.t0 + 1.2) {
            const u = ((t - nd.t0) * 0.4) % 1;
            const q = nd.pts[Math.floor(u * (nd.pts.length - 1))];
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = Math.sin(u * Math.PI);
            ctx.drawImage(sGold, q[0] - 8, q[1] - 8, 16, 16);
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
          }
        }

        // halo
        const hk = easeOut(clamp(t / 1.2, 0, 1));
        const hsz = hs * (0.86 + 0.14 * hk);
        ctx.globalAlpha = hk;
        if (!locked) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.drawImage(sGold, cx - Rh * 1.9, cy - Rh * 1.9, Rh * 3.8, Rh * 3.8);
          ctx.globalCompositeOperation = 'source-over';
        }
        ctx.drawImage(halo, cx - hsz / 2, cy - hsz / 2, hsz, hsz);
        if (!locked && t > 1) {
          // a slow sheen across the gold
          ctx.save();
          ctx.beginPath(); ctx.arc(cx, cy, Rh * 0.98, 0, TAU); ctx.clip();
          const sx = cx + Math.sin(t * 0.5) * Rh * 1.4;
          const sh = ctx.createLinearGradient(sx - Rh * 0.5, cy - Rh, sx + Rh * 0.5, cy + Rh);
          sh.addColorStop(0, 'rgba(255,255,255,0)');
          sh.addColorStop(0.5, 'rgba(255,250,225,.22)');
          sh.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = sh;
          ctx.fillRect(cx - Rh, cy - Rh, Rh * 2, Rh * 2);
          ctx.restore();
        }
        ctx.globalAlpha = 1;

        drawSea(t);

        // dust and number
        if (!locked) {
          ctx.globalCompositeOperation = 'lighter';
          for (const p of dust) {
            const k = easeInOut(clamp((t - p.d) / (T - p.d), 0, 1));
            if (k <= 0 || k >= 1) continue;
            const x = lerp(p.sx, p.tx, k) + Math.sin(p.w + t * 2) * (1 - k) * 14;
            const y = lerp(p.sy, p.ty, k);
            ctx.globalAlpha = Math.sin(k * Math.PI) * 0.9;
            ctx.drawImage(sGold, x - 4, y - 4, 8, 8);
          }
          ctx.globalCompositeOperation = 'source-over';
        }
        ctx.globalAlpha = locked ? 0.55 : clamp((t - (T - 0.7)) / 0.9, 0, 1);
        ctx.fillStyle = locked ? '#2a2a33' : '#0f1f5c';
        drawNumber(ctx, String(o.day), cx, cy, bw, bh);
        ctx.globalAlpha = 1;
      },
    };
  }

  /* --------------------------------------------------------------- CHURCH */
  function Church(ctx, W, H, o) {
    const R = rng(hash('K' + o.id));
    const locked = !!o.locked;
    const cx = W * (o.fx == null ? 0.5 : o.fx), cy = H * (o.fy == null ? 0.42 : o.fy);
    const Rr = Math.min(W * 0.36, H * 0.33);

    // Stone wall, painted once.
    const wall = makeCanvas(W, H), w = wall.getContext('2d');
    const wg = w.createLinearGradient(0, 0, 0, H);
    wg.addColorStop(0, '#161113'); wg.addColorStop(1, '#0a0708');
    w.fillStyle = wg; w.fillRect(0, 0, W, H);
    const bhgt = clamp(H / 14, 18, 40);
    for (let y = 0, row = 0; y < H; y += bhgt, row++) {
      for (let x = row % 2 ? -bhgt : 0; x < W; x += bhgt * 2.1) {
        w.fillStyle = `rgba(255,240,220,${0.012 + R() * 0.02})`;
        w.fillRect(x + 1, y + 1, bhgt * 2.1 - 2, bhgt - 2);
      }
    }
    const vg = w.createRadialGradient(cx, cy, Rr, cx, cy, Math.hypot(W, H) * 0.7);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)');
    w.fillStyle = vg; w.fillRect(0, 0, W, H);

    // Shards of the rose window.
    const PAL = {
      ruby: [178, 30, 42], cobalt: [30, 62, 170], emerald: [26, 122, 80], amber: [218, 146, 42], violet: [92, 42, 134], white: [236, 222, 192],
    };
    const rings = [
      { r0: 0.3, r1: 0.52, n: 8, pat: ['ruby', 'cobalt'] },
      { r0: 0.52, r1: 0.7, n: 16, pat: ['emerald', 'amber', 'ruby', 'amber'] },
      { r0: 0.7, r1: 0.86, n: 16, pat: ['cobalt', 'violet', 'cobalt', 'ruby'] },
      { r0: 0.86, r1: 1, n: 32, pat: ['ruby', 'cobalt', 'amber', 'cobalt'] },
    ];
    const shards = [];
    rings.forEach((rg, ri) => {
      const off = ri % 2 ? Math.PI / rg.n : 0;
      for (let j = 0; j < rg.n; j++) {
        const a0 = off + (j / rg.n) * TAU, a1 = off + ((j + 1) / rg.n) * TAU;
        const pts = [];
        for (let k = 0; k <= 6; k++) { const a = lerp(a0, a1, k / 6); pts.push([Math.cos(a) * rg.r1 * Rr, Math.sin(a) * rg.r1 * Rr]); }
        for (let k = 6; k >= 0; k--) { const a = lerp(a0, a1, k / 6); pts.push([Math.cos(a) * rg.r0 * Rr, Math.sin(a) * rg.r0 * Rr]); }
        const am = (a0 + a1) / 2, rm = ((rg.r0 + rg.r1) / 2) * Rr;
        const base = PAL[rg.pat[j % rg.pat.length]], v = 0.85 + R() * 0.3;
        shards.push({
          pts, am, mx: Math.cos(am) * rm, my: Math.sin(am) * rm,
          col: base.map((c) => c * v), delay: 0.25 + ri * 0.32 + R() * 0.35,
          dist: Rr * (0.5 + R() * 0.9), rot: (R() - 0.5) * 1.6,
        });
      }
    });

    // Candles of the martyrs.
    const nc = clamp(Math.round(W / 70), 4, 9);
    const candles = [];
    for (let i = 0; i < nc; i++) {
      const hgt = H * (0.05 + R() * 0.07);
      candles.push({ x: (W / (nc + 1)) * (i + 1) + (R() - 0.5) * 10, h: hgt, wd: 6 + R() * 5, ph: R() * TAU, lit: !locked || i === Math.floor(nc / 2) });
    }
    const sWarm = sprite('255,176,80'), sLight = sprite('255,236,200');
    const T = 2.4;

    return {
      end: T + 1.2,
      draw(t) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.drawImage(wall, 0, 0, W, H);
        const sun = t * 0.22;

        // light rays falling from the window
        if (!locked) {
          const ra = clamp((t - 1.6) / 1.5, 0, 1);
          if (ra > 0) {
            ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < 4; i++) {
              const sway = Math.sin(t * 0.3 + i) * Rr * 0.08;
              const x0 = cx + (i - 1.5) * Rr * 0.35, x1 = x0 + Rr * 0.9 + sway;
              const g = ctx.createLinearGradient(cx, cy, cx + Rr * 0.6, H);
              g.addColorStop(0, `rgba(255,226,170,${0.09 * ra})`);
              g.addColorStop(1, 'rgba(255,226,170,0)');
              ctx.fillStyle = g;
              ctx.beginPath();
              ctx.moveTo(x0 - Rr * 0.12, cy); ctx.lineTo(x0 + Rr * 0.12, cy);
              ctx.lineTo(x1 + Rr * 0.35, H); ctx.lineTo(x1 - Rr * 0.2, H); ctx.closePath(); ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';
          }
        }

        // stone ring around the window
        ctx.strokeStyle = '#2b231e';
        ctx.lineWidth = Rr * 0.09;
        ctx.beginPath(); ctx.arc(cx, cy, Rr * 1.05, 0, TAU); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,230,200,.08)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, cy, Rr * 1.1, 0, TAU); ctx.stroke();
        ctx.fillStyle = '#0c0909';
        ctx.beginPath(); ctx.arc(cx, cy, Rr * 1.01, 0, TAU); ctx.fill();

        // centre glass
        const ck = clamp((t - 0.1) / 0.6, 0, 1);
        ctx.globalAlpha = ck;
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Rr * 0.3);
        cg.addColorStop(0, locked ? '#4a443c' : '#fff6e0');
        cg.addColorStop(1, locked ? '#2f2b26' : '#d9c79f');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(cx, cy, Rr * 0.3, 0, TAU); ctx.fill();
        ctx.globalAlpha = 1;

        ctx.lineJoin = 'round';
        for (let i = 0; i < shards.length; i++) {
          const s = shards[i];
          const raw = clamp((t - s.delay) / 0.9, 0, 1);
          if (raw <= 0) continue;
          const p = easeBack(raw);
          const light = locked ? 0.22 : 0.62 + 0.38 * Math.max(0, Math.cos(s.am - sun)) + Math.sin(t * 2.3 + i) * 0.03;
          ctx.save();
          ctx.globalAlpha = clamp(raw * 3, 0, 1);
          ctx.translate(cx + Math.cos(s.am) * s.dist * (1 - p), cy + Math.sin(s.am) * s.dist * (1 - p));
          ctx.translate(s.mx, s.my); ctx.rotate(s.rot * (1 - p)); ctx.translate(-s.mx, -s.my);
          ctx.beginPath();
          ctx.moveTo(s.pts[0][0], s.pts[0][1]);
          for (let k = 1; k < s.pts.length; k++) ctx.lineTo(s.pts[k][0], s.pts[k][1]);
          ctx.closePath();
          ctx.fillStyle = `rgb(${Math.min(255, s.col[0] * light) | 0},${Math.min(255, s.col[1] * light) | 0},${Math.min(255, s.col[2] * light) | 0})`;
          ctx.fill();
          ctx.strokeStyle = '#120d0b';
          ctx.lineWidth = Math.max(1.5, Rr * 0.022);
          ctx.stroke();
          ctx.restore();
        }
        ctx.strokeStyle = '#120d0b';
        ctx.lineWidth = Math.max(1.5, Rr * 0.025);
        ctx.beginPath(); ctx.arc(cx, cy, Rr * 0.3, 0, TAU); ctx.stroke();

        if (!locked && t > T) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = clamp((t - T) / 1, 0, 1) * (0.16 + 0.05 * Math.sin(t * 0.9));
          ctx.drawImage(sLight, cx - Rr * 1.6, cy - Rr * 1.6, Rr * 3.2, Rr * 3.2);
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = 'source-over';
        }

        // number on the centre glass
        ctx.globalAlpha = ck;
        ctx.fillStyle = locked ? '#7a6c5c' : '#3a2414';
        drawNumber(ctx, String(o.day), cx, cy, Rr * 0.46, Rr * 0.36);
        ctx.globalAlpha = 1;

        // candles
        const baseY = H * 0.985;
        for (let i = 0; i < candles.length; i++) {
          const c = candles[i];
          const top = baseY - c.h;
          const bg2 = ctx.createLinearGradient(c.x - c.wd / 2, 0, c.x + c.wd / 2, 0);
          bg2.addColorStop(0, '#8d7b5f'); bg2.addColorStop(0.5, '#efe2c4'); bg2.addColorStop(1, '#9c8a6c');
          ctx.fillStyle = bg2;
          ctx.fillRect(c.x - c.wd / 2, top, c.wd, c.h);
          ctx.strokeStyle = '#2a1d12'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(c.x, top); ctx.lineTo(c.x, top - 4); ctx.stroke();
          if (!c.lit) continue;
          const fl = 1 + 0.09 * Math.sin(t * 11 + c.ph) + 0.05 * Math.sin(t * 17 + c.ph * 2);
          const fh = (12 + c.wd) * fl;
          const tip = Math.sin(t * 7 + c.ph) * 1.6 + Math.sin(t * 13 + c.ph) * 0.8;
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 0.55;
          ctx.drawImage(sWarm, c.x - 40, top - fh * 0.6 - 40, 80, 80);
          ctx.globalAlpha = 1;
          const fg = ctx.createRadialGradient(c.x, top - fh * 0.3, 0, c.x, top - fh * 0.35, fh * 0.6);
          fg.addColorStop(0, 'rgba(255,250,225,1)');
          fg.addColorStop(0.45, 'rgba(255,190,90,.9)');
          fg.addColorStop(1, 'rgba(255,120,40,0)');
          ctx.fillStyle = fg;
          ctx.beginPath();
          ctx.moveTo(c.x + tip, top - fh);
          ctx.bezierCurveTo(c.x + c.wd * 0.55, top - fh * 0.45, c.x + c.wd * 0.45, top - 1, c.x, top - 1);
          ctx.bezierCurveTo(c.x - c.wd * 0.45, top - 1, c.x - c.wd * 0.55, top - fh * 0.45, c.x + tip, top - fh);
          ctx.fill();
          for (let e = 0; e < 5; e++) {
            const u = (t * (0.18 + e * 0.03) + c.ph + e * 0.21) % 1;
            const ex = c.x + Math.sin(u * 9 + e + c.ph) * 7, ey = top - fh - u * H * 0.32;
            ctx.globalAlpha = (1 - u) * 0.7;
            ctx.drawImage(sWarm, ex - 2.5, ey - 2.5, 5, 5);
          }
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = 'source-over';
        }
      },
    };
  }

  const PERIODS = { God, Christ, Church };
  const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let fontsReady = null;
  function whenFonts() {
    if (!fontsReady) {
      fontsReady = document.fonts && document.fonts.load
        ? Promise.race([document.fonts.load(`100px ${FONT}`).catch(() => {}), new Promise((r) => setTimeout(r, 1800))])
        : Promise.resolve();
    }
    return fontsReady;
  }
  function factory(o) {
    return (window.Scenes.custom[o.id]) || PERIODS[o.period] || God;
  }

  function mount(canvas, o) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, scene = null, raf = 0, start = null, elapsed = 0, inView = true, stopped = false;
    const still = o.still || reduceMotion();

    function build() {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene = factory(o)(ctx, W, H, o);
      if (still) scene.draw(scene.end);
    }
    function frame(ts) {
      raf = 0;
      if (stopped || !inView || document.hidden) return;
      if (start == null) start = ts - elapsed * 1000;
      elapsed = (ts - start) / 1000;
      scene.draw(elapsed);
      raf = requestAnimationFrame(frame);
    }
    function wake() {
      if (still || stopped || raf || !inView || document.hidden) return;
      start = null;
      raf = requestAnimationFrame(frame);
    }
    const ro = new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect();
      if (Math.abs(r.width - W) > 1 || Math.abs(r.height - H) > 1) { build(); if (!still) scene.draw(elapsed); }
    });
    const io = new IntersectionObserver((es) => { inView = es[0].isIntersecting; if (inView) wake(); });
    const onVis = () => { if (!document.hidden) wake(); };

    whenFonts().then(() => {
      if (stopped) return;
      build();
      ro.observe(canvas);
      io.observe(canvas);
      document.addEventListener('visibilitychange', onVis);
      wake();
    });
    return {
      stop() {
        stopped = true;
        if (raf) cancelAnimationFrame(raf);
        ro.disconnect(); io.disconnect();
        document.removeEventListener('visibilitychange', onVis);
      },
    };
  }

  // Draw the final frame at the canvas's own pixel size (used for the WhatsApp preview images).
  function still(canvas, o) {
    return whenFonts().then(() => {
      const ctx = canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const s = factory(o)(ctx, canvas.width, canvas.height, o);
      s.draw(s.end);
    });
  }

  window.Scenes = { mount, still, custom: {} };
})();

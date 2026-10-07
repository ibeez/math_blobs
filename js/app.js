(() => {
  "use strict";

  // ---------- constants ----------
  const STORE_KEY = "mathblobs.v3";   // v3: student work kept apart from the answer keys; old saves are ignored
  const TYPES = window.MB_DEMO.linkTypes;
  const DEFAULT_TYPES = ["special", "needs", "same", "contrasts"];
  const FALLBACK_TYPE = { label: "linked to", back: "linked to", short: "linked", c: "#A8A294", w: 5, dash: null };
  const typeOf = (k) => TYPES[k] || FALLBACK_TYPE;
  const PALETTE = ["#E8705F", "#F2B544", "#3E8E8A", "#B9A5D6", "#2B3A55"];
  const EXTRA = "#DDD6C8";   // gray "extra" blobs: terms a student kept that are not in the lesson's chart
  const LIGHT = ["#F2B544", "#B9A5D6", EXTRA];
  const SHAPES = [
    "56% 44% 47% 53% / 48% 42% 58% 52%",
    "48% 52% 58% 42% / 54% 46% 54% 46%",
    "52% 48% 42% 58% / 46% 56% 44% 54%",
    "45% 55% 52% 48% / 58% 44% 56% 42%",
    "50% 50% 46% 54% / 52% 48% 52% 48%"
  ];
  const TOP = 78;            // board space kept clear for the search bar
  const GAP = 12;            // minimum air between blobs
  const FRICTION = 0.935;    // per frame; lower = stops sooner
  const BOUNCE = 0.55;
  const STRING_K = 0.018;    // pull of a connection stretched past its rest length
  const PUSH_K = 0.012;      // push of a connection squeezed shorter than its rest length
  const ROOM = 60;           // blobs closer than this (edge to edge) gently nudge each other apart
  const ROOM_K = 0.03;

  const $ = (s) => document.querySelector(s);
  const stage = $("#stage"), board = $("#board"), svg = $("#edges"), blobsEl = $("#blobs"), menuEl = $("#menu");
  const panel = $("#panel"), searchEl = $("#search"), resultsEl = $("#results"), ghostsEl = $("#ghosts");
  const noteEl = $("#note"), progressEl = $("#progress");
  const SVGNS = "http://www.w3.org/2000/svg";

  const inkFor = (c) => (LIGHT.includes(c) ? "#2B3A55" : "#fff");
  const shapeFor = (id) => { let h = 0; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return SHAPES[h % SHAPES.length]; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";

  // ---------- state ----------
  // S = { terms, maps, order, current, mode, work }
  //   maps: one answer key per lesson. work: the student's own map per lesson.
  //   mode: "student" (build your own map) or "key" (see and edit the answer key).
  let S;
  let W = 1000, H = 700, SC = 1;
  const view = { s: 1, x: 0, y: 0 };  // on-screen transform of the board
  const P = {};      // live positions for the current map: id -> {x, y, vx, vy, r}
  const REST = {};   // edge id -> rest length; connections act like springs (pull when long, push when short)
  let drag = null, press = null, connect = null, stack = [];
  let simOn = false;
  let revealOn = false;
  const G = {};      // ghost positions while the reveal is on: id -> {x, y, r}
  // Test mode (?test) switches off the hint features: summary, hint, show what's missing. Not saved.
  const TEST = new URLSearchParams(location.search).has("test");
  let summaryOn = false;
  const shown = new Set();   // terms revealed from the summary: they show as ghosts until dragged in

  function freshState() {
    const d = JSON.parse(JSON.stringify(window.MB_DEMO));
    let n = 1;
    for (const m of Object.values(d.maps)) m.edges.forEach((e) => (e.id = n++));
    d.current = d.order[0];
    d.mode = "student";
    d.work = {};
    return d;
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.maps && s.terms && s.order && s.maps[s.current] && s.work) return s;
      }
    } catch (e) { /* storage unavailable: fall back to the demo */ }
    return freshState();
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
  }
  const isKey = () => S.mode === "key";
  const lesson = () => S.maps[S.current];   // this lesson's answer key
  // The canvas being shown and edited: the answer key, or the student's own map.
  const map = () => (isKey() ? lesson() : (S.work[S.current] = S.work[S.current] || { blobs: [], edges: [] }));
  const blobIn = (m, id) => m.blobs.find((b) => b.id === id);
  const nextEdgeId = () => 1 + Math.max(0, ...[...Object.values(S.maps), ...Object.values(S.work)].flatMap((m) => m.edges.map((e) => e.id)));

  // ---------- answer key checks ----------
  const samePair = (a, b) => (a.from === b.from && a.to === b.to) || (a.from === b.to && a.to === b.from);
  // The key link a student's link counts as, if any (any tier; symmetric types match either way round).
  function keyMatch(e) {
    return lesson().edges.find((k) => k.type === e.type &&
      ((k.from === e.from && k.to === e.to) || (typeOf(k.type).symmetric && k.from === e.to && k.to === e.from))) || null;
  }
  const coreTerms = () => lesson().blobs.filter((b) => b.tier !== "valid");
  const foundIds = () => new Set(map().blobs.map((b) => b.id));
  // Core key links whose pair has no accepted student link yet (one per pair).
  function missedCoreLinks() {
    const w = map(), out = [];
    for (const k of lesson().edges) {
      if (k.tier === "valid" || out.some((o) => samePair(o, k))) continue;
      if (!w.edges.some((e) => samePair(e, k) && keyMatch(e))) out.push(k);
    }
    return out;
  }

  // ---------- layout ----------
  function layout() {
    const vw = window.innerWidth, vh = window.innerHeight;
    SC = clamp(Math.min(vw / 1150, vh / 760), 0.5, 1.15);
    W = vw / SC; H = vh / SC;
    board.style.width = W + "px";
    board.style.height = H + "px";
    applyView();
  }
  // With the detail panel open on a wide screen, shrink the board into the space left of it.
  function applyView() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const side = document.body.classList.contains("panel-open") && vw > 720 ? 340 : 0;
    view.s = SC * (vw - side) / vw;
    view.x = 0;
    view.y = (vh - H * view.s) / 2;
    board.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.s})`;
  }
  const toX = (u) => u * W;
  const toY = (v) => TOP + v * (H - TOP);
  function bounds(p) {
    return { x0: p.r + 6, x1: W - p.r - 6, y0: TOP - 10 + p.r, y1: H - p.r - 6 };
  }
  function placeFromData() {
    for (const k of Object.keys(P)) delete P[k];
    for (const k of Object.keys(REST)) delete REST[k];
    for (const b of map().blobs) {
      const p = { x: toX(b.u), y: toY(b.v), vx: 0, vy: 0, r: b.s / 2 };
      const bd = bounds(p);
      p.x = clamp(p.x, bd.x0, bd.x1); p.y = clamp(p.y, bd.y0, bd.y1);
      P[b.id] = p;
    }
  }
  function writeBack() {
    for (const b of map().blobs) {
      const p = P[b.id]; if (!p) continue;
      b.u = +(p.x / W).toFixed(4);
      b.v = +((p.y - TOP) / (H - TOP)).toFixed(4);
    }
    save();
  }
  function toWorld(e) { return { x: (e.clientX - view.x) / view.s, y: (e.clientY - view.y) / view.s }; }

  // ---------- rendering ----------
  function renderMap() {
    blobsEl.innerHTML = "";
    svg.innerHTML = "";
    const m = map();
    for (const e of m.edges) svg.appendChild(edgeEl(e));
    const temp = document.createElementNS(SVGNS, "line");
    temp.id = "tempEdge"; temp.setAttribute("stroke-linecap", "round"); temp.setAttribute("opacity", "0.75"); temp.style.display = "none";
    svg.appendChild(temp);
    for (const b of m.blobs) blobsEl.appendChild(blobEl(b));
    renderGhosts();
    renderSummary();
    if (!m.blobs.length) {
      const empty = document.createElement("div");
      empty.className = "empty-note";
      empty.style.cssText = "position:absolute;left:24px;right:24px;top:50%;transform:translateY(-50%);text-align:center;font:500 16px Outfit,system-ui,sans-serif;color:#A8A294";
      empty.textContent = isKey() ? "This map is empty. Press + to add a term." : "Type a term you think belongs in this lesson, then press Enter.";
      blobsEl.appendChild(empty);
    }
    renderChip();
    renderProgress();
    draw();
  }
  function blobEl(b) {
    const el = document.createElement("div");
    el.className = "blob" + (S.terms[b.id].extra ? " extra" : "");
    el.dataset.id = b.id;
    el.style.setProperty("--c", b.c);
    el.textContent = S.terms[b.id].name;
    el.style.width = el.style.height = b.s + "px";
    el.style.background = b.c;
    el.style.color = inkFor(b.c);
    el.style.borderRadius = shapeFor(b.id);
    const longest = Math.max(...S.terms[b.id].name.split(/\s+/).map((w) => w.length));
    el.style.fontSize = Math.min(b.s >= 100 ? 16 : b.s >= 84 ? 15 : 13.5, (b.s - 24) / (longest * 0.62)).toFixed(1) + "px";
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", S.terms[b.id].name);
    return el;
  }
  function edgeEl(e) {
    const t = typeOf(e.type);
    const l = document.createElementNS(SVGNS, "line");
    l.dataset.edge = e.id;
    l.setAttribute("stroke", t.c);
    l.setAttribute("stroke-width", t.w);
    l.setAttribute("stroke-linecap", "round");
    if (t.dash) l.setAttribute("stroke-dasharray", t.dash);
    if (isKey() && e.tier === "valid") l.setAttribute("opacity", "0.4");
    return l;
  }
  // Reveal: ghost blobs for core terms not found yet, dashed lines for core links not drawn yet.
  function renderGhosts() {
    ghostsEl.innerHTML = "";
    for (const k of Object.keys(G)) delete G[k];
    for (const l of svg.querySelectorAll(".ghost-edge")) l.remove();
    if (isKey()) return;
    const found = foundIds();
    for (const b of coreTerms()) {
      if (found.has(b.id) || !(revealOn || shown.has(b.id))) continue;
      const g = { x: toX(b.u), y: toY(b.v), r: b.s / 2 };
      G[b.id] = g;
      const el = document.createElement("div");
      el.className = "ghost";
      el.dataset.id = b.id;
      el.textContent = S.terms[b.id].name;
      el.title = "Drag it onto your map";
      el.style.cssText = `width:${b.s}px;height:${b.s}px;border-radius:${shapeFor(b.id)};--c:${b.c};transform:translate(${g.x - g.r}px,${g.y - g.r}px)`;
      ghostsEl.appendChild(el);
    }
    const first = svg.firstChild;
    for (const k of revealOn ? missedCoreLinks() : []) {
      const t = typeOf(k.type), l = document.createElementNS(SVGNS, "line");
      l.classList.add("ghost-edge");
      l.dataset.from = k.from; l.dataset.to = k.to;
      l.setAttribute("stroke", t.c); l.setAttribute("stroke-width", 4);
      l.setAttribute("stroke-dasharray", "8 9"); l.setAttribute("stroke-linecap", "round");
      svg.insertBefore(l, first);
    }
  }
  function draw() {
    for (const el of blobsEl.children) {
      const p = P[el.dataset.id]; if (!p) continue;
      el.style.transform = `translate(${p.x - p.r}px, ${p.y - p.r}px)`;
    }
    for (const l of svg.querySelectorAll("line[data-edge]")) {
      const e = map().edges.find((x) => x.id == l.dataset.edge);
      const a = e && P[e.from], b = e && P[e.to];
      if (!a || !b) continue;
      l.setAttribute("x1", a.x); l.setAttribute("y1", a.y);
      l.setAttribute("x2", b.x); l.setAttribute("y2", b.y);
    }
    for (const l of svg.querySelectorAll(".ghost-edge")) {
      const a = P[l.dataset.from] || G[l.dataset.from], b = P[l.dataset.to] || G[l.dataset.to];
      if (!a || !b) { l.style.display = "none"; continue; }
      l.style.display = "";
      l.setAttribute("x1", a.x); l.setAttribute("y1", a.y);
      l.setAttribute("x2", b.x); l.setAttribute("y2", b.y);
    }
    const temp = $("#tempEdge");
    if (temp) {
      if (connect && connect.type && connect.cursor) {
        const t = typeOf(connect.type), a = P[connect.from];
        temp.style.display = "";
        temp.setAttribute("stroke", t.c); temp.setAttribute("stroke-width", t.w);
        if (t.dash) temp.setAttribute("stroke-dasharray", t.dash); else temp.removeAttribute("stroke-dasharray");
        temp.setAttribute("x1", a.x); temp.setAttribute("y1", a.y);
        temp.setAttribute("x2", connect.cursor.x); temp.setAttribute("y2", connect.cursor.y);
      } else temp.style.display = "none";
    }
  }
  const blobNode = (id) => blobsEl.querySelector(`.blob[data-id="${CSS.escape(id)}"]`);
  function edgeFx(edgeId, cls) {
    const l = svg.querySelector(`line[data-edge="${edgeId}"]`); if (!l) return;
    l.classList.add(cls);
    l.addEventListener("animationend", () => l.classList.remove(cls), { once: true });
  }
  function flash(id, cls) {
    const el = blobNode(id); if (!el) return;
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    el.addEventListener("animationend", () => el.classList.remove(cls), { once: true });
  }

  // ---------- physics: momentum, soft collisions, edge bounce ----------
  function startSim() {
    if (simOn) return;
    simOn = true;
    requestAnimationFrame(tick);
  }
  function tick() {
    const ids = Object.keys(P);
    let active = !!drag;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = P[ids[i]], b = P[ids[j]];
        let dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
        const room = a.r + b.r + ROOM;
        if (d < room && d > 0.01) {
          const f = ROOM_K * (room - d) / ROOM, nx0 = dx / d, ny0 = dy / d;
          if (!(drag && drag.id === ids[i])) { a.vx -= nx0 * f; a.vy -= ny0 * f; }
          if (!(drag && drag.id === ids[j])) { b.vx += nx0 * f; b.vy += ny0 * f; }
        }
        const min = a.r + b.r + GAP;
        if (d >= min) continue;
        if (d < 0.01) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d = Math.hypot(dx, dy); }
        const push = (min - d), nx = dx / d, ny = dy / d;
        const aFixed = drag && drag.id === ids[i], bFixed = drag && drag.id === ids[j];
        const sa = aFixed ? 0 : bFixed ? 1 : 0.5, sb = bFixed ? 0 : aFixed ? 1 : 0.5;
        a.x -= nx * push * sa * 0.5; a.y -= ny * push * sa * 0.5;
        b.x += nx * push * sb * 0.5; b.y += ny * push * sb * 0.5;
        if (push > 0.5) active = true;
      }
    }
    for (const e of map().edges) {
      const a = P[e.from], b = P[e.to];
      if (!a || !b) continue;
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
      if (REST[e.id] == null) REST[e.id] = clamp(d, a.r + b.r + 40, 340);
      const stretch = d - REST[e.id];
      const f = stretch * (stretch > 0 ? STRING_K : PUSH_K), nx = dx / d, ny = dy / d;
      const aFixed = drag && drag.id === e.from, bFixed = drag && drag.id === e.to;
      if (!aFixed) { a.vx += nx * f; a.vy += ny * f; }
      if (!bFixed) { b.vx -= nx * f; b.vy -= ny * f; }
    }
    for (const id of ids) {
      const p = P[id];
      if (drag && drag.id === id) continue;
      p.x += p.vx; p.y += p.vy;
      p.vx *= FRICTION; p.vy *= FRICTION;
      const bd = bounds(p);
      if (p.x < bd.x0) { p.x = bd.x0; p.vx = Math.abs(p.vx) * BOUNCE; }
      if (p.x > bd.x1) { p.x = bd.x1; p.vx = -Math.abs(p.vx) * BOUNCE; }
      if (p.y < bd.y0) { p.y = bd.y0; p.vy = Math.abs(p.vy) * BOUNCE; }
      if (p.y > bd.y1) { p.y = bd.y1; p.vy = -Math.abs(p.vy) * BOUNCE; }
      if (Math.hypot(p.vx, p.vy) > 0.04) active = true; else { p.vx = 0; p.vy = 0; }
    }
    draw();
    if (connect && !connect.type) placeMenu();
    if (active) requestAnimationFrame(tick);
    else { simOn = false; writeBack(); }
  }

  // ---------- pointer: drag, click, long-press ----------
  stage.addEventListener("pointerdown", (e) => {
    const el = e.target.closest(".blob");
    const puck = e.target.closest(".puck");
    const ghost = e.target.closest(".ghost");
    closeResults();
    if (puck) return;                      // handled by the puck itself
    if (ghost && e.button === 0 && !connect) { pullGhost(ghost.dataset.id, e); return; }
    if (!el) {                              // blank canvas
      if (connect) closeConnect();
      else if (e.button === 0 && panel.classList.contains("open")) closePanel();
      return;
    }
    if (e.button !== 0) return;
    const id = el.dataset.id;
    if (connect && connect.type) {          // choosing a target
      if (id !== connect.from) finishConnect(id);
      return;
    }
    beginPress(el, e);
  });
  function beginPress(el, e) {
    const id = el.dataset.id, w = toWorld(e), p = P[id];
    press = { id, el, sx: e.clientX, sy: e.clientY, ox: w.x - p.x, oy: w.y - p.y, moved: false, long: false, samples: [] };
    // hold still on a blob to open the connect menu (mouse, touch or pen)
    el.classList.add("holding");
    press.timer = setTimeout(() => {
      if (press && !press.moved) { press.long = true; el.classList.remove("holding"); openConnect(id); }
    }, 500);
    el.setPointerCapture(e.pointerId);
  }
  // Pull a ghost in: it becomes the student's own blob, already in hand.
  function pullGhost(id, e) {
    const k = blobIn(lesson(), id), g = G[id];
    if (!k || !g) return;
    map().blobs.push({ id, u: g.x / W, v: (g.y - TOP) / (H - TOP), s: k.s, c: k.c });
    P[id] = { x: g.x, y: g.y, r: g.r, vx: 0, vy: 0 };
    save();
    renderMap();
    const el = blobNode(id);
    if (el) beginPress(el, e);
  }

  window.addEventListener("pointermove", (e) => {
    if (connect && connect.type) { connect.cursor = toWorld(e); draw(); }
    if (!press) return;
    if (press.long) {   // still holding after the menu opened: slide onto a type, then on to a target
      const under = document.elementFromPoint(e.clientX, e.clientY);
      const puck = under && under.closest(".puck");
      if (puck) chooseType(puck.dataset.type, e);
      return;
    }
    if (!press.moved && Math.hypot(e.clientX - press.sx, e.clientY - press.sy) < 5) return;
    if (!press.moved) {
      press.moved = true; clearTimeout(press.timer); press.el.classList.remove("holding");
      if (connect) closeConnect();
      drag = { id: press.id };
      press.el.classList.add("dragging");
      startSim();
    }
    const w = toWorld(e), p = P[press.id], bd = bounds(p);
    p.x = clamp(w.x - press.ox, bd.x0, bd.x1);
    p.y = clamp(w.y - press.oy, bd.y0, bd.y1);
    const now = performance.now();
    press.samples.push({ t: now, x: p.x, y: p.y });
    while (press.samples.length > 2 && now - press.samples[0].t > 90) press.samples.shift();
  });

  window.addEventListener("pointerup", (e) => {
    if (connect && connect.type && connect.dragging) {   // released a drag that started on a puck
      connect.dragging = false;
      const t = document.elementFromPoint(e.clientX, e.clientY);
      const el = t && t.closest(".blob");
      if (el && el.dataset.id !== connect.from) {
        if (press) { clearTimeout(press.timer); press.el.classList.remove("holding"); press = null; }
        finishConnect(el.dataset.id);
        return;
      }
    }
    if (!press) return;
    const pr = press; press = null;
    clearTimeout(pr.timer);
    pr.el.classList.remove("holding");
    if (pr.moved) {
      pr.el.classList.remove("dragging");
      const s = pr.samples, p = P[pr.id];
      if (s.length >= 2) {
        const a = s[0], b = s[s.length - 1], dt = Math.max(8, b.t - a.t);
        const recent = performance.now() - b.t < 80;
        p.vx = recent ? clamp((b.x - a.x) / dt * 16.7, -45, 45) : 0;
        p.vy = recent ? clamp((b.y - a.y) / dt * 16.7, -45, 45) : 0;
      }
      drag = null;
      startSim();
      return;
    }
    if (pr.long) return;
    if (connect) closeConnect();
    openTerm(pr.id, { fresh: true });
  });

  stage.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const el = e.target.closest(".blob");
    if (!el && connect) closeConnect();
  });

  blobsEl.addEventListener("keydown", (e) => {
    const el = e.target.closest(".blob"); if (!el) return;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openTerm(el.dataset.id, { fresh: true }); }
    if (e.key === "c") openConnect(el.dataset.id);
  });

  // ---------- connecting ----------
  function openConnect(id) {
    connect = { from: id, type: null, cursor: null };
    flash(id, "wiggle");
    menuEl.innerHTML = "";
    (lesson().types || DEFAULT_TYPES).filter((k) => TYPES[k]).forEach((k, i) => {
      const t = TYPES[k];
      const b = document.createElement("button");
      b.className = "puck";
      b.dataset.type = k;
      b.style.animationDelay = i * 45 + "ms";
      b.innerHTML = `<span class="dot" style="background:${t.c}"></span>${t.short}`;
      b.title = t.label;
      b.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        e.stopPropagation(); e.preventDefault();
        chooseType(k, e);
      });
      menuEl.appendChild(b);
    });
    placeMenu();
  }
  // Pick a connection type; the line then follows the pointer to a target blob.
  function chooseType(k, e) {
    if (!connect || connect.type === k) return;
    const t = TYPES[k];
    connect.type = k;
    connect.dragging = true;
    connect.cursor = toWorld(e);
    for (const o of menuEl.children) o.style.boxShadow = o.dataset.type === k ? `0 0 0 3px ${t.c}` : "";
    for (const el of blobsEl.querySelectorAll(".blob")) el.classList.toggle("target", el.dataset.id !== connect.from);
    draw();
  }
  function placeMenu() {
    if (!connect) return;
    const c = P[connect.from]; if (!c) return;
    const pucks = [...menuEl.children];
    const sizes = pucks.map((p) => ({ w: p.offsetWidth || 100, h: 34 }));
    const others = Object.entries(P).filter(([k]) => k !== connect.from).map(([, p]) => p);
    let best = null;
    for (const extra of [34, 46, 60]) {
      const step = 360 / Math.max(1, sizes.length);
      for (let rot = 0; rot < step; rot += 6) {
        const rects = sizes.map((s, i) => {
          const a = (rot + step / 2 + i * step) * Math.PI / 180;
          const rad = c.r + extra + Math.abs(Math.cos(a)) * (s.w / 2 - 17);
          const x = c.x + Math.cos(a) * rad - s.w / 2, y = c.y + Math.sin(a) * rad - s.h / 2;
          return { x, y, w: s.w, h: s.h };
        });
        let cost = 0;
        for (const r of rects) {
          if (r.x < 8 || r.y < TOP - 8 || r.x + r.w > W - 8 || r.y + r.h > H - 60) cost += 5000;
          for (const o of others) {
            const ox = Math.max(0, Math.min(r.x + r.w, o.x + o.r) - Math.max(r.x, o.x - o.r));
            const oy = Math.max(0, Math.min(r.y + r.h, o.y + o.r) - Math.max(r.y, o.y - o.r));
            cost += ox * oy;
          }
        }
        cost += extra;
        if (!best || cost < best.cost) best = { cost, rects };
      }
    }
    best.rects.forEach((r, i) => { pucks[i].style.left = r.x + "px"; pucks[i].style.top = r.y + "px"; });
  }
  function finishConnect(to) {
    const { from, type } = connect;
    const m = map();
    m.edges = m.edges.filter((e) => !((e.from === from && e.to === to) || (e.from === to && e.to === from)));
    const edge = { id: nextEdgeId(), from, to, type };
    m.edges.push(edge);
    save();
    closeConnect();
    renderMap();
    // Feedback is a response, not a grade: a link that is not in the key wobbles but stays.
    if (!isKey() && !keyMatch(edge)) {
      edgeFx(edge.id, "edge-wobble");
      say("Not in the reference chart. It stays on your map.");
    } else {
      edgeFx(edge.id, "edge-ok");
      flash(to, "pulse");
    }
    if (panel.classList.contains("open")) renderPanel();
  }
  function closeConnect() {
    connect = null;
    menuEl.innerHTML = "";
    for (const el of blobsEl.querySelectorAll(".target")) el.classList.remove("target");
    draw();
  }

  // ---------- detail panel ----------
  function openTerm(id, opts = {}) {
    const entry = { term: id, map: S.current };
    if (opts.fresh) stack = [entry];
    else stack.push(entry);
    renderPanel();
    panel.classList.add("open");
    document.body.classList.add("panel-open");
    applyView();
    if (blobIn(map(), id) && opts.pulse) flash(id, "pulse");
  }
  function closePanel() {
    panel.classList.remove("open");
    document.body.classList.remove("panel-open");
    applyView();
    stack = [];
    markSelected(null);
  }
  function markSelected(id) {
    for (const el of blobsEl.querySelectorAll(".blob")) el.classList.toggle("selected", el.dataset.id === id);
  }
  function defHTML(def) {
    const m = map();
    return esc(def).replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (all, id, text) => {
      const t = S.terms[id];
      if (!t) return text || id;
      const on = !!blobIn(m, id);
      if (!on && !isKey() && blobIn(lesson(), id)) return text || esc(inline(t.name));   // keep recall honest
      return `<span class="term${on ? "" : " off"}" role="link" tabindex="0" data-term="${esc(id)}" title="${on ? "on this map" : "from " + esc(S.maps[t.home] ? S.maps[t.home].title : "another map")}">${text || esc(inline(t.name))}</span>`;
    });
  }
  // "Field" reads as "field" mid-sentence; acronyms like "GCD" stay as they are
  const inline = (name) => (/^[A-Z][a-z]/.test(name) ? name[0].toLowerCase() + name.slice(1) : name);
  function renderPanel() {
    const entry = stack[stack.length - 1];
    if (!entry) return;
    const id = entry.term, t = S.terms[id], m = map();
    const b = blobIn(m, id);
    markSelected(b ? id : null);
    const color = b ? b.c : "#E7DFCF";
    const extra = !!t.extra;
    let h = "";
    if (stack.length > 1) {
      const prev = stack[stack.length - 2];
      const label = prev.map !== entry.map ? S.maps[prev.map].title : S.terms[prev.term].name;
      h += `<button class="back" data-act="back">← ${esc(label)}</button>`;
    }
    h += `<div class="p-head"><div class="p-swatch" style="background:${color};border-radius:${shapeFor(id)}"></div>
      <div class="p-title">${esc(t.name)}</div><button class="x" data-act="close" aria-label="Close">✕</button></div>`;
    if (!b && S.maps[t.home]) h += `<div class="p-from">from ${esc(S.maps[t.home].title)}</div>`;
    h += extra
      ? `<p class="p-def"><span class="p-empty">Not in this lesson's chart. You kept it as an extra.</span></p>`
      : `<p class="p-def">${t.def ? defHTML(t.def) : '<span class="p-empty">No definition yet.</span>'}</p>`;

    if (t.prereqs && t.prereqs.length) {
      h += `<div class="p-label">PREREQUISITES</div><div class="chips">`;
      for (const pm of t.prereqs) {
        if (!S.maps[pm]) continue;
        h += pm === S.current
          ? `<span class="chip here" title="you are here">${esc(S.maps[pm].title)}</span>`
          : `<button class="chip" data-map="${esc(pm)}">${esc(S.maps[pm].title)}</button>`;
      }
      h += `</div>`;
    }

    const elsewhere = S.order.filter((k) => k !== S.current && blobIn(S.maps[k], id));
    if (elsewhere.length) {
      h += `<div class="p-label">ALSO ON</div><div class="chips">`;
      for (const k of elsewhere) h += `<button class="chip" data-map="${esc(k)}">${esc(S.maps[k].title)}</button>`;
      h += `</div>`;
    }

    if (b) {
      const es = m.edges.filter((e) => e.from === id || e.to === id);
      h += `<div class="p-label">${es.length} CONNECTION${es.length === 1 ? "" : "S"}</div><div class="conns">`;
      if (!es.length) h += `<div class="p-empty">Press and hold the blob, or use “connect…”, to link it to another term.</div>`;
      for (const e of es) {
        const ty = typeOf(e.type), out = e.from === id, other = out ? e.to : e.from;
        const [on, off] = ty.dash ? ty.dash.split(" ").map(Number) : [0, 0];
        const seg = on < 3 ? 4 : Math.min(9, on * 0.6), gap = on < 3 ? 5 : Math.min(7, off * 0.5);
        const swatch = ty.dash
          ? `background-image:repeating-linear-gradient(90deg,${ty.c} 0 ${seg}px,transparent ${seg}px ${seg + gap}px)`
          : `background:${ty.c}`;
        h += `<div class="conn"><div class="swatch" style="height:${ty.w > 8 ? 8 : 5}px;${swatch}"></div>
          <div class="txt"><div class="lbl">${out ? ty.label : ty.back}</div>
          <div class="oth">${out ? "→" : "←"} <button data-term="${esc(other)}">${esc(S.terms[other].name)}</button></div>
          ${!isKey() && !keyMatch(e) ? '<div class="oth">not in the reference chart</div>' : ""}</div>
          ${isKey() ? `<button class="tier${e.tier === "valid" ? " valid" : ""}" data-tier="${e.id}" title="Core links appear in the reveal; valid links are accepted but never revealed">${e.tier === "valid" ? "valid" : "core"}</button>` : ""}
          <button class="x rm" data-edge="${e.id}" aria-label="Remove connection" title="Remove">✕</button></div>`;
      }
      h += `</div><div class="p-actions"><button class="pill-btn" data-act="connect">connect…</button>
        <button class="pill-btn" data-act="remove">remove from map</button></div>`;
    } else if (isKey()) {
      h += `<div class="p-actions"><button class="pill-btn" data-act="add-here">add to ${esc(lesson().title)}</button></div>`;
    }
    panel.innerHTML = h;
  }

  panel.addEventListener("click", (e) => {
    const termEl = e.target.closest("[data-term]");
    const mapEl = e.target.closest("[data-map]");
    const act = e.target.closest("[data-act]");
    const rm = e.target.closest("[data-edge]");
    const tier = e.target.closest("[data-tier]");
    const cur = stack[stack.length - 1];
    if (tier) {
      const edge = map().edges.find((x) => x.id == tier.dataset.tier);
      if (edge) { if (edge.tier === "valid") delete edge.tier; else edge.tier = "valid"; }
      save(); renderMap(); renderPanel();
    } else if (termEl) {
      const id = termEl.dataset.term;
      openTerm(id);
      if (blobIn(map(), id)) flash(id, "pulse");
    } else if (mapEl) {
      const target = mapEl.dataset.map, id = cur.term;
      switchMap(target, { keepPanel: true });
      stack.push({ term: id, map: target });
      renderPanel();
      if (blobIn(map(), id)) flash(id, "pulse");
    } else if (rm) {
      map().edges = map().edges.filter((x) => x.id != rm.dataset.edge);
      save(); renderMap(); renderPanel();
    } else if (act) {
      const a = act.dataset.act;
      if (a === "close") closePanel();
      else if (a === "back") {
        stack.pop();
        const prev = stack[stack.length - 1];
        if (prev.map !== S.current) switchMap(prev.map, { keepPanel: true });
        renderPanel();
        if (blobIn(map(), prev.term)) flash(prev.term, "pulse");
      } else if (a === "connect") openConnect(cur.term);
      else if (a === "remove") {
        const m = map(), id = cur.term;
        m.blobs = m.blobs.filter((b) => b.id !== id);
        m.edges = m.edges.filter((x) => x.from !== id && x.to !== id);
        delete P[id];
        save(); closePanel(); renderMap();
      } else if (a === "add-here") {
        addBlob(cur.term, PALETTE[map().blobs.length % PALETTE.length]);
        renderPanel();
      }
    }
  });
  panel.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".term")) { e.preventDefault(); e.target.click(); }
  });

  // ---------- maps ----------
  // Map history: every switch is a browser history entry (#map-id), so the
  // back button and the browser's own back both return to the previous map.
  const mapTrail = [];
  function renderBack() {
    const btn = $("#backBtn"), prev = mapTrail[mapTrail.length - 1];
    btn.hidden = !prev;
    if (prev) $("#backLabel").textContent = S.maps[prev] ? S.maps[prev].title : "back";
  }
  $("#backBtn").addEventListener("click", () => history.back());
  window.addEventListener("popstate", () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!S.maps[id] || id === S.current) return;
    if (mapTrail[mapTrail.length - 1] === id) mapTrail.pop(); else mapTrail.push(S.current);
    switchMap(id, { fromHistory: true });
  });
  function switchMap(id, opts = {}) {
    if (!S.maps[id]) return;
    if (!opts.fromHistory && id !== S.current) {
      mapTrail.push(S.current);
      history.pushState(null, "", "#" + encodeURIComponent(id));
    }
    if (simOn) writeBack();
    if (connect) closeConnect();
    S.current = id;
    save();
    placeFromData();
    renderMap();
    if (!opts.keepPanel) closePanel();
    hideNote();
    applySearchFade();
    renderBack();
  }
  function renderChip() {
    const m = lesson();
    $("#chipTitle").textContent = m.title;
    $("#chipDot").style.background = m.blobs[0] ? m.blobs[0].c : "#E7DFCF";
  }
  function renderGrid() {
    const cards = $("#mapCards");
    cards.innerHTML = "";
    for (const id of S.order) {
      const m = S.maps[id];
      const dots = m.blobs.slice(0, 3).map((b) => `<span class="dot" style="background:${b.c}"></span>`).join("");
      const core = m.blobs.filter((b) => b.tier !== "valid"), mine = S.work[id] ? S.work[id].blobs : [];
      const count = isKey()
        ? `${m.blobs.length} blob${m.blobs.length === 1 ? "" : "s"}`
        : `${core.filter((b) => mine.some((x) => x.id === b.id)).length} of ${core.length} found`;
      const btn = document.createElement("button");
      btn.className = "map-card" + (id === S.current ? " active" : "");
      btn.innerHTML = `<span class="dots">${dots || '<span class="dot" style="background:#E7DFCF"></span>'}</span>
        <span class="t">${esc(m.title)}</span><span class="n">${count}</span>`;
      btn.addEventListener("click", () => { toggleGrid(false); switchMap(id); });
      cards.appendChild(btn);
    }
    for (const b of $("#mapGrid").querySelectorAll("[data-mode]")) b.setAttribute("aria-pressed", String(b.dataset.mode === S.mode));
    if (!isKey()) return;   // new lessons are made in answer-key mode
    const nw = document.createElement("button");
    nw.className = "map-card new";
    nw.textContent = "+ new map";
    nw.addEventListener("click", () => {
      if (nw.querySelector("input")) return;
      nw.innerHTML = `<input type="text" placeholder="Map name" maxlength="40" aria-label="New map name">`;
      const inp = nw.querySelector("input");
      inp.focus();
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && inp.value.trim()) {
          let id = slug(inp.value), n = 2;
          while (S.maps[id]) id = slug(inp.value) + "-" + n++;
          S.maps[id] = { title: inp.value.trim(), types: DEFAULT_TYPES.slice(), blobs: [], edges: [] };
          S.order.push(id);
          toggleGrid(false);
          switchMap(id);
        } else if (e.key === "Escape") { e.stopPropagation(); renderGrid(); }
      });
    });
    cards.appendChild(nw);
  }
  function toggleGrid(force) {
    const grid = $("#mapGrid");
    const open = force === undefined ? grid.hidden : force;
    if (open) renderGrid();
    grid.hidden = !open;
    $("#mapChip").setAttribute("aria-expanded", String(open));
  }
  $("#mapChip").addEventListener("click", () => toggleGrid());
  $("#gridClose").addEventListener("click", () => toggleGrid(false));

  // ---------- adding terms ----------
  let addColor = PALETTE[0];
  const addLayer = $("#addLayer"), addName = $("#addName"), addDef = $("#addDef"), preview = $("#addPreview");
  function openAdd() {
    addColor = PALETTE[map().blobs.length % PALETTE.length];
    addName.value = ""; addDef.value = "";
    renderSwatches(); updatePreview();
    addLayer.hidden = false;
    addName.focus();
  }
  function closeAdd() { addLayer.hidden = true; }
  function renderSwatches() {
    const box = $("#swatches");
    box.innerHTML = "";
    for (const c of PALETTE) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "swatch-btn";
      b.style.background = c; b.style.setProperty("--c", c);
      b.setAttribute("aria-pressed", String(c === addColor));
      b.setAttribute("aria-label", "Colour " + c);
      b.addEventListener("click", () => { addColor = c; renderSwatches(); updatePreview(); });
      box.appendChild(b);
    }
  }
  function updatePreview() {
    preview.textContent = addName.value.trim() || "Name";
    preview.style.background = addColor;
    preview.style.color = inkFor(addColor);
  }
  addName.addEventListener("input", updatePreview);
  $("#addBtn").addEventListener("click", () => {
    if (isKey()) return openAdd();
    if (searchEl.value.trim()) summon(searchEl.value);
    else { searchEl.focus(); say("Type a term, then press Enter or +."); }
  });
  addLayer.addEventListener("click", (e) => { if (e.target === addLayer || e.target.closest("[data-cancel]")) closeAdd(); });
  $("#addForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = addName.value.trim();
    if (!name) return;
    const def = addDef.value.trim();
    let id = Object.keys(S.terms).find((k) => S.terms[k].name.toLowerCase() === name.toLowerCase());
    if (id) {
      if (def) S.terms[id].def = autoLink(def, id);
    } else {
      id = slug(name); let n = 2;
      while (S.terms[id]) id = slug(name) + "-" + n++;
      S.terms[id] = { name, def: autoLink(def, id), home: S.current, prereqs: [] };
    }
    closeAdd();
    if (!blobIn(map(), id)) addBlob(id, addColor);
    openTerm(id, { fresh: true });
  });
  function autoLink(text, selfId) {
    const names = Object.entries(S.terms).filter(([k, t]) => k !== selfId && t.name.length > 2)
      .sort((a, b) => b[1].name.length - a[1].name.length);
    let parts = [esc0(text)];
    for (const [k, t] of names) {
      const re = new RegExp("\\b(" + t.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "s?)\\b", "i");
      let done = false;
      parts = parts.flatMap((seg) => {
        if (done || seg.startsWith("[[")) return [seg];
        const m = seg.match(re);
        if (!m) return [seg];
        done = true;
        return [seg.slice(0, m.index), `[[${k}|${m[1]}]]`, seg.slice(m.index + m[1].length)];
      });
    }
    return parts.join("");
  }
  const esc0 = (s) => s.replace(/\[\[|\]\]/g, "");
  function addBlob(id, color, s = 84) {
    const m = map();
    const cx = W / 2 + (Math.random() - 0.5) * 160, cy = TOP + (H - TOP) / 2 + (Math.random() - 0.5) * 120;
    m.blobs.push({ id, u: cx / W, v: (cy - TOP) / (H - TOP), s, c: color });
    P[id] = { x: cx, y: cy, r: s / 2, vx: (Math.random() - 0.5) * 9, vy: (Math.random() - 0.5) * 9 };
    save();
    renderMap();
    flash(id, "enter");
    startSim();
  }

  // ---------- search ----------
  let hits = [], hitIdx = 0;
  function runSearch() {
    hideNote();
    if (!isKey()) return;          // students summon by typing; no list to pick from
    const q = searchEl.value.trim().toLowerCase();
    applySearchFade();
    if (!q) { closeResults(); return; }
    const m = map();
    hits = Object.entries(S.terms)
      .filter(([, t]) => !t.extra && t.name.toLowerCase().includes(q))
      .map(([id, t]) => ({ id, t, on: !!blobIn(m, id), starts: t.name.toLowerCase().startsWith(q) }))
      .sort((a, b) => (b.on - a.on) || (b.starts - a.starts) || a.t.name.localeCompare(b.t.name))
      .slice(0, 8);
    hitIdx = 0;
    renderResults();
  }
  function renderResults() {
    resultsEl.innerHTML = hits.length ? "" : `<div class="result-empty">No term matches. Press + to add it.</div>`;
    hits.forEach((h, i) => {
      const b = blobIn(map(), h.id);
      const c = b ? b.c : (Object.values(S.maps).map((m) => blobIn(m, h.id)).find(Boolean) || { c: "#E7DFCF" }).c;
      const where = h.on ? "on this map" : (S.maps[h.t.home] ? S.maps[h.t.home].title : "");
      const el = document.createElement("button");
      el.className = "result" + (i === hitIdx ? " active" : "");
      el.innerHTML = `<span class="dot" style="background:${c}"></span>${esc(h.t.name)}<span class="where">${esc(where)}</span>`;
      el.addEventListener("pointerdown", (e) => { e.preventDefault(); pick(h.id); });
      resultsEl.appendChild(el);
    });
    resultsEl.classList.add("open");
  }
  function closeResults() { resultsEl.classList.remove("open"); }
  function applySearchFade() {
    const q = isKey() ? searchEl.value.trim().toLowerCase() : "";
    for (const el of blobsEl.querySelectorAll(".blob")) {
      el.classList.toggle("faded", !!q && !S.terms[el.dataset.id].name.toLowerCase().includes(q));
    }
  }
  function pick(id) {
    searchEl.value = "";
    closeResults();
    searchEl.blur();
    if (!blobIn(map(), id)) {
      const t = S.terms[id];
      const target = (S.maps[t.home] && blobIn(S.maps[t.home], id)) ? t.home : S.order.find((k) => blobIn(S.maps[k], id));
      if (target) switchMap(target);
    }
    applySearchFade();
    openTerm(id, { fresh: true, pulse: true });
  }
  searchEl.addEventListener("input", runSearch);
  searchEl.addEventListener("focus", () => { if (searchEl.value.trim()) runSearch(); });
  searchEl.addEventListener("blur", () => setTimeout(closeResults, 120));
  searchEl.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!hits.length) return;
      hitIdx = (hitIdx + (e.key === "ArrowDown" ? 1 : hits.length - 1)) % hits.length;
      renderResults();
    } else if (e.key === "Enter" && !isKey()) { e.preventDefault(); summon(searchEl.value); }
    else if (e.key === "Enter" && hits[hitIdx]) pick(hits[hitIdx].id);
    else if (e.key === "Escape") { searchEl.value = ""; applySearchFade(); closeResults(); searchEl.blur(); }
  });

  // ---------- summoning terms (student mode) ----------
  // Match ignoring case, punctuation and plurals, check aliases, tolerate small typos.
  const singular = (w) => (w.length > 3 && /ies$/.test(w) ? w.slice(0, -3) + "y"
    : w.length > 3 && /(ss|x|z|ch|sh)es$/.test(w) ? w.slice(0, -2)
    : w.length > 3 && /[^su]s$/.test(w) ? w.slice(0, -1) : w);
  const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ").trim().split(" ").map(singular).join(" ");
  function lev(a, b) {
    const d = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      let prev = d[0]; d[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const tmp = d[j];
        d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = tmp;
      }
    }
    return d[b.length];
  }
  function findTerm(q) {
    const n = norm(q); if (!n) return null;
    const cands = lesson().blobs.flatMap((b) => [S.terms[b.id].name, ...(S.terms[b.id].aliases || [])].map((x) => ({ id: b.id, n: norm(x) })));
    const exact = cands.find((c) => c.n === n);
    if (exact) return exact.id;
    const tol = n.length <= 4 ? 0 : n.length <= 8 ? 1 : 2;
    let best = null;
    for (const c of cands) {
      const d = lev(n, c.n);
      if (d <= tol && (!best || d < best.d)) best = { id: c.id, d };
    }
    return best ? best.id : null;
  }
  function summon(raw) {
    const q = raw.trim(); if (!q) return;
    const id = findTerm(q);
    if (id) {
      searchEl.value = "";
      if (blobIn(map(), id)) { flash(id, "pulse"); say(`${S.terms[id].name} is already on your map.`); return; }
      const k = blobIn(lesson(), id);
      addBlob(id, k.c, k.s);
      hideNote();
      return;
    }
    const kept = map().blobs.find((b) => S.terms[b.id].extra && norm(S.terms[b.id].name) === norm(q));
    if (kept) { searchEl.value = ""; flash(kept.id, "pulse"); return; }
    const box = searchEl.closest(".search");
    box.classList.remove("wobble"); void box.offsetWidth; box.classList.add("wobble");
    say("Not in this lesson's chart.", "keep it anyway", () => keepExtra(q));
  }
  // Keep a term that is not in the key as a gray "extra" blob (data on what students think belongs).
  function keepExtra(q) {
    let id = "extra-" + slug(q), n = 2;
    while (S.terms[id]) id = "extra-" + slug(q) + "-" + n++;
    S.terms[id] = { name: q, def: "", home: S.current, prereqs: [], extra: true };
    searchEl.value = "";
    hideNote();
    addBlob(id, EXTRA, 80);
  }
  let hintN = 0;
  function hint() {
    if (TEST) return;
    const found = foundIds(), key = lesson();
    const unfound = coreTerms().filter((b) => !found.has(b.id));
    if (!unfound.length) return say("You have found every term in this lesson.");
    const touches = (b) => key.edges.some((k) => (k.from === b.id && found.has(k.to)) || (k.to === b.id && found.has(k.from)));
    const pool = unfound.filter(touches).length ? unfound.filter(touches) : unfound;
    const b = pool[hintN++ % pool.length];
    const near = key.edges.map((k) => (k.from === b.id ? k.to : k.to === b.id ? k.from : null)).find((x) => x && found.has(x));
    say(`Hint: a term starting with “${S.terms[b.id].name[0].toUpperCase()}”${near ? `, connected to ${S.terms[near].name}` : ""}.`);
  }
  function toggleReveal(force) {
    if (TEST) return;
    revealOn = force === undefined ? !revealOn : force;
    $("#revealBtn").textContent = revealOn ? "hide what's missing" : "show what's missing";
    $("#revealBtn").setAttribute("aria-pressed", String(revealOn));
    renderMap();
    if (revealOn && !Object.keys(G).length && !svg.querySelector(".ghost-edge")) say("Nothing missing: your map has every core term and link.");
  }
  // Summary: a short paragraph for the lesson; its words only reveal a blob (a ghost to drag in), like the reveal does.
  function renderSummary() {
    const box = $("#summary"), text = (window.MB_DEMO.maps[S.current] || {}).summary;
    box.hidden = !(summaryOn && !TEST && !isKey() && text);
    $("#summaryBtn").setAttribute("aria-pressed", String(summaryOn));
    if (box.hidden) return;
    const found = foundIds(), inLesson = new Set(lesson().blobs.map((b) => b.id));
    box.innerHTML = esc(text).replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (all, id, t) =>
      inLesson.has(id) ? `<span class="sum-term${found.has(id) ? " done" : ""}" role="button" tabindex="0" data-sum="${esc(id)}">${t}</span>` : t);
  }
  function revealFromSummary(id) {
    if (blobIn(map(), id)) { flash(id, "pulse"); return; }
    shown.add(id);
    renderGhosts();
    draw();
  }
  $("#summaryBtn").addEventListener("click", () => { summaryOn = !summaryOn; renderSummary(); });
  $("#summary").addEventListener("click", (e) => { const t = e.target.closest("[data-sum]"); if (t) revealFromSummary(t.dataset.sum); });
  $("#summary").addEventListener("keydown", (e) => {
    const t = e.target.closest("[data-sum]");
    if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); revealFromSummary(t.dataset.sum); }
  });
  $("#hintBtn").addEventListener("click", hint);
  $("#revealBtn").addEventListener("click", () => toggleReveal());

  let noteTimer;
  function say(text, actionLabel, action) {
    clearTimeout(noteTimer);
    noteEl.innerHTML = esc(text) + (actionLabel ? ` <button type="button" class="note-act">${esc(actionLabel)}</button>` : "");
    if (action) noteEl.querySelector(".note-act").addEventListener("click", action);
    noteEl.hidden = false;
    noteTimer = setTimeout(hideNote, actionLabel ? 7000 : 3500);
  }
  function hideNote() { clearTimeout(noteTimer); noteEl.hidden = true; }

  function renderProgress() {
    const key = lesson();
    if (isKey()) {
      const valid = key.edges.filter((e) => e.tier === "valid").length;
      progressEl.textContent = `answer key · ${key.blobs.length} terms · ${key.edges.length} links${valid ? ` (${valid} valid)` : ""}`;
    } else {
      const core = coreTerms(), found = foundIds();
      progressEl.textContent = core.length ? `${core.filter((b) => found.has(b.id)).length} of ${core.length} terms found` : "";
    }
  }
  function setMode(mode) {
    if (mode === S.mode) return;
    if (simOn) writeBack();
    if (connect) closeConnect();
    closePanel();
    S.mode = mode;
    save();
    revealOn = false;
    applyModeUI();
    placeFromData();
    renderMap();
    startSim();
  }
  function applyModeUI() {
    document.body.classList.toggle("key-mode", isKey());
    searchEl.value = "";
    searchEl.placeholder = isKey() ? "search a term…" : "type a term…";
    searchEl.setAttribute("aria-label", isKey() ? "Search terms" : "Type a term to add it");
    $("#addBtn").title = isKey() ? "Add a term" : "Add the term you typed";
    $("#revealBtn").textContent = "show what's missing";
    hideNote(); closeResults(); applySearchFade();
  }
  $("#mapGrid").addEventListener("click", (e) => {
    const b = e.target.closest("[data-mode]");
    if (b) { setMode(b.dataset.mode); renderGrid(); }
  });

  // ---------- global keys, reset, resize ----------
  document.addEventListener("keydown", (e) => {
    const typing = !!(e.target.matches && e.target.matches("input, textarea"));
    if (e.key === "Escape") {
      if (!addLayer.hidden) closeAdd();
      else if (!$("#mapGrid").hidden) toggleGrid(false);
      else if (connect) closeConnect();
      else if (panel.classList.contains("open")) closePanel();
    } else if (e.key === "/" && !typing) { e.preventDefault(); searchEl.focus(); }
  });
  document.addEventListener("pointerdown", (e) => {
    const grid = $("#mapGrid");
    if (!grid.hidden && !e.target.closest(".switcher")) toggleGrid(false);
  });
  $("#resetBtn").addEventListener("click", () => {
    if (!confirm("Restore the demo lessons and clear your maps? Anything you added or moved will be lost.")) return;
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
    const mode = S.mode, cur = S.current;
    S = freshState();
    S.mode = mode;
    if (S.maps[cur]) S.current = cur;
    closePanel(); revealOn = false; applyModeUI();
    placeFromData(); renderMap();
  });
  let rsz;
  window.addEventListener("resize", () => {
    clearTimeout(rsz);
    rsz = setTimeout(() => { writeBack(); layout(); placeFromData(); draw(); if (connect) placeMenu(); }, 60);
  });

  // ---------- boot ----------
  S = load();
  const startMap = decodeURIComponent(location.hash.slice(1));
  if (S.maps[startMap]) S.current = startMap;
  const qs = new URLSearchParams(location.search);
  if (qs.has("key")) S.mode = "key";
  if (qs.has("student")) S.mode = "student";
  document.body.classList.toggle("test-mode", TEST);
  $("#testBadge").hidden = !TEST;
  applyModeUI();
  history.replaceState(null, "", location.search + "#" + encodeURIComponent(S.current));   // keep ?test on reload
  layout();
  placeFromData();
  renderMap();
  startSim(); // settle any overlaps from the saved layout
})();

const MB = { teal: '#3E8E8A', coral: '#E8705F', mustard: '#F2B544', lilac: '#B9A3D6', navy: '#2B3A55', cream: '#FBF3E4', mute: '#6F6A5E', sand: '#F1ECE1', faint: '#A8A294', hl: '#FCE9C4' };
const MBF = 'Outfit, system-ui, sans-serif';
const MBSH = '50% 50% 46% 54%/52% 48% 52% 48%';
const MOTION = { glide: Easing.easeInOutCubic, enter: Easing.easeOutCubic, pop: Easing.easeOutBack };
const LTYPES = {
  req: { c: MB.teal, w: 10, d: '', label: 'requires' },
  ex: { c: MB.coral, w: 10, d: '22 18', label: 'example of' },
  gen: { c: MB.mustard, w: 18, d: '', label: 'generalizes' },
  inv: { c: MB.lilac, w: 10, d: '2 22', label: 'inverse of' },
};

function MBBlob({ n, x, y, s, c, ink, sc = 1, op = 1, halo = 0, fs = 32 }) {
  return (
    <div style={{ position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, transform: `scale(${sc})`, opacity: op,
      display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 14, boxSizing: 'border-box',
      font: `600 ${fs}px/1.1 ${MBF}`, color: ink || MB.navy, background: c, borderRadius: MBSH,
      boxShadow: halo ? `0 0 0 ${8 * halo}px #fff, 0 0 0 ${14 * halo}px ${c}` : 'none' }}>{n}</div>
  );
}

function MBCursor({ x, y, sc, op }) {
  return (
    <svg width="44" height="54" viewBox="0 0 18 22" style={{ position: 'absolute', left: x - 5, top: y - 5, opacity: op, transform: `scale(${sc})`, transformOrigin: '5px 5px', zIndex: 50, overflow: 'visible' }}>
      <path d="M2 2 L2 18 L6.5 14 L9.5 20.5 L12.5 19 L9.5 12.8 L15.5 12.8 Z" fill={MB.navy} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"></path>
    </svg>
  );
}

function MBLine({ a, b, t, p = 1, op = 1 }) {
  const L = LTYPES[t];
  return <line x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * p} y2={a.y + (b.y - a.y) * p} stroke={L.c} strokeWidth={L.w} strokeDasharray={L.d || undefined} strokeLinecap="round" opacity={op}></line>;
}

function MBTag({ x, y, t, op, sc = 1 }) {
  const L = LTYPES[t];
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${sc})`, opacity: op, height: 44, borderRadius: 22, background: '#fff',
      boxShadow: '0 3px 0 rgba(43,58,85,.12)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', font: `600 22px ${MBF}`, color: MB.navy, whiteSpace: 'nowrap' }}>
      <span style={{ width: 14, height: 14, borderRadius: '50%', background: L.c }}></span>{L.label}
    </div>
  );
}

function MBLink({ children, hot }) {
  return <span style={{ textDecoration: 'underline', textDecorationThickness: 3, textUnderlineOffset: 6, background: hot ? MB.hl : 'transparent', borderRadius: 6, color: MB.navy }}>{children}</span>;
}

function MBChip({ n, hot, sc = 1 }) {
  return <div style={{ height: 60, borderRadius: 30, display: 'flex', alignItems: 'center', padding: '0 24px', font: `600 24px ${MBF}`, transform: `scale(${sc})`,
    background: hot ? MB.navy : MB.sand, color: hot ? '#fff' : MB.navy, whiteSpace: 'nowrap' }}>{n}</div>;
}

function Piece() {
  const { T, CUES } = useComposition();
  const c = (n, d = 0) => CUES[n] + d;
  const A = (from, to, s, e, ease = MOTION.glide) => animate({ from, to, start: s, end: e, ease })(T);
  const pop = (s) => ({ sc: A(0, 1, s, s + 0.55, MOTION.pop), op: A(0, 1, s, s + 0.2, MOTION.enter) });
  const bump = (s, d = 0.45) => (T > s && T < s + d ? Math.sin(Math.PI * (T - s) / d) : 0);

  const D = { x: 960, y: 470 }, L = { x: 560, y: 360 }, Fn = { x: 420, y: 730 }, S = { x: 1500, y: 720 }, P = { x: 760, y: 840 }, I = { x: 1400, y: 300 };

  // cursor path [t, x, y]
  const K = [
    [0, 1760, 1120], [c('Add', 0.3), 1760, 1120], [c('Add', 1.0), 720, 105], [c('Add', 2.4), 720, 105],
    [c('Add', 2.9), 1322, 105], [c('Add', 3.4), 1322, 105], [c('Add', 3.9), 1012, 616], [c('Add', 4.2), 1012, 616],
    [c('Add', 4.6), 1176, 616], [c('Add', 5.0), 1176, 616], [c('Add', 5.7), 1660, 930],
    [c('Connect', 0.2), 1660, 930], [c('Connect', 0.9), 960, 470], [c('Connect', 2.1), 960, 470], [c('Connect', 2.6), 960, 265],
    [c('Connect', 2.7), 960, 265], [c('Connect', 3.9), 560, 360], [c('Connect', 4.3), 560, 360], [c('Connect', 5.3), 1660, 930],
    [c('Terms', 0.2), 1660, 930], [c('Terms', 0.8), 960, 470], [c('Terms', 1.8), 960, 470], [c('Terms', 2.7), 1645, 306],
    [c('Prereqs', 0.1), 1645, 306], [c('Prereqs', 0.8), 1505, 500], [c('Prereqs', 3), 1505, 500],
  ];
  const path = (t) => {
    if (t <= K[0][0]) return { x: K[0][1], y: K[0][2] };
    for (let i = 0; i < K.length - 1; i++) {
      if (t <= K[i + 1][0]) {
        const span = K[i + 1][0] - K[i][0] || 1, p = MOTION.glide(clamp((t - K[i][0]) / span, 0, 1));
        return { x: K[i][1] + (K[i + 1][1] - K[i][1]) * p, y: K[i][2] + (K[i + 1][2] - K[i][2]) * p };
      }
    }
    const l = K[K.length - 1]; return { x: l[1], y: l[2] };
  };
  const cur = path(T);
  const clicks = [c('Add', 1.05), c('Add', 3.45), c('Add', 4.25), c('Add', 5.05), c('Connect', 1.0), c('Terms', 0.9), c('Terms', 3.0), c('Prereqs', 1.0)];
  const holding = T >= c('Connect', 1.0) && T < c('Connect', 4.0);
  const tapping = clicks.some(tc => T >= tc && T < tc + 0.14);
  const curOp = A(0, 1, c('Add', 0.2), c('Add', 0.5)) * (1 - A(0, 1, c('Prereqs', 2.4), c('Prereqs', 2.8)));

  // chrome
  const chromeOp = A(0, 1, c('Opening', 0.1), c('Opening', 0.6), MOTION.enter) * (1 - A(0, 1, c('Logo', 0), c('Logo', 0.4)));
  const typed = 'Derivative'.slice(0, Math.floor(clamp((T - c('Add', 1.2)) / 1.2, 0, 1) * 10));
  const searchText = T < c('Add', 5.05) ? typed : '';
  const plusHot = T >= c('Add', 3.45) && T < c('Add', 5.1);

  // add card
  const cardIn = A(0, 1, c('Add', 3.55), c('Add', 3.95), MOTION.pop);
  const cardOut = A(0, 1, c('Add', 5.1), c('Add', 5.5));
  const cardOp = A(0, 1, c('Add', 3.55), c('Add', 3.75)) * (1 - cardOut);
  const swatch = T >= c('Add', 4.25) ? 4 : 0;
  const addHot = T >= c('Add', 5.05);

  // world 1
  const camX = A(0, -260, c('Terms', 1.0), c('Terms', 1.6)) - A(0, -260, c('Prereqs', 1.3), c('Prereqs', 1.9));
  const w1Op = 1 - A(0, 1, c('Prereqs', 1.2), c('Prereqs', 1.8));
  const w1Sc = 1 - 0.06 * A(0, 1, c('Prereqs', 1.2), c('Prereqs', 1.8));
  const bL = pop(c('Opening', 0.3)), bF = pop(c('Opening', 0.6)), bS = pop(c('Opening', 0.9));
  const drift = (s) => 30 * (1 - A(0, 1, s, s + 0.8, MOTION.enter));
  const bD = pop(c('Add', 5.25)), bP = pop(c('Links', 0.1)), bI = pop(c('Links', 1.1));
  const holdP = A(0, 1, c('Connect', 1.0), c('Connect', 1.6), Easing.linear);
  const holdOp = T >= c('Connect', 1.0) ? 1 - A(0, 1, c('Connect', 1.6), c('Connect', 1.8)) : 0;
  const menuOpen = (i) => A(0, 1, c('Connect', 1.6 + i * 0.05), c('Connect', 2.0 + i * 0.05), MOTION.pop) * (1 - A(0, 1, c('Connect', 4.0), c('Connect', 4.3)));
  const reqHot = T >= c('Connect', 2.55) && T < c('Connect', 4.0);
  const dragging = T >= c('Connect', 2.7) && T < c('Connect', 4.0);
  const curW = { x: cur.x - camX, y: cur.y };
  const linked = T >= c('Connect', 4.0);
  const halo = (s) => A(0, 1, s, s + 0.3, MOTION.enter);
  const pills = [
    { t: 'req', x: 960, y: 265 }, { t: 'ex', x: 1240, y: 420 }, { t: 'gen', x: 1185, y: 655 }, { t: 'inv', x: 735, y: 655 },
  ];

  // panel
  const panelX = 560 * (1 - A(0, 1, c('Terms', 1.0), c('Terms', 1.5), MOTION.enter)) + 560 * A(0, 1, c('Prereqs', 1.3), c('Prereqs', 1.8));
  const swap = A(0, 1, c('Terms', 3.1), c('Terms', 3.6));
  const limitHot = T >= c('Terms', 2.75) && T < c('Terms', 3.3);
  const chipBump = bump(c('Prereqs', 0.1), 0.6);
  const preHot = T >= c('Prereqs', 1.0);

  // world 2
  const w2Op = A(0, 1, c('Prereqs', 1.7), c('Prereqs', 2.2)) * (1 - A(0, 1, c('Logo', 0), c('Logo', 0.4)));
  const w2 = (i) => pop(c('Prereqs', 1.8 + i * 0.12));
  const W2 = { f: { x: 960, y: 560 }, d: { x: 560, y: 350 }, e: { x: 1380, y: 350 }, i: { x: 1380, y: 790 }, g: { x: 560, y: 790 } };
  const lineP2 = A(0, 1, c('Prereqs', 2.1), c('Prereqs', 2.6));
  const chipA = T < c('Prereqs', 1.7) ? 'Calculus AB' : 'Precalculus';

  // logo
  const lb = (i) => pop(c('Logo', 0.3 + i * 0.1));
  const wordOp = A(0, 1, c('Logo', 0.6), c('Logo', 1.1), MOTION.enter), wordY = 20 * (1 - wordOp);
  const btn = pop(c('Logo', 1.0));
  const logoOut = 1 - A(0, 1, c('Logo', 3.1), c('Logo', 3.5));

  // captions
  const CAPS = [
    ['Opening', 0.6, 'Opening', 2.8, 'Math is a web of ideas.'],
    ['Add', 0.2, 'Add', 5.8, 'Add a term.'],
    ['Connect', 0.2, 'Connect', 5.8, 'Hold to connect.'],
    ['Links', 0.2, 'Links', 3.8, 'Many kinds of link.'],
    ['Terms', 0.2, 'Terms', 5.8, 'Every term links to more.'],
    ['Prereqs', 0.2, 'Prereqs', 2.8, 'See what comes before.'],
  ];
  const capNow = CAPS.find(k => T >= c(k[0], k[1]) && T < c(k[2], k[3]));
  const capOp = capNow ? A(0, 1, c(capNow[0], capNow[1]), c(capNow[0], capNow[1] + 0.3)) * (1 - A(0, 1, c(capNow[2], capNow[3] - 0.3), c(capNow[2], capNow[3]))) : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, background: MB.cream, overflow: 'hidden', fontFamily: MBF }}>
      {/* world 1 */}
      <div style={{ position: 'absolute', inset: 0, opacity: w1Op, transform: `translateX(${camX}px) scale(${w1Sc})` }}>
        <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {dragging && <line x1={D.x} y1={D.y} x2={curW.x} y2={curW.y} stroke={MB.teal} strokeWidth="8" strokeDasharray="4 18" strokeLinecap="round" opacity="0.7"></line>}
          {linked && <MBLine a={D} b={L} t="req"></MBLine>}
          <MBLine a={D} b={P} t="ex" p={A(0, 1, c('Links', 0.3), c('Links', 0.9))} op={T > c('Links', 0.3) ? 1 : 0}></MBLine>
          <MBLine a={D} b={I} t="inv" p={A(0, 1, c('Links', 1.3), c('Links', 1.9))} op={T > c('Links', 1.3) ? 1 : 0}></MBLine>
          <MBLine a={D} b={S} t="gen" p={A(0, 1, c('Links', 2.1), c('Links', 2.7))} op={T > c('Links', 2.1) ? 1 : 0}></MBLine>
          <circle cx={D.x} cy={D.y} r="150" fill="none" stroke={MB.navy} strokeWidth="8" strokeLinecap="round" opacity={holdOp}
            strokeDasharray={`${2 * Math.PI * 150 * holdP} 2000`} transform={`rotate(-90 ${D.x} ${D.y})`}></circle>
        </svg>
        <MBBlob n="Limit" x={L.x} y={L.y - drift(c('Opening', 0.3))} s={200} c={MB.teal} ink="#fff" sc={bL.sc * (1 + 0.08 * bump(c('Connect', 4.0)))} op={bL.op} halo={halo(c('Terms', 3.1))}></MBBlob>
        <MBBlob n="Function" x={Fn.x} y={Fn.y - drift(c('Opening', 0.6))} s={190} c={MB.mustard} sc={bF.sc} op={bF.op}></MBBlob>
        <MBBlob n="Slope" x={S.x} y={S.y - drift(c('Opening', 0.9))} s={180} c={MB.lilac} sc={bS.sc} op={bS.op}></MBBlob>
        <MBBlob n="Power Rule" x={P.x} y={P.y} s={170} c={MB.coral} fs={28} sc={bP.sc} op={bP.op}></MBBlob>
        <MBBlob n="Integral" x={I.x} y={I.y} s={180} c={MB.mustard} sc={bI.sc} op={bI.op}></MBBlob>
        <MBBlob n="Derivative" x={D.x} y={D.y} s={240} c={MB.navy} ink="#fff" fs={34} sc={bD.sc * (holding ? 0.96 : 1)} op={bD.op} halo={halo(c('Terms', 0.95)) * (1 - halo(c('Terms', 3.1)))}></MBBlob>
        <MBTag x={760} y={415} t="req" op={A(0, 1, c('Connect', 4.1), c('Connect', 4.4))}></MBTag>
        <MBTag x={860} y={655} t="ex" op={A(0, 1, c('Links', 0.8), c('Links', 1.1))}></MBTag>
        <MBTag x={1180} y={385} t="inv" op={A(0, 1, c('Links', 1.8), c('Links', 2.1))}></MBTag>
        <MBTag x={1230} y={595} t="gen" op={A(0, 1, c('Links', 2.6), c('Links', 2.9))}></MBTag>
        {pills.map((p, i) => {
          const o = menuOpen(i), hot = p.t === 'req' && reqHot, Lt = LTYPES[p.t];
          return (
            <div key={p.t} style={{ position: 'absolute', left: D.x + (p.x - D.x) * Math.min(1, o), top: D.y + (p.y - D.y) * Math.min(1, o), transform: `translate(-50%,-50%) scale(${o * (hot ? 1.08 : 1)})`,
              opacity: clamp(o, 0, 1), zIndex: 10, height: 64, borderRadius: 32, background: '#fff', boxShadow: hot ? `0 0 0 4px ${Lt.c}` : '0 3px 0 rgba(43,58,85,.14)',
              display: 'flex', alignItems: 'center', gap: 12, padding: '0 26px', font: `600 26px ${MBF}`, color: MB.navy, whiteSpace: 'nowrap' }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: Lt.c }}></span>{Lt.label}
            </div>
          );
        })}
      </div>

      {/* world 2: Precalculus */}
      <div style={{ position: 'absolute', inset: 0, opacity: w2Op }}>
        <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
          <MBLine a={W2.f} b={W2.d} t="req" p={lineP2}></MBLine>
          <MBLine a={W2.f} b={W2.e} t="ex" p={lineP2}></MBLine>
          <MBLine a={W2.f} b={W2.i} t="inv" p={lineP2}></MBLine>
          <MBLine a={W2.f} b={W2.g} t="gen" p={lineP2}></MBLine>
        </svg>
        <MBBlob n="Function" x={W2.f.x} y={W2.f.y} s={240} c={MB.mustard} fs={34} {...w2(0)}></MBBlob>
        <MBBlob n="Domain & Range" x={W2.d.x} y={W2.d.y} s={200} c={MB.teal} ink="#fff" fs={28} {...w2(1)}></MBBlob>
        <MBBlob n="Exponents" x={W2.e.x} y={W2.e.y} s={190} c={MB.coral} fs={28} {...w2(2)}></MBBlob>
        <MBBlob n="Inverse Functions" x={W2.i.x} y={W2.i.y} s={210} c={MB.lilac} fs={28} {...w2(3)}></MBBlob>
        <MBBlob n="Graphs" x={W2.g.x} y={W2.g.y} s={190} c={MB.navy} ink="#fff" fs={30} {...w2(4)}></MBBlob>
      </div>

      {/* search + map chip */}
      <div style={{ position: 'absolute', left: 550, top: 60, width: 820, height: 90, borderRadius: 45, background: '#fff', opacity: chromeOp, zIndex: 20,
        boxShadow: '0 4px 0 rgba(43,58,85,.1)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 12px 0 40px', boxSizing: 'border-box' }}>
        <span style={{ flex: 1, font: `500 32px ${MBF}`, color: searchText ? MB.navy : MB.faint }}>{searchText || 'Search terms'}</span>
        <div style={{ width: 66, height: 66, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', font: `500 44px ${MBF}`,
          background: plusHot ? MB.navy : MB.sand, color: plusHot ? '#fff' : MB.navy }}>+</div>
      </div>
      <div style={{ position: 'absolute', left: 48, bottom: 48, height: 64, borderRadius: 32, background: '#fff', opacity: chromeOp, zIndex: 20,
        boxShadow: '0 3px 0 rgba(43,58,85,.12)', display: 'flex', alignItems: 'center', padding: '0 28px', font: `600 28px ${MBF}`, color: MB.navy }}>{chipA}</div>

      {/* add card */}
      <div style={{ position: 'absolute', left: 620, top: 330, width: 680, height: 400, borderRadius: 28, background: '#fff', zIndex: 30, opacity: cardOp,
        boxShadow: '0 6px 0 rgba(43,58,85,.12)', transform: `scale(${(0.9 + 0.1 * cardIn) * (1 - 0.6 * cardOut)})`, transformOrigin: '50% 35%' }}>
        <div style={{ position: 'absolute', left: 44, top: 36, font: `600 22px ${MBF}`, letterSpacing: '.07em', color: MB.faint }}>NEW TERM</div>
        <div style={{ position: 'absolute', left: 44, top: 72, font: `600 48px ${MBF}`, color: MB.navy }}>Derivative</div>
        <div style={{ position: 'absolute', left: 44, top: 150, width: 590, font: `500 28px/1.4 ${MBF}`, color: MB.mute }}>The instantaneous rate of change of a function.</div>
        {[MB.teal, MB.coral, MB.mustard, MB.lilac, MB.navy].map((col, i) => (
          <div key={i} style={{ position: 'absolute', left: 44 + i * 80, top: 258, width: 56, height: 56, borderRadius: '50%', background: col,
            boxShadow: swatch === i ? `0 0 0 5px #fff, 0 0 0 9px ${col}` : 'none' }}></div>
        ))}
        <div style={{ position: 'absolute', left: 476, top: 258, width: 160, height: 56, borderRadius: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          font: `600 26px ${MBF}`, background: addHot ? MB.navy : MB.sand, color: addHot ? '#fff' : MB.navy }}>Add</div>
      </div>

      {/* side panel */}
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 560, background: '#fff', zIndex: 25, transform: `translateX(${panelX}px)`,
        boxShadow: '-8px 0 0 rgba(43,58,85,.07)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - swap, transform: `translateX(${-40 * swap}px)` }}>
          <div style={{ position: 'absolute', left: 48, top: 92, display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 52, height: 52, background: MB.navy, borderRadius: MBSH }}></div>
            <div style={{ font: `600 44px ${MBF}`, color: MB.navy }}>Derivative</div>
          </div>
          <div style={{ position: 'absolute', left: 48, top: 180, font: `500 32px/48px ${MBF}`, color: MB.mute, whiteSpace: 'nowrap' }}>
            The instantaneous rate of<br></br>change of a <MBLink>function</MBLink>,<br></br>defined as a <MBLink hot={limitHot}>limit</MBLink>.
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, opacity: swap, transform: `translateX(${40 * (1 - swap)}px)` }}>
          <div style={{ position: 'absolute', left: 48, top: 48, font: `600 24px ${MBF}`, color: '#8C8878' }}>← Derivative</div>
          <div style={{ position: 'absolute', left: 48, top: 104, display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 52, height: 52, background: MB.teal, borderRadius: MBSH }}></div>
            <div style={{ font: `600 44px ${MBF}`, color: MB.navy }}>Limit</div>
          </div>
          <div style={{ position: 'absolute', left: 48, top: 196, font: `500 32px/48px ${MBF}`, color: MB.mute, whiteSpace: 'nowrap' }}>
            The value a <MBLink>function</MBLink><br></br>approaches as its input<br></br>approaches a point.
          </div>
          <div style={{ position: 'absolute', left: 48, right: 48, top: 400, borderTop: `3px solid ${MB.sand}`, paddingTop: 22, font: `600 22px ${MBF}`, letterSpacing: '.07em', color: MB.faint }}>PREREQUISITES</div>
          <div style={{ position: 'absolute', left: 48, top: 470, display: 'flex', gap: 14, transformOrigin: 'left center' }}>
            <MBChip n="Precalculus" hot={preHot} sc={1 + 0.06 * chipBump}></MBChip>
            <MBChip n="Functions & Graphs" sc={1 + 0.06 * bump(c('Prereqs', 0.2), 0.6)}></MBChip>
          </div>
        </div>
      </div>

      {/* logo */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 48, opacity: logoOut, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {[MB.teal, MB.coral, MB.mustard, MB.lilac].map((col, i) => {
            const b = lb(i), s = i % 2 ? 76 : 56;
            return <span key={i} style={{ width: s, height: s, background: col, borderRadius: MBSH, transform: `scale(${b.sc})`, opacity: b.op }}></span>;
          })}
          <span style={{ marginLeft: 18, font: `700 128px ${MBF}`, letterSpacing: '-.01em', color: MB.navy, opacity: wordOp, transform: `translateY(${wordY}px)` }}>mathblobs</span>
        </div>
        <div style={{ height: 84, borderRadius: 42, background: MB.navy, color: '#fff', display: 'flex', alignItems: 'center', padding: '0 44px', font: `600 36px ${MBF}`,
          transform: `scale(${btn.sc})`, opacity: btn.op }}>Start mapping</div>
      </div>

      {/* clicks */}
      {clicks.map((tc, i) => {
        if (T < tc || T > tc + 0.5) return null;
        const p = path(tc), k = (T - tc) / 0.5;
        return <div key={i} style={{ position: 'absolute', left: p.x - 40, top: p.y - 40, width: 80, height: 80, borderRadius: '50%', border: `4px solid ${MB.navy}`,
          boxSizing: 'border-box', zIndex: 49, opacity: 0.5 * (1 - k), transform: `scale(${0.3 + 1.3 * MOTION.enter(k)})` }}></div>;
      })}
      <MBCursor x={cur.x} y={cur.y} sc={holding || tapping ? 0.86 : 1} op={curOp}></MBCursor>

      {/* caption */}
      <div style={{ position: 'absolute', left: 960, bottom: 56, transform: `translate(-50%, ${12 * (1 - capOp)}px)`, opacity: capOp, zIndex: 45,
        padding: '18px 40px', borderRadius: 44, background: MB.navy, color: '#fff', font: `600 40px ${MBF}`, whiteSpace: 'nowrap' }}>{capNow ? capNow[4] : ''}</div>
    </div>
  );
}

window.MathblobsIntro = function MathblobsIntro() {
  return (
    <CompositionStage width={1920} height={1080} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={MB.cream}>
      <Piece></Piece>
    </CompositionStage>
  );
};

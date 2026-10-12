// Tuned "feel" settings, picked in the Blob Toy Lab (Notes: Blob Feel Settings).
// Units match the lab: ms, px, px/s, seconds, Hz. app.js reads these; change a number here to retune.
window.MB_FEEL = {
  // Press and hold a blob to link it.
  hold: {
    ms: 870,       // hold time before the link menu opens
    thresh: 9,     // px of movement that turns the hold into a drag
    ring: 8,       // ring thickness
    menuR: 80,     // distance from the blob's centre to the link type pucks
    spring: 0.45   // menu pop springiness: 0 is critically damped, 1 is very bouncy
  },
  // Letting go of a dragged blob.
  fling: {
    friction: 10,    // higher stops sooner
    bounce: 0.6,     // how much speed a wall or another blob gives back
    maxSpeed: 700,   // px/s cap on a fling
    squash: 2,       // how hard a blob dents on impact
    push: 0.7        // how much a moving blob shoves the ones it hits
  },
  // Links act as springs and the map spreads back out on its own.
  springs: {
    strength: 8,     // pull per px of stretch
    rest: 240,       // px a link likes to be
    repulsion: 2.9,  // every blob pushes every other away
    friction: 7.3,   // damping for linked blobs; higher settles calmer
    centerPull: 0.35 // drift toward the middle of the board
  },
  // Blobs are soft: poke or drag one and it dents, then slowly settles back.
  jiggle: {
    stiffness: 3.5,  // Hz, how quickly it springs back
    wobble: 0.85,    // seconds a wobble takes to die out
    squash: 0.6,     // how far it dents
    plump: 0.3,      // 0 deflates when dented, higher keeps its volume
    material: "mochi",
    // [stiffness, wobble time, tension] multipliers. Mochi is slow and sticky: it returns without wobbling.
    materials: { jelly: [1, 1, 1], rubber: [1.7, 0.4, 1.8], mochi: [0.55, 0.28, 0.6] }
  },
  // Pressing "check my links". A link in the key pops; one that is not shivers, then stays and is labelled.
  feedback: {
    pop: 0.5,        // size of the pop on a link that is in the key (links in the key never shiver)
    shiverAmp: 5,    // px, how far the target blob shakes
    shiverSecs: 1.45 // how long it shivers
  },
  // Typing a term to summon its blob.
  summon: {
    secs: 0.65,      // how long the blob takes to unfold
    overshoot: 1,    // how far past full size it swells on the way
    typo: 1,         // letters a typed term may be off by (longer terms are never allowed more)
    pulse: 0.5       // size of the swell when the term is already on the map
  },
  // "Show what's missing": ghosts of core terms and links, drawn on the student's own map.
  ghosts: {
    opacity: 0.5,    // how see-through a ghost is
    drift: 8,        // px a ghost floats around
    sketchSecs: 1,   // the outline draws itself ("sketch in"), then the fill and label fade up
    materializeSecs: 1, // a ghost pulled onto the map fills in with colour over this long
    dash: 8          // px, dash length of the outline
  }
};

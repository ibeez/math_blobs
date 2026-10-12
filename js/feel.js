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
  }
};

// Demo content for mathblobs: Chapter 9 Algebra (pilot).
// Built from "Pilot Source Outline - Ch 9 Algebra"; definitions are written
// in our own words, and the page numbers point at the photographed chapter.
//
// linkTypes: every connection type, with how it is drawn. `label` reads
//   "from <label> to", `back` reads the other way round. `symmetric` types
//   are accepted in either direction when checking a student's link.
// terms: every concept, keyed by id. `def` may link other terms with
//   [[id]] or [[id|shown text]]. `aliases` are other names a student may type
//   to summon it. `home` is the map the term belongs to; `prereqs` are maps a
//   student should know first.
// maps: one per lesson, and each map is that lesson's answer key. It lists
//   the connection types the lesson offers (`types`), places its terms as
//   blobs (u, v are 0–1 positions on the board, s is size in px, c is colour)
//   and joins them with typed edges. Edges are core by default (the clean
//   chart a good student would draw); `tier: "valid"` marks links that are
//   true and accepted but not expected, and never shown in the reveal.

window.MB_DEMO = {
  linkTypes: {
    special:    { label: "special case of", back: "has special case", short: "special case", c: "#3E8E8A", w: 7,  dash: null },
    part:       { label: "part of",         back: "made of",          short: "part of",      c: "#2B3A55", w: 5,  dash: null },
    needs:      { label: "needs",           back: "needed by",        short: "needs",        c: "#3E8E8A", w: 7,  dash: "12 11" },
    same:       { label: "same as",         back: "same as",          short: "same as",      c: "#B9A5D6", w: 7,  dash: "1 12", symmetric: true },
    models:     { label: "models",          back: "modeled by",       short: "models",       c: "#E8705F", w: 7,  dash: "12 11" },
    reveals:    { label: "reveals",         back: "revealed by",      short: "reveals",      c: "#F2B544", w: 11, dash: null },
    contrasts:  { label: "contrasts with",  back: "contrasts with",   short: "contrasts",    c: "#E8705F", w: 7,  dash: "1 12", symmetric: true },
    shownAs:    { label: "shown as",        back: "shows",            short: "shown as",     c: "#F2B544", w: 9,  dash: "16 12" }
  },

  terms: {
    // 9.1–9.2 Expressions
    expression:   { name: "Expression", aliases: ["algebraic expression"], home: "expressions", prereqs: [], def: "Numbers, [[variable|variables]] and operations put together, like 3x + 5. It has a value once you know the variables." },
    numexpr:      { name: "Numerical expression", aliases: ["numeric expression", "arithmetic expression"], home: "expressions", prereqs: [], def: "An [[expression]] with only numbers and operations, like 4 + 2 × 3. You evaluate it using the [[order|order of operations]]." },
    order:        { name: "Order of operations", aliases: ["PEMDAS", "BODMAS", "GEMDAS", "order of operation"], home: "expressions", prereqs: [], def: "The agreed order for evaluating: parentheses, then exponents, then multiplication and division, then addition and subtraction." },
    variable:     { name: "Variable", aliases: ["unknown"], home: "expressions", prereqs: [], def: "A letter that stands for a number, such as x in 3x + 5." },
    term:         { name: "Term", home: "expressions", prereqs: [], def: "One of the parts of an [[expression]] joined by + or −. In 3x + 5 the terms are 3x and 5." },
    coefficient:  { name: "Coefficient", home: "expressions", prereqs: [], def: "The number multiplying a [[variable]] in a [[term]]. In 3x it is 3." },
    equivexpr:    { name: "Equivalent expressions", aliases: ["equivalent expression", "equivalence"], home: "expressions", prereqs: [], def: "[[expression|Expressions]] that give the same value for every value of the [[variable]], like 2(x + 3) and 2x + 6." },
    structure:    { name: "Structure", aliases: ["structure of an expression", "expression structure"], home: "expressions", prereqs: [], def: "How an [[expression]] is built. Reading it can reveal a maximum, a minimum or the zeros without calculating." },

    // 9.3 Equations
    equation:     { name: "Equation", home: "equations", prereqs: ["expressions"], def: "A statement that two [[expression|expressions]] are equal, like 2x + 1 = 7." },
    solution:     { name: "Solution", aliases: ["root"], home: "equations", prereqs: [], def: "A value of the [[variable]] that makes an [[equation]] true. For 2x + 1 = 7 it is x = 3." },
    identity:     { name: "Identity", aliases: ["identity equation"], home: "equations", prereqs: [], def: "An [[equation]] that is true for every value of the [[variable]], like 2(x + 3) = 2x + 6." },
    conditional:  { name: "Conditional equation", aliases: ["conditional"], home: "equations", prereqs: [], def: "An [[equation]] that is true for some values of the [[variable]] but not others." },
    panbalance:   { name: "Pan balance", aliases: ["balance", "balance scale", "scale"], home: "equations", prereqs: [], def: "A picture of an [[equation]] as a balanced scale: both sides weigh the same." },
    samesol:      { name: "Same-solution transformation", aliases: ["same solution", "balancing", "same thing to both sides", "inverse operations"], home: "equations", prereqs: [], def: "Doing the same thing to both sides of an [[equation]], so the [[solution]] does not change, just as a [[panbalance|pan balance]] stays level." },

    // 9.5 Sequences
    sequence:     { name: "Sequence", aliases: ["number sequence"], home: "sequences", prereqs: [], def: "A list of numbers in order, where each entry has a position: 1st, 2nd, 3rd, …" },
    arithmetic:   { name: "Arithmetic sequence", aliases: ["arithmetic progression", "linear sequence"], home: "sequences", prereqs: [], def: "A [[sequence]] where you add the same amount each time (a constant difference), like 4, 7, 10, 13." },
    geometric:    { name: "Geometric sequence", aliases: ["geometric progression"], home: "sequences", prereqs: [], def: "A [[sequence]] where you multiply by the same amount each time (a constant ratio), like 3, 6, 12, 24." },
    repeating:    { name: "Repeating pattern", aliases: ["repeating sequence", "cycle", "cyclic pattern"], home: "sequences", prereqs: [], def: "A pattern that cycles, like red, blue, green, red, blue, green. Finding what is in a given position uses [[remainder|division with remainder]]." },
    remainder:    { name: "Division with remainder", aliases: ["remainder", "remainders"], home: "sequences", prereqs: [], def: "Dividing and keeping what is left over, like 17 ÷ 5 = 3 remainder 2." },

    // 9.6 Functions
    func:         { name: "Function", aliases: ["function rule", "rule"], home: "functions", prereqs: ["expressions"], def: "A rule that gives exactly one output for each input." },
    representation: { name: "Representation", aliases: ["representations", "multiple representations", "table", "graph"], home: "functions", prereqs: [], def: "A way of showing a [[func|function]]: in words, as a table, as a graph or as an [[equation]]." },
    rate:         { name: "Rate of change", aliases: ["rate", "constant rate of change"], home: "functions", prereqs: [], def: "How much the output changes when the input goes up by 1." },
    slope:        { name: "Slope", aliases: ["gradient", "rise over run", "steepness"], home: "functions", prereqs: [], def: "How steep a line is on a graph: rise over run. It is the same as the [[rate|rate of change]]." },
    yint:         { name: "y-intercept", aliases: ["y intercept", "intercept", "initial value", "starting value"], home: "functions", prereqs: [], def: "Where a graph crosses the y-axis: the output when the input is 0." },
    zeroth:       { name: "0th entry", aliases: ["zeroth entry", "0th term", "zeroth term"], home: "functions", prereqs: ["sequences"], def: "The entry just before the 1st one in a [[sequence]]. It matches the [[yint|y-intercept]] of the matching [[linear|linear function]]." },
    linear:       { name: "Linear function", aliases: ["linear relationship", "linear"], home: "functions", prereqs: ["sequences"], def: "A [[func|function]] with a constant [[rate|rate of change]]. Its graph is a straight line." },

    // 9.7 Linear and other relationships
    slopetri:     { name: "Slope triangle", aliases: ["rise and run"], home: "relationships", prereqs: ["functions"], def: "A right triangle drawn on a line's graph. Its rise over run shows the [[slope]], and every one gives the same answer." },
    proportional: { name: "Proportional relationship", aliases: ["direct proportion", "direct variation", "proportional"], home: "relationships", prereqs: ["functions"], def: "A [[linear|linear relationship]] that goes through the origin: y = kx." },
    inverse:      { name: "Inverse proportion", aliases: ["inverse variation", "inversely proportional"], home: "relationships", prereqs: ["functions"], def: "When one quantity doubles the other halves: x · y stays the same. Its graph is a curve, not a line." },
    quadratic:    { name: "Quadratic function", aliases: ["quadratic", "parabola"], home: "relationships", prereqs: ["functions"], def: "A [[func|function]] like y = x², whose second [[differences]] are constant." },
    exponential:  { name: "Exponential function", aliases: ["exponential", "exponential growth"], home: "relationships", prereqs: ["functions", "sequences"], def: "A [[func|function]] like y = 2ˣ that multiplies by the same factor each step. Its first [[differences]] grow exponentially." },
    differences:  { name: "Differences", aliases: ["first differences", "second differences", "finite differences"], home: "relationships", prereqs: [], def: "Subtracting each output from the next. Constant first differences mean [[linear|linear]]; constant second differences mean [[quadratic|quadratic]]." }
  },

  order: ["expressions", "equations", "sequences", "functions", "relationships"],

  maps: {
    expressions: {
      title: "9.1–9.2 Expressions",
      types: ["part", "special", "needs"],
      blobs: [
        { id: "expression",  u: .44, v: .42, s: 112, c: "#2B3A55" },
        { id: "numexpr",     u: .18, v: .30, s: 98,  c: "#F2B544" },
        { id: "order",       u: .12, v: .70, s: 94,  c: "#E8705F" },
        { id: "variable",    u: .66, v: .22, s: 86,  c: "#3E8E8A" },
        { id: "term",        u: .62, v: .70, s: 80,  c: "#B9A5D6" },
        { id: "coefficient", u: .84, v: .78, s: 92,  c: "#F2B544" },
        { id: "equivexpr",   u: .86, v: .38, s: 104, c: "#E8705F" },
        { id: "structure",   u: .36, v: .84, s: 86,  c: "#3E8E8A" }
      ],
      edges: [
        { from: "numexpr", to: "expression", type: "special" },
        { from: "numexpr", to: "order", type: "needs" },
        { from: "variable", to: "expression", type: "part" },
        { from: "term", to: "expression", type: "part" },
        { from: "coefficient", to: "term", type: "part" },
        { from: "equivexpr", to: "variable", type: "needs" },
        { from: "structure", to: "expression", type: "part" },
        { from: "coefficient", to: "variable", type: "needs", tier: "valid" },
        { from: "term", to: "numexpr", type: "part", tier: "valid" }
      ]
    },

    equations: {
      title: "9.3 Equations",
      types: ["special", "needs", "models", "contrasts"],
      blobs: [
        { id: "equation",    u: .42, v: .44, s: 110, c: "#2B3A55" },
        { id: "expression",  u: .16, v: .26, s: 90,  c: "#B9A5D6" },
        { id: "solution",    u: .66, v: .22, s: 90,  c: "#F2B544" },
        { id: "identity",    u: .20, v: .74, s: 86,  c: "#3E8E8A" },
        { id: "conditional", u: .48, v: .84, s: 104, c: "#E8705F" },
        { id: "panbalance",  u: .80, v: .52, s: 90,  c: "#E8705F" },
        { id: "samesol",     u: .86, v: .20, s: 112, c: "#3E8E8A" }
      ],
      edges: [
        { from: "equation", to: "expression", type: "needs" },
        { from: "solution", to: "equation", type: "needs" },
        { from: "identity", to: "equation", type: "special" },
        { from: "conditional", to: "equation", type: "special" },
        { from: "identity", to: "conditional", type: "contrasts" },
        { from: "panbalance", to: "equation", type: "models" },
        { from: "panbalance", to: "samesol", type: "models" },
        { from: "samesol", to: "equation", type: "needs", tier: "valid" },
        { from: "samesol", to: "solution", type: "needs", tier: "valid" }
      ]
    },

    sequences: {
      title: "9.5 Sequences",
      types: ["special", "needs", "contrasts"],
      blobs: [
        { id: "sequence",    u: .38, v: .40, s: 108, c: "#2B3A55" },
        { id: "arithmetic",  u: .16, v: .22, s: 98,  c: "#3E8E8A" },
        { id: "geometric",   u: .62, v: .20, s: 98,  c: "#E8705F" },
        { id: "repeating",   u: .24, v: .74, s: 96,  c: "#B9A5D6" },
        { id: "remainder",   u: .52, v: .84, s: 98,  c: "#F2B544" },
        { id: "linear",      u: .80, v: .54, s: 92,  c: "#3E8E8A" },
        { id: "exponential", u: .88, v: .24, s: 100, c: "#E8705F" }
      ],
      edges: [
        { from: "arithmetic", to: "sequence", type: "special" },
        { from: "geometric", to: "sequence", type: "special" },
        { from: "repeating", to: "sequence", type: "special" },
        { from: "arithmetic", to: "geometric", type: "contrasts" },
        { from: "repeating", to: "remainder", type: "needs" },
        { from: "arithmetic", to: "linear", type: "special" },
        { from: "geometric", to: "exponential", type: "special" },
        { from: "repeating", to: "arithmetic", type: "contrasts", tier: "valid" }
      ]
    },

    functions: {
      title: "9.6 Functions",
      types: ["special", "needs", "same", "shownAs"],
      blobs: [
        { id: "func",           u: .36, v: .34, s: 108, c: "#2B3A55" },
        { id: "representation", u: .12, v: .62, s: 112, c: "#F2B544" },
        { id: "linear",         u: .54, v: .58, s: 104, c: "#3E8E8A" },
        { id: "rate",           u: .80, v: .34, s: 96,  c: "#E8705F" },
        { id: "slope",          u: .88, v: .72, s: 82,  c: "#B9A5D6" },
        { id: "yint",           u: .34, v: .84, s: 88,  c: "#E8705F" },
        { id: "zeroth",         u: .62, v: .18, s: 86,  c: "#B9A5D6" }
      ],
      edges: [
        { from: "func", to: "representation", type: "shownAs" },
        { from: "linear", to: "func", type: "special" },
        { from: "linear", to: "rate", type: "needs" },
        { from: "linear", to: "yint", type: "needs" },
        { from: "rate", to: "slope", type: "same" },
        { from: "zeroth", to: "yint", type: "same" },
        { from: "linear", to: "slope", type: "needs", tier: "valid" }
      ]
    },

    relationships: {
      title: "9.7 Linear & Other Relationships",
      types: ["special", "reveals", "contrasts"],
      blobs: [
        { id: "linear",       u: .40, v: .40, s: 108, c: "#3E8E8A" },
        { id: "slope",        u: .16, v: .22, s: 84,  c: "#B9A5D6" },
        { id: "slopetri",     u: .12, v: .58, s: 92,  c: "#F2B544" },
        { id: "proportional", u: .64, v: .18, s: 112, c: "#2B3A55" },
        { id: "inverse",      u: .86, v: .40, s: 100, c: "#E8705F" },
        { id: "quadratic",    u: .66, v: .76, s: 98,  c: "#F2B544" },
        { id: "exponential",  u: .88, v: .78, s: 100, c: "#E8705F" },
        { id: "differences",  u: .36, v: .84, s: 96,  c: "#B9A5D6" }
      ],
      edges: [
        { from: "slopetri", to: "slope", type: "reveals" },
        { from: "proportional", to: "linear", type: "special" },
        { from: "inverse", to: "linear", type: "contrasts" },
        { from: "quadratic", to: "linear", type: "contrasts" },
        { from: "differences", to: "linear", type: "reveals" },
        { from: "differences", to: "quadratic", type: "reveals" },
        { from: "differences", to: "exponential", type: "reveals" },
        { from: "exponential", to: "linear", type: "contrasts", tier: "valid" },
        { from: "inverse", to: "proportional", type: "contrasts", tier: "valid" }
      ]
    }
  }
};

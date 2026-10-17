// Demo content for mathblobs: Chapter 9 Algebra (pilot).
// Built from "Pilot Source Outline - Ch 9 Algebra" and the Link Research notes
// (decisions in "Link Research Decisions"); definitions are written in our own
// words, and the page numbers point at the photographed chapter.
//
// linkTypes: every connection type, with how it is drawn. `label` reads
//   "from <label> to", `back` reads the other way round. `symmetric` types
//   are accepted in either direction when checking a student's link.
// terms: every concept, keyed by id. `def` may link other terms with
//   [[id]] or [[id|shown text]]. `aliases` are other names a student may type
//   to summon it. `home` is the map the term belongs to; `prereqs` are maps a
//   student should know first.
// maps: ten lessons (9.1, 9.2, 9.3a, 9.3b, 9.5a, 9.5b, 9.6a, 9.6b, 9.7a, 9.7b),
//   and each map is that lesson's answer key. It lists the connection types the
//   lesson offers (`types`, at most 5), places its terms as blobs (u, v are 0–1
//   positions on the board, s is size in px, c is colour) and joins them with
//   typed edges. Edges are core by default (the clean chart a good student would
//   draw); `tier: "valid"` marks links that are true and accepted but not
//   expected, and never shown in the reveal. A blob with `tier: "valid"` is
//   accepted but not expected either; every link touching one is valid too.
//   `summary` is the short paragraph shown by the summary toggle, with the same
//   [[id|text]] links; it is read from here (not from saved state) so old saves
//   still get it.
//
// Still to check against the textbook photos ("check photos"): the terms the
// source outline does not name (most of the new ones), the links marked valid
// for that reason, and all of 9.6a. The links are drafts until Judy checks them.

window.MB_DEMO = {
  linkTypes: {
    special:    { label: "special case of", back: "has special case", short: "special case", c: "#3E8E8A", w: 7, dash: null },
    part:       { label: "part of", back: "made of", short: "part of", c: "#2B3A55", w: 5, dash: null },
    needs:      { label: "needs", back: "needed by", short: "needs", c: "#3E8E8A", w: 7, dash: "12 11" },
    same:       { label: "same as", back: "same as", short: "same as", c: "#B9A5D6", w: 7, dash: "1 12", symmetric: true },
    models:     { label: "models", back: "modeled by", short: "models", c: "#E8705F", w: 7, dash: "12 11" },
    reveals:    { label: "reveals", back: "revealed by", short: "reveals", c: "#F2B544", w: 11, dash: null },
    contrasts:  { label: "contrasts with", back: "contrasts with", short: "contrasts", c: "#E8705F", w: 7, dash: "1 12", symmetric: true },
    shownAs:    { label: "shown as", back: "shows", short: "shown as", c: "#F2B544", w: 9, dash: "16 12" }
  },

  terms: {
    // 9.1 Numerical Expressions
    numexpr: { name: "Numerical expression", aliases: ["numeric expression","arithmetic expression"], home: "numerical", prereqs: [], def: "An [[expression]] with only numbers and operations, like 4 + 2 × 3. You evaluate it using the [[order|order of operations]]." },
    order: { name: "Order of operations", aliases: ["PEMDAS","BODMAS","GEMDAS","order of operation"], home: "numerical", prereqs: [], def: "The agreed order for evaluating: parentheses, then exponents, then multiplication and division, then addition and subtraction." },
    operation: { name: "Operation", aliases: ["operations","operator","arithmetic operation"], home: "numerical", prereqs: [], def: "A basic action on numbers: add, subtract, multiply, divide or raise to a power." },
    exponent: { name: "Exponentiation", aliases: ["exponent","exponents","power","powers","exponentiation"], home: "numerical", prereqs: [], def: "Repeated multiplication shown with a small raised number, like 2³ = 2 × 2 × 2. It is an [[operation]]." },
    parens: { name: "Parentheses", aliases: ["grouping symbols","brackets","parenthesis"], home: "numerical", prereqs: [], def: "Symbols ( ) that group part of an [[expression]] so it is done first, as in the [[order|order of operations]]." },
    evaluate: { name: "Evaluating", aliases: ["evaluate","find the value","substitution","substitute","plug in","plugging in","check a solution","checking a solution"], home: "numerical", prereqs: [], def: "Finding the value of an [[expression]]: put a number in for each [[variable]], then work it out using the [[order|order of operations]]. Putting a number into an [[equation]] to see whether it is a [[solution]] is the same move." },
    equivexpr: { name: "Equivalent expressions", aliases: ["equivalent expression","equivalence"], home: "numerical", prereqs: [], def: "[[expression|Expressions]] that give the same value for every value of the [[variable]], like 2(x + 3) and 2x + 6." },
    properties: { name: "Properties of operations", aliases: ["commutative property","associative property","properties"], home: "numerical", prereqs: [], def: "Rules about adding and multiplying that are always true, like swapping the order of an addition or regrouping it." },
    distributive: { name: "Distributive property", aliases: ["distributive law","distributing","distribute","expanding"], home: "numerical", prereqs: [], def: "Multiplying by a group means multiplying each thing inside it: a(b + c) = ab + ac. It is one of the [[properties]] of operations." },

    // 9.2 Expressions with Variables
    expression: { name: "Expression", aliases: ["algebraic expression"], home: "expressions", prereqs: [], def: "Numbers, [[variable|variables]] and operations put together, like 3x + 5. It has a value once you know the variables." },
    variable: { name: "Variable", aliases: ["unknown"], home: "expressions", prereqs: [], def: "A letter that stands for a number, such as x in 3x + 5." },
    term: { name: "Term", home: "expressions", prereqs: [], def: "One of the parts of an [[expression]] joined by + or −. In 3x + 5 the terms are 3x and 5." },
    coefficient: { name: "Coefficient", home: "expressions", prereqs: [], def: "The number multiplying a [[variable]] in a [[term]]. In 3x it is 3." },
    constant: { name: "Constant", aliases: ["constant term","number term"], home: "expressions", prereqs: [], def: "A [[term]] that is just a number, with no [[variable]], like the 5 in 3x + 5." },
    liketerms: { name: "Like terms", aliases: ["like term","similar terms"], home: "expressions", prereqs: [], def: "[[term|Terms]] with exactly the same variable part, like 3x and 7x. Only like terms can be combined." },
    simplify: { name: "Simplifying", aliases: ["simplify","combine like terms","make simpler"], home: "expressions", prereqs: [], def: "Rewriting an [[expression]] in a shorter form with the same value, like 3x + 2x + 1 becomes 5x + 1, by combining [[liketerms|like terms]]." },
    structure: { name: "Structure", aliases: ["structure of an expression","expression structure"], home: "expressions", prereqs: [], def: "How an [[expression]] is built. Reading it can reveal a maximum, a minimum or the zeros without calculating." },
    zeros: { name: "Zero of an expression", aliases: ["zeros","zero","makes it zero"], home: "expressions", prereqs: [], def: "A value of the [[variable]] that makes the whole [[expression]] equal 0. For x − 4 it is x = 4." },

    // 9.3a Equations and Solutions
    equation: { name: "Equation", home: "equations", prereqs: ["expressions"], def: "A statement that two [[expression|expressions]] are equal, like 2x + 1 = 7." },
    equalsign: { name: "Equal sign", aliases: ["equals sign","equals","equality"], home: "equations", prereqs: [], def: "The = symbol. It says the two sides have the same value, not \"now do the calculation\"." },
    solution: { name: "Solution", aliases: ["root"], home: "equations", prereqs: [], def: "A value of the [[variable]] that makes an [[equation]] true. For 2x + 1 = 7 it is x = 3." },
    solset: { name: "Solution set", aliases: ["set of solutions","all the solutions"], home: "equations", prereqs: [], def: "All the values of the [[variable]] that make an [[equation]] true. It could be one value, several, every number, or none." },
    identity: { name: "Identity", aliases: ["identity equation"], home: "equations", prereqs: [], def: "An [[equation]] that is true for every value of the [[variable]], like 2(x + 3) = 2x + 6." },
    conditional: { name: "Conditional equation", aliases: ["conditional"], home: "equations", prereqs: [], def: "An [[equation]] that is true for some values of the [[variable]] but not others." },
    nosolution: { name: "No-solution equation", aliases: ["no solution","contradiction","inconsistent equation","never true"], home: "equations", prereqs: [], def: "An [[equation]] that is false for every value of the [[variable]], like x + 1 = x + 2." },

    // 9.3b Solving Equations
    solving: { name: "Solving an equation", aliases: ["solve","solve an equation","solving equations","isolating the variable"], home: "solvingeqs", prereqs: ["equations"], def: "Finding every value of the [[variable]] that makes an [[equation]] true, usually through a chain of [[samesol|same-solution transformations]]." },
    samesol: { name: "Same-solution transformation", aliases: ["same solution","balancing","same thing to both sides"], home: "solvingeqs", prereqs: ["equations"], def: "Doing the same thing to both sides of an [[equation]], so the [[solution]] does not change, just as a [[panbalance|pan balance]] stays level." },
    panbalance: { name: "Pan balance", aliases: ["balance","balance scale","scale"], home: "solvingeqs", prereqs: ["equations"], def: "A picture of an [[equation]] as a balanced scale: both sides weigh the same." },
    inverseop: { name: "Inverse operation", aliases: ["inverse operations","undo","opposite operation","opposite operations"], home: "solvingeqs", prereqs: ["equations"], def: "An operation that undoes another one: subtracting undoes adding, and dividing undoes multiplying. It is how you [[solving|solve]] for the [[variable]]." },

    // 9.5a Arithmetic and Geometric Sequences
    sequence: { name: "Sequence", aliases: ["number sequence"], home: "sequences", prereqs: [], def: "A list of numbers or objects in order. Each one sits at a [[position]]: 1st, 2nd, 3rd, …" },
    arithmetic: { name: "Arithmetic sequence", aliases: ["arithmetic progression","linear sequence"], home: "sequences", prereqs: [], def: "A [[sequence]] where you add the same amount each time (a constant difference), like 4, 7, 10, 13." },
    geometric: { name: "Geometric sequence", aliases: ["geometric progression"], home: "sequences", prereqs: [], def: "A [[sequence]] where you multiply by the same amount each time (a constant ratio), like 3, 6, 12, 24. With a positive ratio it behaves like an [[exponential|exponential function]]." },
    commondiff: { name: "Common difference", aliases: ["constant difference"], home: "sequences", prereqs: [], def: "The amount you add each step in an [[arithmetic]] sequence. Subtract any [[entry]] from the next one to find it. In 4, 7, 10, 13 it is 3." },
    commonratio: { name: "Common ratio", aliases: ["constant ratio","growth factor","multiplier"], home: "sequences", prereqs: [], def: "The amount you multiply by each step in a [[geometric]] sequence. Divide any [[entry]] by the one before it to find it. In 3, 6, 12, 24 it is 2. For an [[exponential|exponential function]] it is called the growth factor." },
    entry: { name: "Entry", aliases: ["term of a sequence","element","nth term","member"], home: "sequences", prereqs: [], def: "One number in a [[sequence]], like the 3rd number on the list." },
    position: { name: "Position", aliases: ["term number","index"], home: "sequences", prereqs: [], def: "The spot an [[entry]] sits in: 1st, 2nd, 3rd, and so on. It says where the entry is, not how big it is." },
    zeroth: { name: "0th entry", aliases: ["zeroth entry","0th term","zeroth term"], home: "sequences", prereqs: [], def: "The entry just before the 1st one in a [[sequence]]. It matches the [[yint|y-intercept]] of the matching [[linear|linear function]]." },

    // 9.5b Patterns and Rules
    repeating: { name: "Repeating pattern", aliases: ["repeating sequence","cycle","cyclic pattern"], home: "patterns", prereqs: [], def: "A pattern that cycles, like red, blue, green, red, blue, green. Finding what is in a given position uses [[remainder|division with remainder]]." },
    cyclelength: { name: "Cycle length", aliases: ["period","length of the cycle","cycle size"], home: "patterns", prereqs: [], def: "How many [[entry|entries]] a [[repeating|repeating pattern]] uses before it starts over. In red, blue, green, red, blue, green it is 3. It is the number you divide the [[position]] by." },
    remainder: { name: "Division with remainder", aliases: ["remainder","remainders"], home: "patterns", prereqs: [], def: "Dividing and keeping what is left over, like 17 ÷ 5 = 3 remainder 2." },
    explicit: { name: "Explicit rule", aliases: ["explicit formula","closed form","nth term rule","general rule"], home: "patterns", prereqs: [], def: "A rule that gives any [[entry]] straight from its [[position]] n. For 4, 7, 10, 13 it is 3n + 1, so you can jump to the 100th entry without listing the ones before it." },
    recursive: { name: "Recursive rule", aliases: ["recursive formula","recursion","recurrence relation"], home: "patterns", prereqs: [], def: "A rule that builds each [[entry]] from the one before it, like start at 4 and add 3 each time. To reach the 100th entry you have to work through the earlier ones." },

    // 9.6a What Is a Function
    func: { name: "Function", aliases: ["function rule","rule"], home: "functions", prereqs: ["expressions"], def: "A rule that gives exactly one [[output]] for each [[input]]." },
    input: { name: "Input", aliases: ["inputs","x-value","x value"], home: "functions", prereqs: [], def: "The number you put into a [[func|function]]." },
    output: { name: "Output", aliases: ["outputs","y-value","y value","result"], home: "functions", prereqs: [], def: "The number a [[func|function]] gives back for an [[input]]." },
    indvar: { name: "Independent variable", aliases: ["independent","input variable"], home: "functions", prereqs: [], def: "The [[variable]] you get to pick freely. It stands for the [[input]]." },
    depvar: { name: "Dependent variable", aliases: ["dependent","output variable"], home: "functions", prereqs: [], def: "The [[variable]] whose value depends on the [[indvar|independent variable]]. It stands for the [[output]]." },
    domain: { name: "Domain", aliases: ["domain of a function","set of inputs"], home: "functions", prereqs: [], def: "All the [[input|inputs]] a [[func|function]] is allowed to take." },
    range: { name: "Range", aliases: ["range of a function","set of outputs"], home: "functions", prereqs: [], def: "All the [[output|outputs]] a [[func|function]] actually gives." },
    orderedpair: { name: "Ordered pair", aliases: ["coordinate pair","coordinates","point"], home: "functions", prereqs: [], def: "Two numbers written (input, output), like (2, 7). On a [[graph]] it is one point." },
    vlt: { name: "Vertical line test", aliases: ["vertical line"], home: "functions", prereqs: [], def: "A check on a [[graph]]: if a vertical line touches it twice, one input has two outputs, so it is not a [[func|function]]." },

    // 9.6b Representations and Rate
    representation: { name: "Representation", aliases: ["representations","multiple representations"], home: "representations", prereqs: [], def: "A way of showing a [[func|function]]: in words, as a [[table]], as a [[graph]] or as an [[equation]]." },
    table: { name: "Table", aliases: ["table of values","input-output table","function table","x-y table"], home: "representations", prereqs: [], def: "A grid that lists each [[input]] next to the [[output]] it gives." },
    graph: { name: "Graph", aliases: ["graph of a function","coordinate graph","plot"], home: "representations", prereqs: [], def: "A picture of a [[func|function]] on a coordinate grid, with a point for each [[input]] and its [[output]]." },
    rate: { name: "Rate of change", aliases: ["rate","constant rate of change"], home: "representations", prereqs: ["functions"], def: "For a [[linear|linear function]], how much the output goes up each time the input goes up by 1." },
    slope: { name: "Slope", aliases: ["gradient","rise over run","steepness"], home: "representations", prereqs: ["functions"], def: "For a line, the same as the [[rate|rate of change]]: rise over run. It shows how steep the line is on a graph." },
    yint: { name: "y-intercept", aliases: ["y intercept","intercept","initial value","starting value"], home: "representations", prereqs: ["functions"], def: "Where a graph crosses the y-axis: the output when the input is 0." },

    // 9.7a Linear and Proportional
    linear: { name: "Linear function", aliases: ["linear relationship","linear"], home: "relationships", prereqs: ["functions"], def: "A [[func|function]] with a constant [[rate|rate of change]]. Its graph is a straight line." },
    slopetri: { name: "Slope triangle", aliases: ["rise and run"], home: "relationships", prereqs: ["functions"], def: "A right triangle drawn on a line's graph. Its rise over run shows the [[slope]], and every one gives the same answer." },
    proportional: { name: "Proportional relationship", aliases: ["direct proportion","direct variation","proportional"], home: "relationships", prereqs: ["functions"], def: "A [[linear|linear relationship]] that goes through the origin: y = kx." },
    origin: { name: "Origin", aliases: ["the origin","point (0,0)"], home: "relationships", prereqs: ["functions"], def: "The point (0, 0) where the two axes cross." },
    constk: { name: "Constant of proportionality", aliases: ["constant of variation","unit rate","proportionality constant","k"], home: "relationships", prereqs: ["functions"], def: "The fixed number k in y = kx. Divide any output by its input and you always get k. On the graph it is the [[slope]] of the line through the [[origin]]." },

    // 9.7b Nonlinear Relationships
    nonlinear: { name: "Nonlinear function", aliases: ["nonlinear","non-linear","nonlinear relationship"], home: "otherrelationships", prereqs: ["functions"], def: "A [[func|function]] whose graph is not a straight line, so its [[rate|rate of change]] is not constant. [[inverse|Inverse proportions]], [[quadratic|quadratics]] and [[exponential|exponentials]] are examples." },
    inverse: { name: "Inverse proportion", aliases: ["inverse variation","inversely proportional"], home: "otherrelationships", prereqs: ["functions"], def: "When one quantity doubles the other halves: x · y stays the same. Its graph is a curve, not a line." },
    quadratic: { name: "Quadratic function", aliases: ["quadratic","parabola"], home: "otherrelationships", prereqs: ["functions"], def: "A [[func|function]] like y = x², whose second [[differences]] are constant." },
    exponential: { name: "Exponential function", aliases: ["exponential","exponential growth"], home: "otherrelationships", prereqs: ["functions","sequences"], def: "A [[func|function]] like y = 2ˣ that multiplies by the same factor each step. Its first [[differences]] grow exponentially." },
    differences: { name: "Differences", aliases: ["first differences","second differences","finite differences"], home: "otherrelationships", prereqs: [], def: "Subtracting each output from the next. Constant first differences mean [[linear|linear]]; constant second differences mean [[quadratic|quadratic]]." }
  },

  order: ["numerical","expressions","equations","solvingeqs","sequences","patterns","functions","representations","relationships","otherrelationships"],

  maps: {
    numerical: {
      title: "9.1 Numerical Expressions",
      summary: "A [[numexpr|numerical expression]] is made of numbers and [[operation|operations]]: add, subtract, multiply, divide, or raise to a power with an [[exponent|exponent]]. To [[evaluate|evaluate]] one you follow the [[order|order of operations]], and [[parens|parentheses]] let you choose what is done first. The [[properties|properties of operations]], such as the [[distributive|distributive property]], let you rewrite an expression in a different form. Expressions that keep the same value this way are [[equivexpr|equivalent expressions]].",
      types: ["needs", "special", "reveals", "part"],
      blobs: [
        { id: "numexpr", u: 0.69, v: 0.49, s: 94, c: "#F2B544" },
        { id: "order", u: 0.46, v: 0.51, s: 112, c: "#2B3A55" },
        { id: "operation", u: 0.6, v: 0.8, s: 102, c: "#E8705F" },
        { id: "exponent", u: 0.38, v: 0.82, s: 90, c: "#3E8E8A" },
        { id: "parens", u: 0.25, v: 0.61, s: 90, c: "#B9A5D6" },
        { id: "evaluate", u: 0.26, v: 0.4, s: 94, c: "#E8705F" },
        { id: "equivexpr", u: 0.44, v: 0.14, s: 94, c: "#3E8E8A" },
        { id: "properties", u: 0.79, v: 0.32, s: 94, c: "#B9A5D6" },
        { id: "distributive", u: 0.58, v: 0.35, s: 98, c: "#F2B544" }
      ],
      edges: [
        { from: "numexpr", to: "order", type: "needs" },
        { from: "distributive", to: "properties", type: "special" },
        { from: "distributive", to: "equivexpr", type: "reveals" },
        { from: "evaluate", to: "order", type: "needs" },
        { from: "order", to: "operation", type: "needs" },
        { from: "exponent", to: "operation", type: "special" },
        { from: "parens", to: "order", type: "part", alt: [{ type: "needs", flip: true }] },
        { from: "exponent", to: "order", type: "part", alt: [{ type: "needs", flip: true }] },
        { from: "equivexpr", to: "evaluate", type: "needs", tier: "valid" },
        { from: "operation", to: "numexpr", type: "part", tier: "valid", alt: [{ type: "needs", flip: true }] },
        { from: "properties", to: "operation", type: "needs", tier: "valid" },
        { from: "properties", to: "equivexpr", type: "reveals", tier: "valid" },
        { from: "distributive", to: "parens", type: "needs", tier: "valid" },
        { from: "distributive", to: "operation", type: "needs", tier: "valid" },
        { from: "evaluate", to: "numexpr", type: "needs", tier: "valid" }
      ]
    },

    expressions: {
      title: "9.2 Expressions with Variables",
      summary: "An [[expression|expression]] is built from numbers and [[variable|variables]], like 3x + 5. Each part joined by + or − is a [[term|term]]. The number multiplying a variable is its [[coefficient|coefficient]], and a [[constant|constant]] is a term with no variable. [[liketerms|Like terms]] have the same variable part, so you can combine them to [[simplify|simplify]] the expression. Looking at its [[structure|structure]] can show you its [[zeros|zeros]] without any calculating.",
      types: ["part", "special", "needs", "reveals"],
      blobs: [
        { id: "expression", u: 0.49, v: 0.47, s: 112, c: "#2B3A55" },
        { id: "variable", u: 0.65, v: 0.72, s: 102, c: "#F2B544" },
        { id: "term", u: 0.45, v: 0.75, s: 104, c: "#E8705F" },
        { id: "coefficient", u: 0.26, v: 0.86, s: 98, c: "#3E8E8A" },
        { id: "constant", u: 0.23, v: 0.59, s: 90, c: "#B9A5D6" },
        { id: "liketerms", u: 0.34, v: 0.46, s: 98, c: "#B9A5D6" },
        { id: "simplify", u: 0.34, v: 0.14, s: 90, c: "#E8705F" },
        { id: "structure", u: 0.61, v: 0.21, s: 94, c: "#3E8E8A" },
        { id: "zeros", u: 0.81, v: 0.37, s: 94, c: "#B9A5D6" }
      ],
      edges: [
        { from: "variable", to: "expression", type: "part", alt: [{ type: "needs", flip: true }] },
        { from: "term", to: "expression", type: "part", alt: ["special", { type: "needs", flip: true }] },
        { from: "coefficient", to: "term", type: "part" },
        { from: "constant", to: "term", type: "special" },
        { from: "simplify", to: "liketerms", type: "needs" },
        { from: "liketerms", to: "term", type: "needs" },
        { from: "structure", to: "expression", type: "part" },
        { from: "structure", to: "zeros", type: "reveals" },
        { from: "coefficient", to: "variable", type: "needs", tier: "valid" },
        { from: "variable", to: "term", type: "part", tier: "valid" },
        { from: "zeros", to: "expression", type: "needs", tier: "valid" },
        { from: "zeros", to: "variable", type: "needs", tier: "valid" },
        { from: "simplify", to: "expression", type: "needs", tier: "valid" },
        { from: "structure", to: "term", type: "needs", tier: "valid" },
        { from: "liketerms", to: "coefficient", type: "needs", tier: "valid" },
        { from: "liketerms", to: "variable", type: "needs", tier: "valid" },
        { from: "coefficient", to: "expression", type: "part", tier: "valid" },
        { from: "constant", to: "expression", type: "part", tier: "valid" }
      ]
    },

    equations: {
      title: "9.3a Equations and Solutions",
      summary: "An [[equation|equation]] says that two [[expression|expressions]] have the same value, and the [[equalsign|equal sign]] is what says it. A [[solution|solution]] is a value of the variable that makes the equation true, and the [[solset|solution set]] is all of those values together. If every value works, the equation is an [[identity|identity]], and its two sides are [[equivexpr|equivalent expressions]]. If only some values work, it is a [[conditional|conditional equation]]. If none work, it is a [[nosolution|no-solution equation]].",
      types: ["needs", "special", "contrasts", "part", "reveals"],
      blobs: [
        { id: "equation", u: 0.47, v: 0.48, s: 112, c: "#2B3A55" },
        { id: "expression", u: 0.68, v: 0.69, s: 90, c: "#F2B544" },
        { id: "equalsign", u: 0.54, v: 0.82, s: 86, c: "#E8705F" },
        { id: "solution", u: 0.4, v: 0.77, s: 102, c: "#3E8E8A" },
        { id: "solset", u: 0.21, v: 0.55, s: 102, c: "#B9A5D6" },
        { id: "identity", u: 0.31, v: 0.27, s: 104, c: "#F2B544" },
        { id: "conditional", u: 0.48, v: 0.14, s: 102, c: "#E8705F" },
        { id: "nosolution", u: 0.68, v: 0.43, s: 80, c: "#3E8E8A", tier: "valid" },
        { id: "equivexpr", u: 0.57, v: 0.31, s: 90, c: "#B9A5D6" }
      ],
      edges: [
        { from: "equation", to: "expression", type: "needs", alt: [{ type: "part", flip: true }] },
        { from: "solution", to: "equation", type: "needs" },
        { from: "identity", to: "equation", type: "special" },
        { from: "conditional", to: "equation", type: "special" },
        { from: "identity", to: "conditional", type: "contrasts" },
        { from: "equalsign", to: "equation", type: "part", alt: [{ type: "needs", flip: true }] },
        { from: "identity", to: "equivexpr", type: "needs" },
        { from: "solution", to: "solset", type: "part", tier: "valid", alt: [{ type: "needs", flip: true }] },
        { from: "nosolution", to: "equation", type: "special", tier: "valid" },
        { from: "identity", to: "nosolution", type: "contrasts", tier: "valid" },
        { from: "conditional", to: "nosolution", type: "contrasts", tier: "valid" },
        { from: "solset", to: "equation", type: "needs", tier: "valid" },
        { from: "identity", to: "solution", type: "needs", tier: "valid" },
        { from: "conditional", to: "solution", type: "needs", tier: "valid" },
        { from: "nosolution", to: "solution", type: "needs", tier: "valid" },
        { from: "solset", to: "identity", type: "reveals", tier: "valid" },
        { from: "solset", to: "conditional", type: "reveals", tier: "valid" },
        { from: "solset", to: "nosolution", type: "reveals", tier: "valid" },
        { from: "equivexpr", to: "expression", type: "needs", tier: "valid" }
      ]
    },

    solvingeqs: {
      title: "9.3b Solving Equations",
      summary: "[[solving|Solving]] an [[equation|equation]] means finding the [[solution|solution]]: the value of the [[variable|variable]] that makes it true. A [[panbalance|pan balance]] pictures the equation as a level scale, so doing the same thing to both sides, a [[samesol|same-solution transformation]], keeps the solution safe. Each step usually uses an [[inverseop|inverse operation]] to undo what was done to the variable. To check an answer you [[evaluate|put it in]] and see whether both sides match.",
      types: ["needs", "models", "reveals", "part"],
      blobs: [
        { id: "equation", u: 0.59, v: 0.55, s: 98, c: "#F2B544" },
        { id: "solving", u: 0.45, v: 0.46, s: 112, c: "#2B3A55" },
        { id: "solution", u: 0.61, v: 0.77, s: 102, c: "#E8705F" },
        { id: "samesol", u: 0.4, v: 0.78, s: 102, c: "#3E8E8A" },
        { id: "panbalance", u: 0.3, v: 0.54, s: 102, c: "#B9A5D6" },
        { id: "inverseop", u: 0.36, v: 0.14, s: 94, c: "#F2B544" },
        { id: "evaluate", u: 0.58, v: 0.35, s: 90, c: "#3E8E8A" },
        { id: "variable", u: 0.79, v: 0.47, s: 98, c: "#F2B544" }
      ],
      edges: [
        { from: "solution", to: "equation", type: "needs" },
        { from: "panbalance", to: "equation", type: "models" },
        { from: "panbalance", to: "samesol", type: "models" },
        { from: "solving", to: "samesol", type: "needs", alt: [{ type: "part", flip: true }] },
        { from: "solving", to: "solution", type: "reveals" },
        { from: "solving", to: "equation", type: "needs" },
        { from: "samesol", to: "equation", type: "needs" },
        { from: "samesol", to: "solution", type: "needs" },
        { from: "evaluate", to: "solution", type: "reveals" },
        { from: "panbalance", to: "solving", type: "models", tier: "valid" },
        { from: "solving", to: "inverseop", type: "needs", tier: "valid" },
        { from: "panbalance", to: "variable", type: "models", tier: "valid" },
        { from: "panbalance", to: "inverseop", type: "models", tier: "valid" },
        { from: "solution", to: "variable", type: "needs", tier: "valid" },
        { from: "evaluate", to: "variable", type: "needs", tier: "valid" },
        { from: "samesol", to: "inverseop", type: "needs", tier: "valid" },
        { from: "solving", to: "variable", type: "needs", tier: "valid" }
      ]
    },

    sequences: {
      title: "9.5a Arithmetic and Geometric Sequences",
      summary: "A [[sequence|sequence]] is a list in order, and each [[entry|entry]] sits at a [[position|position]]. The entry just before the 1st is the [[zeroth|0th entry]]. In an [[arithmetic|arithmetic sequence]] you add the same [[commondiff|common difference]] each time. In a [[geometric|geometric sequence]] you multiply by the same [[commonratio|common ratio]]. Taking the [[differences|differences]] between neighbors helps you see which kind you have.",
      types: ["special", "contrasts", "needs", "reveals", "part"],
      blobs: [
        { id: "sequence", u: 0.48, v: 0.46, s: 112, c: "#2B3A55" },
        { id: "arithmetic", u: 0.64, v: 0.66, s: 98, c: "#F2B544" },
        { id: "geometric", u: 0.48, v: 0.86, s: 98, c: "#E8705F" },
        { id: "commondiff", u: 0.41, v: 0.66, s: 102, c: "#3E8E8A" },
        { id: "commonratio", u: 0.27, v: 0.73, s: 102, c: "#B9A5D6" },
        { id: "differences", u: 0.22, v: 0.4, s: 104, c: "#F2B544" },
        { id: "entry", u: 0.4, v: 0.14, s: 102, c: "#E8705F" },
        { id: "position", u: 0.71, v: 0.17, s: 90, c: "#3E8E8A" },
        { id: "zeroth", u: 0.72, v: 0.48, s: 94, c: "#F2B544" }
      ],
      edges: [
        { from: "arithmetic", to: "sequence", type: "special" },
        { from: "geometric", to: "sequence", type: "special" },
        { from: "arithmetic", to: "geometric", type: "contrasts" },
        { from: "arithmetic", to: "commondiff", type: "needs", alt: [{ type: "part", flip: true }] },
        { from: "geometric", to: "commonratio", type: "needs", alt: [{ type: "part", flip: true }] },
        { from: "sequence", to: "entry", type: "needs", tier: "valid", alt: [{ type: "part", flip: true }] },
        { from: "commondiff", to: "commonratio", type: "contrasts", tier: "valid" },
        { from: "entry", to: "position", type: "needs", tier: "valid" },
        { from: "commondiff", to: "entry", type: "needs", tier: "valid" },
        { from: "commonratio", to: "entry", type: "needs", tier: "valid" },
        { from: "differences", to: "sequence", type: "needs", tier: "valid" },
        { from: "zeroth", to: "sequence", type: "needs", tier: "valid" },
        { from: "sequence", to: "position", type: "needs", tier: "valid" },
        { from: "differences", to: "entry", type: "needs", tier: "valid" },
        { from: "zeroth", to: "commondiff", type: "needs", tier: "valid" },
        { from: "zeroth", to: "commonratio", type: "needs", tier: "valid" },
        { from: "differences", to: "arithmetic", type: "reveals", tier: "valid" },
        { from: "differences", to: "commondiff", type: "reveals", tier: "valid" },
        { from: "differences", to: "geometric", type: "reveals", tier: "valid" },
        { from: "differences", to: "commonratio", type: "reveals", tier: "valid" }
      ]
    },

    patterns: {
      title: "9.5b Patterns and Rules",
      summary: "A [[sequence|sequence]] can be described by a rule. An [[explicit|explicit rule]] gives any entry straight from its [[position|position]], and a [[recursive|recursive rule]] builds each entry from the one before it. A sequence is also a [[func|function]] of position. A [[repeating|repeating pattern]] cycles, and its [[cyclelength|cycle length]] says how many entries come before it starts over. To find what sits in a given position, use [[remainder|division with remainder]].",
      types: ["special", "needs", "shownAs", "contrasts"],
      blobs: [
        { id: "sequence", u: 0.48, v: 0.46, s: 112, c: "#2B3A55" },
        { id: "repeating", u: 0.63, v: 0.72, s: 102, c: "#F2B544" },
        { id: "cyclelength", u: 0.35, v: 0.86, s: 86, c: "#E8705F" },
        { id: "remainder", u: 0.41, v: 0.68, s: 86, c: "#3E8E8A" },
        { id: "position", u: 0.23, v: 0.58, s: 94, c: "#B9A5D6" },
        { id: "explicit", u: 0.31, v: 0.14, s: 94, c: "#F2B544" },
        { id: "recursive", u: 0.63, v: 0.14, s: 90, c: "#E8705F" },
        { id: "func", u: 0.78, v: 0.37, s: 90, c: "#3E8E8A" }
      ],
      edges: [
        { from: "repeating", to: "sequence", type: "special" },
        { from: "repeating", to: "remainder", type: "needs" },
        { from: "sequence", to: "func", type: "special", tier: "valid" },
        { from: "repeating", to: "cyclelength", type: "needs", tier: "valid" },
        { from: "sequence", to: "explicit", type: "shownAs", tier: "valid" },
        { from: "sequence", to: "recursive", type: "shownAs", tier: "valid" },
        { from: "explicit", to: "recursive", type: "contrasts", tier: "valid" },
        { from: "explicit", to: "position", type: "needs", tier: "valid" },
        { from: "repeating", to: "position", type: "needs", tier: "valid" },
        { from: "sequence", to: "position", type: "needs", tier: "valid" },
        { from: "repeating", to: "func", type: "special", tier: "valid" }
      ]
    },

    functions: {
      title: "9.6a What Is a Function",
      summary: "A [[func|function]] gives exactly one [[output|output]] for each [[input|input]]. The [[indvar|independent variable]] stands for the input and the [[depvar|dependent variable]] stands for the output. The [[domain|domain]] is all the inputs allowed, and the [[range|range]] is the outputs that actually come out. An [[orderedpair|ordered pair]] writes one input with its output. On a graph, the [[vlt|vertical line test]] checks that no input has two outputs.",
      types: ["needs", "same", "part", "reveals"],
      blobs: [
        { id: "func", u: 0.49, v: 0.42, s: 112, c: "#2B3A55" },
        { id: "input", u: 0.62, v: 0.69, s: 102, c: "#F2B544" },
        { id: "output", u: 0.4, v: 0.65, s: 102, c: "#E8705F" },
        { id: "indvar", u: 0.42, v: 0.86, s: 94, c: "#3E8E8A" },
        { id: "depvar", u: 0.2, v: 0.73, s: 94, c: "#B9A5D6" },
        { id: "domain", u: 0.23, v: 0.53, s: 94, c: "#E8705F" },
        { id: "range", u: 0.36, v: 0.14, s: 94, c: "#3E8E8A" },
        { id: "orderedpair", u: 0.68, v: 0.22, s: 94, c: "#3E8E8A" },
        { id: "vlt", u: 0.79, v: 0.52, s: 86, c: "#B9A5D6" }
      ],
      edges: [
        { from: "func", to: "input", type: "needs" },
        { from: "func", to: "output", type: "needs" },
        { from: "output", to: "input", type: "needs" },
        { from: "indvar", to: "input", type: "same" },
        { from: "depvar", to: "output", type: "same" },
        { from: "depvar", to: "indvar", type: "needs" },
        { from: "input", to: "orderedpair", type: "part", tier: "valid", alt: [{ type: "needs", flip: true }] },
        { from: "output", to: "orderedpair", type: "part", tier: "valid", alt: [{ type: "needs", flip: true }] },
        { from: "orderedpair", to: "func", type: "part", tier: "valid", alt: [{ type: "needs", flip: true }] },
        { from: "domain", to: "func", type: "part", tier: "valid", alt: [{ type: "needs", flip: true }] },
        { from: "range", to: "func", type: "part", tier: "valid", alt: [{ type: "needs", flip: true }] },
        { from: "range", to: "domain", type: "needs", tier: "valid" },
        { from: "input", to: "domain", type: "part", tier: "valid", alt: [{ type: "needs", flip: true }] },
        { from: "output", to: "range", type: "part", tier: "valid", alt: [{ type: "needs", flip: true }] },
        { from: "vlt", to: "func", type: "needs", tier: "valid", alt: ["reveals"] },
        { from: "func", to: "indvar", type: "needs", tier: "valid" },
        { from: "func", to: "depvar", type: "needs", tier: "valid" }
      ]
    },

    representations: {
      title: "9.6b Representations and Rate",
      summary: "A [[func|function]] can be shown in different ways, called [[representation|representations]]: in words, as a [[table|table]], as a [[graph|graph]] or as an [[equation|equation]]. On a graph, the [[slope|slope]] tells you how steep the line is, which is the same as the [[rate|rate of change]]. The line crosses the y-axis at the [[yint|y-intercept]], which matches the [[zeroth|0th entry]] of the matching sequence.",
      types: ["shownAs", "same", "special", "part", "needs"],
      blobs: [
        { id: "func", u: 0.67, v: 0.64, s: 104, c: "#F2B544" },
        { id: "representation", u: 0.48, v: 0.46, s: 112, c: "#2B3A55" },
        { id: "table", u: 0.46, v: 0.83, s: 90, c: "#E8705F" },
        { id: "graph", u: 0.4, v: 0.64, s: 98, c: "#3E8E8A" },
        { id: "equation", u: 0.26, v: 0.63, s: 90, c: "#B9A5D6" },
        { id: "rate", u: 0.24, v: 0.43, s: 90, c: "#E8705F" },
        { id: "slope", u: 0.41, v: 0.26, s: 90, c: "#B9A5D6" },
        { id: "yint", u: 0.56, v: 0.27, s: 94, c: "#B9A5D6" },
        { id: "zeroth", u: 0.78, v: 0.37, s: 86, c: "#F2B544" }
      ],
      edges: [
        { from: "func", to: "representation", type: "shownAs" },
        { from: "rate", to: "slope", type: "same" },
        { from: "table", to: "representation", type: "special" },
        { from: "graph", to: "representation", type: "special" },
        { from: "equation", to: "representation", type: "special" },
        { from: "zeroth", to: "yint", type: "same" },
        { from: "yint", to: "graph", type: "part" },
        { from: "slope", to: "graph", type: "needs" },
        { from: "func", to: "graph", type: "shownAs", tier: "valid" },
        { from: "func", to: "table", type: "shownAs", tier: "valid" },
        { from: "func", to: "equation", type: "shownAs", tier: "valid" },
        { from: "rate", to: "func", type: "needs", tier: "valid" },
        { from: "yint", to: "func", type: "needs", tier: "valid" }
      ]
    },

    relationships: {
      title: "9.7a Linear and Proportional",
      summary: "A [[linear|linear function]] is a [[func|function]] with a constant [[rate|rate of change]], which is the same as its [[slope|slope]]. A [[slopetri|slope triangle]] drawn on its graph reveals that slope, and the line crosses the y-axis at the [[yint|y-intercept]]. A [[proportional|proportional relationship]] is a linear one that passes through the [[origin|origin]], and its [[constk|constant of proportionality]] is the slope.",
      types: ["needs", "special", "reveals", "same", "part"],
      blobs: [
        { id: "linear", u: 0.46, v: 0.48, s: 112, c: "#2B3A55" },
        { id: "func", u: 0.74, v: 0.49, s: 98, c: "#F2B544" },
        { id: "rate", u: 0.55, v: 0.82, s: 104, c: "#E8705F" },
        { id: "slope", u: 0.36, v: 0.74, s: 102, c: "#3E8E8A" },
        { id: "slopetri", u: 0.22, v: 0.49, s: 98, c: "#B9A5D6" },
        { id: "yint", u: 0.28, v: 0.29, s: 94, c: "#E8705F" },
        { id: "proportional", u: 0.55, v: 0.22, s: 104, c: "#B9A5D6" },
        { id: "origin", u: 0.77, v: 0.2, s: 86, c: "#3E8E8A" },
        { id: "constk", u: 0.6, v: 0.56, s: 98, c: "#F2B544" }
      ],
      edges: [
        { from: "linear", to: "rate", type: "needs" },
        { from: "proportional", to: "linear", type: "special" },
        { from: "proportional", to: "origin", type: "needs" },
        { from: "proportional", to: "constk", type: "needs", alt: [{ type: "part", flip: true }] },
        { from: "slopetri", to: "slope", type: "reveals" },
        { from: "rate", to: "slope", type: "same" },
        { from: "linear", to: "slope", type: "needs" },
        { from: "constk", to: "slope", type: "same" },
        { from: "linear", to: "func", type: "special", tier: "valid" },
        { from: "linear", to: "yint", type: "needs", tier: "valid" },
        { from: "slopetri", to: "linear", type: "needs", tier: "valid" },
        { from: "slopetri", to: "rate", type: "reveals", tier: "valid" },
        { from: "constk", to: "rate", type: "same", tier: "valid" },
        { from: "proportional", to: "yint", type: "needs", tier: "valid" },
        { from: "slopetri", to: "constk", type: "reveals", tier: "valid" },
        { from: "proportional", to: "rate", type: "needs", tier: "valid" },
        { from: "proportional", to: "slope", type: "needs", tier: "valid" },
        { from: "proportional", to: "func", type: "special", tier: "valid" },
        { from: "rate", to: "func", type: "needs", tier: "valid" },
        { from: "yint", to: "func", type: "needs", tier: "valid" }
      ]
    },

    otherrelationships: {
      title: "9.7b Nonlinear Relationships",
      summary: "A [[linear|linear function]] has a constant rate of change, and a [[proportional|proportional relationship]] is a linear one through the origin. A [[nonlinear|nonlinear function]] is anything else. An [[inverse|inverse proportion]] makes a curve, a [[quadratic|quadratic function]] has constant second differences, and an [[exponential|exponential function]] multiplies by the same [[commonratio|growth factor]] each step. Checking the [[differences|differences]] tells you which kind you have. An [[arithmetic|arithmetic sequence]] acts like a linear function, and a [[geometric|geometric sequence]] acts like an exponential one.",
      types: ["special", "reveals", "contrasts", "needs"],
      blobs: [
        { id: "nonlinear", u: 0.51, v: 0.45, s: 112, c: "#2B3A55", tier: "valid" },
        { id: "linear", u: 0.43, v: 0.64, s: 104, c: "#F2B544" },
        { id: "proportional", u: 0.61, v: 0.86, s: 90, c: "#E8705F" },
        { id: "inverse", u: 0.28, v: 0.86, s: 94, c: "#3E8E8A" },
        { id: "quadratic", u: 0.22, v: 0.67, s: 98, c: "#B9A5D6" },
        { id: "exponential", u: 0.22, v: 0.45, s: 104, c: "#E8705F" },
        { id: "differences", u: 0.35, v: 0.31, s: 104, c: "#3E8E8A" },
        { id: "commonratio", u: 0.53, v: 0.14, s: 94, c: "#B9A5D6" },
        { id: "arithmetic", u: 0.65, v: 0.24, s: 80, c: "#B9A5D6", tier: "valid" },
        { id: "geometric", u: 0.67, v: 0.59, s: 80, c: "#F2B544", tier: "valid" }
      ],
      edges: [
        { from: "proportional", to: "linear", type: "special" },
        { from: "differences", to: "linear", type: "reveals" },
        { from: "differences", to: "quadratic", type: "reveals" },
        { from: "differences", to: "exponential", type: "reveals" },
        { from: "inverse", to: "linear", type: "contrasts" },
        { from: "quadratic", to: "linear", type: "contrasts" },
        { from: "exponential", to: "linear", type: "contrasts" },
        { from: "nonlinear", to: "linear", type: "contrasts", tier: "valid" },
        { from: "exponential", to: "commonratio", type: "needs", tier: "valid" },
        { from: "inverse", to: "proportional", type: "contrasts", tier: "valid" },
        { from: "differences", to: "nonlinear", type: "reveals", tier: "valid" },
        { from: "inverse", to: "nonlinear", type: "special", tier: "valid" },
        { from: "quadratic", to: "nonlinear", type: "special", tier: "valid" },
        { from: "exponential", to: "nonlinear", type: "special", tier: "valid" },
        { from: "quadratic", to: "exponential", type: "contrasts", tier: "valid" },
        { from: "differences", to: "commonratio", type: "reveals", tier: "valid" },
        { from: "arithmetic", to: "geometric", type: "contrasts", tier: "valid" },
        { from: "arithmetic", to: "linear", type: "special", tier: "valid" },
        { from: "geometric", to: "exponential", type: "special", tier: "valid" },
        { from: "geometric", to: "commonratio", type: "needs", tier: "valid" },
        { from: "arithmetic", to: "exponential", type: "contrasts", tier: "valid" },
        { from: "geometric", to: "linear", type: "contrasts", tier: "valid" },
        { from: "differences", to: "arithmetic", type: "reveals", tier: "valid" },
        { from: "differences", to: "geometric", type: "reveals", tier: "valid" }
      ]
    }
  }
};

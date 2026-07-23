// ═══════════════════════════════════════════════════════════════════
//  rotations - the turned sheet as palimpsest
//
//  The whole piece, in three lines - this alone is a complete sketch:
//      const plot = new GysinPlot({ seed: 1960 });
//      plot.lattice("COME TO FREE THE WORDS", 0, 0, 700, 1160, { turns: [4, 94] });
//      plot.text("FREE THE WORDS COME TO", 120, 300, { size: 24, angle: 96 });
//      plot.draw();
//  Everything below is elaboration, layered the way the studio layered:
//  the machine drawing (a roller grid, turned slightly off true) as the
//  ground, the written field crossing it edge to edge in two off-square
//  passes, and the silent script over everything - the five cyclic
//  orders of the phrase scattered at their own angles, some running as
//  columns, one upside down. Nothing centres, nothing reads top-left to
//  bottom-right; the sheet is entered anywhere.
// ═══════════════════════════════════════════════════════════════════

const PHRASE = "COME TO FREE THE WORDS";
const INK = "#151515";
const RED = "#b5362b";
const BLUE = "#244f73";
const GROUND = "#b3a98f";
const W = 700;
const H = 1160;

const WEAR_STEPS = [0.6, 1, 1.5, 2.1];

// Anchor fractions and base angles for the five cyclic orders: spread
// over the whole sheet, two as columns (up and down), one upside down.
const SCRIPT_ANCHORS = [
  { fx: 0.10, fy: 0.16, angle: -7 },
  { fx: 0.78, fy: 0.08, angle: 96 },
  { fx: 0.34, fy: 0.52, angle: 178 },
  { fx: 0.90, fy: 0.90, angle: -94 },
  { fx: 0.06, fy: 0.78, angle: 4 }
];

let plot;
let currentSeed = 1960;
let latticeIds = [];
let wearIndex = 1;
let firstPassFrozen = false;

function setup() {
  const canvas = createCanvas(W, H);
  canvas.parent("sketch");
  pixelDensity(1);
  noLoop();
  buildPlot(currentSeed);
  wireActions();
}

function draw() {
  background("#f0efe9");
  plot.draw();
}

// Small seeded generator for the scatter, so the sheet is reproducible
// without leaning on p5's random state.
function mulberry(seed) {
  let a = seed >>> 0;
  return function() {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildPlot(seed) {
  currentSeed = seed;
  firstPassFrozen = false;
  const rng = mulberry(seed);
  plot = new GysinPlot({
    seed,
    width: W,
    height: H,
    style: { stroke: INK, strokeWeight: 1.15, alpha: 0.9 }
  });

  // ── 1 · the machine drawing: the roller grid as ground ───────────
  // Larger than the sheet and turned a few degrees off true, so it
  // bleeds off every edge and never squares up with the frame.
  plot.grid(-40, -40, W + 80, H + 80, 5, 8, {
    outer: false,
    frame: {
      angle: 1.5 + rng() * 2.5,
      pivot: { x: W / 2, y: H / 2 },
      stroke: GROUND,
      alpha: 0.55,
      strokeWeight: 2.6,
      layer: "ground"
    }
  });

  // ── 2 · the written field: two off-square passes, edge to edge ───
  // The lattice covers the whole sheet; turns [4, 94] keep the two
  // writings a few degrees off the grid, the hand against the machine.
  latticeIds = plot.lattice(PHRASE, -15, -15, W + 30, H + 30, {
    size: 15,
    lineHeight: 1.5,
    turns: [4, 94],
    wear: WEAR_STEPS[wearIndex]
  });

  // ── 3 · the lexical drift: orders embedded through the field ─────
  // Fourteen dictionary orders of the phrase, scattered over a loose
  // jittered grid so the coverage stays all-over, each running in one
  // of the sheet's directions.
  const orders = GysinText.permute(PHRASE, { order: "lexical", limit: 15 }).slice(1);
  orders.forEach((row, index) => {
    const cx = ((index % 3) + 0.15 + rng() * 0.7) / 3 * W;
    const cy = (Math.floor(index / 3) + 0.15 + rng() * 0.7) / 5 * H;
    const direction = [0, 90, 180, -90][Math.floor(rng() * 4)];
    plot.text(row, cx, cy, {
      size: 11,
      angle: direction + (rng() - 0.5) * 10,
      breathe: 0.3 + rng() * 0.5,
      dropout: 0.02 + rng() * 0.04,
      alpha: 0.6,
      stroke: BLUE,
      layer: "drift"
    });
  });

  // ── 4 · the silent script: the five cyclic orders, over all ──────
  // Order "rotate" walks the first word to the back; each order is
  // written large at its own place and its own angle, columns among
  // rows, one upside down - the phrase turning through the sheet
  // instead of around a pin.
  const turns = GysinText.permute(PHRASE, { order: "rotate" });
  turns.forEach((row, index) => {
    const a = SCRIPT_ANCHORS[index % SCRIPT_ANCHORS.length];
    plot.text(row, a.fx * W + (rng() - 0.5) * 50, a.fy * H + (rng() - 0.5) * 60, {
      size: 24,
      angle: a.angle + (rng() - 0.5) * 8,
      breathe: 0.5 + index * 0.2,
      dropout: 0.015 + index * 0.012,
      strokeWeight: 1.5,
      stroke: RED,
      layer: "script"
    });
  });

  // ── 5 · the knots: asemic script where the layers meet ───────────
  for (let knot = 0; knot < 3; knot++) {
    plot.asemic(60 + rng() * (W - 220), 60 + rng() * (H - 220), 90 + rng() * 70, 70 + rng() * 60, {
      wobble: 1.2,
      dropout: 0.06,
      alpha: 0.75,
      layer: "script"
    });
  }
}

// The wear knob works on the standing field: every lattice row is an
// addressable shape, so update() re-tunes its disturbance in place - no
// rebuild, the ids and the frozen state survive.
function applyWear() {
  wearIndex = (wearIndex + 1) % WEAR_STEPS.length;
  const wear = WEAR_STEPS[wearIndex];
  const perPass = latticeIds.length / 2;
  latticeIds.forEach((id, index) => {
    const pass = index < perPass ? 0 : 1;
    plot.update(id, {
      wobble: (0.3 + 0.55 * pass) * wear,
      dropout: (0.01 + 0.035 * pass) * wear,
      drift: 0.22 * pass * wear
    });
  });
  updateLabels();
  redraw();
}

// Freeze the first writing; only the later hand rerolls. The first
// pass becomes the fixed ground the second keeps crossing.
function toggleFirstPass() {
  firstPassFrozen = !firstPassFrozen;
  const perPass = Math.floor(latticeIds.length / 2);
  latticeIds.slice(0, perPass).forEach((id) => {
    if (firstPassFrozen) plot.freeze(id);
    else plot.thaw(id);
  });
  updateLabels();
}

function rerollPlot() {
  plot.reroll();
  redraw();
}

function newSheet() {
  buildPlot(currentSeed + 1);
  updateLabels();
  redraw();
}

function downloadSVG() {
  plot.downloadSVG("p5-gysin-rotations.svg", { width: W, height: H });
}

// The page model's own turn: the same drawing exported upside down,
// so a second plot run wears the pen in the opposite direction.
function downloadTurnedSVG() {
  plot.downloadSVG("p5-gysin-rotations-turned.svg", {
    page: { width: W, height: H, rotation: 180 }
  });
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) rerollPlot();
}

function keyPressed() {
  if (key === "r" || key === "R") rerollPlot();
  if (key === "n" || key === "N") newSheet();
  if (key === "w" || key === "W") applyWear();
  if (key === "f" || key === "F") toggleFirstPass();
  if (key === "s" || key === "S") downloadSVG();
  if (key === "t" || key === "T") downloadTurnedSVG();
}

function wireActions() {
  document.getElementById("reroll-button").addEventListener("click", rerollPlot);
  document.getElementById("sheet-button").addEventListener("click", newSheet);
  document.getElementById("wear-button").addEventListener("click", applyWear);
  document.getElementById("freeze-button").addEventListener("click", toggleFirstPass);
  document.getElementById("svg-button").addEventListener("click", downloadSVG);
  document.getElementById("turned-button").addEventListener("click", downloadTurnedSVG);
  updateLabels();
}

function updateLabels() {
  const wearButton = document.getElementById("wear-button");
  const freezeButton = document.getElementById("freeze-button");
  if (wearButton) wearButton.textContent = `Wear: ${WEAR_STEPS[wearIndex]}`;
  if (freezeButton) freezeButton.textContent = firstPassFrozen ? "Thaw first pass" : "Freeze first pass";
}

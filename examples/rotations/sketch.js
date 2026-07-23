// ═══════════════════════════════════════════════════════════════════
//  rotations - the phrase turns: order "rotate" and order "lexical"
//
//  The whole piece, in one loop - this alone is a complete sketch:
//      const plot = new GysinPlot({ seed: 1959 });
//      GysinText.permute("RUB OUT THE WORD", { order: "rotate" })
//        .forEach((row, i) => plot.text(row, 90 + i * 34, 430 + i * 56, { size: 26 }));
//      plot.draw();
//  Everything below is elaboration: the wheel emblem, the lexical fall,
//  and the page controls. All options are opt-in disturbance.
// ═══════════════════════════════════════════════════════════════════

const PHRASE = "RUB OUT THE WORD";
const INK = "#151515";
const RED = "#b5362b";
const BLUE = "#244f73";
const W = 700;
const H = 940;

let plot;
let currentSeed = 1959;

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

function buildPlot(seed) {
  currentSeed = seed;
  plot = new GysinPlot({
    seed,
    width: W,
    height: H,
    style: { stroke: INK, strokeWeight: 1.15, alpha: 0.9 }
  });

  // ── 1 · the wheel emblem: the turning made visible ──────────────
  plot.circle(W / 2, 240, 300, {
    breathe: 1.1,
    repeat: 2,
    dropout: 0.04,
    stroke: RED,
    layer: "wheel"
  });
  plot.circle(W / 2, 240, 196, {
    breathe: 0.7,
    dropout: 0.02,
    stroke: RED,
    layer: "wheel"
  });
  for (let spoke = 0; spoke < 4; spoke++) {
    const angle = spoke * HALF_PI;
    plot.line(
      W / 2 + Math.cos(angle) * 98,
      240 + Math.sin(angle) * 98,
      W / 2 + Math.cos(angle) * 150,
      240 + Math.sin(angle) * 150,
      { breathe: 0.5, stroke: RED, layer: "wheel" }
    );
  }

  // ── 2 · the turning stair: order "rotate" ───────────────────────
  // Each order moves the first word to the end; the indent is that
  // word walking away. Four words, four turns, back to the start.
  const turns = GysinText.permute(PHRASE, { order: "rotate" });
  turns.forEach((row, index) => {
    plot.text(row, 90 + index * 34, 470 + index * 56, {
      size: 26,
      breathe: 0.4 + index * 0.3,
      dropout: index * 0.015
    });
  });

  // ── 3 · the lexical fall: every order the dictionary allows ─────
  const orders = GysinText.permute(PHRASE, { order: "lexical", limit: 12 });
  orders.forEach((row, index) => {
    const column = index < 6 ? 0 : 1;
    const rowIndex = index % 6;
    plot.text(row, 60 + column * 320, 748 + rowIndex * 30, {
      size: 14,
      breathe: 0.3 + index * 0.08,
      dropout: 0.02 + index * 0.012,
      stroke: BLUE,
      layer: "fall"
    });
  });
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) rerollPlot();
}

function keyPressed() {
  if (key === "r" || key === "R") rerollPlot();
  if (key === "s" || key === "S") downloadSVG();
}

function wireActions() {
  document.getElementById("reroll-button").addEventListener("click", rerollPlot);
  document.getElementById("svg-button").addEventListener("click", downloadSVG);
}

function rerollPlot() {
  buildPlot(currentSeed + 1);
  redraw();
}

function downloadSVG() {
  plot.downloadSVG("p5-gysin-rotations.svg", { width: W, height: H });
}

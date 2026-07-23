// ═══════════════════════════════════════════════════════════════════
//  the_letter - a period-typed letter: the whole underwood grammar
//  in its natural habitat.
//
//  The whole piece, in three lines - this alone is a complete sketch:
//      const plot = new GysinPlot({ seed: 1912 });
//      plot.underwood("DEAR READER,\nTHE MACHINE HAS ONE FACE.", 60, 150);
//      plot.draw();
//  Everything below is the full letter: dateline, salutation, body,
//  a struck-over correction, the three period emphases, and the
//  small voice that signs. All options are opt-in.
// ═══════════════════════════════════════════════════════════════════

const INK = "#151515";
const W = 700;
const H = 780;

let plot;
let currentSeed = 1912;

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
    style: { stroke: INK, strokeWeight: 1.1, alpha: 0.92 }
  });

  // ── 1 · dateline, spaced the Sperrsatz way ──────────────────────
  plot.underwood("P A R I S ,  I N  O C T O B E R", 220, 80, {
    size: 14,
    wear: 0.8
  });

  // ── 2 · salutation, ruled beneath ───────────────────────────────
  plot.underwood("DEAR READER,", 60, 150, {
    size: 18,
    underline: 1,
    wear: 0.9
  });

  // ── 3 · the body: one face, one size ────────────────────────────
  const body = [
    "THE MACHINE HAS ONE FACE, ONE SIZE.",
    "WHEN A WORD MATTERS I MUST SPACE IT,",
    "STRIKE IT TWICE, OR RULE BENEATH IT.",
    "ALL ELSE THE PAGE SIMPLY REFUSES."
  ].join("\n");
  plot.underwood(body, 60, 210, {
    size: 14,
    wear: 1.1
  });

  // ── 4 · the correction: the period way to unsay a word ──────────
  plot.underwood("FORGET", 60, 360, {
    size: 14,
    wear: 1
  });
  plot.underwood("XXXXXX", 60, 360, {
    size: 14,
    wear: 1.3,
    bold: true
  });
  plot.underwood("REMEMBER THE RIBBON.", 200, 360, {
    size: 14,
    wear: 1
  });

  // ── 5 · the three period emphases, side by side ─────────────────
  plot.underwood("S P E R R S A T Z", 60, 430, {
    size: 14,
    wear: 0.9
  });
  plot.underwood("DOUBLE-STRUCK", 340, 430, {
    size: 14,
    bold: true,
    wear: 0.9
  });
  plot.underwood("RULED", 560, 430, {
    size: 14,
    underline: 1,
    wear: 0.9
  });

  // ── 6 · a divider the machine could type ────────────────────────
  plot.underwood("* * * * * * * * * * * * * * * *", 60, 500, {
    size: 13,
    wear: 1.2
  });

  // ── 7 · the small voice signs, lowercase ────────────────────────
  plot.underwood("yours, in one voice,", 60, 560, {
    size: 14,
    wear: 1
  });
  plot.underwood("the small hand.", 60, 600, {
    size: 14,
    wear: 1.2
  });

  // ── 8 · postscript, nearly out of ribbon ────────────────────────
  plot.underwood("P.S. THE RIBBON IS ALMOST FREE.", 60, 680, {
    size: 13,
    wear: 2.2
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
  plot.downloadSVG("p5-gysin-the-letter.svg", { width: W, height: H });
}

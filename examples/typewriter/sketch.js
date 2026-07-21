// ═══════════════════════════════════════════════════════════════════
//  typewriter - a period-correct single-stroke typed sheet
// ═══════════════════════════════════════════════════════════════════
//  New to p5.gysin? With the underwood module loaded, the whole sketch is:
//
//      const plot = new GysinPlot({ seed: 1961 });
//      plot.underwood("RUB OUT THE WORD", 60, 90);   // period typewriter, defaults
//      plot.draw();
//
//  underwood() is an intent verb: defaults alone give a period-correct typewriter
//  page - single-stroke Hershey letterforms (bundled, no font to load), fixed
//  monospace pitch and line height (10 chars-per-inch / 6 lines-per-inch), and
//  the small strike wear of a real typed sheet. Every option below is opt-in.
//
//  A typewriter had no bold and no italic (see the About page and
//  docs/typewriter-decoration-research.md). So the only decoration here is what
//  the machine could actually do: OVERSTRIKE (bold: true, the same key struck
//  twice), UNDERLINE (the underscore rule), ALL CAPS, spacing, and symbol rules.
// ═══════════════════════════════════════════════════════════════════

const W = 820;
const H = 640;
const PAPER = "#eee9dc";
const INK = "#17140f";
const PHRASE = "RUB OUT THE WORD";

let plot;
let seed = 1961;

function setup() {
  const canvas = createCanvas(W, H);
  canvas.parent("sketch");
  pixelDensity(1);
  noLoop();
  describe("A period-correct single-stroke typewriter sheet: RUB OUT THE WORD as a heading, a permuted block, a double-struck line, an underlined line, spaced emphasis, and typed symbol dividers.");

  buildSheet();
  wireActions();
}

function draw() {
  background(PAPER);
  drawScreenTexture();
  plot.draw();
}

function buildSheet() {
  plot = new GysinPlot({
    seed: seed,
    width: W,
    height: H,
    style: { stroke: INK, strokeWeight: 1.1, alpha: 0.92 }
  });

  // ── 1 · heading, underlined (the period way to emphasise) ───────
  plot.underwood("RUB OUT THE WORD", 60, 74, {
    size: 24,
    underline: 1
  });

  // ── 2 · the permuted block, defaults only ───────────────────────
  // One multi-line string, so underwood() lays the lines out at the period
  // 6-lines-per-inch spacing on its own.
  const rows = GysinText.permute(PHRASE, {
    seed: seed,
    limit: 6,
    order: "walk"
  });
  plot.underwood(rows.join("\n"), 60, 128, {
    size: 18
  });

  // ── 3 · a divider the machine could type ────────────────────────
  plot.underwood("* * * * * * * * * * * * * * * * * *", 60, 372, {
    size: 14,
    wear: 0.6
  });

  // ── 4 · double-strike = the only "bold" ─────────────────────────
  plot.underwood("DOUBLE-STRUCK IS THE ONLY BOLD", 60, 410, {
    size: 17,
    bold: true
  });

  // ── 5 · spacing as emphasis (Sperrsatz) ─────────────────────────
  plot.underwood("S P A C E D   F O R   E M P H A S I S", 60, 446, {
    size: 15
  });

  // ── 6 · a second divider, alternating ───────────────────────────
  plot.underwood("-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_", 60, 486, {
    size: 14,
    wear: 0.6
  });

  // ── 7 · colophon ────────────────────────────────────────────────
  plot.underwood("PERIOD-CORRECT / 10 CPI / 6 LPI / SEED " + seed, 60, 560, {
    size: 12,
    wear: 0.8
  });
}

function wireActions() {
  const rerollButton = document.getElementById("reroll-button");
  const svgButton = document.getElementById("svg-button");

  if (rerollButton) {
    rerollButton.addEventListener("click", function () {
      seed += 1;
      buildSheet();
      redraw();
    });
  }

  if (svgButton) {
    svgButton.addEventListener("click", function () {
      plot.downloadSVG("p5-gysin-typewriter.svg");
    });
  }
}

// Screen-only decoration (paper grain), kept out of the plotter export.
function drawScreenTexture() {
  randomSeed(7);
  stroke("#d4ccbe");
  strokeWeight(0.5);
  for (let i = 0; i < 900; i++) point(random(width), random(height));
}

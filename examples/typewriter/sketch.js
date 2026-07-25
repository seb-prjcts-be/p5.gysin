// typewriter — fixed-pitch, single-stroke rows with seeded wear.
// The bundled face needs no font file. Overstrike and underline are pen paths.
// ═══════════════════════════════════════════════════════════════════

const W = 820;
const H = 640;
const PAPER = "#f0efe9";
const INK = "#17140f";
const PHRASE = "KICK THAT HABIT MAN";

let plot;
let seed = 1961;

function setup() {
  const canvas = createCanvas(W, H);
  canvas.parent("sketch");
  pixelDensity(1);
  noLoop();
  describe("A period-correct single-stroke typewriter sheet: KICK THAT HABIT MAN as a heading, a permuted block, a double-struck line, an underlined line, spaced emphasis, and typed symbol dividers.");

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
  plot.underwood("KICK THAT HABIT MAN", 60, 74, {
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

  // ── 7 · the small voice: both cases live on the same keys ───────
  plot.underwood("and the small voice, lowercase, on the same keys.", 60, 522, {
    size: 15
  });

  // ── 8 · colophon ────────────────────────────────────────────────
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

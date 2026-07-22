// ═══════════════════════════════════════════════════════════════════
//  ink_bleed - the ink returns to lines it has already written
// ═══════════════════════════════════════════════════════════════════
//  New to p5.gysin? The whole library is three lines:
//
//      const plot = new GysinPlot({ seed: 1916 });
//      plot.text("I AM THAT I AM", 46, 170);   // one clean pass
//      plot.draw();
//
//  bleed is the ADDITIVE disturbance. dropout and rubout take line
//  material away; bleed picks a few contiguous fragments and gives only
//  those one or more extra, slightly shifted passes - ink gathering where
//  the pen went back over its own trace. No cut-up here: the phrase stays
//  whole, drawn on real outline-font contours (Oswald), so the ink
//  gathers in letterforms. Three states of exactly that one option;
//  nothing else changes between the rows. Read the numbered sections in
//  buildPlot() from top to bottom.
// ═══════════════════════════════════════════════════════════════════

let plot;
let seedValue = 1916;
let ink = 0.22;   // the one knob: share of the written contour that gets extra passes
let font = null;  // outline contours; a failed load falls back to the single-stroke alphabet

const FONT_URL = "../font_outlines/assets/Oswald-Regular.otf";

// A phrase that repeats itself, for a pen that repeats itself. Three states
// of one concept: the same sliced line, the ink returning harder each row.
const PHRASE = "I AM THAT I AM";

// state() reads the live ink knob, so the table stays one source of truth.
const STATES = [
  { labelY: 118, y: 170, caption: "one pass",         state: () => ({}) },
  { labelY: 288, y: 340, caption: "the ink returns",  state: () => ({
      bleed: ink,
      bleedPasses: 2
    }) },
  { labelY: 458, y: 510, caption: "the ink decides",  state: () => ({
      bleed: Math.min(ink * 2, 0.45),
      bleedPasses: 3,
      bleedSpread: 1.2,
      bleedCluster: 12
    }) }
];

// One caption look for the row labels and the footnote.
const CAPTION_STYLE = {
  size: 13,
  glyphJitter: 0.1,
  breathe: 0.5,
  stroke: "#8a8a8a"
};

async function setup() {
  const canvas = createCanvas(520, 620);
  canvas.parent("sketch");
  describe(
    "The same phrase in outline letters three times down the sheet: one clean " +
    "pass, then with a share of its contours retraced so ink gathers, then " +
    "retraced harder - dark clusters where the pen kept returning."
  );
  pixelDensity(1);
  noLoop();
  wireActions();
  updateInkReadout();
  try { font = await loadFont(FONT_URL); } catch (error) { font = null; }
  buildPlot();
}

function draw() {
  background("#f0efe9");
  plot.draw();
}

function buildPlot() {
  plot = new GysinPlot({
    seed: seedValue,
    width: width,
    height: height,
    style: {
      stroke: "#151515",
      strokeWeight: 1.1,
      alpha: 0.9
    }
  });

  // ── 1 · the three states ────────────────────────────────────────
  // Identical calls; only the bleed options differ per row, so the darkening
  // clusters are provably that one option at work. With the outline font the
  // ink gathers along real letter contours; without it, on the single-stroke
  // alphabet.
  for (const row of STATES) {
    plot.text(row.caption, 46, row.labelY, CAPTION_STYLE);
    const opts = {
      // The condensed outline face carries 44; the wider single-stroke
      // fallback drops to 34 so the phrase stays inside the sheet.
      size: font ? 44 : 34,
      breathe: 0.9,
      pressure: 0.3,
      ...row.state()
    };
    if (font) opts.font = font;
    plot.text(PHRASE, 46, row.y, opts);
  }

  // ── 2 · the sheet's own measurement ─────────────────────────────
  // stats() counts the extra passes; print the overdraw on the sheet, so an
  // exported SVG records how much ink returned.
  const s = plot.stats();
  plot.text(
    "seed " + seedValue + "  ·  ink " + ink.toFixed(2) +
    "  ·  " + s.bleedPaths + " return passes  ·  overdraw " + (s.overdrawRatio * 100).toFixed(0) + "%",
    46, 600, CAPTION_STYLE);

  document.getElementById("seed-readout").textContent = String(seedValue);
  const stats = document.getElementById("bleed-stats");
  if (stats) {
    stats.textContent = s.bleedPaths + " return passes · overdraw " + (s.overdrawRatio * 100).toFixed(0) + "%";
  }
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  rerollPlot();
}

function keyPressed() {
  if (keyCode === UP_ARROW) { nudgeInk(0.05); return false; }
  if (keyCode === DOWN_ARROW) { nudgeInk(-0.05); return false; }
}

function wireActions() {
  document.getElementById("reroll-button").addEventListener("click", rerollPlot);
  document.getElementById("ink-up").addEventListener("click", () => nudgeInk(0.05));
  document.getElementById("ink-down").addEventListener("click", () => nudgeInk(-0.05));

  // The same drawing, two tools: the pen keeps the ink build-up, the blade
  // export strips every second and later pass (a knife cannot darken a line).
  document.getElementById("svg-button").addEventListener("click", () => {
    plot.downloadSVG("p5-gysin-ink-bleed-pen.svg", { tool: "pen" });
  });
  document.getElementById("blade-button").addEventListener("click", () => {
    plot.downloadSVG("p5-gysin-ink-bleed-blade.svg", { tool: "blade" });
  });
}

function nudgeInk(delta) {
  ink = constrain(ink + delta, 0, 0.45);
  updateInkReadout();
  buildPlot();
  redraw();
}

function rerollPlot() {
  seedValue += 1;   // new slices, new fragments chosen for the return passes
  buildPlot();
  redraw();
}

function updateInkReadout() {
  document.getElementById("ink-readout").textContent = ink.toFixed(2);
  document.getElementById("ink-down").disabled = ink <= 0;
  document.getElementById("ink-up").disabled = ink >= 0.45;
}

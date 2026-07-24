// ═══════════════════════════════════════════════════════════════════
//  plotter_export - one layered plate, exported to SVG, JSON and HPGL
// ═══════════════════════════════════════════════════════════════════
//  New to p5.gysin? The whole core is three lines:
//
//      const plot = new GysinPlot({ seed: 7475 });
//      plot.text("PLOT", 118, 188);   // clean, mechanical text
//      plot.draw();
//
//  Every option below (breathe, dropout, typed subtitle, per-pen
//  layers, page + export…) is OPTIONAL on top of that core. The defaults are
//  all zero, so a call with no options just draws clean - nothing here
//  is required to use the library. This sketch stacks the layers one at
//  a time; read the numbered sections in shapesFor() from top to bottom.
//  Each is a compositional layer, drawn back to front, and can be
//  deleted on its own without breaking the rest. Export is just handing
//  the same plot to plot.downloadSVG() / downloadJSON() / downloadHPGL().
// ═══════════════════════════════════════════════════════════════════

const SEED = 7475;
const EXPORT_PAGE = {
  width: 210,
  height: 210,
  units: "mm",
  margin: 5,
  scale: 0.375,
  clip: true
};
const STATS_OPTIONS = {
  page: EXPORT_PAGE,
  optimize: true,
  drawSpeed: 20,
  travelSpeed: 60
};

// Pen map: layer == pen == ink. Canvas, legend and HPGL export all read these,
// so what you see on screen is what each pen plots.
const PEN_MAP = {
  frame: 1,
  type: 2,
  field: 3,
  registration: 1
};
const PEN_INK = {
  1: "#151515",
  2: "#b5362b",
  3: "#244f73"
};

const PEN_LEGEND = [
  { layer: "frame", label: "FRAME" },
  { layer: "type", label: "TYPE" },
  { layer: "field", label: "FIELD" },
  { layer: "registration", label: "REG" }
];

// Plate geometry derived once. INNER is the type area; every row is an offset
// from INNER, so the whole plate rescales as one unit when FRAME changes.
const FRAME = {
  x: 78,
  y: 78,
  size: 404
};
const PAD = 40;
const INNER = {
  x: FRAME.x + PAD,
  y: FRAME.y + PAD,
  w: FRAME.size - 2 * PAD,
  h: FRAME.size - 2 * PAD
};
const ROW = {
  hero: INNER.y + 70,     // hero word baseline
  letters: INNER.y + 78,  // decaying letter field top
  sub: INNER.y + 126,     // cut-up subtitle baseline
  band: INNER.y + 182     // lower texture band top
};
const LETTERS_H = 30;
const BAND_H = 130;

const FRAME_CORNERS = [
  [FRAME.x, FRAME.y],
  [FRAME.x + FRAME.size, FRAME.y],
  [FRAME.x, FRAME.y + FRAME.size],
  [FRAME.x + FRAME.size, FRAME.y + FRAME.size]
];

// Per-variation composition tuning. A reroll advances `variation`, which walks
// this table, so each plate reads as a distinctly different plate - a new
// symbol set, not just re-jittered glyphs. Symbols stay inside the bitmap
// alphabet's safe punctuation. Index 0 is the canonical plate Reset returns.
const SYMBOL_SETS = ["/:;-!", "()/-:", ":;.,_", "!?-/'"];

function composition(v) {
  return {
    symbolSet: SYMBOL_SETS[v % SYMBOL_SETS.length]
  };
}

// The composition as data: [layer, method, geometry, perturbation]. buildPlot()
// iterates this and derives stroke from the pen map, describing the plate once.
// `comp` carries the per-variation tuning. No filled masses: the pen-3 fields
// stay airy (alpha 0.3/0.35), so the red type carries the weight of the plate.
const ARM = {
  alpha: 0.7,
  breathe: 0.6,
  dropout: 0.02,
  overshoot: 4,
  fray: 1.2
};
function shapesFor(comp) {
  return [
    // ── 1 · frame ───────────────────────────────
    // Pen 1 - plate frame; hesitates mid-edge like a hand-ruled boundary.
    ["frame", "rect", [FRAME.x, FRAME.y, FRAME.size, FRAME.size],
      {
        segmentLength: 12,
        breathe: 0.45,
        drift: 0.8,
        dropout: 0.015,
        hesitate: 0.35,
        repeat: 2
      }],

    // ── 2 · hero word ───────────────────────────
    // Pen 2 - hero word; per-glyph jitter reshapes it on reroll.
    ["type", "text", ["PLOT", INNER.x, ROW.hero],
      {
        size: 88,
        segmentLength: 8,
        breathe: 1.5,
        drift: 2,
        dropout: 0.07,
        repeat: 2,
        rubout: 0.1,
        pressure: 0.25,
        glyphJitter: 0.7
      }],

    // ── 3 · typed subtitle ──────────────────────
    // Pen 2 - the four export layers as a typed spec line (underwood module):
    // a machine sheet gets a machine label, single-stroke at period pitch.
    ["type", "underwood", ["FRAME/TYPE/FIELD/REG", INNER.x, ROW.sub],
      {
        size: 13,
        wear: 0.8
      }],

    // ── 4 · letter field ────────────────────────
    // Pen 3 - decaying letter field, kept lightest so the hero dominates.
    ["field", "letters", ["PLOTTER", INNER.x, ROW.letters, INNER.w, LETTERS_H],
      {
        size: 11,
        segmentLength: 7,
        breathe: 0.8,
        drift: 1,
        dropout: 0.05,
        glyphJitter: 0.5,
        alpha: 0.3
      }],

    // ── 5 · symbol field ────────────────────────
    // Pen 3 - airy full-width field of procedural operator glyphs: the lower
    // band is signs, not a filled mass.
    ["field", "symbols", [INNER.x, ROW.band, INNER.w, BAND_H],
      {
        set: comp.symbolSet,
        cluster: true,
        size: 13,
        lineHeight: 1.3,
        segmentLength: 7,
        breathe: 0.7,
        drift: 1.2,
        dropout: 0.04,
        glyphJitter: 0.4,
        alpha: 0.35
      }],

    // ── 6 · registration marks ──────────────────
    // Pen 1 - registration marks on the diagonal; light enough to read as
    // registration, not as dark noise beside the fields.
    ["registration", "circle", [404, 152, 78],
      {
        alpha: 0.7,
        density: 1.0,
        breathe: 1.3,
        drift: 1.8,
        dropout: 0.08,
        repeat: 2,
        rubout: 0.08,
        fray: 0.5
      }],
    ["registration", "polygon", [[[156, 372], [125, 426], [187, 426]]],
      {
        alpha: 0.7,
        breathe: 1.3,
        drift: 1.8,
        dropout: 0.08,
        repeat: 2,
        rubout: 0.08,
        fray: 0.5
      }],

    // ── 7 · corner crosses ──────────────────────
    // Pen 1 - a cross in every frame corner; arms overshoot and fray at the tips.
    ...FRAME_CORNERS.flatMap(([cx, cy]) => [
      ["registration", "line", [cx - 10, cy, cx + 10, cy], ARM],
      ["registration", "line", [cx, cy - 10, cx, cy + 10], ARM]
    ])
  ];
}

// Perturbation keys scaled by the live human-scale control: 0 = machine-clean,
// 2 = heavily hand-disturbed. wear is underwood's own knob, so the typed
// subtitle strikes cleaner and rougher along with everything else.
const SCALED_KEYS = ["breathe", "drift", "hesitate", "overshoot", "fray", "rubout", "glyphJitter", "dropout", "wear"];

let plot;
let variation = 0;
let humanScale = 1;
let statusPrefix = "Ready to export";
// Stats for the plate on screen, computed once in buildPlot() (which always runs
// before any draw or export) and shared by the legend and status line so both
// report identical numbers.
let liveStats = null;

function setup() {
  const canvas = createCanvas(560, 560);
  canvas.parent("sketch");
  describe("A layered plotter composition prepared for SVG, JSON, and HPGL export.");
  pixelDensity(1);
  noLoop();
  buildPlot();
  wireButtons();
}

function draw() {
  background("#f0efe9");
  drawPageFrame();
  plot.draw();
  drawLegend(liveStats);
  drawHint();
  report();
}

function keyPressed() {
  if (key === "r" || key === "R") newVariation();
  else if (keyCode === UP_ARROW) adjustHuman(0.25);
  else if (keyCode === DOWN_ARROW) adjustHuman(-0.25);
}

function newVariation() {
  statusPrefix = "New variation";
  variation += 1;
  buildPlot();
  redraw();
}

function adjustHuman(delta) {
  humanScale = Math.max(0, Math.min(2, Math.round((humanScale + delta) * 100) / 100));
  statusPrefix = `Human x${humanScale.toFixed(2)}`;
  buildPlot();
  redraw();
}

// Back to the canonical plate: variation 0, human x1.00, whatever the reroll count.
function resetPlate() {
  variation = 0;
  humanScale = 1;
  statusPrefix = "Reset to canonical";
  buildPlot();
  redraw();
}

// Scale a shape's perturbation by humanScale, leaving geometry and style intact.
function humanize(opts) {
  const out = { ...opts };
  for (const key of SCALED_KEYS) {
    if (out[key] !== undefined) out[key] *= humanScale;
  }
  return out;
}

// Build the plate for the current `variation`: its composition tuning, then a
// matching number of rerolls to reshape the glyphs. The plate is fully
// determined by (seed, variation, humanScale) and reproducible. Stats are
// computed here, once, and reused by draw() and report().
function buildPlot() {
  plot = new GysinPlot({
    seed: SEED,
    width: width,
    height: height,
    page: EXPORT_PAGE,
    style: {
      stroke: PEN_INK[1],
      strokeWeight: 0.9,
      alpha: 0.86
    }
  });

  for (const [layer, method, geom, opts] of shapesFor(composition(variation))) {
    plot[method](...geom, {
      layer,
      stroke: PEN_INK[PEN_MAP[layer]],
      ...humanize(opts)
    });
  }

  for (let i = 0; i < variation; i++) plot.reroll();

  liveStats = plot.stats(STATS_OPTIONS);
}

function wireButtons() {
  onClick("svg-button", function() {
    plot.downloadSVG("p5-gysin-plotter-export.svg", {
      page: EXPORT_PAGE,
      optimize: true
    });
    report("SVG exported");
  });

  onClick("json-button", function() {
    plot.downloadJSON("p5-gysin-plotter-export.json", { includeGenerated: true });
    report("JSON exported");
  });

  onClick("hpgl-button", function() {
    plot.downloadHPGL("p5-gysin-plotter-export.hpgl", {
      page: EXPORT_PAGE,
      penMap: PEN_MAP,
      speed: 20,
      optimize: true
    });
    report("HPGL exported");
  });

  onClick("reroll-button", newVariation);
  onClick("rougher-button", function() { adjustHuman(0.25); });
  onClick("cleaner-button", function() { adjustHuman(-0.25); });
  onClick("reset-button", resetPlate);
}

function onClick(id, handler) {
  document.getElementById(id).addEventListener("click", handler);
}

// Status line: reproducible export coordinates plus total paths, drawn length
// and plot time. buildPlot() always fills liveStats before this can run, so it
// only formats the numbers it is handed.
function report(prefix) {
  if (prefix !== undefined) statusPrefix = prefix;
  setStatus(
    `${statusPrefix} · seed ${SEED}/v${variation} · human x${humanScale.toFixed(2)} · ` +
    `${liveStats.paths} paths · ${liveStats.drawnLength.toFixed(0)} mm · ` +
    `~${liveStats.estimatedSeconds.toFixed(0)}s plot time`
  );
}

function setStatus(message) {
  document.getElementById("export-status").textContent = message;
}

// --- Canvas chrome (drawn, not plotted) -------------------------------------

const CHROME_FONT = "monospace";
const CHROME_INK = "#9a9a9a";
const PAGE_INSET = 36;                             // page border inset
const HINT_Y = 22;                                 // top caption baseline
const METER = {
  x: 22,
  y: 36,
  w: 120,
  h: 6
};      // CLEAN..ROUGH track
const LEGEND = {
  y: 498,
  x0: 20,
  gap: 135,
  swatch: 10
};  // pen row geometry

// One place for the monospace chrome type: set font, size, colour and alignment,
// then draw. Keeps the chrome helpers about their geometry, not their boilerplate.
function label(str, x, y, { size = 10, ink = CHROME_INK, align = LEFT } = {}) {
  noStroke();
  fill(ink);
  textFont(CHROME_FONT);
  textSize(size);
  textAlign(align, CENTER);
  text(str, x, y);
}

// Page border + corner brackets, all derived from PAGE_INSET.
function drawPageFrame() {
  const m = PAGE_INSET, near = m + 16, far = m + 40;
  noFill();
  stroke("#d8d8d8");
  strokeWeight(0.8);
  rect(m, m, width - 2 * m, height - 2 * m);
  line(m, near, far, near);
  line(near, m, near, far);
  line(width - far, height - near, width - m, height - near);
  line(width - near, height - far, width - near, height - m);
}

// Legend: each layer in its pen colour with live path count and draw time
// (layer length / drawSpeed), so you see which pen keeps the machine busiest.
function drawLegend(stats) {
  const { layers } = stats;
  const drawSpeed = STATS_OPTIONS.drawSpeed;
  PEN_LEGEND.forEach(function(entry, i) {
    const pen = PEN_MAP[entry.layer];
    const info = layers[entry.layer] || {};
    const secs = Math.round((info.drawnLength || 0) / drawSpeed);
    const x = LEGEND.x0 + i * LEGEND.gap;
    noStroke();
    fill(PEN_INK[pen]);
    rect(x, LEGEND.y, LEGEND.swatch, LEGEND.swatch);
    label(`P${pen} ${entry.label} ${info.paths || 0}p ${secs}s`, x + 16, LEGEND.y + 5, { ink: PEN_INK[pen] });
  });
}

// Top caption: export coordinates + live controls, plus a CLEAN..ROUGH meter.
function drawHint() {
  label(`SEED ${SEED} · VAR ${variation} · HUMAN x${humanScale.toFixed(2)}`, METER.x, HINT_Y, { size: 11 });
  label("R = REROLL · ↑↓ = HUMAN SCALE", width - METER.x, HINT_Y, {
    size: 11,
    align: RIGHT
  });
  drawHumanMeter();
}

// A 0..2 track with a filled bar and a centre tick at the machine-neutral x1.00.
function drawHumanMeter() {
  const { x, y, w, h } = METER;
  noStroke();
  fill("#e4e4e4");
  rect(x, y, w, h);
  fill("#9a9a9a");
  rect(x, y, w * (humanScale / 2), h);
  stroke("#c4c4c4");
  strokeWeight(1);
  line(x + w / 2, y - 2, x + w / 2, y + h + 2);
  label("CLEAN", x, y + h + 8, {
    size: 9,
    ink: "#b8b8b8"
  });
  label("ROUGH", x + w, y + h + 8, {
    size: 9,
    ink: "#b8b8b8",
    align: RIGHT
  });
}

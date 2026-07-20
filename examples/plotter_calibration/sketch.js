const MM = 3;                 // pixels per millimetre on the preview canvas
const mm = (v) => v * MM;     // millimetres -> canvas pixels

// Column origins (canvas px) for a horizontal strip of `count` cells.
const spread = (count, x0, stride) =>
  Array.from({ length: count }, (_, i) => mm(x0 + i * stride));

const PAGE = { width: 210, height: 297, units: "mm", margin: 10, scale: 1 / MM, clip: true };

// Sheet layout in millimetres: one row per zone, positions as data, not magic numbers.
const ZONES = {
  title:    { label: 13, mastheadX: 150 },
  scale:    { label: 22, ruler: 30, x0: 14 },
  rings:    { label: 44, center: 88, diskX: 30, asemicX: 139, asemicY: 50 },
  ramp:     { label: 136, top: 142 },
  gradient: { label: 183, center: 199, x0: 27, stride: 34, cap: 217, capDx: -3.5 },
  weights:  { label: 224, top: 229, bottom: 240, x0: 27, stride: 28, cap: 246, capDx: -3.5 },
  verbs:    { label: 252, line: 258, grain: 271, x0: 16, stride: 44, cap: 265, capDx: 0 }
};

// Three physical pens; every zone's layer name maps to one of them.
const INK  = "#171717";   // pen 1 — structure, text, measurement
const RED   = "#b5362b";  // pen 2 — rings, the one focal accent
const TINT  = "#c69a63";  // pen 3 — hatch-fill mass, a muted tint
const PEN_OF = { frame: 1, label: 1, ramp: 1, weight: 1, texture: 1, rings: 2, fill: 3 };
const PENS = [
  { pen: 1, color: INK,  role: "structure · text · measure" },
  { pen: 2, color: RED,  role: "rings · focal accent" },
  { pen: 3, color: TINT, role: "hatch fill mass" }
];

const SEED_A4 = 210297;                       // reproducible reference-sheet seed
const EXPORT = { page: PAGE, optimize: true }; // shared by SVG, HPGL and stats

let plot;
let currentSeed = SEED_A4;
let liveWobble = 1;   // ramp-zone wobble maximum, driven by the HTML slider

function setup() {
  const drawW = PAGE.width - 2 * PAGE.margin;
  const drawH = PAGE.height - 2 * PAGE.margin;
  const canvas = createCanvas(mm(drawW), mm(drawH));
  canvas.parent("sketch");
  describe("An A4 pen-plotter calibration sheet on three pens: a disturbed single-stroke title with a letters() specimen, a labelled mm ruler, RED centre-crossed rings with a cross-hatched core between a tinted cross-hatched ink mass and a field of asemic marks, a mirrored dropout/wobble ramp whose live-wobble side follows an on-page slider, a hatch-density gradient, a pen-weight ramp and a strip of disturbance verbs above a straight zero line. Buttons and keys: 0 reference, R reroll, S SVG, H HPGL.");
  pixelDensity(1);
  noLoop();
  buildPlot(SEED_A4);
  wireActions();
  buildLegend();
  showStats();
}

function draw() {
  background(245);
  plot.draw();
}

function keyPressed() {
  if (key === "0") resetToReference();
  if (key === "r" || key === "R") rerollSeed();
  if (key === "s" || key === "S") downloadSVG();
  if (key === "h" || key === "H") downloadHPGL();
}

function buildPlot(seed) {
  currentSeed = seed;
  plot = new GysinPlot({
    seed, width, height, page: PAGE,
    style: { stroke: INK, strokeWeight: 0.75, alpha: 0.86 }
  });
  drawFrame();
  drawScale();      // 1 · mm ruler with tick marks and numbers
  drawRings();      // 2 · rings between a cross-hatched ink mass and asemic marks
  drawRamp();       // 3 · mirrored ramp: dropout 0->0.4, wobble 0->live
  drawGradient();   // 4 · hatch-density gradient, spacing 0.8->2.4 mm
  drawWeights();    // 5 · bars with rising strokeWeight
  drawVerbs();      // 6 · four disturbance verbs + a symbols() texture foot
}

// --- helpers ---------------------------------------------------------------

// Zone header caption.
function head(text, x, y) {
  plot.text(text, x, y, { size: mm(2.9), wobble: 0.15, alpha: 0.8, layer: "label", stroke: INK });
}

// Demoted value caption: small and light so the rings and ink mass dominate.
function label(text, x, y, stroke = INK, layer = "label") {
  plot.text(text, x, y, { size: mm(2.5), wobble: 0.15, alpha: 0.55, layer, stroke });
}

// Lay `values` across a zone's columns; draw each cell, then its caption below.
function ramp(zone, values, drawCell, caption = String) {
  const xs = spread(values.length, zone.x0, zone.stride);
  values.forEach((v, i) => {
    drawCell(v, xs[i], i);
    label(caption(v), xs[i] + mm(zone.capDx), mm(zone.cap), INK);
  });
}

// --- zones -----------------------------------------------------------------

// Border, corner registration crosses, and a title that itself shows the disturbance it measures.
function drawFrame() {
  plot.rect(0, 0, width, height, { wobble: 0.25, drift: 0.3, layer: "frame" });
  const inset = mm(9), arm = mm(4);
  const corners = [[inset, inset], [width - inset, inset],
                   [inset, height - inset], [width - inset, height - inset]];
  for (const [cx, cy] of corners) {
    plot.line(cx - arm, cy, cx + arm, cy, { wobble: 0.2, layer: "frame" });
    plot.line(cx, cy - arm, cx, cy + arm, { wobble: 0.2, layer: "frame" });
  }
  plot.text("P5.GYSIN CALIBRATION", mm(16), mm(ZONES.title.label), {
    size: mm(7), wobble: 0.6, glyphJitter: 0.8, drift: 0.4, repeat: 2, layer: "frame", stroke: INK
  });
  const mx = mm(ZONES.title.mastheadX);
  plot.letters("P5 GYSIN", mx, mm(9), mm(38), mm(13), {
    size: mm(3.4), glyphJitter: 0.6, wobble: 0.2, layer: "label", stroke: INK
  });
  label("letters() · glyphJitter 0.6", mx, mm(24), INK);
}

// Zone 1 — mm ruler: minor ticks every 10 mm, numbered every 50 mm.
function drawScale() {
  head("1 : SCALE MM · wobble 0.15", mm(16), mm(ZONES.scale.label));
  const y = mm(ZONES.scale.ruler), x0 = mm(ZONES.scale.x0), span = 160;
  plot.line(x0, y, x0 + mm(span), y, { wobble: 0.15, layer: "label" });
  for (let d = 0; d <= span; d += 10) {
    const x = x0 + mm(d), major = d % 50 === 0;
    plot.line(x, y, x, y - mm(major ? 5 : 2.5), { wobble: 0.15, layer: "label" });
    if (major) label(String(d), x - mm(2.5), y + mm(6), INK);
  }
}

// Zone 2 — RED rings by diameter with a centre cross, between a tinted ink mass and an asemic field.
function drawRings() {
  head("2 : RINGS DIA MM · wobble 0.45 · repeat 2", mm(16), mm(ZONES.rings.label));
  const cx = width / 2, cy = mm(ZONES.rings.center);

  const diskX = mm(ZONES.rings.diskX);
  plot.circle(diskX, cy, mm(34), {
    wobble: 0.3, fill: "cross", hatchSpacing: mm(0.9), hatchAngle: 30,
    pressure: 0.4, layer: "fill", stroke: TINT
  });
  label("fill:cross · pressure 0.4", diskX - mm(11), cy + mm(22), TINT, "fill");

  const diameters = [16, 34, 58, 82];
  for (const d of diameters) {
    plot.circle(cx, cy, mm(d), {
      density: 1.25, wobble: 0.45, dropout: 0.012, repeat: 2, drift: 0.4,
      layer: "rings", stroke: RED,
      fill: d === diameters[0] ? "cross" : "none", hatchSpacing: mm(0.8)
    });
    label(String(d), cx + mm(2), cy - mm(d) / 2 + mm(3.5), RED, "rings");
  }

  const arm = mm(11);
  plot.line(cx - arm, cy, cx + arm, cy, { wobble: 0.2, layer: "rings", stroke: RED });
  plot.line(cx, cy - arm, cx, cy + arm, { wobble: 0.2, layer: "rings", stroke: RED });

  const ax = mm(ZONES.rings.asemicX), ay = mm(ZONES.rings.asemicY);
  label("asemic() · wobble 0.6", ax, ay - mm(2), INK, "texture");
  const cols = 3, rows = 4, aw = mm(42) / cols, ah = mm(74) / rows;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      plot.asemic(ax + c * aw, ay + r * ah, aw, ah, { wobble: 0.6, layer: "texture", stroke: INK });
}

// Zone 3 — mirrored rulers: dropout 0->0.4 left, wobble 0->liveWobble right (driven by the slider).
function drawRamp() {
  head(`3 : DROPOUT 0-0.4 · WOBBLE 0-${liveWobble.toFixed(2)}`, mm(16), mm(ZONES.ramp.label));
  const xMid = width / 2, gap = mm(5), half = mm(70);
  const y0 = mm(ZONES.ramp.top), step = mm(3), lines = 12;
  for (let i = 0; i < lines; i++) {
    const y = y0 + i * step, t = i / (lines - 1);
    plot.line(xMid - gap, y, xMid - gap - half, y, {
      wobble: 0.45, dropout: t * 0.4, overshoot: mm(4),
      repeat: i % 3 === 0 ? 2 : 1, drift: 0.5, layer: "ramp", stroke: INK
    });
    plot.line(xMid + gap, y, xMid + gap + half, y, {
      wobble: t * liveWobble, drift: 0.5, layer: "ramp", stroke: INK
    });
  }
  const yEnd = y0 + (lines - 1) * step;
  plot.line(xMid, y0, xMid, yEnd, { wobble: 0.15, layer: "ramp", stroke: INK });
  plot.line(xMid, yEnd, xMid - mm(1.5), yEnd - mm(2.5), { layer: "ramp", stroke: INK });
  plot.line(xMid, yEnd, xMid + mm(1.5), yEnd - mm(2.5), { layer: "ramp", stroke: INK });
  label("0.0", xMid - gap - half - mm(9), y0 + mm(1.5), INK, "ramp");
  label("0.4", xMid - gap - half - mm(9), yEnd + mm(1.5), INK, "ramp");
  label("0.0", xMid + gap + half + mm(2), y0 + mm(1.5), INK, "ramp");
  label(liveWobble.toFixed(2), xMid + gap + half + mm(2), yEnd + mm(1.5), INK, "ramp");
}

// Zone 4 — five hatch-filled diamonds, spacing 0.8->2.4 mm with a sweeping hatch angle.
function drawGradient() {
  head("4 : FILL HATCH · spacing mm · angle sweep", mm(16), mm(ZONES.gradient.label));
  const cy = mm(ZONES.gradient.center), hs = mm(12);
  ramp(ZONES.gradient, [0.8, 1.2, 1.6, 2.0, 2.4],
    (s, cx, i) => plot.polygon(
      [[cx, cy - hs], [cx + hs, cy], [cx, cy + hs], [cx - hs, cy]],
      { wobble: 0.35, drift: 0.3, layer: "fill", stroke: TINT,
        fill: i === 0 ? "cross" : "hatch", hatchSpacing: mm(s), hatchAngle: 30 + i * 15 }),
    (s) => s.toFixed(1));
}

// Zone 5 — bars with rising strokeWeight: reads the line weight the pen lays down.
function drawWeights() {
  head("5 : PEN WEIGHT · strokeWeight", mm(16), mm(ZONES.weights.label));
  const yt = mm(ZONES.weights.top), yb = mm(ZONES.weights.bottom);
  ramp(ZONES.weights, [0.5, 1.0, 1.5, 2.0, 2.5, 3.0],
    (w, x) => plot.line(x, yt, x, yb,
      { wobble: 0.2, drift: 0.2, strokeWeight: w, layer: "weight", stroke: INK }),
    (w) => w.toFixed(1));
}

// Zone 6 — four verbs, each above a straight zero line, then a full-width symbols() foot.
function drawVerbs() {
  head("6 : DISTURBANCE VERBS · vs straight zero", mm(16), mm(ZONES.verbs.label));
  const y = mm(ZONES.verbs.line), len = mm(34);
  ramp(ZONES.verbs, [
    { text: "hesitate 0.6", opt: { hesitate: 0.6 } },
    { text: "fray 0.5", opt: { fray: 0.5 } },
    { text: "pressure 0.4", opt: { pressure: 0.4 } },
    { text: "rubout 0.3", opt: { rubout: 0.3 } }
  ],
    (v, x) => {
      plot.line(x, y, x + len, y, { wobble: 0.25, density: 1.5, layer: "texture", stroke: INK, ...v.opt });
      plot.line(x, y + mm(2), x + len, y + mm(2), { strokeWeight: 0.5, layer: "texture", stroke: INK });
    },
    (v) => v.text);

  const grainY = mm(ZONES.verbs.grain);
  label("symbols() · set /:;-_", mm(16), grainY - mm(1), INK, "texture");
  plot.symbols(mm(46), grainY, mm(130), mm(6),
    { set: "/:;-_", size: mm(2), wobble: 0.3, layer: "texture", stroke: INK });
}

// --- actions & readouts ----------------------------------------------------

function wireActions() {
  document.getElementById("svg-button").addEventListener("click", downloadSVG);
  document.getElementById("hpgl-button").addEventListener("click", downloadHPGL);
  document.getElementById("reroll-button").addEventListener("click", rerollSeed);
  document.getElementById("reset-button").addEventListener("click", resetToReference);

  const range = document.getElementById("wobble-range");
  range.addEventListener("input", () => {
    liveWobble = parseFloat(range.value);
    document.getElementById("wobble-readout").textContent = liveWobble.toFixed(2);
    buildPlot(currentSeed);
    redraw();
    showStats();
  });
}

// Pen legend: one swatch per physical pen, so a screen colour reads back to a pen number.
function buildLegend() {
  document.getElementById("pen-legend").innerHTML = PENS
    .map(({ pen, color, role }) =>
      `<span class="pen-chip"><i style="background:${color}"></i>pen ${pen} · ${role}</span>`)
    .join("");
}

function rerollSeed() {
  buildPlot(Math.floor(Math.random() * 900000) + 100000);
  redraw();
  showStats();
}

function resetToReference() {
  buildPlot(SEED_A4);
  redraw();
  showStats();
}

function downloadSVG() {
  plot.downloadSVG("p5-gysin-calibration.svg", EXPORT);
  setStatus("SVG exported with A4 page metadata and clipping.");
}

function downloadHPGL() {
  plot.downloadHPGL("p5-gysin-calibration.hpgl", { ...EXPORT, penMap: PEN_OF, speed: 20 });
  showStats("HPGL exported · ");
}

// Path cost up front, so a reroll or slider move shows its effect without exporting first.
function showStats(prefix = "") {
  const s = plot.stats({ ...EXPORT, drawSpeed: 20, travelSpeed: 60 });
  setStatus(`${prefix}seed ${plot.globalSeed} · ${s.paths} paths · ${s.drawnLength.toFixed(0)} mm drawn · ${s.travelLength.toFixed(0)} mm travel`);
}

function setStatus(message) {
  document.getElementById("calibration-status").textContent = message;
}

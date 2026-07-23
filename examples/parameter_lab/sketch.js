// ═══════════════════════════════════════════════════════════════════
//  parameter_lab - one slider owns one element, each in its own colour
// ═══════════════════════════════════════════════════════════════════
//  New to p5.gysin? The whole library is three lines:
//
//      const plot = new GysinPlot({ seed: 8319 });
//      plot.text("PISTOL POEM", 70, 150);   // clean, mechanical text
//      plot.draw();
//
//  Every option below (breathe, dropout, repeat, rubout, ruled block,
//  letter field…) is OPTIONAL disturbance layered on top of that
//  core. The defaults are all zero, so a call with no options just draws
//  clean - nothing here is required to use the library. This sketch adds
//  the layers one at a time; read the numbered sections in buildPlot()
//  from top to bottom. Each is a compositional layer, drawn back to
//  front, and can be deleted on its own without breaking the rest.
// ═══════════════════════════════════════════════════════════════════

let plot;
let seedValue = 8319;

// One slider owns exactly one element. This table is the single source of truth:
// each control's default value (used on load and by Reset), the plot layer it
// drives, and the stroke colour it shares with that element so the isolation is
// readable without the text. Change a default here and the HTML slider matches.
const CONTROLS = {
  breathe:  { layer: "title", tint: "#b26a00", value: 1.4 },  // title  "PISTOL POEM"
  dropout: { layer: "bar",   tint: "#0f7a6c", value: 0.16 }, // ruled block
  repeat:  { layer: "band",  tint: "#2b4fb0", value: 2 },    // line band
  rubout:  { layer: "word",  tint: "#b0203a", value: 0.12 }  // word   "ERASE"
};

// The element to emphasise: hoverId (a transient preview while the pointer is
// over a control, or a tapped legend row) wins over activeId (the last slider
// actually dragged). The shown element gets extra ink (EMPHASIS) while the rest
// fade to a quiet ground (DIM), on screen and in the exported SVG. DIM keeps a
// legible minimum stroke so the four muted elements stay a readable grey
// skeleton - isolation never hollows the plate out to near-blank.
let activeId = null;
let hoverId = null;
const EMPHASIS = {
  alpha: 1,
  pressure: 0.6,
  strokeWeight: 2.4
};
const DIM = {
  alpha: 0.3,
  strokeWeight: 1
};

function setup() {
  const canvas = createCanvas(560, 560);
  canvas.parent("sketch");
  describe("A parameter lab: breathe bends the title, rubout tears ERASE, repeat thickens the line band, dropout opens the ruled block, and a dense letter field fills the middle row. Hover or move a slider and its own element darkens while every other element fades back, so you see exactly which one you own.");
  pixelDensity(1);
  noLoop();
  wireControls();
  wireLegend();
  wireActions();
  buildPlot();
}

function draw() {
  background("#f0efe9");
  plot.draw();
}

function keyPressed() {
  if (key === "r" || key === "R") rerollPlot();
  if (key === "s" || key === "S") downloadSVG();
}

function wireControls() {
  for (const id of Object.keys(CONTROLS)) {
    const input = document.getElementById(id);
    input.addEventListener("input", () => { activeId = id; render({ relabel: true }); });
    // Hovering a row previews its element (without changing the value), so the
    // colour-to-element link is discoverable before dragging.
    const row = input.closest(".control-row");
    row.addEventListener("mouseenter", () => { hoverId = id; render(); });
    row.addEventListener("mouseleave", () => { hoverId = null; render(); });
  }
  updateControlLabels();
}

// Touch-friendly twin of hover: tap a legend row to isolate its element, tap
// again to release. Gives tablet/phone users the same figure-ground reveal that
// mouse hover gives, since a tap has no hover state to lean on.
function wireLegend() {
  for (const li of document.querySelectorAll(".legend li[data-focus]")) {
    const id = li.dataset.focus;
    li.addEventListener("click", () => {
      hoverId = hoverId === id ? null : id;
      render();
    });
  }
}

function wireActions() {
  document.getElementById("reroll-button").addEventListener("click", rerollPlot);
  document.getElementById("reset-button").addEventListener("click", resetControls);
  document.getElementById("svg-button").addEventListener("click", downloadSVG);
}

// The single draw path: rebuild the plot from the current sliders and paint it.
// Pass { relabel: true } when a value actually changed and the number badges
// must follow; every caller goes through here, so there is one way to redraw.
function render({ relabel = false } = {}) {
  if (relabel) updateControlLabels();
  buildPlot();
  redraw();
}

// New composition, same sliders.
function rerollPlot() {
  seedValue = floor(random(100000));
  activeId = null;
  render();
}

// Return every slider to its default; the seed is kept, so only parameters reset.
function resetControls() {
  for (const [id, cfg] of Object.entries(CONTROLS)) {
    document.getElementById(id).value = cfg.value;
  }
  activeId = null;
  render({ relabel: true });
}

function downloadSVG() {
  plot.downloadSVG("p5-gysin-parameter-lab.svg", { width: width, height: height });
}

function updateControlLabels() {
  for (const id of Object.keys(CONTROLS)) {
    document.getElementById(id + "-value").textContent = document.getElementById(id).value;
  }
}

function inkOf(id) {
  return CONTROLS[id].tint;
}

function value(id) {
  return Number(document.getElementById(id).value);
}

// Figure-ground override, spread last so it wins: the shown element gets
// EMPHASIS and the rest get DIM; with nothing shown every element keeps its ink.
function shownId() {
  return hoverId || activeId;
}

function focus(id) {
  const shown = shownId();
  if (!shown) return {};
  return id === shown ? EMPHASIS : DIM;
}

function buildPlot() {
  plot = new GysinPlot({
    seed: seedValue,
    width: width,
    height: height,
    style: {
      stroke: "#111111",
      strokeWeight: 1,
      alpha: 1
    }
  });

  // ── 1 · the plate ───────────────────────────────────────────────
  // Drawn first so every element sits on top of it: a thin border and
  // corner registration marks in quiet grey (see registrationMarks()).
  registrationMarks();

  // ── 2 · the title ───────────────────────────────────────────────
  // Title - owned by BREATHE only. The word stays whole (no cut-up: breathe is
  // the concept here); the slider bends and drifts the trace while the other
  // sliders leave it untouched. glyphJitter keeps each letter a hand-set shape.
  plot.text("PISTOL POEM", 70, 150, {
    layer: CONTROLS.breathe.layer,
    // 48 keeps the eleven characters inside the plate border at x 528.
    size: 48,
    breathe: value("breathe"),
    drift: value("breathe") * 1.4,
    glyphJitter: 0.55,
    stroke: inkOf("breathe"),
    // Pressure rides breathe, so the accent breathes in line weight, not just shape.
    pressure: 0.25 + value("breathe") * 0.1,
    segmentLength: 7,
    ...focus("breathe")
  });

  // ── 3 · the word ────────────────────────────────────────────────
  // Word - owned by RUBOUT only. The word stays whole; the slider visibly eats
  // this line away while everything around it holds together.
  plot.text("ERASE", 70, 214, {
    layer: CONTROLS.rubout.layer,
    size: 40,
    rubout: value("rubout"),
    glyphJitter: 0.2,
    stroke: inkOf("rubout"),
    segmentLength: 8,
    ...focus("rubout")
  });

  // ── 4 · the line band ───────────────────────────────────────────
  // Line band - owned by REPEAT only. Each row is drawn `repeat` times by the
  // engine, ghosted apart by a drift that grows with repeat, so more copies also
  // spread visibly wider. Rows swing in alternating phase with an amplitude that
  // deepens downward, so neighbours overrun and cross into a woven mesh rather
  // than parallel stripes. Left/right edges share the ruled block's grid.
  const bandTop = 250;
  const bandBottom = 410;
  const rows = 6;
  for (let i = 0; i < rows; i++) {
    const depth = i / (rows - 1); // 0 at the top row, 1 at the bottom row
    const y = bandTop + (bandBottom - bandTop) * depth;
    plot.path(waveRow(70, 490, y, 3 + depth * 12, i * PI), {
      layer: CONTROLS.repeat.layer,
      repeat: value("repeat"),
      drift: value("repeat") * 1.2,
      // Ends overrun (further with each added pass) and the trace hesitates, so
      // the row-ends visibly overlap their neighbours - the weave becomes a
      // graphic fact, not just a caption. overshoot only extends open paths.
      overshoot: 2 + value("repeat"),
      hesitate: 0.12,
      stroke: inkOf("repeat"),
      pressure: 0.15,
      segmentLength: 10,
      alpha: 0.7,
      ...focus("repeat")
    });
  }

  // ── 5 · the ruled block ─────────────────────────────────────────
  // Ruled block - owned by DROPOUT only. A block needs no fill: closely set
  // rules read as one mass, and dropout visibly breaks them up, so the block
  // opens as you raise it. Aligned to the band above (70..490) so the owned
  // elements form a clean grid.
  for (let i = 0; i < 9; i++) {
    plot.line(70, 428 + i * 8, 490, 428 + i * 8, {
      layer: CONTROLS.dropout.layer,
      dropout: value("dropout"),
      stroke: inkOf("dropout"),
      fray: 0.35,
      pressure: 0.25,
      segmentLength: 8,
      alpha: 0.82,
      ...focus("dropout")
    });
  }

  // ── 6 · the letter field ────────────────────────────────────────
  // Unowned ink: a dense letter field, right of ERASE, that counterweights the
  // middle row and travels into the SVG as fixed reference ink. Its pool is the
  // library's creed in three words - the word as material, cut apart, set
  // free - dissolved past reading into pure texture. A smaller size
  // packs more rows into the same box, so it reads as a solid textured block and
  // truly balances the band. It obeys no slider but dims when one is shown.
  plot.letters("WORD CUT FREE", 300, 150, 190, 100, {
    layer: "field",
    size: 10,
    stroke: "#111111",
    breathe: 0.6,
    glyphJitter: 0.4,
    alpha: 0.92,
    ...focus("field")
  });

  updateStats();
}

// Reference ink: a thin plate border plus corner registration marks, all in the
// same quiet grey. Routed through the plot so they travel into the exported SVG,
// and drawn on every state so screen and export read as a composed plate rather
// than loose elements floating on the flat background.
function registrationMarks() {
  const mark = {
    stroke: "#b8b8b8",
    strokeWeight: 0.8,
    breathe: 0.6
  };
  plot.rect(32, 32, width - 64, height - 64, mark);
  plot.line(44, 44, 96, 44, mark);
  plot.line(44, 44, 44, 96, mark);
  plot.line(width - 96, height - 44, width - 44, height - 44, mark);
  plot.line(width - 44, height - 96, width - 44, height - 44, mark);
}

// The plot's own measurement of total plot cost; when an element is shown, the
// readout also names how much of that ink it owns.
function updateStats() {
  const s = plot.stats();
  let line = `${s.paths} paths · ${round(s.drawnLength)} px ink · ${round(s.travelLength)} px travel`;
  const shown = shownId();
  if (shown) {
    const own = s.layers[CONTROLS[shown].layer];
    if (own) line += `  -  ${shown} owns ${round(own.drawnLength)} px`;
  }
  document.getElementById("stats").textContent = line;
}

// A horizontal row sampled as a sine wave: two cycles across the width, with a
// per-row phase so neighbours swing opposite ways and cross into a weave.
function waveRow(x1, x2, y, amplitude, phase) {
  const points = [];
  const steps = 12;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push([x1 + (x2 - x1) * t, y + sin(t * TWO_PI * 2 + phase) * amplitude]);
  }
  return points;
}

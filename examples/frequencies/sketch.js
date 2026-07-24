// ═══════════════════════════════════════════════════════════════════
//  frequencies - five wavering signals notated as an abstract machine score
// ═══════════════════════════════════════════════════════════════════
//  New to p5.gysin? The whole core is three lines:
//
//      const plot = new GysinPlot({ seed: 40017 });
//      plot.path([[52, 200], [668, 200]], { stroke: "#171717" });   // one clean signal
//      plot.draw();
//
//  Every option below (breathe, dropout, rubout, hatch fill, asemic, layers…)
//  is OPTIONAL disturbance layered on top of that core. The defaults are
//  all zero, so a call with no options just draws clean - nothing here is
//  required to use the library. This sketch builds the score up in layers;
//  read the numbered sections in buildPlot() from top to bottom. Each is a
//  compositional layer, drawn back to front, and can be deleted on its own
//  without breaking the rest.
// ═══════════════════════════════════════════════════════════════════

let plot;
let seed = 40017;
let loudestChannel = "";   // which S# the reading head sits on, shown in the caption

// Five signals, each with its own voice. harm/harmAmp are a fixed second
// harmonic per row, so no two wave forms read alike. Row index 2 is the accent.
const voices = [
  { y: 120, amp: 16, freq: 0.030, harm: 2.0, harmAmp: 5,  breathe: 1.0, rubout: 0.05, repeat: 2, pressure: 0.12, hesitate: 0.05 },
  { y: 205, amp: 24, freq: 0.045, harm: 3.4, harmAmp: 8,  breathe: 1.3, rubout: 0.10, repeat: 1, pressure: 0.40, hesitate: 0.22 },
  { y: 290, amp: 12, freq: 0.070, harm: 4.7, harmAmp: 4,  breathe: 0.7, rubout: 0.16, repeat: 2, pressure: 0.65, hesitate: 0.10 },
  { y: 375, amp: 30, freq: 0.022, harm: 1.7, harmAmp: 10, breathe: 1.6, rubout: 0.08, repeat: 1, pressure: 0.28, hesitate: 0.34 },
  { y: 460, amp: 18, freq: 0.055, harm: 6.1, harmAmp: 5,  breathe: 1.1, rubout: 0.20, repeat: 2, pressure: 0.52, hesitate: 0.16 }
];

const LEFT = 52;
const ACCENT = 2;         // the red focus row
const RED = "#b5362b";
const INK = "#171717";
const STAFF_TOP = 92;     // first ruled line
const STAFF_GAP = 28;     // spacing between ruled lines
const NOTES = 16;         // notation cells across the score
const STEP = 8;           // one sampling grid, shared by every layer

function setup() {
  const canvas = createCanvas(720, 620);
  canvas.parent("sketch");
  describe("An abstract machine score: five wavering signal lines with hatched diamond markers scaled to and labelled with each signal's loudness percent, thin threads dropping from each marker to the notation cell beneath it, one faint vertical reading head on the loudest column, a row of asemic notation whose height and density track the score, and a small labelled legend in the bottom margin.");
  pixelDensity(1);
  noLoop();
  voices.forEach((v) => { v.baseAmp = v.amp; v.baseFreq = v.freq; });
  buildPlot();
  wireActions();
}

function draw() {
  background("#f0efe9");
  plot.draw();
}

// A new reading drifts each voice's amplitude and frequency, reshaping every layer.
function regenerate() {
  voices.forEach((v) => {
    v.amp = v.baseAmp * random(0.78, 1.22);
    v.freq = v.baseFreq * random(0.85, 1.15);
  });
  seed = floor(random(1e6));
  buildPlot();
  redraw();
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) regenerate();
}

function keyPressed() {
  if (key === "r" || key === "R") regenerate();
  if (key === "s" || key === "S") downloadScore();
}

// One signal's y at position x: baseline plus its fundamental and its own harmonic.
function signalY(v, i, x) {
  return v.y + sin(x * v.freq + i) * v.amp + sin(x * v.freq * v.harm + i) * v.harmAmp;
}

// Sample the score once on the shared grid: per column, each voice's y and a 0..1 loudness.
function sampleScore(right) {
  const cols = [];
  for (let x = LEFT; x <= right; x += STEP) {
    const ys = voices.map((v, i) => signalY(v, i, x));
    let sum = 0, max = 0;
    voices.forEach((v, i) => { sum += abs(ys[i] - v.y); max += v.amp + v.harmAmp; });
    cols.push({ x, ys, amp: sum / max });
  }
  return cols;
}

// The column where one voice sits loudest, plus that loudness in pixels.
function peakColumn(cols, i) {
  let best = cols[0], loud = -1;
  for (const c of cols) {
    const d = abs(c.ys[i] - voices[i].y);
    if (d > loud) { loud = d; best = c; }
  }
  return { col: best, loudness: loud };
}

// Combined loudness at an x, read off the nearest sampled column.
function ampAt(cols, x) {
  const k = constrain(round((x - LEFT) / STEP), 0, cols.length - 1);
  return cols[k].amp;
}

// Single export path shared by the button and the S key.
function downloadScore() {
  plot.downloadSVG("p5-gysin-frequencies.svg", { width, height });
}

// Which notation cell a column x falls into, clamped to the row.
function cellIndex(x, cellW) {
  return constrain(floor((x - LEFT) / cellW), 0, NOTES - 1);
}

function buildPlot() {
  plot = new GysinPlot({
    seed,
    width,
    height,
    style: {
      stroke: INK,
      strokeWeight: 1,
      alpha: 0.82
    }
  });

  const right = width - LEFT;
  const cellW = (right - LEFT) / NOTES;
  const cols = sampleScore(right);

  // Staff geometry drives everything below it, so the sheet stays glued to the paper at any height.
  const staffYs = [];
  for (let y = STAFF_TOP; y < height - 72; y += STAFF_GAP) staffYs.push(y);
  const baseline = staffYs[staffYs.length - 1];

  // ── 1 · ruled paper ────────────────────────────────────────────
  // Ruled paper on its own layer so the SVG export shows the same sheet.
  staffYs.forEach((y) => {
    plot.line(LEFT - 22, y, right + 22, y, {
      breathe: 0.3,
      dropout: 0.02,
      stroke: "#dcdcdc",
      strokeWeight: 0.6,
      layer: "paper"
    });
  });

  // ── 2 · reading head ───────────────────────────────────────────
  // Reading head: the loudest combined column, and the channel that dominates it.
  // A tape head over a loop: the same material returns at different speeds and
  // levels, and the score notates what returned - reading as recording.
  let head = cols[0];
  for (const c of cols) if (c.amp > head.amp) head = c;
  const headCell = cellIndex(head.x, cellW);
  loudestChannel = "S" + (head.ys.reduce(
    (best, y, i) => abs(y - voices[i].y) > abs(head.ys[best] - voices[best].y) ? i : best, 0) + 1);

  // A faint vertical rule on that column, the counter-axis to the five horizontals.
  plot.line(head.x, staffYs[0], head.x, baseline, {
    breathe: 0.6,
    dropout: 0.08,
    stroke: INK,
    strokeWeight: 0.8,
    alpha: 0.45,
    layer: "read"
  });
  // Cap it with a hatched tick and label its level as a percent of full scale.
  plot.polygon(diamond(head.x, staffYs[0], 6), {
    fill: "hatch",
    hatchSpacing: 2,
    breathe: 0.5,
    stroke: INK,
    alpha: 0.85,
    layer: "read"
  });
  plot.text(nf(head.amp * 100, 2, 0) + "% level", head.x + 10, staffYs[0] - 5, {
    size: 11,
    letterSpacing: 0.5,
    breathe: 0.4,
    stroke: INK,
    layer: "read"
  });

  // ── 3 · accent baseline ────────────────────────────────────────
  // A thin red baseline under the accent signal gives S3 one clear focus -
  // a line, not a filled wash.
  const hero = voices[ACCENT];
  plot.line(LEFT, hero.y, right, hero.y, {
    breathe: 0.3,
    stroke: RED,
    strokeWeight: 0.8,
    alpha: 0.5,
    layer: "signal"
  });

  // ── 4 · the five signals ───────────────────────────────────────
  // Five signals. The red accent leads; the four ink voices sit lighter so they read as backdrop, not clones.
  voices.forEach((v, i) => {
    const signal = cols.map((c) => [c.x, c.ys[i]]);
    const accent = i === ACCENT;
    plot.path(signal, {
      breathe: v.breathe,
      dropout: 0.05,
      repeat: v.repeat,
      drift: 1.2,
      rubout: v.rubout,
      pressure: v.pressure,
      hesitate: v.hesitate,
      overshoot: 8,
      segmentLength: 8,
      stroke: accent ? RED : INK,
      strokeWeight: accent ? 2 : map(v.amp, 12, 30, 0.6, 1.4, true),
      alpha: accent ? 0.9 : map(v.amp, 12, 30, 0.34, 0.62, true),
      layer: "signal"
    });
  });

  // Each voice's loudest column, reused by the notation, the links and the markers.
  const peaks = voices.map((v, i) => peakColumn(cols, i));
  const linkedCells = new Set(peaks.map((pk) => cellIndex(pk.col.x, cellW)));
  const accentCell = cellIndex(peaks[ACCENT].col.x, cellW);

  // ── 5 · notation row ───────────────────────────────────────────
  // Notation row: one asemic mark per column, taller/denser where the score is louder.
  // Every other cell is nudged shorter so the row reads as a rhythm, not an even wall.
  // The accent cell inks red and stays full; the four ink voices dim so the red run leads.
  const cells = [];
  for (let i = 0; i < NOTES; i++) {
    const cx = LEFT + (i + 0.5) * cellW;
    const amp = ampAt(cols, cx);
    const h = (28 + amp * 40) * (i % 2 ? 0.78 : 1);
    cells.push({ cx, top: baseline - h });
    const isHead = i === headCell;
    const isAccent = i === accentCell;
    plot.asemic(LEFT + i * cellW, baseline - h, cellW * 0.7, h, {
      loops: 3 + round(amp * 6),
      breathe: 0.5,
      strokeWeight: 0.6 + amp * 1.4 + (linkedCells.has(i) ? 0.5 : 0) + (isHead ? 0.9 : 0),
      stroke: isAccent ? RED : (isHead ? INK : "#3a3a3a"),
      alpha: (isAccent || isHead ? 0.4 + amp * 0.5 : (0.4 + amp * 0.5) * 0.6),
      layer: "notation"
    });
  }

  // ── 6 · peak markers ───────────────────────────────────────────
  // Per peak: a dropout thread to its notation cell, then a diamond sized to the voice's loudness.
  // The accent peak keeps a red cross and full weight; the ink voices' threads and markers dim behind it.
  peaks.forEach((pk, i) => {
    const px = pk.col.x, py = pk.col.ys[i];
    const cell = cells[cellIndex(px, cellW)];
    const accent = i === ACCENT;
    plot.line(px, py, cell.cx, cell.top, {
      breathe: 0.4,
      dropout: 0.35,
      stroke: "#8a8a8a",
      strokeWeight: 0.6,
      alpha: accent ? 0.55 : 0.3,
      layer: "link"
    });
    const r = map(pk.loudness, 10, 36, 8, 22, true);
    plot.polygon(diamond(px, py, r), {
      fill: accent ? "cross" : "hatch",
      hatchSpacing: 2.4,
      breathe: 0.65,
      rubout: 0.04,
      stroke: accent ? RED : "#244f73",
      alpha: accent ? 0.85 : 0.5,
      layer: "markers"
    });
    const pct = constrain(pk.loudness / (voices[i].amp + voices[i].harmAmp) * 100, 0, 100);
    plot.text(nf(pct, 2, 0) + "%", px + r + 4, py + 3, {
      size: 9,
      letterSpacing: 0.5,
      breathe: 0.4,
      stroke: accent ? RED : "#244f73",
      alpha: accent ? 0.9 : 0.55,
      layer: "markers"
    });
  });

  // ── 7 · row labels ─────────────────────────────────────────────
  // Row labels in the left margin (S1..S5); the accent row is labelled in red.
  voices.forEach((v, i) => {
    plot.text("S" + (i + 1), 14, v.y + 4, {
      size: 12,
      letterSpacing: 0.5,
      breathe: 0.4,
      stroke: i === ACCENT ? RED : INK,
      layer: "label"
    });
  });

  // ── 8 · title ──────────────────────────────────────────────────
  // Title in the top margin so the partituur concept reads on its own.
  plot.text("SIGNAL / NOTATION", LEFT, 52, {
    size: 15,
    letterSpacing: 1.1,
    breathe: 0.4,
    stroke: INK,
    layer: "label"
  });

  // ── 9 · legend ─────────────────────────────────────────────────
  // A legend in the bottom margin so the composition decodes from the image itself.
  drawLegend(height - 46, right);

  // ── 10 · control hint ──────────────────────────────────────────
  // On-canvas control hint so the composition announces it is rerollable.
  plot.text("click / R = new reading  ·  S = SVG", LEFT, height - 22, {
    size: 10,
    letterSpacing: 0.6,
    breathe: 0.4,
    stroke: "#8a8a8a",
    layer: "label"
  });

  // ── 11 · frame ─────────────────────────────────────────────────
  // The border, drawn last so it sits on top and boxes the whole score.
  plot.rect(LEFT, 64, right - LEFT, height - 128, {
    breathe: 0.4,
    dropout: 0.015,
    repeat: 2,
    drift: 0.5,
    stroke: INK,
    alpha: 0.65,
    layer: "frame"
  });

  showReading();
}

// Report seed, path count and the channel under the reading head, tying the reading to the SVG.
function showReading() {
  const el = document.getElementById("reading-caption");
  if (el) el.textContent = "Reading seed " + seed + " · " + plot.stats().paths +
    " plotted paths · reading head on " + loudestChannel;
}

function diamond(cx, cy, r) {
  return [[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]];
}

// The three visual verbs of the score, drawn small and labelled in three equal
// columns derived from 'right', so the legend rescales with the canvas width.
function drawLegend(y, right) {
  const label = {
    size: 10,
    letterSpacing: 0.5,
    breathe: 0.4,
    stroke: INK,
    layer: "label"
  };
  const colW = (right - LEFT) / 3;
  const col = (n) => LEFT + n * colW;

  const wave = [];
  for (let t = 0; t <= 6; t++) wave.push([col(0) + t * 5, y + sin(t) * 4]);
  plot.path(wave, {
    breathe: 0.6,
    drift: 0.8,
    stroke: INK,
    strokeWeight: 1,
    layer: "label"
  });
  plot.text("signal", col(0) + 42, y + 4, label);

  plot.polygon(diamond(col(1) + 7, y, 7), {
    fill: "hatch",
    hatchSpacing: 2.4,
    breathe: 0.5,
    stroke: "#244f73",
    alpha: 0.85,
    layer: "label"
  });
  plot.text("peak = loudness", col(1) + 22, y + 4, label);

  plot.asemic(col(2), y - 10, 18, 20, {
    loops: 4,
    breathe: 0.5,
    strokeWeight: 0.8,
    stroke: "#3a3a3a",
    alpha: 0.75,
    layer: "label"
  });
  plot.text("notation", col(2) + 26, y + 4, label);
}

function wireActions() {
  document.getElementById("reroll-button").addEventListener("click", regenerate);
  document.getElementById("svg-button").addEventListener("click", downloadScore);
}

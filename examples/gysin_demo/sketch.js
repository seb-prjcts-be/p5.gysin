// ═══════════════════════════════════════════════════════════════════
//  gysin_demo - a cut-up poster that rubs its own words away
// ═══════════════════════════════════════════════════════════════════
//  New to p5.gysin? The whole library is three lines:
//
//      const plot = new GysinPlot({ seed: 19600319 });
//      plot.text("RUB OUT", 75, 145);   // clean, mechanical text
//      plot.draw();
//
//  Every option below (breathe, dropout, rubout, cut-up, letters…)
//  is OPTIONAL disturbance layered on top of that core. The defaults are
//  all zero, so a call with no options just draws clean - nothing here is
//  required to use the library. This sketch adds the layers one at a time;
//  read the numbered sections in buildPlot() from top to bottom. Each is a
//  compositional layer, drawn back to front, and can be deleted on its own
//  without breaking the rest.
// ═══════════════════════════════════════════════════════════════════

// p5.gysin demo - "RUB OUT THE WORD"
// A cut-up typographic poster read in clear zones: two titles, a ruled band,
// and the word dissolving into a letter field that fills the lower half. Two
// sliders drive the whole poster: one rubs it away as a top-to-bottom gradient
// (titles barely touched, the field worn out), one breaks the letters apart -
// the word decaying from its head down to its foot.

let plot;
let paper;                 // paper texture, rendered once in setup (out of the draw loop)
let titleId;               // the frozen "RUB OUT" title, so reroll leaves it untouched
let titleRubout = 0.14;    // how hard everything is wiped away; driven by the rub-out slider
let letterJitter = 0.4;    // how far each glyph drifts off its axis; driven by the break slider

const SEED = 19600319;

// Shared hand-drawn defaults; every element only states how it differs.
const base = {
  segmentLength: 8,
  pressure: 0.3,
  drift: 2.5,
  breathe: 1.6
};

// The rub-out deepens with depth: one slider, read as a top-to-bottom gradient.
// A baseline y (0 at the head, 900 at the foot) is turned into a multiple of the
// slider value, so titles are barely touched and the letter field is worn away.
function ruboutAt(y) {
  return constrain(titleRubout * (0.5 + (y / 900) * 2), 0, 1);
}

function setup() {
  const canvas = createCanvas(900, 900);
  canvas.parent("sketch");
  describe("A cut-up typographic poster: rubbed-out titles, a ruled band, and the word dissolving into a decaying letter field that fills the lower half.");
  pixelDensity(1);
  noLoop();

  plot = new GysinPlot({
    seed: SEED,
    width: 900,
    height: 900,
    style: {
      stroke: "#161616",
      strokeWeight: 1.15,
      alpha: 0.9
    }
  });

  paper = makePaper();
  buildPlot();
  wireActions();
}

// Lay out the whole poster from scratch. Called again on every slider move, so the
// rub-out and break-apart happen live while the composition holds.
function buildPlot() {
  plot.clear();

  // ── 1 · the titles ──────────────────────────────────────────────
  // Both title lines get the same treatment; each line states only how it differs.
  // Their rubout is the lightest step of the gradient; glyphJitter drifts every
  // letter on its own axis.
  const titleOpts = {
    ...base,
    size: 96,
    density: 1.15,
    glyphJitter: letterJitter
  };
  titleId = plot.text("RUB OUT", 75, 145, {
    ...titleOpts,
    rubout: ruboutAt(145),
    breathe: 1.8,
    dropout: 0.08,
    repeat: 2,
    drift: 2
  });
  plot.text("THE WORD", 76, 235, {
    ...titleOpts,
    rubout: ruboutAt(235),
    breathe: 2.2,
    dropout: 0.14,
    repeat: 3,
    drift: 3,
    pressure: 0.4
  });

  // ── 2 · the cut-up quotation ────────────────────────────────────
  // Cut-up quotation: sliced and re-offset so the phrase stutters.
  plot.textCutup("I THINK THEREFORE I AM", 76, 370, {
    ...base,
    size: 55,
    slices: 9,
    sliceOffset: 24,
    sliceDropout: 0.18,
    density: 1,
    breathe: 1.4,
    dropout: 0.09,
    repeat: 2,
    drift: 2,
    rubout: ruboutAt(370),
    pressure: 0.25,
    segmentLength: 6
  });

  // ── 3 · the ruled band ──────────────────────────────────────────
  // Ruled band: six lines step in from the left and fan downward, dropout ramping
  // so the band tapers off asymmetrically. Fewer, wider-spaced lines than the text
  // above, to give the lower half air and let this read as its own block.
  for (let i = 0; i < 6; i++) {
    const y = 448 + i * 18;
    plot.line(80 + i * 8, y, 820, y + i * 5, {
      ...base,
      breathe: 0.9,
      drift: 1.4,
      dropout: 0.04 + i * 0.03,
      overshoot: 9,
      repeat: i % 3 === 0 ? 2 : 1,
      pressure: 0.2,
      segmentLength: 10,
      strokeWeight: 0.85,
      alpha: 0.72,
      rubout: ruboutAt(y)
    });
  }

  // ── 4 · the letter field ────────────────────────────────────────
  // The word made literal: the whole lower half is a letter field, the heaviest
  // step of the gradient, dissolving under both sliders. No filled masses - the
  // words themselves are the block, densest ink the poster has.
  plot.letters("RUB OUT THE WORD", 90, 600, 720, 300, {
    ...base,
    size: 26,
    breathe: 1.4,
    dropout: 0.2 + titleRubout,
    rubout: ruboutAt(700),
    drift: 1.2,
    glyphJitter: letterJitter,
    alpha: 0.7
  });

  plot.freeze(titleId);
  updateStats();
  updateCodeCaption();
}

// Reflect the two live parameters back onto the code above, so a student sees which
// slider drives which argument instead of the hard-coded numbers in the snippet.
function updateCodeCaption() {
  const el = document.getElementById("code-caption");
  if (!el) return;
  el.textContent = `now driving the code above: rubout ${titleRubout.toFixed(2)} · glyphJitter ${letterJitter.toFixed(2)}`;
}

function draw() {
  image(paper, 0, 0);
  plot.draw();
}

// Render the paper grain once into an off-screen buffer. The plot keeps its own
// seeded RNG, so the local randomSeed here stays isolated.
function makePaper() {
  const g = createGraphics(width, height);
  g.pixelDensity(1);
  g.background("#f0efe9");
  g.noFill();
  randomSeed(88);

  g.stroke("#e6e6e6");
  g.strokeWeight(0.6);
  for (let y = 56; y < height; y += 34) {
    g.line(48, y + random(-1, 1), width - 48, y + random(-1, 1));
  }

  g.stroke("#dddddd");
  g.strokeWeight(0.45);
  for (let i = 0; i < 120; i++) {
    g.point(random(width), random(height));
  }
  return g;
}

// One source of truth for the four actions: the key that triggers it, the button
// it binds to, and the handler. keyPressed and wireActions both read from here, so
// a key and its button can never drift apart.
const actions = {
  s: { button: "svg-button", run: downloadSVG },
  j: { button: "json-button", run: downloadJSON },
  h: { button: "hpgl-button", run: downloadHPGL },
  r: { button: "reroll-button", run: rerollPlot },
};

function keyPressed() {
  const action = actions[key.toLowerCase()];
  if (action) action.run();
}

function wireActions() {
  for (const { button, run } of Object.values(actions)) bindClick(button, run);

  bindSlider("rubout-slider", "rubout-value", (v) => { titleRubout = v; });
  bindSlider("jitter-slider", "jitter-value", (v) => { letterJitter = v; });
}

// Wire a range input to a state setter, rebuild the poster, and redraw live.
function bindSlider(sliderId, readoutId, setValue) {
  const slider = document.getElementById(sliderId);
  const readout = document.getElementById(readoutId);
  if (!slider) return;
  slider.addEventListener("input", (event) => {
    const v = Number(event.target.value);
    setValue(v);
    if (readout) readout.textContent = v.toFixed(2);
    buildPlot();
    redraw();
  });
}

function bindClick(id, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", handler);
}

// Show the plot cost: number of pen strokes and total pen-down travel in pixels.
function updateStats() {
  const el = document.getElementById("plot-stats");
  if (!el) return;
  const s = plot.stats();
  el.textContent = `${s.paths} pen-strokes · pen length ≈ ${Math.round(s.drawnLength)} px`;
}

function downloadSVG() {
  plot.downloadSVG("p5-gysin-demo.svg", { width: 900, height: 900 });
}

function downloadJSON() {
  plot.downloadJSON("p5-gysin-demo.json");
}

function downloadHPGL() {
  plot.downloadHPGL("p5-gysin-demo.hpgl");
}

// reroll() re-decays every unfrozen shape; the frozen top title is left untouched.
function rerollPlot() {
  plot.reroll();
  updateStats();
  redraw();
}

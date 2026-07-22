// ═══════════════════════════════════════════════════════════════════
//  first_trace - one word decaying down a single faint backbone line
// ═══════════════════════════════════════════════════════════════════
//  New to p5.gysin? The whole library is three lines:
//
//      const plot = new GysinPlot({ seed: 1960 });
//      plot.text("FIRST TRACE", 46, 248);   // clean, mechanical text
//      plot.draw();
//
//  Every option below (breathe, dropout, rubout, fill, cut-up, asemic…)
//  is OPTIONAL disturbance layered on top of that core. The defaults are
//  all zero, so a call with no options just draws clean - nothing here is
//  required to use the library. This sketch adds the layers one at a time;
//  read the numbered sections in buildPlot() from top to bottom. Each is a
//  compositional layer, drawn back to front, and can be deleted on its own
//  without breaking the rest.
// ═══════════════════════════════════════════════════════════════════

let plot;
let seedValue = 1960;
let decay = 1;      // live disturbance multiplier, driven by the decay knob
let font = null;    // outline typeface for the word stages; null = built-in bitmap fallback

// A local outline font (shared with the font_outlines example). Its contours let
// the head stage carry a real cross-hatch fill, so density - not just alpha -
// reads the decay. If it fails to load the sketch falls back to the single-stroke
// bitmap alphabet and simply draws the words hollow.
const FONT_URL = "../font_outlines/assets/Oswald-Regular.otf";

// A five-word phrase, one word per reseed. Consecutive reseeds step through it
// in order (FIRST TRACE -> SLOW HAND -> ...), so the variations read as a phrase.
const WORDS = ["FIRST TRACE", "SLOW HAND", "LOST WORD", "OPEN MARK", "GONE SOON"];

// One word, three stages, one loop. Down the diagonal each stage drifts right (x),
// thins its stroke (weight), fades (alpha), breaks up (dropout) and gets erased
// (rubout/fray) - a continuous gradient of legibility, not three separate lines.
// Only the legible head carries fill:"cross", so it reads solid/ink-heavy while the
// cut-up and asemic tail stay outline-only and hollow. verb picks the drawing
// method; extra holds the per-stage disturbance flavour.
const STAGES = [
  //  name       labelY  y    x    weight  alpha  dropout  rubout  fray   verb          fill      extra
  { name: "legible", labelY: 216, y: 248, x: 46,  weight: 1.1,  alpha: 0.9,  dropout: 0.05, rubout: 0.06, fray: 0.4, verb: "text",      fill: "cross",
    extra: { breathe: 1.2, glyphJitter: 0.5 } },
  { name: "cut-up",  labelY: 326, y: 360, x: 100, weight: 0.85, alpha: 0.55, dropout: 0.2,  rubout: 0.16, fray: 1.2, verb: "textCutup",
    extra: { breathe: 1.5, glyphJitter: 1.1, slices: 8, sliceOffset: 22, drift: 3.4, overshoot: 6, repeat: 2 } },
  { name: "asemic",  labelY: 424, y: 512, x: 150, weight: 0.6,  alpha: 0.18, dropout: 0.55, rubout: 0.3,  fray: 2.4, verb: "text",
    extra: { breathe: 2.2, glyphJitter: 1.3 } }
];

// The asemic tangles that bury the ghost word, placed as offsets from the asemic
// stage - so moving that stage's x/y moves the whole tail with it, one source.
const TANGLES = [
  { dx: -110, dy: -80, w: 250, h: 168, weight: 0.5,  dropout: 0.04, pressure: 0.1  },
  { dx:   76, dy: -52, w: 262, h: 140, weight: 0.42, dropout: 0.06, pressure: 0.05 },
  { dx:  210, dy:   8, w: 150, h: 90,  weight: 0.3,  dropout: 0.1,  pressure: 0.04 }
];

const SIZE = 46;   // shared type size
const SEG = 7;     // shared grain of the disturbance
const CAPTION = "#8a8a8a";

// Shared type fields for every word block; per-stage differences spread over it.
const BASE = {
  size: SIZE,
  segmentLength: SEG
};

// One caption look for every small label and footnote on the sheet. Captions keep
// the crisp single-stroke bitmap alphabet (no font), so small text stays legible.
const CAPTION_STYLE = {
  glyphJitter: 0.1,
  breathe: 0.5,
  stroke: CAPTION
};

// The decay knob: scale the disturbance verbs of any block by the live multiplier,
// so one control drives breathe, drift, dropout AND erasure across the whole trace
// at once. rubout/fray scale too, so higher decay literally wipes the mark out.
const decayed = (opts) => ({
  ...opts,
  breathe: (opts.breathe ?? 0) * decay,
  drift: (opts.drift ?? 0) * decay,
  dropout: (opts.dropout ?? 0) * decay,
  rubout: (opts.rubout ?? 0) * decay,
  fray: (opts.fray ?? 0) * decay
});

async function setup() {
  const canvas = createCanvas(520, 620);
  canvas.parent("sketch");
  describe(
    "A single mark decaying in labelled stages, read top to bottom along one faint " +
    "backbone line: a cross-hatched origin dot, a firm first stroke, then one word " +
    "rendered solid and cross-hatch filled, cut up, and finally dissolving into a " +
    "hollow asemic scribble that drifts right and fades out."
  );
  pixelDensity(1);
  noLoop();
  wireActions();
  updateDecayReadout();
  await loadTypeface();
  buildPlot();
}

function draw() {
  background("#f0efe9");
  drawSheet();
  plot.draw();
}

// Loads the outline font once; a failed load leaves font null and the words draw
// with the built-in single-stroke alphabet (hollow, no fill) instead.
async function loadTypeface() {
  try { font = await loadFont(FONT_URL); }
  catch (error) { font = null; }
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  rerollPlot();
}

// Arrow keys mirror the on-screen decay buttons, so the cause-and-effect between
// one parameter and the whole trace is discoverable live.
function keyPressed() {
  if (keyCode === UP_ARROW) { nudgeDecay(0.2); return false; }
  if (keyCode === DOWN_ARROW) { nudgeDecay(-0.2); return false; }
}

function wireActions() {
  document.getElementById("reroll-button").addEventListener("click", rerollPlot);
  document.getElementById("svg-button").addEventListener("click", downloadSVG);
  document.getElementById("decay-up").addEventListener("click", () => nudgeDecay(0.2));
  document.getElementById("decay-down").addEventListener("click", () => nudgeDecay(-0.2));
}

function nudgeDecay(delta) {
  decay = constrain(decay + delta, 0, 2.5);
  updateDecayReadout();
  buildPlot();
  redraw();
}

function rerollPlot() {
  seedValue += 1;   // one step further along the phrase and a fresh disturbance pattern
  buildPlot();
  redraw();
}

function downloadSVG() {
  if (!plot) return;   // never fire before the first buildPlot()
  plot.downloadSVG("p5-gysin-first-trace.svg", { width: width, height: height });
}

function buildPlot() {
  const word = WORDS[seedValue % WORDS.length];   // deterministic: same seed -> same word

  plot = new GysinPlot({
    seed: seedValue,
    width: width,
    height: height,
    style: {
      stroke: "#151515",
      strokeWeight: 1.1,
      alpha: 0.88
    }
  });

  // ── 1 · the backbone ────────────────────────────────────────────
  // The backbone, drawn first so every mark sits on top of it: one faint, searching
  // line that literally joins the origin node, the end of the first stroke and each
  // decay anchor - the 'one continuous mark' drawn, not just implied by placement.
  // Its shake and doubling scale with decay like everything else on the sheet.
  const spine = [[92, 110], [470, 124], ...STAGES.map((s) => [s.x, s.y])];
  plot.path(spine, decayed({
    stroke: "#151515",
    strokeWeight: 0.5,
    alpha: 0.4,
    breathe: 0.9,
    drift: 1.2,
    repeat: 2,
    hesitate: 0.4,
    segmentLength: SEG
  }));

  const label = (stage) =>
    plot.text(stage.name, stage.x, stage.labelY, {
      ...CAPTION_STYLE,
      size: 13
    });

  // ── 2 · the origin node ─────────────────────────────────────────
  // Origin: a dense, hard-pressed ink node - the heavy head of the diagonal.
  plot.circle(92, 110, 80, decayed({
    fill: "cross",
    hatchSpacing: 1.8,
    density: 1.6,
    breathe: 1.4,
    dropout: 0.05,
    pressure: 0.82
  }));

  // ── 3 · the first stroke ────────────────────────────────────────
  // First stroke: firm and confident, already hesitating and fraying.
  plot.line(146, 110, 470, 124, decayed({
    breathe: 1.2,
    dropout: 0.04,
    overshoot: 10,
    hesitate: 0.6,
    fray: 0.5,
    pressure: 0.65,
    segmentLength: 9
  }));

  // ── 4 · the word, three decays ──────────────────────────────────
  // Same word, three decays. The whole gradient is one pass over the stage table:
  // only verb, position, fill and the disturbance amounts differ from row to row.
  // With the outline font loaded the head is cross-hatch filled (solid) while the
  // tail stays outline-only (hollow); without it every stage falls back to hollow.
  for (const stage of STAGES) {
    label(stage);
    const opts = decayed({
      ...BASE,
      ...stage.extra,
      strokeWeight: stage.weight,
      alpha: stage.alpha,
      dropout: stage.dropout,
      rubout: stage.rubout,
      fray: stage.fray
    });
    if (font) {
      opts.font = font;
      if (stage.fill) { opts.fill = stage.fill; opts.hatchSpacing = 2; }
    }
    plot[stage.verb](word, stage.x, stage.y, opts);
  }

  // ── 5 · the asemic tail ─────────────────────────────────────────
  // The last stage's word survives only as a ghost: asemic tangles bury it and drift
  // down-right. Their spread scales with decay, so a higher knob buries it wider.
  const asemic = STAGES[2];
  for (const t of TANGLES) {
    plot.asemic(asemic.x + t.dx * decay, asemic.y + t.dy * decay, t.w * decay, t.h * decay, decayed({
      breathe: 1.4,
      dropout: t.dropout,
      strokeWeight: t.weight,
      pressure: t.pressure
    }));
  }

  // ── 6 · captions ────────────────────────────────────────────────
  // Print seed AND decay on the sheet, so an exported SVG records its own knob setting.
  plot.text("seed " + seedValue, 44, 610, {
    ...CAPTION_STYLE,
    size: 14
  });
  plot.text("decay " + decay.toFixed(1) + "x", 300, 610, {
    ...CAPTION_STYLE,
    size: 14
  });

  document.getElementById("seed-readout").textContent = seedValue + " · " + word;
}

function updateDecayReadout() {
  document.getElementById("decay-readout").textContent = decay.toFixed(1) + "×";
  // Disable a knob at its end stop, so the limits (0× fully clean, 2.5× fully
  // wiped) are visible instead of clicking with no effect.
  document.getElementById("decay-down").disabled = decay <= 0;
  document.getElementById("decay-up").disabled = decay >= 2.5;
}

function drawSheet() {
  randomSeed(42);
  stroke("#dedede");
  strokeWeight(0.5);
  for (let y = 52; y < height; y += 34) {
    line(44, y + random(-0.8, 0.8), width - 44, y + random(-0.8, 0.8));
  }

  stroke("#d3d3d3");
  for (let i = 0; i < 120; i++) {
    point(random(width), random(height));
  }
}

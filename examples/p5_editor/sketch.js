// ═══════════════════════════════════════════════════════════════════
//  p5 Editor Starter — a sliced title that returns lower and forgets itself
// ═══════════════════════════════════════════════════════════════════
//  New to p5.gysin? The whole library is three lines:
//
//      const plot = new GysinPlot({ seed: 19600319 });
//      plot.text("CUT UP", 82, 150);   // clean, mechanical text
//      plot.draw();
//
//  Every option below (wobble, dropout, rubout, cut-up, hatch fill,
//  asemic…) is OPTIONAL disturbance layered on top of that core. The
//  defaults are all zero, so a call with no options just draws clean —
//  nothing here is required to use the library. This sketch builds the
//  layers up in draw order; read the numbered sections in buildPlot()
//  from top to bottom. Each is a compositional layer, drawn back to
//  front, and can be deleted on its own without breaking the rest.
// ═══════════════════════════════════════════════════════════════════

// p5.gysin — "CUT UP" starter for the p5.js Web Editor.
// The plate acts out its title: a line of type is sliced, then REMEMBERS returns
// lower, ringed in red, and forgets itself — its tail decaying through a wrong
// letter, then a printed sign, then a pure scribble as you steer decay. As the
// machine forgets, the hatched anchor erodes too. What you see is what you plot.
// Buttons drive everything; the R H + - 0 S keys mirror them.

let plot;
let seedValue = 19600319;
let calm = false;    // steady vs nervous hand
let forgotten = 0;   // glyphs the current decay dissolved

const WORD = "REMEMBERS";
const DECAY_START = 0.45;
const DECAY_STEP = 0.18;
const DECAY_MIN = 0;
const DECAY_MAX = 0.95;

let decay = DECAY_START;

// All positions in one place; canvas is square, coordinates in canvas pixels.
// The ring centre and the forgetting tail are both derived from `degrade`, so
// the red ring can never drift off the word it orbits.
const LAYOUT = {
  canvas: 720,
  anchor: { x: 88, y: 470, w: 544, h: 160 },
  title: { x: 82, y: 150, size: 96 },
  cutup: { x: 82, y: 262, size: 46 },
  degrade: { x: 82, y: 360, size: 46 },
  ring: { d: 350 },
  field: { x: 470, y: 274, w: 196, h: 186, cols: 3, rows: 3 } // right-hand void
};

// Built-in font sits on a size/7 grid; each glyph advances 5.9 units, so the
// forgotten tail stays flush with the kept letters at any size.
const GLYPH_ADVANCE_UNITS = 5.9;

const base = {
  wobble: 1.4,
  drift: 1.8,
  pressure: 0.22,
  segmentLength: 8,
  alpha: 0.8
};
const RED = "#c0392b"; // second pen: the returning word and the ring around it
const INK = "#151515"; // hatch grey, reused by the right-hand field

function setup() {
  const canvas = createCanvas(LAYOUT.canvas, LAYOUT.canvas);
  const holder = document.getElementById("sketch");
  if (holder) canvas.parent(holder);
  describe("Cut-up typography whose title word forgets itself into scribbles over an eroding hatched anchor.");
  pixelDensity(1);
  noLoop();
  buildPlot();
  syncHandLabel();
  syncDecayLabel();
}

function draw() {
  background(245);
  plot.draw();
  showStats();
}

// Reseed reshuffles the cut-up and re-breathes the plate (decay is kept).
window.reseed = () => { seedValue = floor(random(1000000)); buildPlot(); redraw(); };

// Toggle the hand between steady and nervous so the disturbance is felt live.
window.toggleHand = () => { calm = !calm; buildPlot(); redraw(); syncHandLabel(); };

// Steer forgetting both ways, clamped to the effect's range.
const setDecay = (next) => {
  decay = constrain(next, DECAY_MIN, DECAY_MAX);
  buildPlot();
  redraw();
  syncDecayLabel();
};
window.decayUp = () => setDecay(decay + DECAY_STEP);
window.decayDown = () => setDecay(decay - DECAY_STEP);
window.decayReset = () => setDecay(DECAY_START);

window.exportSVG = () => plot.downloadSVG("p5-gysin-editor-starter.svg", { width, height });

function keyPressed() {
  if (key === "r" || key === "R") window.reseed();
  if (key === "h" || key === "H") window.toggleHand();
  if (key === "+" || key === "=") window.decayUp();
  if (key === "-" || key === "_") window.decayDown();
  if (key === "0") window.decayReset();
  if (key === "s" || key === "S") window.exportSVG();
}

function buildPlot() {
  // Seed steers structure; the Hand button scales disturbance; decay erodes.
  randomSeed(seedValue);
  const nerve = calm ? 0.35 : 1.6;
  const hand = {
    ...base,
    wobble: base.wobble * nerve,
    drift: base.drift * nerve
  };
  const breath = 0.12 + random(0.3); // anchor pressure, new every reseed

  // Seed-driven grain so each plot reads as its own work, not the same picture
  // rewobbled. Drawn once, reused per layer.
  const grain = {
    crossSpacing: random(6, 9),
    crossAngle: random(0, 22),
    hatchSpacing: random(12, 18),
    hatchAngle: random(24, 48),
    ringRepeat: floor(random(2, 5)),
    ringRubout: random(0.06, 0.2),
    titleHesitate: random(0.35, 0.7),
    cutSlices: floor(random(6, 11)),
    cutOffset: random(10, 22)
  };

  plot = new GysinPlot({
    seed: seedValue,
    width,
    height,
    style: {
      stroke: INK,
      strokeWeight: 1,
      alpha: 0.88
    }
  });

  // ── 1 · the anchor ──────────────────────────────────────────────
  // Anchor — cross-hatched block that grounds the plate. Its ink drops out and
  // rubs away as decay rises, so "the machine forgets" reaches the whole plate,
  // not only the word.
  const a = LAYOUT.anchor;
  plot.rect(a.x, a.y, a.w, a.h, {
    ...hand,
    fill: "cross",
    hatchSpacing: grain.crossSpacing,
    hatchAngle: grain.crossAngle,
    pressure: breath,
    repeat: 2,
    fray: 0.3,
    alpha: 0.7,
    dropout: 0.05 + decay * 0.35,
    rubout: decay * 0.22
  });
  // Sparse slanted second hatch for tonal depth.
  plot.rect(a.x, a.y, a.w, a.h, {
    ...hand,
    fill: "hatch",
    hatchAngle: grain.hatchAngle,
    hatchSpacing: grain.hatchSpacing,
    dropout: 0.05,
    alpha: 0.25
  });

  // ── 2 · the right-hand field ────────────────────────────────────
  // Right-hand field — a light machine index in the hatch grey that fills the
  // void and counterweights the red ring. Its glyphs and frame thin with decay.
  const f = LAYOUT.field;
  plot.symbols(f.x, f.y, f.w, f.h, {
    ...hand,
    size: 15,
    stroke: INK,
    alpha: 0.35,
    drift: decay * 0.5,
    dropout: 0.05 + decay * 0.5,
    glyphJitter: 0.4
  });
  plot.grid(f.x, f.y, f.w, f.h, f.cols, f.rows, {
    frame: {
      stroke: INK,
      strokeWeight: 0.9,
      alpha: 0.38,
      wobble: 0.7,
      bleed: 0.18,
      dropout: 0.06 + decay * 0.4
    }
  });

  // ── 3 · the red ring ────────────────────────────────────────────
  // Red ring — centred on the degrade word from the same layout + advance the
  // word is drawn with, so it always circles REMEMBERS. Red stays on the ring
  // and the returning word, so the two read as one figure.
  const dg = LAYOUT.degrade;
  const wordWidth = WORD.length * (dg.size / 7) * GLYPH_ADVANCE_UNITS;
  plot.circle(dg.x + wordWidth / 2, dg.y - dg.size / 2, LAYOUT.ring.d, {
    ...hand,
    stroke: RED,
    density: 1.35,
    dropout: 0.1,
    repeat: grain.ringRepeat,
    rubout: grain.ringRubout,
    alpha: 0.7
  });

  // ── 4 · the title ───────────────────────────────────────────────
  // Title — largest surface; pressure varies its weight, hesitate breaks it.
  const t = LAYOUT.title;
  plot.text("CUT UP", t.x, t.y, {
    ...hand,
    size: t.size,
    pressure: 0.4,
    hesitate: grain.titleHesitate,
    dropout: 0.08,
    repeat: 2,
    rubout: 0.06
  });

  // ── 5 · the sentence ────────────────────────────────────────────
  // Sentence — sliced once, how hard depends on the seed's grain.
  const cu = LAYOUT.cutup;
  plot.textCutup("THE MACHINE REMEMBERS", cu.x, cu.y, {
    ...hand,
    size: cu.size,
    slices: grain.cutSlices,
    sliceOffset: grain.cutOffset,
    sliceDropout: 0.16,
    dropout: 0.09,
    repeat: 2,
    rubout: 0.14
  });

  // ── 6 · the forgetting word ─────────────────────────────────────
  // The word returns lower and forgets itself.
  forgotten = degradeWord(WORD, dg.x, dg.y, dg.size, decay, hand);
}

// Draw a word whose tail dissolves and return how many glyphs were lost. Each
// lost glyph decays through three alphabets as `t` runs 0→1 across the tail — its
// own letter shaken loose, then a printed sign, then a pure scribble — while
// wobble, drift and dropout climb with every step. So the tail is a gradient of
// noise, a real failing alphabet, not the same scribble nine times over.
function degradeWord(word, x, y, size, decay, hand) {
  const advance = (size / 7) * GLYPH_ADVANCE_UNITS;
  const lost = floor(decay * word.length);
  const kept = word.length - lost;

  if (kept > 0) {
    plot.textCutup(word.slice(0, kept), x, y, {
      ...hand,
      size,
      stroke: RED,
      slices: floor(random(12, 19)),
      sliceOffset: random(30, 54),
      sliceDropout: 0.3,
      dropout: 0.14,
      rubout: 0.22
    });
  }
  for (let i = kept; i < word.length; i++) {
    const fade = i - kept;
    const t = lost > 1 ? fade / (lost - 1) : 1; // 0 first-lost → 1 last-lost
    forgetGlyph(word[i], x + i * advance, y - size, advance, size, t, {
      ...hand,
      stroke: RED,
      size,
      wobble: hand.wobble + fade * 0.5,
      drift: hand.drift + fade * 0.6,
      dropout: 0.08 + fade * 0.06
    });
  }
  return lost;
}

// One forgotten cell along the tail: this glyph, shaken → printed sign → scribble.
function forgetGlyph(glyph, gx, top, w, size, t, mark) {
  if (t < 0.34) plot.letters(glyph, gx, top, w, size, {
    ...mark,
    glyphJitter: 0.55
  });
  else if (t < 0.67) plot.symbols(gx, top, w, size, mark);
  else plot.asemic(gx, top, w, size, mark);
}

// Live plotter cost plus the three steerable axes — seed, hand and decay —
// read off in one place, followed by how much the machine forgot this decay.
function showStats() {
  const el = document.getElementById("stats");
  if (!el) return;
  const s = plot.stats();
  el.textContent =
    `seed ${seedValue} · hand ${calm ? "steady" : "nervous"} · decay ${decay.toFixed(2)} · ` +
    `${forgotten}/${WORD.length} letters forgotten · ` +
    `${s.paths} strokes · pen-down ${round(s.drawnLength)} px · pen-up ${round(s.travelLength)} px`;
}

function syncHandLabel() {
  const b = document.getElementById("handBtn");
  if (b) b.textContent = calm ? "Hand: steady" : "Hand: nervous";
}

// Both Decay buttons read the value live, so the core of the demo is reachable
// without touching the keyboard.
function syncDecayLabel() {
  const value = decay.toFixed(2);
  const up = document.getElementById("decayUpBtn");
  const down = document.getElementById("decayDownBtn");
  if (up) up.textContent = `Decay + (${value})`;
  if (down) down.textContent = `Decay − (${value})`;
}

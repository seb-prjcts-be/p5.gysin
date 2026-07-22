// ═══════════════════════════════════════════════════════════════════
//  font_outlines - the same glyphs, hatch-filled two ways, then undone
// ═══════════════════════════════════════════════════════════════════
//  New to p5.gysin? The whole library is three lines:
//
//      const plot = new GysinPlot({ seed: 8088 });
//      plot.text("O8", 64, 190, { font });   // an outline font -> real letter bodies
//      plot.draw();
//
//  A real outline font is the ONLY extra this example needs: with it, fill can
//  hatch the letter bodies and leave the inner counters empty. Every other
//  option below (fill mode, weave spacing/angle, breathe, cut-up, asemic…) is
//  OPTIONAL disturbance layered on top, and every default is zero - a call with
//  no options draws clean. This sketch adds the layers one at a time; read the
//  numbered sections in buildPlot() from top to bottom. Each is a compositional
//  layer, drawn back to front, and can be deleted on its own without breaking
//  the rest.
// ═══════════════════════════════════════════════════════════════════

const FONT_URLS = {
  Oswald: "assets/Oswald-Regular.otf",
  Anton: "assets/Anton-Regular.ttf"
};

const CROSS_TWIST = 23;  // the woven side sits this many degrees off the single hatch

let fonts = {};        // name -> loaded p5.Font (lazy)
let activeFont = "Oswald";
let plot;

let currentSeed = 8088; // bumped by "New variation" so a reroll survives a rebuild
let fillOn = true;      // toggled live so the fill lines can be seen appearing
let breatheAmount = 0.9;
let hatchSpacing = 4;   // weave density: fewer lines = more paper showing
let hatchAngle = 22;    // off-axis weave reads more handmade than a flat 0

async function setup() {
  const canvas = createCanvas(760, 560);
  canvas.parent("sketch");
  pixelDensity(1);
  noLoop();

  await loadOutlineFont("Oswald");
  buildPlot();
  wireControls();
}

function draw() {
  background("#f0efe9");
  drawPaper();
  plot.draw();
}

// Loads a font once and keeps it; a failed load falls back to the bitmap alphabet.
async function loadOutlineFont(name) {
  if (fonts[name] === undefined) {
    try {
      fonts[name] = await loadFont(FONT_URLS[name]);
    } catch (error) {
      fonts[name] = null;
    }
  }
  if (fonts[name]) activeFont = name;
}

// Attaches the active outline font to an options object when one is loaded, so
// the "fill needs real contours" guard lives in one place instead of three.
function withFont(options) {
  const font = fonts[activeFont];
  if (font) options.font = font;
  return options;
}

// Weave density: 0 (open, lots of paper) .. 6 (tight, solid). One source of
// truth so the bodies, the cut-up and the asemic field all breathe together.
function weaveDensity() {
  return 8 - hatchSpacing;
}

// One glyph body; only the fill mode and the weave angle differ between sides.
// A tighter weave (higher density) also presses harder and frays more, so the
// slider and "New variation" read as a change in ink weight, not just count.
function glyphBody(fillMode, angle) {
  const density = weaveDensity();
  const body = withFont({
    size: 130,
    breathe: breatheAmount,
    dropout: 0.025,
    rubout: 0.08,
    fray: 0.3 + density * 0.04,
    pressure: 0.25 + density * 0.03,
    segmentLength: 6,
    glyphJitter: 0.5,
    layer: "contours"
  });
  if (fillOn && body.font) {
    body.fill = fillMode;                   // "hatch" (single) or "cross" (woven)
    body.hatchSpacing = hatchSpacing;
    body.hatchAngle = angle;
    body.glyphJitter += density * 0.05;
  }
  return body;
}

// A fresh caption options object each call, so withFont() can mutate it safely.
function caption() {
  return {
    size: 18,
    breathe: 0.5,
    dropout: 0.03,
    segmentLength: 6,
    stroke: "#171717",
    alpha: 0.5,
    layer: "labels"
  };
}

// Point once at the hollow O so a viewer sees which part stays empty, instead of
// only reading the word "counter". The built-in single-stroke alphabet keeps the
// small label crisp; a thin red arrow dips into the O's counter.
function annotateCounter() {
  const ink = {
    stroke: "#b5362b",
    alpha: 0.95,
    layer: "labels"
  };
  plot.text("counter", 66, 84, Object.assign({
    size: 14,
    breathe: 0.5,
    dropout: 0.02
  }, ink));
  plot.line(100, 88, 95, 130, Object.assign({
    breathe: 0.5,
    overshoot: 2
  }, ink));
  plot.line(95, 130, 88, 119, Object.assign({}, ink));   // arrowhead
  plot.line(95, 130, 102, 121, Object.assign({}, ink));
}

function buildPlot() {
  plot = new GysinPlot({
    seed: currentSeed,
    width: width,
    height: height,
    style: {
      stroke: "#171717",
      strokeWeight: 1,
      alpha: 0.9
    }
  });

  // ── 1 · the two glyph bodies ────────────────────────────────────
  // Same glyphs on both sides so the fill mode is the ONLY variable: single
  // hatch left, woven cross-hatch right, twisted apart so the weave out-reads.
  plot.text("O8", 64, 190, glyphBody("hatch", hatchAngle));
  plot.text("O8", 384, 190, glyphBody("cross", hatchAngle + CROSS_TWIST));

  // ── 2 · the counter arrow ───────────────────────────────────────
  if (fonts[activeFont]) annotateCounter();

  // ── 3 · the side captions ───────────────────────────────────────
  plot.text("SINGLE HATCH", 64, 228, withFont(caption()));
  plot.text("WOVEN CROSS", 384, 228, withFont(caption()));

  // ── 4 · the cut-up phrase ───────────────────────────────────────
  // The weave slider drives the cut-up too: a tighter weave slices the word harder.
  const density = weaveDensity();                // 0 (open) .. 6 (tight)
  plot.textCutup("COUNTER MEMORY", 72, 404, withFont({
    size: 48,
    slices: 4 + Math.round(density),
    sliceOffset: 8 + density * 3,
    sliceDropout: 0.11,
    breathe: 1,
    dropout: 0.06,
    repeat: 2,
    drift: 1.2,
    rubout: 0.1,
    segmentLength: 6,
    stroke: "#b5362b",
    layer: "cutup"
  }));

  // ── 5 · the inked rule ──────────────────────────────────────────
  // One hand-inked rule under COUNTER MEMORY: doubled by repeat, run past the ends.
  plot.line(72, 428, 588, 428, {
    repeat: 2,
    drift: 1.6,
    breathe: 0.6,
    dropout: 0.03,
    overshoot: 8,
    stroke: "#171717",
    alpha: 0.6,
    layer: "baseline"
  });

  // ── 6 · the asemic field ────────────────────────────────────────
  // Past the rule the phrase stops being words: it scatters into asemic marks,
  // memory pulled apart into illegible signs instead of spelled out again. Set
  // clear of the cut-up so weave / cut-up / field each read on their own. Tighter
  // weave tangles each mark more, so the field decays in step with the bodies.
  const marks = 8;
  const markW = 516 / marks;
  for (let i = 0; i < marks; i++) {
    plot.asemic(72 + i * markW, 478, markW, 66, {
      loops: 3 + Math.round(density),
      breathe: 0.6,
      dropout: 0.05,
      pressure: 0.2 + density * 0.05,
      stroke: "#171717",
      alpha: 0.22,
      layer: "field"
    });
  }

  updateStatus();
}

// Fill needs a real outline font; the weave sliders need Fill on too. When they
// can do nothing, hide them entirely - a vanished control reads as a choice,
// where a greyed-out one reads as a bug.
function setControlsEnabled(hasFont) {
  document.getElementById("fill-button").disabled = !hasFont;
  document.getElementById("breathe-range").disabled = !hasFont;
  const weaveLive = hasFont && fillOn;
  ["hatch-range", "angle-range"].forEach((id) => {
    const range = document.getElementById(id);
    range.disabled = !weaveLive;
    range.closest("label").style.display = weaveLive ? "flex" : "none";
  });
}

// One short, live measurement - seed plus pen/fill totals - so the aria-live
// region announces a number per tick, not a paragraph. The fixed explanation
// lives in the HTML subtitle.
function updateStatus() {
  const status = document.getElementById("font-status");
  const hasFont = Boolean(fonts[activeFont]);
  setControlsEnabled(hasFont);

  const stats = plot.stats();
  if (!hasFont) {
    status.textContent = `built-in alphabet · seed ${currentSeed} · ${stats.paths} pen lines`;
    return;
  }
  if (!fillOn) {
    status.textContent = `${activeFont} · outline only · seed ${currentSeed} · ${stats.paths} pen lines`;
    return;
  }
  // Name the angle the slider sets on EACH side, so its subtle pull on the
  // single-hatch reads as a value even when the woven side steals the eye.
  const crossAngle = hatchAngle + CROSS_TWIST;
  status.textContent = `${activeFont} · seed ${currentSeed} · weave ${hatchAngle}° / ${crossAngle}° · ${stats.paths} pen · ${stats.fillPaths} fill lines`;
}

function wireControls() {
  wireSlider("breathe-range", "breathe-value", (value) => { breatheAmount = value; });
  wireSlider("hatch-range", "hatch-value", (value) => { hatchSpacing = value; });
  wireSlider("angle-range", "angle-value", (value) => { hatchAngle = value; });

  const fillButton = document.getElementById("fill-button");
  fillButton.addEventListener("click", function() {
    fillOn = !fillOn;
    fillButton.textContent = fillOn ? "Fill: on" : "Fill: off";
    fillButton.setAttribute("aria-pressed", String(fillOn));
    buildPlot();
    redraw();
  });

  const fontButton = document.getElementById("font-button");
  fontButton.addEventListener("click", async function() {
    fontButton.disabled = true;
    await loadOutlineFont(activeFont === "Oswald" ? "Anton" : "Oswald");
    fontButton.textContent = `Font: ${activeFont}`;
    fontButton.disabled = false;
    buildPlot();
    redraw();
  });

  document.getElementById("reroll-button").addEventListener("click", function() {
    currentSeed++;          // a new variation that survives the next slider rebuild
    buildPlot();
    redraw();
  });
  document.getElementById("svg-button").addEventListener("click", function() {
    plot.downloadSVG("p5-gysin-font-outlines.svg", { width: width, height: height });
  });
  document.getElementById("hpgl-button").addEventListener("click", function() {
    plot.downloadHPGL("p5-gysin-font-outlines.hpgl");
  });
}

// One rebuild-and-redraw path shared by every slider.
function wireSlider(rangeId, valueId, apply) {
  const range = document.getElementById(rangeId);
  const value = document.getElementById(valueId);
  range.addEventListener("input", function() {
    apply(parseFloat(range.value));
    if (value) value.textContent = range.value;
    buildPlot();
    redraw();
  });
}

function drawPaper() {
  stroke("#dedede");
  strokeWeight(0.5);
  for (let y = 44; y < height; y += 32) {
    line(44, y, width - 44, y);
  }
}

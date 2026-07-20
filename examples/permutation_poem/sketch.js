// ═══════════════════════════════════════════════════════════════════
//  permutation_poem - one phrase, permuted and cut up into an A3 poster
// ═══════════════════════════════════════════════════════════════════
//  New to p5.gysin? The whole library is three lines:
//
//      const plot = new GysinPlot({ seed: 1960 });
//      plot.textCutup("I LOVE YOU", 64, 120);   // one line, sliced + reset
//      plot.draw();
//
//  textCutup() is this poster's core verb: it slices a line of type and
//  offsets the pieces (slices default to 7, so it disturbs on its own). Every
//  OTHER option below (letters, hatch fill, wobble, dropout, pressure…) is
//  optional and defaults to zero, so nothing else here is required to draw.
//  The one addon this example loads is the text module (p5.gysin.text.min.js);
//  its GysinText.permute() rearranges the phrase into orders before any of it
//  is drawn. The permutation poem was Gysin's own invention. This sketch builds
//  the poster one layer at a time; read the
//  numbered sections in buildPoster() from top to bottom. Each is a
//  compositional layer, drawn back to front, and can be deleted on its own
//  without breaking the rest.
// ═══════════════════════════════════════════════════════════════════

const POSTER_WIDTH = 840;
const POSTER_HEIGHT = 1188;
const FONT_URL = "../font_outlines/assets/Oswald-Regular.otf";
const PAPER = "#eee9dc";
const INK = "#17140f";

// Strategies the "New order" button cycles through, each with a one-line gloss
// so walk/rotate/lexical/random are readable on the poster and in the status.
const ORDERS = ["walk", "rotate", "lexical", "random"];
const ORDER_NOTES = {
  walk: "random swaps",
  rotate: "cyclic shifts",
  lexical: "alphabetical",
  random: "seeded shuffle"
};
// Base symbols for the code column; symbolMapFor() keeps every word unique.
const CODE_SET = ["|", "§§", "%", "=", "#", "//", "×", "¶"];
// Shared look for every rule line on the poster.
const RULE = {
  wobble: 0.14,
  dropout: 0.012,
  strokeWeight: 0.42,
  alpha: 0.34,
  layer: "rules"
};

// One source for the vertical rhythm; every layout anchor below derives from it.
const GROUPS = 6;                      // permutation orders stacked down the poster
const REPEATS = 6;                     // fading echo rows under each order
const COLS = 3;                        // columns in the bottom tonal grid
const ROWS = Math.ceil(GROUPS / COLS); // grid rows needed to hold every order

// Vertical anchors, derived from GROUPS so the band and grid follow the orders.
const GROUP_TOP = 124;                       // first order's top edge
const GROUP_H = 112;                         // vertical stride between orders
const BAND_Y = GROUP_TOP + GROUPS * GROUP_H; // letter band, under the last order
const GRID_Y = BAND_Y + 146;                 // tonal grid, under the band
const FOOTER_Y = 1147;                        // colophon baseline at the page foot
const GRID_FOOT_GAP = 44;                     // clearance kept between grid and colophon

// Horizontal anchors for the two columns, the group rules, and the band.
const TEXT_X = 64;     // left word column and its heading
const CODE_X = 602;    // symbolic code column and its heading/legend
const RULE_X0 = 56;    // group rules + band underline start
const RULE_X1 = 784;   // group rules + band underline end
const RULE_DY = 91;    // rule offset below each group top
const BAND_X = 58;     // letter band, its caption, and the footer colophon
const BAND_W = 726;    // letter band width

let outlineFont = null;
let glyphFont = {};
// Cut-up defaults + current font, merged once per rebuild (not per line).
let cutupBase = {};
let plot;
let phrase = "I LOVE YOU";
let posterSeed = 1960;
let orderIndex = 0;
let permutations = [];

async function setup() {
  const canvas = createCanvas(POSTER_WIDTH, POSTER_HEIGHT);
  canvas.parent("sketch");
  pixelDensity(1);
  noLoop();
  describe("A monochrome A3 permutation poem: six groups of repeated cut-up text, a symbolic code column, a dense decaying letter band, and a modular word grid.");

  try {
    outlineFont = await loadFont(FONT_URL);
    setStatus("Plotter-safe Oswald outlines: every permutation uses textCutup(), without retraced paths.");
  } catch (error) {
    setStatus("The outline font could not load; the poster is using p5.gysin's built-in vector alphabet.");
  }

  buildPoster();
  wireActions();
}

function draw() {
  background(PAPER);
  drawScreenTexture();
  plot.draw();
}

// One flat merge: shared cut-up base (with font) + this line's differences.
function cutupLine(text, x, y, overrides) {
  return plot.textCutup(text, x, y, { ...cutupBase, ...overrides });
}

// The plain-type counterpart of cutupLine: the shared font + this label's tweaks,
// so the outline font lives in one place instead of a merge per caption.
function typeStyle(overrides) {
  return { ...glyphFont, ...overrides };
}

// One decay curve, fully resolved: a higher index bites deeper, lightens the
// pen, and fades out. Callers hand it their layer/overrides and read back a
// single ready-to-draw set of disturbance params - no second merge downstream.
// `boost` lifts the whole weight/pressure ramp without flattening its slope, so
// the lead order can dominate while still decaying top-to-bottom.
function decay(i, seedTag, overrides, boost = 0) {
  return {
    slices: 4 + (i % 5),
    sliceOffset: 0.7 + i * 0.72,
    sliceDropout: 0.02 + i * 0.006,
    wobble: 0.08 + i * 0.03,
    dropout: 0.006 + i * 0.002,
    strokeWeight: Math.max(0.4, 1.3 + boost - i * 0.17),
    pressure: Math.min(0.8, boost + i * 0.14),
    alpha: Math.max(0.18, 1 - i * 0.16),
    seed: `${posterSeed}:${seedTag}`,
    ...overrides
  };
}

// Two-digit index shared by the text groups and the grid cells.
function label(i) {
  return String(i + 1).padStart(2, "0");
}

function buildPoster() {
  const order = ORDERS[orderIndex];
  // Take exactly GROUPS orders for the layout.
  permutations = GysinText.permute(phrase, {
    seed: posterSeed,
    limit: GROUPS,
    order
  }).slice(0, GROUPS);
  const symbols = symbolMapFor(phrase);
  const wordCount = phrase.trim().split(/\s+/).length;

  glyphFont = outlineFont ? { font: outlineFont } : {};
  // Only the truly shared basis: size, cut-up granularity, font. Every disturbance
  // param (wobble/dropout/slices…) comes from decay() or the caller, so a reader
  // never weighs two layers of defaults against each other.
  cutupBase = {
    size: 18.5,
    segmentLength: 3.6,
    ...glyphFont
  };

  plot = new GysinPlot({
    seed: posterSeed,
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    style: {
      stroke: INK,
      strokeWeight: 0.72,
      alpha: 0.88
    }
  });

  // ── 1 · the frame ───────────────────────────────────────────────
  // The registration frame and corner crosses, drawn first so every mark sits
  // inside it: the plotter-ready border of the sheet.
  drawFrame();

  // ── 2 · the heading ─────────────────────────────────────────────
  // The title line: what the poster is, in the heavier "type" pen.
  plot.text(`PERMUTATION POEM / ${phrase.toUpperCase()} / ${wordCount} WORDS`, TEXT_X, 69, typeStyle({
    size: 16,
    letterSpacing: 1.05,
    dropout: 0.012,
    strokeWeight: 0.82,
    layer: "type"
  }));

  // ── 3 · column headings + legend ────────────────────────────────
  // The two column headings and the decode legend, so the symbolic code column
  // to the right is genuinely readable against these signs.
  plot.text("TEXT", TEXT_X, 100, typeStyle({
    size: 11,
    strokeWeight: 0.55,
    alpha: 0.62,
    layer: "notes"
  }));
  plot.text("CODE / KEY", CODE_X, 100, typeStyle({
    size: 11,
    strokeWeight: 0.55,
    alpha: 0.62,
    layer: "notes"
  }));
  // Legend so the symbolic column is genuinely decodable: read the clean top row
  // of any code group against these signs. It rides the "code" layer, printing in
  // the same second pen as the column below.
  const legend = Object.entries(symbols).map(([word, sign]) => `${sign} = ${word}`).join("   ");
  plot.text(legend, CODE_X, 114, typeStyle({
    size: 9,
    strokeWeight: 0.44,
    alpha: 0.6,
    layer: "code"
  }));

  // ── 4 · the permutation groups ──────────────────────────────────
  // The body of the poster: one group per permutation order. Each group prints
  // the words (left) and their coded form (right) as repeated cut-up rows that
  // press hard at the top and fade downward, closed off by a rule line.
  permutations.forEach(function(regel, g) {
    const top = GROUP_TOP + g * GROUP_H;
    const strip = Array(4).fill(regel).join("  ");
    const code = encode(regel, symbols);
    // The first order is the source phrase; it leads the poster in a heavier pen
    // so the eye lands there, then reads the decay downward across the others.
    const boost = g === 0 ? 0.7 : 0;

    // Marginal index so each order maps onto its cell in the grid below.
    plot.text(label(g), 46, top + 6, {
      size: 9,
      strokeWeight: 0.5,
      alpha: 0.55,
      layer: "notes"
    });

    for (let r = 0; r < REPEATS; r++) {
      const y = top + r * 16;
      // Words fade down the column (the lead order fades from heavier). The code
      // column prints its top row clean as the legend key, then smears to texture.
      const key = r === 0;
      cutupLine(strip, TEXT_X, y, decay(r, `text:${g}:${r}`, { layer: "type" }, boost));
      cutupLine(code, CODE_X, y, decay(r, `code:${g}:${r}`, {
        // The lead order's key row prints a touch larger, sharpening the start of the read.
        size: key && g === 0 ? 20 : 18,
        layer: "code",
        strokeWeight: key ? 1.4 : 1.05,
        pressure: key ? 0 : 0.14,
        alpha: key ? 0.95 : 0.68,
        rubout: key ? 0 : 0.05 + r * 0.02
      }));
    }

    plot.line(RULE_X0, top + RULE_DY, RULE_X1, top + RULE_DY, RULE);
  });

  // ── 5 · the letter band ─────────────────────────────────────────
  // The phrase dissolving into a decaying letter field: letters() jitters each
  // glyph so meaning breaks down into pure letterform.
  drawLetterBand();

  // ── 6 · the tonal grid ──────────────────────────────────────────
  // The modular grid at the foot: one hatch-filled cell per order, tightening
  // from light to dark, with the order printed back inside each cell.
  drawPermutationGrid();
}

// The words dissolve into a decaying letter field; letters() jitters each glyph.
function drawLetterBand() {
  plot.line(RULE_X0, BAND_Y, RULE_X1, BAND_Y, {
    wobble: 0.2,
    strokeWeight: 0.7,
    alpha: 0.58,
    layer: "rules"
  });

  // Caption so the letter-soup below is self-describing, like the 01-06 indexes.
  plot.text(`${phrase.toUpperCase()} DISSOLVING INTO A LETTER FIELD`, BAND_X, BAND_Y - 6, typeStyle({
    size: 9,
    strokeWeight: 0.5,
    alpha: 0.55,
    layer: "notes"
  }));

  plot.letters(permutations.join(""), BAND_X, BAND_Y + 4, BAND_W, 120, typeStyle({
    size: 13.5,
    lineHeight: 1.05,
    wobble: 0.5,
    dropout: 0.04,
    glyphJitter: 0.8,
    strokeWeight: 0.82,
    alpha: 0.8,
    layer: "band",
    seed: `${posterSeed}:band`
  }));
}

function drawPermutationGrid() {
  const gridX = RULE_X0;
  const gridY = GRID_Y;
  const cellWidth = 242;
  // Fit every grid row in the space left above the colophon, so more orders never overrun the footer.
  const cellHeight = Math.floor((FOOTER_Y - GRID_Y - GRID_FOOT_GAP) / ROWS);

  for (let i = 0; i < permutations.length; i++) {
    const x = gridX + (i % COLS) * cellWidth;
    const y = gridY + Math.floor(i / COLS) * cellHeight;

    // Tonal engine: hatch tightens from 14 (faint) to 4 (dense) as a light-to-dark staircase.
    plot.rect(x, y, cellWidth, cellHeight, {
      fill: "hatch",
      hatchSpacing: 14 - i * 2,
      hatchAngle: -18,
      wobble: 0.5,
      dropout: 0.02,
      strokeWeight: 0.6,
      alpha: 0.6,
      layer: "grid"
    });

    // Index matches the margin above; the word scales down so long phrases stay inside the cell.
    plot.text(label(i), x + 13, y + 18, {
      size: 10,
      strokeWeight: 0.5,
      alpha: 0.7,
      layer: "grid-type"
    });
    cutupLine(permutations[i], x + 13, y + 47, {
      // Scale to fit the cell, but never below 9px so long phrases stay legible.
      size: Math.max(9, Math.min(24, 260 / permutations[i].length)),
      wobble: 0.16,
      dropout: 0.008,
      sliceDropout: 0.02,
      strokeWeight: 1.05,
      alpha: 0.95,
      seed: `${posterSeed}:grid:${i}`,
      layer: "grid-type"
    });
  }

  const order = ORDERS[orderIndex];
  plot.text(`ONE PHRASE / ORDER ${order.toUpperCase()} - ${ORDER_NOTES[order].toUpperCase()} / SEED ${posterSeed}`, BAND_X, FOOTER_Y, typeStyle({
    size: 12,
    letterSpacing: 1.08,
    dropout: 0.018,
    strokeWeight: 0.52,
    alpha: 0.62,
    layer: "notes"
  }));
}

function drawFrame() {
  plot.rect(42, 42, POSTER_WIDTH - 84, POSTER_HEIGHT - 84, {
    wobble: 0.45,
    dropout: 0.006,
    strokeWeight: 0.62,
    alpha: 0.64,
    layer: "frame"
  });

  const cross = {
    wobble: 0.18,
    strokeWeight: 0.52,
    alpha: 0.55,
    layer: "frame"
  };
  [[42, 42], [798, 42], [42, 1146], [798, 1146]].forEach(function(p) {
    plot.line(p[0] - 9, p[1], p[0] + 9, p[1], cross);
    plot.line(p[0], p[1] - 9, p[0], p[1] + 9, cross);
  });
}

// Each distinct word gets a unique symbol; a suffix keeps the legend 1-to-1 past CODE_SET.
function symbolMapFor(text) {
  const map = {};
  let i = 0;
  text.toUpperCase().split(/\s+/).forEach(function(word) {
    if (!word || word in map) return;
    const base = CODE_SET[i % CODE_SET.length];
    const cycle = Math.floor(i / CODE_SET.length);
    map[word] = cycle ? base + (cycle + 1) : base;
    i++;
  });
  return map;
}

function encode(regel, symbols) {
  return regel.toUpperCase().split(/\s+/).map(function(word) {
    return symbols[word] || "·";
  }).join("  ");
}

// Screen-only decoration (paper grain + centre fold), drawn with bare p5 so it
// stays out of the plotter export; the pen draws exactly plot.draw().
function drawScreenTexture() {
  randomSeed(44);
  stroke("#d4ccbe");
  strokeWeight(0.45);
  for (let i = 0; i < 1000; i++) point(random(width), random(height));
  stroke("#d9d1c3");
  line(width * 0.505, 42, width * 0.5, height - 42);
}

function wireActions() {
  const orderButton = document.getElementById("reroll-button");
  const seedButton = document.getElementById("seed-button");
  const phraseInput = document.getElementById("phrase-input");

  // Build first, then report. Order and seed are always shown, whatever changed,
  // so the status stays a consistent readout after a phrase edit too.
  function rebuild(lead) {
    buildPoster();
    updateLabels(orderButton, seedButton);
    const order = ORDERS[orderIndex];
    const state = `order ${order} (${ORDER_NOTES[order]}), seed ${posterSeed}`;
    // Past CODE_SET's supply of signs, symbolMapFor() recycles them with a suffix; say so
    // when the legend grows, so the extra rows read as a wider key, not noise.
    const uniqueWords = new Set(phrase.toUpperCase().split(/\s+/).filter(Boolean)).size;
    const recycle = uniqueWords > CODE_SET.length
      ? ` - ${uniqueWords} unique words, so code symbols recycle with a suffix`
      : "";
    setStatus(`${lead ? lead + " - " : ""}${state}: ${permutations.join(" / ")}${recycle}`);
    redraw();
  }

  updateLabels(orderButton, seedButton);
  if (phraseInput) phraseInput.value = phrase;

  // Order and seed are separate controls: hold one, vary the other.
  orderButton.addEventListener("click", function() {
    orderIndex = (orderIndex + 1) % ORDERS.length;
    rebuild();
  });

  seedButton.addEventListener("click", function() {
    posterSeed += 1;
    rebuild();
  });

  if (phraseInput) {
    phraseInput.addEventListener("change", function() {
      const next = phraseInput.value.trim();
      // The letter band needs at least one letter or digit; otherwise fall back,
      // and say so in the status so the fallback is not silent.
      const usable = /[a-z0-9]/i.test(next);
      phrase = usable ? next : "I LOVE YOU";
      phraseInput.value = phrase;
      rebuild(usable ? `Phrase "${phrase}" through permute()` : `Empty input, fell back to "${phrase}"`);
    });
  }

  document.getElementById("svg-button").addEventListener("click", function() {
    plot.downloadSVG("p5-gysin-permutation-poem-a3.svg", { page: a3Page() });
  });

  document.getElementById("hpgl-button").addEventListener("click", function() {
    // Two pens: the code column and the whole word grid plot in a second colour.
    plot.downloadHPGL("p5-gysin-permutation-poem-a3.hpgl", {
      page: a3Page(),
      penMap: {
        frame: 1,
        type: 1,
        notes: 1,
        rules: 1,
        band: 1,
        code: 2,
        grid: 2,
        "grid-type": 2
      },
      speed: 18
    });
  });
}

function updateLabels(orderButton, seedButton) {
  const order = ORDERS[orderIndex];
  if (orderButton) orderButton.textContent = `New order: ${order} (${ORDER_NOTES[order]})`;
  if (seedButton) seedButton.textContent = `New seed: ${posterSeed}`;
}

function a3Page() {
  return {
    width: 297,
    height: 420,
    units: "mm",
    margin: 10,
    scale: 277 / POSTER_WIDTH,
    clip: true
  };
}

function setStatus(message) {
  const status = document.getElementById("poster-status");
  if (status) status.textContent = message;
}

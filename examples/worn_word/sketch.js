// ═══════════════════════════════════════════════════════════════════
//  worn_word - one word worn away, in a single call
// ═══════════════════════════════════════════════════════════════════
//  New to p5.gysin? The whole library is three lines:
//
//      const plot = new GysinPlot({ seed: 1960 });
//      plot.rub("WORN", 46, 248);   // legible → cut up → asemic
//      plot.draw();
//
//  rub() is an intent verb: it composes text → textCutup → asemic into
//  one decaying gesture, with strong defaults. This whole sketch is that
//  one call - everything else here is just a canvas, a decay knob, and a
//  reseed button. Compare it with first_trace, which builds the same
//  gesture by hand: rub() is those ~40 lines collapsed into one.
// ═══════════════════════════════════════════════════════════════════

let plot;
let seedValue = 1960;
let decay = 1;      // one knob: scales the whole disturbance (0 = clean)
let font = null;    // outline font gives the legible head a real filled body

const FONT_URL = "../font_outlines/assets/Oswald-Regular.otf";

// Consecutive reseeds walk a short phrase, one word at a time.
const WORDS = ["WORN", "FADE", "LOST", "GONE"];

async function setup() {
  const canvas = createCanvas(520, 620);
  canvas.parent("sketch");
  describe(
    "One word drawn three times down the sheet, each copy more worn than the " +
    "last: a solid legible head, a cut-up middle, and an asemic scribble that " +
    "buries the final, ghostly copy."
  );
  pixelDensity(1);
  noLoop();
  wireActions();
  updateDecayReadout();
  try { font = await loadFont(FONT_URL); } catch (error) { font = null; }
  buildPlot();
}

function draw() {
  background("#f0efe9");
  plot.draw();
}

// The whole composition is one rub(). decay scales breathe/dropout/rubout/fray
// across all three copies at once; font (when it loads) fills the legible head.
function buildPlot() {
  const word = WORDS[seedValue % WORDS.length];

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

  plot.rub(word, 46, 248, {
    decay: decay,
    font: font
  });

  // A small caption, so an exported SVG records its own seed and knob setting.
  plot.text("seed " + seedValue + "  ·  decay " + decay.toFixed(1) + "x", 46, 600, {
    size: 13,
    glyphJitter: 0.1,
    breathe: 0.5,
    stroke: "#8a8a8a"
  });

  document.getElementById("seed-readout").textContent = seedValue + " · " + word;
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  rerollPlot();
}

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
  seedValue += 1;   // next word, fresh disturbance
  buildPlot();
  redraw();
}

function downloadSVG() {
  if (!plot) return;
  plot.downloadSVG("p5-gysin-worn-word.svg", { width: width, height: height });
}

function updateDecayReadout() {
  document.getElementById("decay-readout").textContent = decay.toFixed(1) + "×";
  document.getElementById("decay-down").disabled = decay <= 0;
  document.getElementById("decay-up").disabled = decay >= 2.5;
}

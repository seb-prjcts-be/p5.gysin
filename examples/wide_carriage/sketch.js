const W = 760;
const H = 560;
let plot;

function setup() {
  createCanvas(W, H).parent("sketch");
  pixelDensity(1);
  noLoop();
  describe("Three short lines typed with wide letter spacing and tall line height.");
  wireActions();
  makeHaiku();
}

function draw() {
  background("#f0efe9");
  plot.draw();
}

function makeHaiku() {
  const spacing = Number(document.getElementById("pitch-input").value);
  plot = GysinWorks.wideCarriage.build({ width: W, height: H, spacing }).plot;
  document.getElementById("pitch-input-value").textContent = spacing.toFixed(1);
  document.getElementById("carriage-status").textContent =
    `pitch ${spacing.toFixed(1)} × size · ${plot.stats().paths} traces`;
  redraw();
}

function wireActions() {
  document.getElementById("pitch-input").oninput = makeHaiku;
  document.getElementById("svg-button").onclick =
    () => plot.downloadSVG("p5-gysin-wide-carriage.svg");
}

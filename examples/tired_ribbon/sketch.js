const W = 760;
const H = 560;
let plot;
let strikeSeed = 1912;

function setup() {
  createCanvas(W, H).parent("sketch");
  pixelDensity(1);
  noLoop();
  describe("A short note typed with a worn ribbon: the letters wander and some are struck twice.");
  wireActions();
  makeNote();
}

function draw() {
  background("#f0efe9");
  plot.draw();
}

function makeNote() {
  const wear = Number(document.getElementById("wear-input").value);
  plot = GysinWorks.tiredRibbon.build({ width: W, height: H, seed: strikeSeed, wear }).plot;
  document.getElementById("wear-input-value").textContent = wear.toFixed(1);
  document.getElementById("ribbon-status").textContent =
    `wear ${wear.toFixed(1)} · seed ${strikeSeed} · ${plot.stats().paths} traces`;
  redraw();
}

function wireActions() {
  document.getElementById("wear-input").oninput = makeNote;
  document.getElementById("strike-button").onclick = () => { strikeSeed += 1; makeNote(); };
  document.getElementById("svg-button").onclick =
    () => plot.downloadSVG("p5-gysin-tired-ribbon.svg");
}

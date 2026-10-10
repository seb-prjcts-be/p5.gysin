const W = 760;
const H = 560;
let plot;
let ids = [];
let weaveSeed = 1960;

function setup() {
  createCanvas(W, H).parent("sketch");
  pixelDensity(1);
  noLoop();
  wireActions();
  makeChorus();
}

function draw() {
  background("#f0efe9");
  plot.draw();
}

function makeChorus() {
  const work = GysinWorks.chorus.build({ width: W, height: H, seed: weaveSeed });
  plot = work.plot;
  ids = work.ids;
  document.getElementById("chorus-status").textContent =
    `${ids.length} woven lines · seed ${weaveSeed} · three clauses per line`;
  redraw();
}

function wireActions() {
  document.getElementById("weave-button").onclick = () => { weaveSeed += 1; makeChorus(); };
  document.getElementById("json-button").onclick =
    () => plot.downloadJSON("p5-gysin-chorus.json");
  document.getElementById("svg-button").onclick =
    () => plot.downloadSVG("p5-gysin-chorus.svg");
}

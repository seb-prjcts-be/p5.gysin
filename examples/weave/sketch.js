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
  makeWeave();
}

function draw() {
  background("#f0efe9");
  plot.draw();
}

function sources() {
  return [
    { id: "window", text: document.getElementById("source-a").value },
    { id: "letter", text: document.getElementById("source-b").value }
  ];
}

function makeWeave() {
  try {
    const work = GysinWorks.weave.build({
      width: W,
      height: H,
      seed: weaveSeed,
      sources: sources()
    });
    plot = work.plot;
    ids = work.ids;
    document.getElementById("weave-status").textContent =
      `${ids.length} woven lines · seed ${weaveSeed} · two clauses per line`;
    redraw();
  } catch (error) {
    document.getElementById("weave-status").textContent = error.message;
  }
}

function wireActions() {
  document.getElementById("weave-button").onclick = () => { weaveSeed += 1; makeWeave(); };
  document.getElementById("json-button").onclick =
    () => plot.downloadJSON("p5-gysin-weave.json");
  document.getElementById("svg-button").onclick =
    () => plot.downloadSVG("p5-gysin-weave.svg");
}

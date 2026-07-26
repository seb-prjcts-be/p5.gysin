const W = 760;
const H = 560;
let plot;
let ids = [];
let cutSeed = 1960;

function setup() {
  createCanvas(W, H).parent("sketch");
  pixelDensity(1);
  noLoop();
  wireActions();
  makeCut();
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

function makeCut() {
  try {
    const work = GysinWorks.weave.build({
      width: W,
      height: H,
      seed: cutSeed,
      sources: sources()
    });
    plot = work.plot;
    ids = work.ids;
    document.getElementById("weave-status").textContent =
      `${ids.length} lines · seed ${cutSeed} · phrase fragments`;
    redraw();
  } catch (error) {
    document.getElementById("weave-status").textContent = error.message;
  }
}

function wireActions() {
  document.getElementById("cut-button").onclick = () => { cutSeed += 1; makeCut(); };
  document.getElementById("ink-button").onclick = () => { plot.reroll(); redraw(); };
  document.getElementById("json-button").onclick =
    () => plot.downloadJSON("p5-gysin-weave.json");
  document.getElementById("svg-button").onclick =
    () => plot.downloadSVG("p5-gysin-weave.svg");
}

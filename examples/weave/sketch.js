const W = 760, H = 560;
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
  background("#eee9dc");
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
    const next = new GysinPlot({ seed: cutSeed, width: W, height: H });
    ids = next.weave(sources(), 42, 82, { seed: cutSeed, lines: 5, size: 12.5, leading: 94, breathe: 0.4 });
    plot = next;
    document.getElementById("weave-status").textContent = `${ids.length} lines · seed ${cutSeed} · phrase fragments`;
    redraw();
  } catch (error) {
    document.getElementById("weave-status").textContent = error.message;
  }
}
function wireActions() {
  document.getElementById("cut-button").onclick = () => { cutSeed += 1; makeCut(); };
  document.getElementById("ink-button").onclick = () => { plot.reroll(); redraw(); };
  document.getElementById("json-button").onclick = () => plot.downloadJSON("p5-gysin-weave.json");
  document.getElementById("svg-button").onclick = () => plot.downloadSVG("p5-gysin-weave.svg");
}

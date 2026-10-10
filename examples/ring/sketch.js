const W = 760;
const H = 560;
let plot;

function setup() {
  createCanvas(W, H).parent("sketch");
  pixelDensity(1);
  noLoop();
  describe("CUT ARRANGE GLUE written three times, each line starting one word later.");

  const work = GysinWorks.ring.build({ width: W, height: H });
  plot = work.plot;
  document.getElementById("ring-status").textContent = `${work.ids.length} turns of the phrase`;
  wireActions();
}

function draw() {
  background("#f0efe9");
  plot.draw();
}

function wireActions() {
  document.getElementById("json-button").onclick =
    () => plot.downloadJSON("p5-gysin-ring.json");
  document.getElementById("svg-button").onclick =
    () => plot.downloadSVG("p5-gysin-ring.svg");
}

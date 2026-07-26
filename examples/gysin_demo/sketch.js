let plot;
let seedValue = 19600319;
let outlineFont = null;

async function setup() {
  const canvas = createCanvas(900, 620);
  canvas.parent("sketch");
  describe("The word SURFACE drawn once, with five horizontal contour bands shifted slightly out of register.");
  pixelDensity(1);
  noLoop();
  try {
    outlineFont = await loadFont("../font_outlines/assets/Oswald-Regular.otf");
  } catch (error) {
    outlineFont = null;
  }
  buildPlot();
  wireActions();
}

function buildPlot() {
  const work = GysinWorks.slicedText.build({
    seed: seedValue,
    width,
    height,
    font: outlineFont
  });
  plot = work.plot;
  updateStats();
}

function draw() {
  background("#f0efe9");
  plot.draw();
}

function rerollPlot() {
  seedValue += 1;
  buildPlot();
  redraw();
}

function wireActions() {
  document.getElementById("reroll-button").addEventListener("click", rerollPlot);
  document.getElementById("svg-button").addEventListener("click", () =>
    plot.downloadSVG("p5-gysin-sliced-text.svg", { width, height })
  );
  document.getElementById("json-button").addEventListener("click", () =>
    plot.downloadJSON("p5-gysin-sliced-text.json", { includeGenerated: true })
  );
  document.getElementById("hpgl-button").addEventListener("click", () =>
    plot.downloadHPGL("p5-gysin-sliced-text.hpgl")
  );
}

function keyPressed() {
  if (key === "r" || key === "R") rerollPlot();
  if (key === "s" || key === "S") plot.downloadSVG("p5-gysin-sliced-text.svg", { width, height });
  if (key === "j" || key === "J") plot.downloadJSON("p5-gysin-sliced-text.json", { includeGenerated: true });
  if (key === "h" || key === "H") plot.downloadHPGL("p5-gysin-sliced-text.hpgl");
}

function updateStats() {
  const stats = plot.stats();
  document.getElementById("plot-stats").textContent =
    `${stats.paths} paths · ${Math.round(stats.drawnLength)} plot units`;
}

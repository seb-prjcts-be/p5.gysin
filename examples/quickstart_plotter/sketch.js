// quickstart-plotter - a small sheet, and the same traces saved for the pen.
let plot;

function setup() {
  const canvas = createCanvas(560, 790);
  canvas.parent("sketch");
  pixelDensity(1);
  noLoop();

  plot = new GysinPlot({ seed: 1960 });
  plot.rect(40, 40, 480, 710, { breathe: 0.6, layer: "frame" });
  plot.text("TO PAPER", 70, 170, { size: 58, breathe: 1.2, layer: "type" });
  plot.line(70, 220, 490, 224, { breathe: 0.8, overshoot: 6, layer: "type" });
  plot.draw();
}

// The same traces, mapped to a physical A4 with margins and clipping.
function downloadSVG() {
  const page = { width: 210, height: 297, units: "mm", margin: 12, clip: true };
  plot.downloadSVG("p5-gysin-quickstart.svg", { page, optimize: true });
}

function keyPressed() {
  if (key === "s" || key === "S") downloadSVG();
}

document.getElementById("svg-button").addEventListener("click", downloadSVG);

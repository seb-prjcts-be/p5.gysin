// quickstart-rub - the whole library in one worn word.
function setup() {
  const canvas = createCanvas(560, 440);
  canvas.parent("sketch");
  pixelDensity(1);
  noLoop();

  const plot = new GysinPlot({ seed: 1960 });
  plot.rub("BEGIN", 50, 100);
  plot.draw();
}

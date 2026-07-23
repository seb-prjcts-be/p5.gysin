// quickstart-chant - one phrase set free to say its orders.
function setup() {
  const canvas = createCanvas(560, 560);
  canvas.parent("sketch");
  pixelDensity(1);
  noLoop();

  const plot = new GysinPlot({ seed: 1960 });
  plot.chant("SAY IT AGAIN", 60, 110, { size: 34 });
  plot.draw();
}

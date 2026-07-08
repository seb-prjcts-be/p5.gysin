let plot;
let seedValue = 1960;

function setup() {
  const canvas = createCanvas(520, 520);
  canvas.parent("sketch");
  pixelDensity(1);
  noLoop();
  buildPlot();
}

function draw() {
  background(245);
  drawSheet();
  plot.draw();
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  seedValue = floor(random(100000));
  buildPlot();
  redraw();
}

function keyPressed() {
  if (key === "s" || key === "S") {
    plot.downloadSVG("p5-gysin-first-trace.svg", {
      width: width,
      height: height
    });
  }
}

function buildPlot() {
  plot = new GysinPlot({
    seed: seedValue,
    width: width,
    height: height,
    style: {
      stroke: "#151515",
      strokeWeight: 1.1,
      alpha: 0.88
    }
  });

  plot.line(70, 160, 450, 178, {
    wobble: 1.2,
    dropout: 0.04,
    overshoot: 8,
    segmentLength: 9
  });

  plot.text("FIRST TRACE", 68, 255, {
    size: 54,
    wobble: 1.4,
    dropout: 0.08,
    repeat: 2,
    drift: 1.4,
    rubout: 0.05,
    segmentLength: 7
  });

  plot.circle(360, 340, 125, {
    density: 1.3,
    wobble: 1.6,
    dropout: 0.08,
    repeat: 2,
    drift: 2,
    rubout: 0.08,
    pressure: 0.25
  });
}

function drawSheet() {
  randomSeed(42);
  stroke("#dedede");
  strokeWeight(0.5);
  for (let y = 52; y < height; y += 34) {
    line(44, y + random(-0.8, 0.8), width - 44, y + random(-0.8, 0.8));
  }

  stroke("#d3d3d3");
  for (let i = 0; i < 120; i++) {
    point(random(width), random(height));
  }
}

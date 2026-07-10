let plot;
let seedValue = 19600319;

function setup() {
  const canvas = createCanvas(720, 720);
  const holder = document.getElementById("sketch");
  if (holder) canvas.parent(holder);
  pixelDensity(1);
  noLoop();
  buildPlot();
}

function draw() {
  background(245);
  drawPaper();
  plot.draw();
}

function keyPressed() {
  if (key === "r" || key === "R") {
    seedValue = floor(random(1000000));
    buildPlot();
    redraw();
  }

  if (key === "s" || key === "S") {
    plot.downloadSVG("p5-gysin-editor-starter.svg", {
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
      strokeWeight: 1,
      alpha: 0.88
    }
  });

  plot.text("CUT UP", 82, 145, {
    size: 92,
    wobble: 1.8,
    dropout: 0.08,
    repeat: 2,
    drift: 2,
    rubout: 0.06,
    pressure: 0.25,
    segmentLength: 7
  });

  plot.textCutup("THE MACHINE REMEMBERS", 82, 265, {
    size: 48,
    slices: 8,
    sliceOffset: 18,
    sliceDropout: 0.16,
    wobble: 1.3,
    dropout: 0.09,
    repeat: 2,
    drift: 1.7,
    rubout: 0.14,
    pressure: 0.2,
    segmentLength: 7
  });

  for (let i = 0; i < 13; i++) {
    const y = 360 + i * 18;
    plot.line(92, y, 628, y + sin(i * 0.65) * 10, {
      wobble: 0.9,
      dropout: 0.045,
      overshoot: 9,
      repeat: i % 4 === 0 ? 2 : 1,
      drift: 1.1,
      pressure: 0.18,
      segmentLength: 10,
      alpha: 0.7
    });
  }

  plot.circle(540, 168, 92, {
    density: 1.35,
    wobble: 1.7,
    dropout: 0.1,
    repeat: 3,
    drift: 2.4,
    rubout: 0.1,
    pressure: 0.25,
    alpha: 0.68
  });

  plot.rect(88, 565, 544, 72, {
    wobble: 1,
    dropout: 0.06,
    repeat: 2,
    drift: 1.5,
    rubout: 0.1,
    fray: 0.35,
    pressure: 0.2,
    segmentLength: 9,
    alpha: 0.72
  });
}

function drawPaper() {
  randomSeed(99);
  stroke("#dddddd");
  strokeWeight(0.5);

  for (let y = 52; y < height; y += 34) {
    line(54, y + random(-0.7, 0.7), width - 54, y + random(-0.7, 0.7));
  }

  stroke("#d0d0d0");
  for (let i = 0; i < 160; i++) {
    point(random(width), random(height));
  }
}

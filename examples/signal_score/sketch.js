let plot;

function setup() {
  const canvas = createCanvas(720, 620);
  canvas.parent("sketch");
  pixelDensity(1);
  noLoop();
  buildPlot();
  wireActions();
}

function draw() {
  background(245);
  drawPaper();
  plot.draw();
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    plot.reroll();
    redraw();
  }
}

function keyPressed() {
  if (key === "r" || key === "R") {
    plot.reroll();
    redraw();
  }
  if (key === "s" || key === "S") {
    plot.downloadSVG("p5-gysin-signal-score.svg", { width: width, height: height });
  }
}

function buildPlot() {
  plot = new GysinPlot({
    seed: 40017,
    width: width,
    height: height,
    style: {
      stroke: "#171717",
      strokeWeight: 1,
      alpha: 0.82
    }
  });

  const rows = [120, 205, 290, 375, 460];
  for (let row = 0; row < rows.length; row++) {
    const points = [];
    const yBase = rows[row];
    for (let x = 52; x <= width - 52; x += 8) {
      const y = yBase + sin(x * 0.035 + row * 0.9) * (16 + row * 3) + sin(x * 0.11 + row) * 7;
      points.push([x, y]);
    }
    plot.path(points, {
      wobble: 1 + row * 0.12,
      dropout: 0.045 + row * 0.008,
      repeat: row % 2 === 0 ? 2 : 1,
      drift: 1.2,
      rubout: 0.05 + row * 0.025,
      overshoot: 8,
      segmentLength: 8,
      stroke: row === 2 ? "#b5362b" : "#171717",
      layer: "signal"
    });
  }

  for (let index = 0; index < 7; index++) {
    const x = 92 + index * 86;
    const y = 80 + (index % 2) * 412;
    plot.polygon([
      [x, y - 13],
      [x + 15, y],
      [x, y + 13],
      [x - 15, y]
    ], {
      wobble: 0.65,
      repeat: 2,
      drift: 0.8,
      rubout: 0.04,
      stroke: "#244f73",
      alpha: 0.76,
      layer: "markers"
    });
  }

  plot.rect(52, 64, width - 104, height - 128, {
    wobble: 0.4,
    dropout: 0.015,
    repeat: 2,
    drift: 0.5,
    stroke: "#171717",
    alpha: 0.65,
    layer: "frame"
  });
}

function wireActions() {
  document.getElementById("reroll-button").addEventListener("click", function() {
    plot.reroll();
    redraw();
  });
  document.getElementById("svg-button").addEventListener("click", function() {
    plot.downloadSVG("p5-gysin-signal-score.svg", { width: width, height: height });
  });
}

function drawPaper() {
  stroke("#e0e0e0");
  strokeWeight(0.5);
  for (let y = 38; y < height; y += 28) {
    line(30, y, width - 30, y);
  }
}

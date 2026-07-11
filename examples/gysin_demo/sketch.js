let plot;
let titleId;

function setup() {
  const canvas = createCanvas(900, 900);
  canvas.parent("sketch");
  describe("A cut-up typographic poster with rubbed-out words, repeated contours, and uncertain lines.");
  pixelDensity(1);
  noLoop();

  plot = new GysinPlot({
    seed: 19600319,
    width: 900,
    height: 900,
    style: {
      stroke: "#161616",
      strokeWeight: 1.15,
      alpha: 0.9
    }
  });

  randomSeed(19600319);

  titleId = plot.text("RUB OUT", 75, 145, {
    size: 96,
    density: 1.15,
    wobble: 1.8,
    dropout: 0.08,
    repeat: 2,
    drift: 2,
    rubout: 0.08,
    pressure: 0.35,
    segmentLength: 7
  });

  plot.text("THE WORD", 76, 235, {
    size: 96,
    density: 1.15,
    wobble: 2.2,
    dropout: 0.14,
    repeat: 3,
    drift: 3,
    rubout: 0.22,
    pressure: 0.4,
    segmentLength: 7
  });

  plot.textCutup("I THINK THEREFORE I AM", 76, 370, {
    size: 55,
    slices: 9,
    sliceOffset: 24,
    sliceDropout: 0.18,
    density: 1,
    wobble: 1.4,
    dropout: 0.09,
    repeat: 2,
    drift: 2,
    rubout: 0.12,
    pressure: 0.25,
    segmentLength: 6
  });

  for (let i = 0; i < 18; i++) {
    const y = 445 + i * 18;
    plot.line(80, y, 820, y + random(-8, 8), {
      wobble: 0.9,
      dropout: 0.04 + i * 0.002,
      overshoot: 9,
      repeat: i % 5 === 0 ? 2 : 1,
      drift: 1.4,
      pressure: 0.2,
      segmentLength: 10,
      strokeWeight: 0.85,
      alpha: 0.72
    });
  }

  plot.rect(90, 585, 720, 170, {
    density: 1,
    wobble: 1.3,
    dropout: 0.08,
    repeat: 3,
    drift: 2.5,
    rubout: 0.16,
    fray: 0.55,
    pressure: 0.25,
    segmentLength: 9,
    strokeWeight: 0.9,
    alpha: 0.65
  });

  plot.circle(705, 690, 160, {
    density: 1.4,
    wobble: 2.5,
    dropout: 0.13,
    repeat: 3,
    drift: 4,
    rubout: 0.2,
    fray: 0.25,
    pressure: 0.35,
    segmentLength: 8,
    alpha: 0.7
  });

  plot.polygon([
    [132, 715],
    [244, 612],
    [365, 744],
    [230, 802]
  ], {
    density: 1,
    wobble: 1.8,
    dropout: 0.1,
    repeat: 2,
    drift: 3,
    rubout: 0.1,
    segmentLength: 8,
    alpha: 0.68
  });

  plot.freeze(titleId);
  wireActions();
}

function draw() {
  background(245);
  drawPaper();
  plot.draw();
}

function keyPressed() {
  if (key === "s" || key === "S") {
    downloadSVG();
  }

  if (key === "j" || key === "J") {
    downloadJSON();
  }

  if (key === "r" || key === "R") {
    rerollPlot();
  }
}

function wireActions() {
  const svgButton = document.getElementById("svg-button");
  const jsonButton = document.getElementById("json-button");
  const rerollButton = document.getElementById("reroll-button");

  if (svgButton) svgButton.addEventListener("click", downloadSVG);
  if (jsonButton) jsonButton.addEventListener("click", downloadJSON);
  if (rerollButton) rerollButton.addEventListener("click", rerollPlot);
}

function downloadSVG() {
  plot.downloadSVG("p5-gysin-demo.svg", {
    width: 900,
    height: 900
  });
}

function downloadJSON() {
  plot.downloadJSON("p5-gysin-demo.json");
}

function rerollPlot() {
  plot.reroll();
  redraw();
}

function drawPaper() {
  randomSeed(88);
  noFill();
  stroke("#dddddd");
  strokeWeight(0.45);

  for (let i = 0; i < 220; i++) {
    const x = random(width);
    const y = random(height);
    point(x, y);
  }

  stroke("#e6e6e6");
  for (let y = 56; y < height; y += 34) {
    line(48, y + random(-1, 1), width - 48, y + random(-1, 1));
  }
}

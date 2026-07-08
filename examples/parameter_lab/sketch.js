let plot;
let seedValue = 8319;

function setup() {
  const canvas = createCanvas(560, 560);
  canvas.parent("sketch");
  pixelDensity(1);
  noLoop();
  wireControls();
  buildPlot();
}

function draw() {
  background(245);
  drawRegistrationMarks();
  plot.draw();
}

function keyPressed() {
  if (key === "r" || key === "R") {
    seedValue = floor(random(100000));
    buildPlot();
    redraw();
  }

  if (key === "s" || key === "S") {
    plot.downloadSVG("p5-gysin-parameter-lab.svg", {
      width: width,
      height: height
    });
  }
}

function wireControls() {
  const ids = ["wobble", "dropout", "repeat", "rubout"];
  for (let i = 0; i < ids.length; i++) {
    const input = document.getElementById(ids[i]);
    input.addEventListener("input", function() {
      updateControlLabels();
      buildPlot();
      redraw();
    });
  }
  updateControlLabels();
}

function updateControlLabels() {
  const ids = ["wobble", "dropout", "repeat", "rubout"];
  for (let i = 0; i < ids.length; i++) {
    const input = document.getElementById(ids[i]);
    const output = document.getElementById(ids[i] + "-value");
    output.textContent = input.value;
  }
}

function readSettings() {
  return {
    wobbleValue: Number(document.getElementById("wobble").value),
    dropoutValue: Number(document.getElementById("dropout").value),
    repeatValue: Number(document.getElementById("repeat").value),
    ruboutValue: Number(document.getElementById("rubout").value)
  };
}

function buildPlot() {
  const settings = readSettings();
  plot = new GysinPlot({
    seed: seedValue,
    width: width,
    height: height,
    style: {
      stroke: "#151515",
      strokeWeight: 1,
      alpha: 0.9
    }
  });

  plot.textCutup("RUB OUT", 58, 170, {
    size: 72,
    slices: 7,
    sliceOffset: 18,
    sliceDropout: 0.14,
    wobble: settings.wobbleValue,
    dropout: settings.dropoutValue,
    repeat: settings.repeatValue,
    drift: settings.wobbleValue * 1.4,
    rubout: settings.ruboutValue,
    pressure: 0.25,
    segmentLength: 7
  });

  for (let i = 0; i < 12; i++) {
    plot.line(70, 255 + i * 18, 490, 255 + i * 18 + sin(i) * 8, {
      wobble: settings.wobbleValue * 0.65,
      dropout: settings.dropoutValue * 0.8,
      repeat: max(1, settings.repeatValue - 1),
      drift: settings.wobbleValue,
      rubout: settings.ruboutValue * 0.4,
      overshoot: 8,
      pressure: 0.15,
      segmentLength: 10,
      alpha: 0.65
    });
  }

  plot.rect(82, 432, 396, 58, {
    wobble: settings.wobbleValue,
    dropout: settings.dropoutValue,
    repeat: settings.repeatValue,
    drift: settings.wobbleValue * 1.2,
    rubout: settings.ruboutValue,
    fray: 0.35,
    pressure: 0.25,
    segmentLength: 8,
    alpha: 0.72
  });
}

function drawRegistrationMarks() {
  stroke("#d9d9d9");
  strokeWeight(0.8);
  line(44, 44, 96, 44);
  line(44, 44, 44, 96);
  line(width - 96, height - 44, width - 44, height - 44);
  line(width - 44, height - 96, width - 44, height - 44);
}

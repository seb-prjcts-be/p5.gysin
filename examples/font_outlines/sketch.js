const FONT_URL = "assets/Oswald-Regular.otf";

let outlineFont;
let plot;

async function setup() {
  const canvas = createCanvas(760, 560);
  canvas.parent("sketch");
  pixelDensity(1);
  noLoop();

  try {
    outlineFont = await loadFont(FONT_URL);
    document.getElementById("font-status").textContent = "Oswald outlines loaded. O, 8, B, and R keep their counters.";
  } catch (error) {
    document.getElementById("font-status").textContent = "The remote font could not load, so this preview uses the built-in vector alphabet.";
  }

  buildPlot();
  wireActions();
}

function draw() {
  background(245);
  drawPaper();
  plot.draw();
}

function buildPlot() {
  plot = new GysinPlot({
    seed: 8088,
    width: width,
    height: height,
    style: {
      stroke: "#171717",
      strokeWeight: 1,
      alpha: 0.9
    }
  });

  const fontOptions = outlineFont ? { font: outlineFont } : {};

  plot.text("O8BR", 70, 190, Object.assign({}, fontOptions, {
    size: 150,
    wobble: 0.9,
    dropout: 0.025,
    repeat: 2,
    drift: 1.1,
    rubout: 0.08,
    pressure: 0.2,
    segmentLength: 6,
    layer: "contours"
  }));

  plot.textCutup("COUNTER MEMORY", 72, 360, Object.assign({}, fontOptions, {
    size: 48,
    slices: 8,
    sliceOffset: 15,
    sliceDropout: 0.11,
    wobble: 1,
    dropout: 0.06,
    repeat: 2,
    drift: 1.2,
    rubout: 0.1,
    segmentLength: 6,
    stroke: "#b5362b",
    layer: "cutup"
  }));

  for (let index = 0; index < 8; index++) {
    const y = 438 + index * 12;
    plot.line(78, y, 682, y + sin(index * 0.8) * 6, {
      wobble: 0.65,
      dropout: 0.035,
      overshoot: 6,
      stroke: "#244f73",
      alpha: 0.62,
      layer: "baseline"
    });
  }
}

function wireActions() {
  document.getElementById("reroll-button").addEventListener("click", function() {
    plot.reroll();
    redraw();
  });
  document.getElementById("svg-button").addEventListener("click", function() {
    plot.downloadSVG("p5-gysin-font-outlines.svg", { width: width, height: height });
  });
}

function drawPaper() {
  stroke("#dedede");
  strokeWeight(0.5);
  for (let y = 44; y < height; y += 32) {
    line(44, y, width - 44, y);
  }
}

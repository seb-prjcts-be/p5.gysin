let plot;
const EXPORT_PAGE = {
  width: 210,
  height: 210,
  units: "mm",
  margin: 5,
  scale: 0.375,
  clip: true
};

function setup() {
  const canvas = createCanvas(560, 560);
  canvas.parent("sketch");
  describe("A layered plotter composition prepared for SVG, JSON, and HPGL export.");
  pixelDensity(1);
  noLoop();
  buildPlot();
  wireExportButtons();
}

function draw() {
  background(245);
  drawPageFrame();
  plot.draw();
}

function keyPressed() {
  if (key === "r" || key === "R") {
    plot.reroll();
    redraw();
    setStatus("Created a new seeded variation.");
  }
}

function buildPlot() {
  plot = new GysinPlot({
    seed: 7475,
    width: width,
    height: height,
    page: EXPORT_PAGE,
    style: {
      stroke: "#151515",
      strokeWeight: 0.9,
      alpha: 0.86
    }
  });

  plot.rect(78, 78, 404, 404, {
    wobble: 0.45,
    dropout: 0.015,
    repeat: 2,
    drift: 0.8,
    layer: "frame",
    stroke: "#151515",
    segmentLength: 12
  });

  plot.text("PLOT", 112, 190, {
    size: 92,
    wobble: 1.5,
    dropout: 0.07,
    repeat: 2,
    drift: 2,
    rubout: 0.1,
    pressure: 0.25,
    layer: "type",
    stroke: "#b5362b",
    segmentLength: 8
  });

  plot.textCutup("EXPORT / TRACE / RETURN", 112, 272, {
    size: 36,
    slices: 6,
    sliceOffset: 13,
    sliceDropout: 0.14,
    wobble: 1.2,
    dropout: 0.08,
    repeat: 2,
    drift: 1.6,
    rubout: 0.12,
    layer: "type",
    stroke: "#151515",
    segmentLength: 7
  });

  for (let i = 0; i < 9; i++) {
    const y = 340 + i * 13;
    plot.line(118, y, 442, y + sin(i * 0.8) * 8, {
      wobble: 0.7,
      dropout: 0.04,
      repeat: i % 3 === 0 ? 2 : 1,
      drift: 1.2,
      overshoot: 8,
      layer: "hatch",
      stroke: "#244f73",
      alpha: 0.68,
      segmentLength: 10
    });
  }

  plot.circle(404, 152, 78, {
    density: 1.3,
    wobble: 1.3,
    dropout: 0.08,
    repeat: 3,
    drift: 1.8,
    rubout: 0.08,
    layer: "registration",
    stroke: "#151515",
    alpha: 0.7
  });
}

function wireExportButtons() {
  document.getElementById("svg-button").addEventListener("click", function() {
    plot.downloadSVG("p5-gysin-plotter-export.svg", {
      page: EXPORT_PAGE,
      optimize: true
    });
    setStatus("SVG exported.");
  });

  document.getElementById("json-button").addEventListener("click", function() {
    plot.downloadJSON("p5-gysin-plotter-export.json", {
      includeGenerated: true
    });
    setStatus("JSON exported.");
  });

  document.getElementById("hpgl-button").addEventListener("click", function() {
    plot.downloadHPGL("p5-gysin-plotter-export.hpgl", {
      page: EXPORT_PAGE,
      penMap: { frame: 1, type: 2, hatch: 3, registration: 1 },
      speed: 20,
      optimize: true
    });
    const stats = plot.stats({
      page: EXPORT_PAGE,
      optimize: true,
      drawSpeed: 20,
      travelSpeed: 60
    });
    setStatus(`HPGL exported · ${stats.paths} paths · ${stats.drawnLength.toFixed(1)} mm drawn.`);
  });
}

function setStatus(message) {
  document.getElementById("export-status").textContent = message;
}

function drawPageFrame() {
  noFill();
  stroke("#d8d8d8");
  strokeWeight(0.8);
  rect(36, 36, width - 72, height - 72);
  line(36, 52, 76, 52);
  line(52, 36, 52, 76);
  line(width - 76, height - 52, width - 36, height - 52);
  line(width - 52, height - 76, width - 52, height - 36);
}

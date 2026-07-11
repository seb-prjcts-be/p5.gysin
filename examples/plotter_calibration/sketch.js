const MM = 3;
const PAGE = {
  width: 210,
  height: 297,
  units: "mm",
  margin: 10,
  scale: 1 / MM,
  clip: true
};

let plot;

function setup() {
  const canvas = createCanvas(190 * MM, 277 * MM);
  canvas.parent("sketch");
  describe("An A4 pen-plotter calibration sheet with margins, measurement marks, and three pen layers.");
  pixelDensity(1);
  noLoop();
  buildPlot();
  wireActions();
}

function draw() {
  background(245);
  plot.draw();
}

function keyPressed() {
  if (key === "r" || key === "R") {
    plot.reroll();
    redraw();
  }
  if (key === "s" || key === "S") downloadSVG();
  if (key === "h" || key === "H") downloadHPGL();
}

function buildPlot() {
  plot = new GysinPlot({
    seed: 210297,
    width: width,
    height: height,
    page: PAGE,
    style: {
      stroke: "#171717",
      strokeWeight: 0.75,
      alpha: 0.86
    }
  });

  plot.rect(0, 0, width, height, {
    wobble: 0.2,
    repeat: 2,
    drift: 0.35,
    layer: "frame"
  });

  const corners = [[18, 18], [width - 18, 18], [18, height - 18], [width - 18, height - 18]];
  for (let index = 0; index < corners.length; index++) {
    plot.rect(corners[index][0] - 10, corners[index][1] - 10, 20, 20, {
      wobble: 0.35,
      repeat: 2,
      drift: 0.4,
      layer: "frame"
    });
  }

  const diameters = [36, 72, 144, 216];
  for (let index = 0; index < diameters.length; index++) {
    plot.circle(width * 0.5, 178, diameters[index], {
      density: 1.25,
      wobble: 0.45,
      dropout: 0.012,
      repeat: 2,
      drift: 0.4,
      layer: "circle",
      stroke: "#b5362b"
    });
  }

  for (let index = 0; index < 12; index++) {
    const y = 420 + index * 16;
    plot.line(70, y, width - 70, y, {
      wobble: 0.45,
      dropout: index * 0.008,
      overshoot: 12,
      repeat: index % 3 === 0 ? 2 : 1,
      drift: 0.5,
      layer: "hatch",
      stroke: "#244f73"
    });
  }

  plot.polygon([[84, 680], [138, 626], [192, 680], [138, 734]], {
    wobble: 0.5,
    dropout: 0.025,
    repeat: 2,
    drift: 0.5,
    layer: "frame"
  });
  plot.polygon([[378, 680], [432, 626], [486, 680], [432, 734]], {
    wobble: 0.5,
    dropout: 0.025,
    repeat: 2,
    drift: 0.5,
    layer: "frame"
  });
}

function wireActions() {
  document.getElementById("svg-button").addEventListener("click", downloadSVG);
  document.getElementById("hpgl-button").addEventListener("click", downloadHPGL);
  document.getElementById("reroll-button").addEventListener("click", function() {
    plot.reroll();
    redraw();
  });
}

function downloadSVG() {
  plot.downloadSVG("p5-gysin-calibration.svg", { page: PAGE, optimize: true });
  setStatus("SVG exported with A4 page metadata and clipping.");
}

function downloadHPGL() {
  plot.downloadHPGL("p5-gysin-calibration.hpgl", {
    page: PAGE,
    penMap: { frame: 1, circle: 2, hatch: 3 },
    speed: 20,
    optimize: true
  });
  const stats = plot.stats({ page: PAGE, optimize: true, drawSpeed: 20, travelSpeed: 60 });
  setStatus(`${stats.paths} paths · ${stats.drawnLength.toFixed(1)} mm drawn · ${stats.travelLength.toFixed(1)} mm travel.`);
}

function setStatus(message) {
  document.getElementById("calibration-status").textContent = message;
}

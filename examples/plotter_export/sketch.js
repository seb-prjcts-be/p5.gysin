// Canvas and export are separate: the selected paper size changes only the SVG.

let poster;

function setup() {
  const canvas = createCanvas(
    GysinWorks.plotterPoster.width,
    GysinWorks.plotterPoster.height
  );
  canvas.parent("sketch");
  pixelDensity(1);
  noLoop();
  describe("A black and red typographic poster prepared as a two-pen SVG.");

  poster = GysinWorks.plotterPoster.build();
  document.getElementById("plot-size").addEventListener("change", function() {
    reportFormat();
  });
  document.getElementById("svg-button").addEventListener("click", downloadPoster);
  reportFormat();
}

function draw() {
  background(poster.paper);
  poster.plot.draw();
}

function downloadPoster() {
  const format = document.getElementById("plot-size").value;

  poster.plot.downloadPlotterSVG(
    `gysin-remembers-${format.toLowerCase()}.svg`,
    {
      page: format,
      penMap: poster.penMap
    }
  );

  reportFormat("SVG downloaded");
}

function reportFormat(prefix = "Ready") {
  const format = document.getElementById("plot-size").value;
  document.getElementById("export-status").textContent =
    `${prefix} · ${format} · 10 mm margin · black layer → pen 1 · red layer → pen 2`;
}

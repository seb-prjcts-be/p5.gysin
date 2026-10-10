const WORK = GysinWorks.sayItAgain;

let plot;
let posterSeed = WORK.seed;

function setup() {
  createCanvas(WORK.width, WORK.height).parent("sketch");
  pixelDensity(1);
  noLoop();
  describe("One phrase turned twice across the sheet.");

  buildPoster();
  wireActions();
}

function draw() {
  background(WORK.paper);
  plot.draw();
}

function buildPoster() {
  plot = WORK.build({ seed: posterSeed }).plot;
  setStatus(`${plot.stats().paths} traces · seed ${posterSeed}`);
  redraw();
}

function wireActions() {
  document.getElementById("reroll-button").onclick = () => {
    posterSeed += 1;
    buildPoster();
  };
  document.getElementById("svg-button").onclick =
    () => plot.downloadSVG("p5-gysin-say-it-again.svg");
  document.getElementById("plotter-button").onclick = downloadPlotter;
}

// Route optimization stops at 2000 traces per pen. A worn poster can pass that,
// so it falls back to the same file in drawing order and says so.
function downloadPlotter() {
  const options = { page: "A3", penMap: WORK.penMap };
  const name = "p5-gysin-say-it-again-a3.svg";
  try {
    plot.downloadPlotterSVG(name, options);
  } catch (error) {
    plot.downloadPlotterSVG(name, Object.assign({}, options, { optimize: false }));
    setStatus("Too many traces to optimize the pen route: saved in drawing order.");
  }
}

function setStatus(message) {
  document.getElementById("poster-status").textContent = message;
}

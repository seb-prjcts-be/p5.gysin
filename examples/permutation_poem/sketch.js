const POSTER_WIDTH = 840;
const POSTER_HEIGHT = 1188;
const FONT_URL = "../font_outlines/assets/Oswald-Regular.otf";

let outlineFont = null;
let plot;
let phrase = "I LOVE YOU";
let posterSeed = 1960;

async function setup() {
  createCanvas(POSTER_WIDTH, POSTER_HEIGHT).parent("sketch");
  pixelDensity(1);
  noLoop();
  describe("One phrase written six times, with the same words returning in changing positions.");

  try {
    outlineFont = await loadFont(FONT_URL);
  } catch (error) {
    outlineFont = null;
  }

  buildPoster();
  wireActions();
}

function draw() {
  background("#f0efe9");
  plot.draw();
}

function buildPoster() {
  const work = GysinWorks.permutationPoem.build({
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    seed: posterSeed,
    phrase,
    font: outlineFont
  });
  plot = work.plot;
  setStatus(`${work.ids.length} returns · seed ${work.seed}`);
  redraw();
}

function wireActions() {
  const phraseInput = document.getElementById("phrase-input");
  phraseInput.value = phrase;

  document.getElementById("reroll-button").onclick = () => {
    posterSeed += 1;
    buildPoster();
  };
  phraseInput.onchange = () => {
    phrase = /[a-z0-9]/i.test(phraseInput.value)
      ? phraseInput.value.trim()
      : "I LOVE YOU";
    phraseInput.value = phrase;
    buildPoster();
  };
  document.getElementById("svg-button").onclick =
    () => plot.downloadSVG("p5-gysin-permutation-poem-a3.svg", { page: "A3" });
  document.getElementById("hpgl-button").onclick =
    () => plot.downloadHPGL("p5-gysin-permutation-poem-a3.hpgl", {
      page: "A3",
      speed: 18
    });
}

function setStatus(message) {
  document.getElementById("poster-status").textContent = message;
}

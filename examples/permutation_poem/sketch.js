const POSTER_WIDTH = 840;
const POSTER_HEIGHT = 1188;
const FONT_URL = "../font_outlines/assets/Oswald-Regular.otf";
const PAPER = "#eee9dc";
const INK = "#17140f";

let outlineFont = null;
let plot;
let posterSeed = 1960;
let permutations = [];

async function setup() {
  const canvas = createCanvas(POSTER_WIDTH, POSTER_HEIGHT);
  canvas.parent("sketch");
  pixelDensity(1);
  noLoop();
  describe("A monochrome A3 permutation poem: six groups of repeated cut-up text, a symbolic code column, a dense letter band, and a modular word grid.");

  try {
    outlineFont = await loadFont(FONT_URL);
    setStatus("Plotter-safe Oswald outlines: every permutation uses textCutup(), without retraced paths.");
  } catch (error) {
    setStatus("The outline font could not load; the poster is using p5.gysin's built-in vector alphabet.");
  }

  buildPoster();
  wireActions();
}

function draw() {
  background(PAPER);
  drawPaper();
  plot.draw();
}

function buildPoster() {
  permutations = GysinText.permute("I LOVE YOU", {
    seed: posterSeed,
    limit: 6,
    order: "walk"
  });

  plot = new GysinPlot({
    seed: posterSeed,
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    style: {
      stroke: INK,
      strokeWeight: 0.72,
      alpha: 0.88
    }
  });

  const font = outlineFont ? { font: outlineFont } : {};
  drawFrame();

  plot.text("PERMUTATION POEM / I LOVE YOU / 3 WORDS / 6 ORDERS", 64, 69, Object.assign({}, font, {
    size: 16,
    letterSpacing: 1.05,
    dropout: 0.012,
    strokeWeight: 0.82,
    layer: "type"
  }));

  plot.text("TEXT", 64, 100, Object.assign({}, font, {
    size: 11,
    strokeWeight: 0.55,
    alpha: 0.62,
    layer: "notes"
  }));
  plot.text("CODE", 602, 100, Object.assign({}, font, {
    size: 11,
    strokeWeight: 0.55,
    alpha: 0.62,
    layer: "notes"
  }));

  permutations.forEach(function(regel, groupIndex) {
    const groupTop = 124 + groupIndex * 112;
    const textField = Array(4).fill(regel).join("  ");
    const encoded = encodePermutation(regel);

    for (let repeatIndex = 0; repeatIndex < 6; repeatIndex++) {
      const baseline = groupTop + repeatIndex * 16;
      const offset = 0.7 + ((groupIndex * 3 + repeatIndex) % 7) * 0.72;

      plot.textCutup(textField, 64 + (repeatIndex === 4 ? 8 : 0), baseline, Object.assign({}, font, {
        size: 18.5,
        slices: 4 + ((groupIndex + repeatIndex) % 5),
        sliceOffset: offset,
        sliceDropout: 0.018 + repeatIndex * 0.004,
        wobble: 0.08 + repeatIndex * 0.018,
        dropout: 0.006 + groupIndex * 0.002,
        rubout: repeatIndex === 3 ? 0.012 : 0,
        segmentLength: 3.8,
        strokeWeight: repeatIndex === 0 ? 1.08 : 0.9,
        alpha: repeatIndex === 3 ? 0.7 : 0.94,
        layer: "type",
        seed: `${posterSeed}:text:${groupIndex}:${repeatIndex}`
      }));

      plot.textCutup(encoded, 602, baseline, Object.assign({}, font, {
        size: 18,
        slices: 4 + ((repeatIndex + 2) % 4),
        sliceOffset: 0.5 + groupIndex * 0.35,
        sliceDropout: 0.02,
        wobble: 0.07,
        dropout: 0.006,
        segmentLength: 3.6,
        strokeWeight: 0.92,
        alpha: 0.9,
        layer: "code",
        seed: `${posterSeed}:code:${groupIndex}:${repeatIndex}`
      }));
    }

    plot.line(56, groupTop + 91, 784, groupTop + 91, {
      wobble: 0.14,
      dropout: 0.012,
      strokeWeight: 0.42,
      alpha: 0.34,
      layer: "rules"
    });
  });

  drawLetterBand(font);
  drawPermutationGrid(font);
}

function drawLetterBand(font) {
  const compact = permutations.map(function(regel) {
    return regel.replace(/\s+/g, "");
  });

  plot.line(56, 812, 784, 812, {
    wobble: 0.2,
    strokeWeight: 0.7,
    alpha: 0.58,
    layer: "rules"
  });

  for (let row = 0; row < 7; row++) {
    const unit = `${compact[row % compact.length]}${compact[(row + 2) % compact.length]}${compact[(row + 4) % compact.length]}`;
    const text = unit + unit;
    plot.textCutup(text, 58 - (row % 3) * 7, 836 + row * 14, Object.assign({}, font, {
      size: 13.5,
      slices: 3 + row,
      sliceOffset: 2 + row * 1.2,
      sliceDropout: 0.025 + row * 0.006,
      wobble: 0.12,
      dropout: 0.012 + row * 0.004,
      rubout: row === 4 ? 0.025 : 0,
      segmentLength: 3.2,
      strokeWeight: 0.82,
      alpha: 0.8,
      layer: "band",
      seed: `${posterSeed}:band:${row}`
    }));
  }
}

function drawPermutationGrid(font) {
  const gridX = 56;
  const gridY = 958;
  const cellWidth = 242;
  const cellHeight = 80;

  for (let index = 0; index < permutations.length; index++) {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = gridX + column * cellWidth;
    const y = gridY + row * cellHeight;

    plot.rect(x, y, cellWidth, cellHeight, {
      wobble: 0.65,
      dropout: 0.02,
      strokeWeight: 0.68,
      alpha: 0.68,
      layer: "grid"
    });

    plot.textCutup(permutations[index], x + 13, y + 47, Object.assign({}, font, {
      size: 24,
      slices: 6 + index,
      sliceOffset: 4 + index * 1.4,
      sliceDropout: 0.035 + index * 0.006,
      wobble: 0.2 + index * 0.035,
      dropout: 0.012,
      rubout: index === 2 ? 0.025 : 0,
      segmentLength: 3.4,
      strokeWeight: 0.94,
      alpha: 0.92,
      layer: "grid-type",
      seed: `${posterSeed}:grid:${index}`
    }));
  }

  plot.text("ONE PHRASE / NO FINAL READING / SEED " + posterSeed, 58, 1147, Object.assign({}, font, {
    size: 12,
    letterSpacing: 1.08,
    dropout: 0.018,
    strokeWeight: 0.52,
    alpha: 0.62,
    layer: "notes"
  }));
}

function drawFrame() {
  plot.rect(42, 42, POSTER_WIDTH - 84, POSTER_HEIGHT - 84, {
    wobble: 0.45,
    dropout: 0.006,
    strokeWeight: 0.62,
    alpha: 0.64,
    layer: "frame"
  });

  const crosses = [[42, 42], [798, 42], [42, 1146], [798, 1146]];
  crosses.forEach(function(point) {
    plot.line(point[0] - 9, point[1], point[0] + 9, point[1], {
      wobble: 0.18,
      strokeWeight: 0.52,
      alpha: 0.55,
      layer: "frame"
    });
    plot.line(point[0], point[1] - 9, point[0], point[1] + 9, {
      wobble: 0.18,
      strokeWeight: 0.52,
      alpha: 0.55,
      layer: "frame"
    });
  });
}

function encodePermutation(regel) {
  const symbols = { I: "|", LOVE: "§§", YOU: "%" };
  return regel.split(" ").map(function(word) {
    return symbols[word] || "·";
  }).join("  ");
}

function drawPaper() {
  randomSeed(44);
  stroke("#d4ccbe");
  strokeWeight(0.45);
  for (let index = 0; index < 1000; index++) {
    point(random(width), random(height));
  }
  stroke("#d9d1c3");
  line(width * 0.505, 42, width * 0.5, height - 42);
}

function wireActions() {
  document.getElementById("reroll-button").addEventListener("click", function() {
    posterSeed += 1;
    buildPoster();
    setStatus(`Seed ${posterSeed}: ${permutations.join(" / ")}`);
    redraw();
  });

  document.getElementById("svg-button").addEventListener("click", function() {
    plot.downloadSVG("p5-gysin-permutation-poem-a3.svg", { page: a3Page() });
  });

  document.getElementById("hpgl-button").addEventListener("click", function() {
    plot.downloadHPGL("p5-gysin-permutation-poem-a3.hpgl", {
      page: a3Page(),
      penMap: {
        frame: 1, type: 1, code: 1, notes: 1, rules: 1,
        band: 1, grid: 1, "grid-type": 1
      },
      speed: 18
    });
  });
}

function a3Page() {
  return {
    width: 297,
    height: 420,
    units: "mm",
    margin: 10,
    scale: 277 / POSTER_WIDTH,
    clip: true
  };
}

function setStatus(message) {
  const status = document.getElementById("poster-status");
  if (status) status.textContent = message;
}

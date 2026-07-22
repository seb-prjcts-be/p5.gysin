let heroPlot;

function setup() {
  const holder = document.getElementById("hero-canvas");
  const canvas = createCanvas(holder.offsetWidth, holder.offsetHeight);
  canvas.parent("hero-canvas");
  pixelDensity(1);
  noLoop();
  heroPlot = makeHeroPlot();
}

function draw() {
  background("#f0efe9");
  drawPaperLines();
  heroPlot.draw();
}

function windowResized() {
  const holder = document.getElementById("hero-canvas");
  resizeCanvas(holder.offsetWidth, holder.offsetHeight);
  heroPlot = makeHeroPlot();
  redraw();
}

function makeHeroPlot() {
  const plot = new GysinPlot({
    seed: 12071960,
    width,
    height,
    style: {
      stroke: "#151515",
      strokeWeight: 1,
      alpha: 0.78
    }
  });
  buildHeroTrace(plot);
  return plot;
}

// The hero is the worked sheet itself: an incised table stamped twice,
// a typed permutation block, the word turned into columns, a dissolving
// letter field, an operator band, asemic rows, spatter, and a lowercase
// signature. The left-middle cell stays quiet - the title lives there,
// like the empty cell of the reference sheet.
function buildHeroTrace(plot) {
  const w = width;
  const h = height;
  const compact = w < 900;

  // the roller: the table, stamped twice, off register
  plot.grid(w * 0.04, h * 0.05, w * 0.92, h * 0.88, compact ? 3 : 5, 4, {
    frame: { bleed: 0.35, wobble: 0.8, strokeWeight: 1.6 }
  });
  plot.grid(w * 0.045 + 8, h * 0.05 - 6, w * 0.92, h * 0.88, compact ? 3 : 5, 4, {
    frame: { wobble: 1.5, dropout: 0.4 }
  });

  // ghost behind the title: the phrase, deep cut, muted by the wash
  plot.textCutup("RUB OUT THE WORD", w * 0.06, h * 0.17, {
    size: Math.max(34, Math.min(64, w * 0.045)),
    slices: 8,
    sliceOffset: 16,
    wobble: 1.6,
    dropout: 0.1,
    rubout: 0.15,
    alpha: 0.6
  });

  // left to right: the typed permutation block, top right
  const lines = GysinText.permute("RUB OUT THE WORD", {
    seed: 1960,
    limit: 5,
    order: "walk"
  });
  plot.underwood(lines.join("\n"), w * 0.55, h * 0.12, {
    size: Math.max(10, w * 0.013),
    wear: 0.4
  });

  // top to bottom: the word turned, written over the block
  const word = "RUB OUT";
  const columns = compact ? 2 : 3;
  for (let c = 0; c < columns; c++) {
    for (let i = 0; i < word.length; i++) {
      if (word[i] === " ") continue;
      plot.text(word[i], w * (0.6 + c * 0.13), h * (0.1 + i * 0.075), {
        size: Math.max(20, w * 0.026),
        breathe: 1.0,
        bleed: 0.2,
        dropout: 0.05
      });
    }
  }

  // the letter field, dissolving to the right
  plot.letters("RUBOUTTHEWORD", w * 0.55, h * 0.46, w * 0.38, h * 0.18, {
    size: Math.max(10, w * 0.012),
    glyphJitter: 0.7,
    wobble: 0.5,
    dropout: 0.1,
    alpha: 0.8
  });

  // the operator band and a soaked rule
  plot.underwood('+ " # & / + " # & / + " # & /', w * 0.55, h * 0.7, {
    size: Math.max(10, w * 0.013),
    wear: 0.6
  });
  plot.line(w * 0.55, h * 0.745, w * 0.94, h * 0.75, {
    wobble: 0.9,
    bleed: 0.7
  });

  // asemic rows across the foot, ghosted under the wash at the left
  const cells = compact ? 4 : 6;
  const cw = (w * 0.9) / cells;
  for (let c = 0; c < cells; c++) {
    plot.asemic(w * 0.05 + c * cw + 6, h * (c % 2 ? 0.795 : 0.81), cw * 0.82, h * 0.13, {
      wobble: 1.6,
      strokeWeight: 1
    });
  }

  // spatter: chance keeps the last word
  for (let i = 0; i < 36; i++) {
    const angle = i * 2.399;
    const radius = w * 0.012 * Math.sqrt(i);
    const sx = w * 0.72 + Math.cos(angle) * radius;
    const sy = h * 0.4 + Math.sin(angle) * radius * 1.4;
    plot.line(sx, sy, sx + 2, sy + 2, { wobble: 3 });
  }

  // the small voice, bottom right
  plot.underwood("p5.gysin / rub out the word", w * 0.6, h * 0.965, {
    size: Math.max(8, w * 0.0105),
    wear: 0.5
  });
}

function drawPaperLines() {
  randomSeed(77);
  stroke("#ddd6c8");
  strokeWeight(0.45);
  for (let y = 44; y < height; y += 32) {
    line(0, y + random(-1, 1), width, y + random(-1, 1));
  }
}

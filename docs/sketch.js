let heroPlot;

function setup() {
  const holder = document.getElementById("hero-canvas");
  const canvas = createCanvas(holder.offsetWidth, holder.offsetHeight);
  canvas.parent("hero-canvas");
  pixelDensity(1);
  noLoop();

  heroPlot = new GysinPlot({
    seed: 12071960,
    width,
    height,
    style: {
      stroke: "#151515",
      strokeWeight: 1,
      alpha: 0.78
    }
  });

  buildHeroTrace();
}

function draw() {
  background(245);
  drawPaperLines();
  heroPlot.draw();
}

function windowResized() {
  const holder = document.getElementById("hero-canvas");
  resizeCanvas(holder.offsetWidth, holder.offsetHeight);
  heroPlot = new GysinPlot({
    seed: 12071960,
    width,
    height,
    style: {
      stroke: "#151515",
      strokeWeight: 1,
      alpha: 0.78
    }
  });
  buildHeroTrace();
  redraw();
}

function buildHeroTrace() {
  randomSeed(12071960);
  const left = width * 0.52;
  const top = height * 0.18;
  const size = Math.max(48, Math.min(92, width * 0.07));

  heroPlot.textCutup("RUB OUT THE WORD", left, top + size, {
    size,
    slices: 9,
    sliceOffset: 22,
    density: 1,
    wobble: 2.2,
    dropout: 0.12,
    repeat: 2,
    drift: 3,
    rubout: 0.2,
    pressure: 0.3,
    segmentLength: 7
  });

  for (let i = 0; i < 18; i++) {
    const y = top + size * 2.2 + i * 18;
    heroPlot.line(left - 20, y, width - 70, y + random(-12, 12), {
      wobble: 1.1,
      dropout: 0.05,
      overshoot: 10,
      repeat: i % 4 === 0 ? 2 : 1,
      drift: 1.5,
      pressure: 0.2,
      alpha: 0.62,
      segmentLength: 10
    });
  }

  heroPlot.circle(width * 0.78, height * 0.72, Math.min(220, width * 0.2), {
    density: 1.2,
    wobble: 2.8,
    dropout: 0.13,
    repeat: 3,
    drift: 4,
    rubout: 0.22,
    fray: 0.25,
    alpha: 0.62,
    segmentLength: 8
  });
}

function drawPaperLines() {
  randomSeed(77);
  stroke("#dddddd");
  strokeWeight(0.45);
  for (let y = 44; y < height; y += 32) {
    line(0, y + random(-1, 1), width, y + random(-1, 1));
  }
}

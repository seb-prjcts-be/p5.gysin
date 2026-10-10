(function(global) {
  "use strict";

  const WIDTH = 720;
  const HEIGHT = 1018;
  const SEED = 42;
  const PAPER = "#eadfc4";
  const BLUE = "#1d4e89";
  const BROWN = "#3a2d1c";
  const PEN_MAP = { [BLUE]: 1, [BROWN]: 2 };
  const DAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

  // Small seeded generator, so the rainfall is the same on every build
  // without leaning on p5's random state.
  function mulberry(seed) {
    let a = seed >>> 0;
    return function() {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function build(options) {
    const o = options || {};
    const seed = o.seed === undefined ? SEED : o.seed;
    const rnd = mulberry(seed);
    const plot = new global.GysinPlot({
      p: o.p || null,
      seed,
      width: WIDTH,
      height: HEIGHT
    });
    const cols = 7, rows = 6, cell = 84, x0 = 66, y0 = 330;

    // ── 1 · the title and the weekdays ──────────────────────────────
    plot.text("42 DAYS", 48, 170, { size: 90, stroke: BROWN, strokeWeight: 2.6, wobble: 0.6, layer: "title" });
    plot.underwood("rainfall per day, in millimetres.\nsix weeks, one gauge, almost nothing.", 50, 215, { size: 13, stroke: BROWN, layer: "title" });

    DAYS.forEach((d, i) => plot.text(d, x0 + i * cell + cell / 2 - 10, y0 - 14, { size: 12, stroke: BROWN, layer: "title" }));

    // ── 2 · one cell per day: a dot is dry, hatching is rain ────────
    let total = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const storm = i === 17 || i === 18 ? 1 : 0;
        const mm = storm ? 6 + rnd() * 8 : rnd() < 0.12 ? rnd() * 2.2 : 0;
        total += mm;
        const x = x0 + c * cell, y = y0 + r * cell, g = 6;
        if (mm < 0.1) {
          plot.circle(x + cell / 2, y + cell / 2, 5, { stroke: BROWN, strokeWeight: 1.4, layer: "dry" });
        } else {
          plot.rect(x + g, y + g, cell - 2 * g, cell - 2 * g, {
            stroke: BLUE, strokeWeight: 1, fill: "hatch",
            hatchSpacing: Math.max(1.1, 9 - mm * 0.72), hatchAngle: 90 + (rnd() - 0.5) * 12,
            wobble: 0.35, layer: "rain"
          });
        }
      }
    }

    // ── 3 · the total ───────────────────────────────────────────────
    plot.text("TOTAL " + Math.round(total) + " MM", 66, y0 + rows * cell + 64, { size: 26, stroke: BROWN, strokeWeight: 2, layer: "title" });
    plot.underwood("a dot is a day without.", 66, y0 + rows * cell + 84, { size: 12, stroke: BROWN, layer: "title" });

    return { plot, seed, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.fortyTwoDays = Object.freeze({
    build, seed: SEED, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP
  });
})(typeof window === "undefined" ? globalThis : window);

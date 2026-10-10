(function(global) {
  "use strict";

  const WIDTH = 720;
  const HEIGHT = 1018;
  const SEED = 1951;
  const PAPER = "#2c312f";
  const CHALK = "#e9e6dc";
  const ROSE = "#e0776b";
  const PEN_MAP = { [CHALK]: 1, [ROSE]: 2 };

  // Small seeded generator, so the handwriting is the same on every build
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

    // One row of looped handwriting: a cycloid with a slant and a wander.
    const loops = (x0, x1, y, pitch, ratio, slant, wander, opts) => {
      const a = pitch / (2 * Math.PI), b = a * ratio, ph = rnd() * 6;
      const pts = [];
      const turns = (x1 - x0) / pitch;
      for (let u = 0; u <= turns * 2 * Math.PI; u += 0.3) {
        const yy = -b * Math.cos(u) + Math.sin(u * 0.05 + ph) * wander;
        pts.push([x0 + a * u - b * Math.sin(u) + yy * slant, y + yy]);
      }
      return plot.path(pts, opts);
    };

    // ── 1 · thirteen rows of chalk, erased more as they go ──────────
    const rows = 13, y0 = 150, step = 62;
    for (let i = 0; i < rows; i++) {
      const k = i / (rows - 1);
      const y = y0 + i * step;
      const pitch = 20 - k * 6 + rnd() * 5;
      const ratio = 1.5 + rnd() * 1.1;
      const x0 = 46 + rnd() * 14;
      const x1 = 640 + rnd() * 40 - (i % 4 === 3 ? 260 : 0);
      loops(x0, x1, y, pitch, ratio, 0.25 + rnd() * 0.3, 3 + rnd() * 6, {
        stroke: CHALK, strokeWeight: 1.4 + rnd() * 0.8, alpha: 0.8,
        wobble: 0.6, bleed: 0.4, fray: 0.3, dropout: 0.03 + k * 0.1, rubout: i > 7 ? 0.1 + k * 0.25 : 0.04,
        segmentLength: 5, layer: "chalk"
      });
    }

    // ── 2 · the correction, in rose ─────────────────────────────────
    loops(46, 330, 150 + 8 * step + 30, 22, 2.4, 0.35, 8, {
      stroke: ROSE, strokeWeight: 2, alpha: 0.9, wobble: 1, bleed: 0.8, repeat: 2, segmentLength: 5, layer: "rose"
    });

    // ── 3 · the instruction ─────────────────────────────────────────
    plot.underwood("exercise 1 to 13. keep your writing neat.", 46, 996, { size: 11, stroke: CHALK, layer: "chalk" });

    return { plot, seed, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.exercise = Object.freeze({
    build, seed: SEED, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP
  });
})(typeof window === "undefined" ? globalThis : window);

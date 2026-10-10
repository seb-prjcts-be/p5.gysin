(function(global) {
  "use strict";

  const WIDTH = 720;
  const HEIGHT = 1018;
  const SEED = 1403;
  const PAPER = "#21152c";
  const CREAM = "#f1e6c9";
  const AMBER = "#ff9d5c";
  const PEN_MAP = { [CREAM]: 1, [AMBER]: 2 };
  // The queue position, two digits on a 5 x 7 grid.
  const DIGITS = [
    ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
    ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."]
  ];

  function build(options) {
    const o = options || {};
    const seed = o.seed === undefined ? SEED : o.seed;
    const plot = new global.GysinPlot({
      p: o.p || null,
      seed,
      width: WIDTH,
      height: HEIGHT
    });

    // ── 1 · the recorded message, permuted until it falls apart ─────
    plot.chant("YOUR CALL MAY BE RECORDED", 48, 90, {
      lines: 11, order: "walk", size: 24, leading: 52, seed: 7,
      stroke: CREAM, strokeWeight: 1.4, wobble: 0.4,
      descent: 0.6, slices: 4, sliceOffset: 5, sliceDropout: 0, layer: "chant"
    });

    // ── 2 · your position in the queue ──────────────────────────────
    const cell = 27, x0 = 386, y0 = 700;
    DIGITS.forEach((d, k) => d.forEach((row, r) => [...row].forEach((ch, c) => {
      if (ch !== "#") return;
      plot.rect(x0 + k * (5 * cell + cell) + c * cell, y0 + r * cell, cell, cell, {
        stroke: AMBER, strokeWeight: 1.2, wobble: 0.5, fill: "hatch", hatchSpacing: 4, hatchAngle: 45, layer: "number"
      });
    })));
    plot.underwood("your position in the queue", 48, 955, { size: 13, stroke: AMBER, layer: "number" });
    plot.underwood("estimated wait: unknown", 48, 985, { size: 13, stroke: AMBER, layer: "number" });

    return { plot, seed, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.onHold = Object.freeze({
    build, seed: SEED, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP
  });
})(typeof window === "undefined" ? globalThis : window);

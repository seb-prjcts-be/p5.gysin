(function(global) {
  "use strict";

  const WIDTH = 720;
  const HEIGHT = 1018;
  const SEED = 3;
  const PAPER = "#dde2e6";
  const NAVY = "#1b2a49";
  const RED = "#c1121f";
  const PEN_MAP = { [NAVY]: 1, [RED]: 2 };

  function build(options) {
    const o = options || {};
    const seed = o.seed === undefined ? SEED : o.seed;
    const plot = new global.GysinPlot({
      p: o.p || null,
      seed,
      width: WIDTH,
      height: HEIGHT
    });

    // rub() carries stroke, not layer: the pens come from the colours.

    // ── 1 · the first file name, lightly worn ───────────────────────
    plot.underwood("report_final.docx", 48, 62, { size: 13, stroke: NAVY, layer: "name" });
    plot.rub("FINAL", 48, 130, { size: 64, stepX: 12, stepY: 94, decay: 0.7, stroke: NAVY });

    // ── 2 · the second, worn further ────────────────────────────────
    plot.underwood("report_final_2.docx", 48, 436, { size: 13, stroke: NAVY, layer: "name" });
    plot.rub("FINAL 2", 48, 504, { size: 52, stepX: 14, stepY: 76, decay: 1.1, stroke: NAVY });

    // ── 3 · the third, in red, almost gone ──────────────────────────
    plot.underwood("report_final_final_NOW.docx", 48, 726, { size: 13, stroke: RED, layer: "name2" });
    plot.rub("FINAL FINAL", 48, 790, { size: 54, stepX: 16, stepY: 62, decay: 1.5, stroke: RED });

    return { plot, seed, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.final = Object.freeze({
    build, seed: SEED, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP
  });
})(typeof window === "undefined" ? globalThis : window);

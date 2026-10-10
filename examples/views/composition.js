(function(global) {
  "use strict";

  const WIDTH = 720;
  const HEIGHT = 1018;
  const SEED = 2100;
  const PAPER = "#e7dcb4";
  const GREEN = "#143a2f";
  const SEA = "#1f5f8b";
  const PEN_MAP = { [GREEN]: 1, [SEA]: 2 };
  const SOURCES = Object.freeze([
    Object.freeze({
      id: "climate",
      text:
        "sea level is rising, extreme rainfall returns, low-lying areas are at risk, " +
        "dikes are being reinforced, heatwaves last longer, the water keeps rising, evacuation is sometimes needed, the ground dries out"
    }),
    Object.freeze({
      id: "brochure",
      text:
        "this charming apartment, a sunny balcony, sweeping views over the water, " +
        "the garden meets the quayside, plenty of light, you live on the river, a dream location, available immediately"
    })
  ]);

  function build(options) {
    const o = options || {};
    const seed = o.seed === undefined ? SEED : o.seed;
    const plot = new global.GysinPlot({
      p: o.p || null,
      seed,
      width: WIDTH,
      height: HEIGHT
    });

    // ── 1 · the headline ────────────────────────────────────────────
    plot.text("STUNNING", 48, 140, { size: 92, stroke: GREEN, strokeWeight: 2.6, wobble: 0.6, layer: "title" });
    plot.text("VIEWS", 48, 250, { size: 92, stroke: GREEN, strokeWeight: 2.6, wobble: 0.6, layer: "title" });

    // ── 2 · a climate report and a sales brochure, woven ────────────
    plot.weave(SOURCES, 48, 312, {
      lines: 10, unit: "clause", fragments: 2, size: 24, leading: 46, maxWidth: 640,
      stroke: GREEN, strokeWeight: 1.2, seed: 5, layer: "text"
    });

    // ── 3 · the water keeps rising ──────────────────────────────────
    for (let i = 0; i < 9; i++) {
      const y = 790 + i * 24, amp = 3 + i * 1.4;
      const pts = [];
      for (let x = 0; x <= 720; x += 12) pts.push([x, y + Math.sin(x * 0.03 + i * 1.7) * amp]);
      plot.path(pts, { stroke: SEA, strokeWeight: 1.4 + i * 0.15, wobble: 0.4, repeat: 1 + (i > 5 ? 1 : 0), layer: "water" });
    }
    plot.underwood("for sale. viewings by appointment.", 48, 996, { size: 11, stroke: GREEN, layer: "title" });

    return { plot, seed, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP, sources: SOURCES };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.views = Object.freeze({
    build, seed: SEED, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP, sources: SOURCES
  });
})(typeof window === "undefined" ? globalThis : window);

(function(global) {
  "use strict";

  const WIDTH = 720;
  const HEIGHT = 1018;
  const SEED = 2018;
  const PAPER = "#dfe6e1";
  const INK = "#23307a";
  const RED = "#d6452b";
  const PEN_MAP = { [INK]: 1, [RED]: 2 };
  const FINE =
    "WE VALUE YOUR PRIVACY AND USE COOKIES TO IMPROVE YOUR EXPERIENCE. " +
    "SOME PARTNERS PROCESS DATA WITHOUT YOUR CONSENT BASED ON LEGITIMATE INTEREST. ";

  function build(options) {
    const o = options || {};
    const seed = o.seed === undefined ? SEED : o.seed;
    const plot = new global.GysinPlot({
      p: o.p || null,
      seed,
      width: WIDTH,
      height: HEIGHT
    });

    // ── 1 · the fine print: a wall of rows, turned once ─────────────
    plot.lattice(FINE.repeat(2), 48, 56, 624, 660, {
      size: 15, turns: [0, 90], wear: 1.1, stroke: INK, strokeWeight: 1, layer: "fine"
    });

    // ── 2 · the heading ─────────────────────────────────────────────
    plot.text("WE VALUE", 48, 792, { size: 38, stroke: INK, strokeWeight: 2, wobble: 0.4, layer: "heading" });
    plot.text("YOUR PRIVACY", 48, 846, { size: 38, stroke: INK, strokeWeight: 2, wobble: 0.4, layer: "heading" });

    // ── 3 · the button you are meant to press ───────────────────────
    plot.rect(48, 884, 624, 76, { stroke: RED, strokeWeight: 2.2, repeat: 3, wobble: 0.9, fill: "hatch", hatchSpacing: 5, hatchAngle: 62, layer: "button" });
    plot.text("ACCEPT ALL", 232, 931, { size: 30, stroke: INK, strokeWeight: 2.4, layer: "heading" });

    // ── 4 · the way out, barely there ───────────────────────────────
    plot.text("MANAGE SETTINGS", 520, 990, {
      size: 8, stroke: INK, alpha: 0.55, dropout: 0.25, rubout: 0.1, glyphJitter: 0.8, layer: "fine"
    });

    return { plot, seed, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.consent = Object.freeze({
    build, seed: SEED, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP
  });
})(typeof window === "undefined" ? globalThis : window);

(function(global) {
  "use strict";

  const WIDTH = 720;
  const HEIGHT = 1018;
  const SEED = 90;
  const PAPER = "#d9dbe6";
  const INDIGO = "#2b2d6e";
  const ORANGE = "#e4572e";
  const BLACK = "#17171c";
  const PEN_MAP = { [INDIGO]: 1, [ORANGE]: 2, [BLACK]: 3 };
  const PHRASE = "SAY IT AGAIN ";

  function build(options) {
    const o = options || {};
    const seed = o.seed === undefined ? SEED : o.seed;
    const plot = new global.GysinPlot({
      p: o.p || null,
      seed,
      width: WIDTH,
      height: HEIGHT
    });

    // ── 1 · the phrase, turned a quarter ────────────────────────────
    plot.lattice(PHRASE.repeat(3), 48, 48, 624, 700, {
      size: 26, turns: [0, 90], wear: 0.9, stroke: INDIGO, strokeWeight: 1.2, layer: "indigo"
    });

    // ── 2 · the same phrase, turned an eighth, a little worse ───────
    plot.lattice(PHRASE.repeat(3), 84, 84, 552, 628, {
      size: 26, turns: [45, 135], wear: 1.6, stroke: ORANGE, strokeWeight: 1.1, layer: "orange"
    });

    // ── 3 · the caption ─────────────────────────────────────────────
    plot.underwood("a word repeated often enough\nloses its meaning, and gains something.", 48, 840, {
      size: 13, stroke: BLACK, layer: "black"
    });
    plot.underwood("semantic satiation, approx. 30 repetitions.", 48, 920, { size: 11, stroke: INDIGO, layer: "indigo" });

    return { plot, seed, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.sayItAgain = Object.freeze({
    build, seed: SEED, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP
  });
})(typeof window === "undefined" ? globalThis : window);

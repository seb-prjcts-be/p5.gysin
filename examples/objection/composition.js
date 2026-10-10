(function(global) {
  "use strict";

  const WIDTH = 720;
  const HEIGHT = 1018;
  const SEED = 1984;
  const PAPER = "#efe9dc";
  const INK = "#26262b";
  const RED = "#b3202a";
  const PEN_MAP = { [INK]: 1, [RED]: 2 };
  const LETTER = [
    "Re: your decision of 14 March",
    "",
    "Dear automated decision-maker,",
    "",
    "You wrote that my application does",
    "not qualify. Under which condition,",
    "exactly? I have asked three times",
    "and received the same answer thrice:",
    "'based on your data'.",
    "",
    "My data was compiled by a service",
    "I do not know, from sources I may",
    "not see, and judged by a rule that",
    "no one can read aloud to me.",
    "",
    "I request that you send a human.",
    "Even someone who does not know how",
    "it works, but who can look at me",
    "while saying so.",
    "",
    "Yours sincerely,",
    "",
    "file 2291-A"
  ];
  // Struck-out answers: [row, first column, last column].
  const REDACTED = [[2, 5, 14], [5, 25, 34], [8, 0, 21], [11, 20, 33], [12, 14, 30], [13, 11, 21]];

  function build(options) {
    const o = options || {};
    const seed = o.seed === undefined ? SEED : o.seed;
    const plot = new global.GysinPlot({
      p: o.p || null,
      seed,
      width: WIDTH,
      height: HEIGHT
    });
    const size = 13, k = 1, pitch = size * 1.2 * k, lh = size * 1.9 * k, x0 = 64, y0 = 150;

    // ── 1 · the letter, typed ───────────────────────────────────────
    plot.underwood(LETTER.join("\n"), x0, y0, { size, stroke: INK, wear: 1.3, layer: "text" });

    // ── 2 · the answers, struck out with the same machine ──────────
    REDACTED.forEach(([row, a, b]) => {
      plot.underwood("X".repeat(b - a), x0 + a * pitch, y0 + row * lh, { size, stroke: RED, bold: true, wear: 1.3, layer: "red" });
    });

    // ── 3 · the stamp ───────────────────────────────────────────────
    plot.text("OFFICIAL", 450, 100, { size: 14, stroke: RED, strokeWeight: 1.6, layer: "red" });
    plot.rect(430, 78, 168, 40, { stroke: RED, strokeWeight: 1.8, repeat: 2, wobble: 1, layer: "red" });
    plot.underwood("your reference: illegible\ncaseworker: n/a", 64, 900, { size: 11, stroke: INK, layer: "text" });

    return { plot, seed, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.objection = Object.freeze({
    build, seed: SEED, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP
  });
})(typeof window === "undefined" ? globalThis : window);

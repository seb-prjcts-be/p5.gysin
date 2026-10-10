(function(global) {
  "use strict";

  const WIDTH = 720;
  const HEIGHT = 1018;
  const SEED = 612;
  const PAPER = "#f0dfd8";
  const GRAPHITE = "#2b2a2e";
  const RED = "#c1121f";
  const PEN_MAP = { [GRAPHITE]: 1, [RED]: 2 };
  // null is the passage nobody could make out.
  const SPOKEN = [
    "HI, I AM CALLING ABOUT THE DATE",
    "ON THURSDAY, I CANNOT MAKE IT",
    "BECAUSE I HAVE TO GO TO THE HOSPI-",
    "TAL, BUT MAYBE YOU COULD COME",
    "A BIT EARLIER TOMORROW",
    "SO WE CAN DISCUSS IT PROPERLY",
    "THE KEY IS WITH THE NEIGHBOURS",
    "AND THE CODE FOR THE GATE IS",
    null,
    "CALL ME BACK, OKAY?",
    "SEE YOU THEN, BYE, TAKE CARE",
    "HI, I AM CALLING ABOUT THE DA-"
  ];

  // Small seeded generator, so the timestamps are the same on every build
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

    // ── 1 · the title ───────────────────────────────────────────────
    plot.text("TRANSCRIPT", 48, 120, { size: 68, stroke: GRAPHITE, strokeWeight: 2.4, wobble: 0.5, layer: "title" });
    plot.underwood("automatically generated from a voice message.\naccuracy: not available.", 50, 160, { size: 11, stroke: GRAPHITE, layer: "title" });

    // ── 2 · a loop runs straight through the lines ──────────────────
    const scrawl = (y, amp, x1, w) => {
      const pts = [];
      for (let u = 0; u < 46; u += 0.3) pts.push([60 + u * (x1 - 60) / 46 + amp * 1.3 * Math.sin(u), y - amp * Math.cos(u) + Math.sin(u * 0.2) * 18]);
      plot.path(pts, { stroke: GRAPHITE, strokeWeight: w, alpha: 0.55, wobble: 0.8, bleed: 0.5, segmentLength: 5, layer: "scrawl" });
    };
    scrawl(560, 26, 660, 1.2);
    scrawl(800, 34, 620, 1.6);

    // ── 3 · the lines, harder to hear with every timestamp ──────────
    const y0 = 285, step = 56;
    let sec = 3;
    SPOKEN.forEach((line, i) => {
      const y = y0 + i * step, k = i / (SPOKEN.length - 1);
      sec += 2 + Math.floor(rnd() * 9);
      const stamp = "00:" + String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0");
      plot.text(stamp, 48, y + 10, { size: 12, stroke: GRAPHITE, strokeWeight: 1.3, layer: "title" });

      if (line === null) {
        plot.asemic(170, y - 24, 200, 44, { stroke: RED, strokeWeight: 1.3, loops: 30, detail: 6, layer: "red" });
        plot.underwood("[inaudible]", 400, y - 4, { size: 13, stroke: RED, wear: 1.8, layer: "red" });
        return;
      }
      plot.text(line, 170, y + 10, {
        size: 15, stroke: GRAPHITE, strokeWeight: 1.5, wobble: 0.3 + k * 0.8,
        dropout: k * 0.32, rubout: k * 0.22, glyphJitter: 0.35 + k * 0.9, layer: "text"
      });
    });

    return { plot, seed, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.transcript = Object.freeze({
    build, seed: SEED, width: WIDTH, height: HEIGHT, paper: PAPER, penMap: PEN_MAP
  });
})(typeof window === "undefined" ? globalThis : window);

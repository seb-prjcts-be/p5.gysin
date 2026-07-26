(function(global) {
  "use strict";

  const SOURCES = Object.freeze([
    Object.freeze({
      id: "window",
      text: "Window holds light. The room waits."
    }),
    Object.freeze({
      id: "letter",
      text: "A letter came late. Paper remembers."
    })
  ]);

  function build(options) {
    const o = options || {};
    const width = o.width || 760;
    const height = o.height || 560;
    const seed = o.seed === undefined ? 1960 : o.seed;
    const lines = o.lines || 4;
    const x = width * 0.055;
    const y = height * 0.145;
    const plot = new global.GysinPlot({
      p: o.p || null,
      seed,
      width,
      height,
      style: { stroke: "#171717", strokeWeight: 1.05, alpha: 1 }
    });
    const ids = plot.weave(o.sources || SOURCES, x, y, {
      lines,
      unit: "clause",
      fragments: 2,
      size: width * 0.028,
      leading: lines > 1 ? (height - y * 2) / (lines - 1) : 0,
      maxWidth: width - x * 2
    });
    return { plot, ids };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.weave = Object.freeze({ build, sources: SOURCES });
})(typeof window === "undefined" ? globalThis : window);

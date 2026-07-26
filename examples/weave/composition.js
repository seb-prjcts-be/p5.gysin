(function(global) {
  "use strict";

  const SOURCES = Object.freeze([
    Object.freeze({
      id: "window",
      text: "The window keeps the last light of the street. Someone closes the curtains before the rain arrives."
    }),
    Object.freeze({
      id: "letter",
      text: "Your letter arrived after the room was empty. I left its folded weather beside the door."
    })
  ]);

  function build(options) {
    const o = options || {};
    const width = o.width || 760;
    const height = o.height || 560;
    const seed = o.seed === undefined ? 1960 : o.seed;
    const lines = o.lines || 5;
    const x = width * 0.055;
    const y = height * 0.145;
    const plot = new global.GysinPlot({
      p: o.p || null,
      seed,
      width,
      height,
      style: { stroke: "#171717", strokeWeight: 0.82, alpha: 0.88 }
    });
    const ids = plot.weave(o.sources || SOURCES, x, y, {
      seed,
      lines,
      size: width * 0.02,
      leading: lines > 1 ? (height - y * 2) / (lines - 1) : 0,
      maxWidth: width - x * 2,
      breathe: 0.4
    });
    return { plot, ids };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.weave = Object.freeze({ build, sources: SOURCES });
})(typeof window === "undefined" ? globalThis : window);

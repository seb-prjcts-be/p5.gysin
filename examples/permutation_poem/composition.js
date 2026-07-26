(function(global) {
  "use strict";

  function build(options) {
    const o = options || {};
    const width = o.width || 840;
    const height = o.height || 1188;
    const seed = o.seed === undefined ? 1960 : o.seed;
    const phrase = String(o.phrase || "I LOVE YOU").trim() || "I LOVE YOU";
    const plot = new global.GysinPlot({
      p: o.p || null,
      seed,
      width,
      height,
      style: { stroke: "#171717", strokeWeight: 0.82, alpha: 0.9 }
    });
    const chantOptions = {
      seed,
      order: "walk",
      lines: 6,
      size: Math.min(width * 0.11, width * 1.55 / Math.max(12, phrase.length)),
      leading: height * 0.14,
      strokeWeight: 1.05,
      alpha: 0.94
    };
    if (o.font) chantOptions.font = o.font;
    const ids = plot.chant(phrase, width * 0.075, height * 0.12, chantOptions);
    return { plot, ids, phrase, seed };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.permutationPoem = Object.freeze({ build });
})(typeof window === "undefined" ? globalThis : window);

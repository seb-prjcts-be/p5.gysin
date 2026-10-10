(function(global) {
  "use strict";

  function build(options) {
    const o = options || {};
    const width = o.width || 760;
    const height = o.height || 560;
    const seed = o.seed === undefined ? 1960 : o.seed;
    const plot = new global.GysinPlot({
      p: o.p || null,
      seed,
      width,
      height,
      style: { stroke: "#171717", strokeWeight: 1.1, alpha: 1 }
    });
    const ids = plot.chant("CUT ARRANGE GLUE", width * 0.07, height * 0.24, {
      order: "rotate",
      lines: 3,
      size: width * 0.06,
      leading: height * 0.27
    });
    return { plot, ids };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.ring = Object.freeze({ build });
})(typeof window === "undefined" ? globalThis : window);

(function(global) {
  "use strict";

  const HAIKU = "ONE LETTER\nAT A TIME\nTHE PAGE FILLS";

  function build(options) {
    const o = options || {};
    const width = o.width || 760;
    const height = o.height || 560;
    const seed = o.seed === undefined ? 1961 : o.seed;
    const size = width * 0.022;
    const plot = new global.GysinPlot({
      p: o.p || null,
      seed,
      width,
      height,
      style: { stroke: "#171717", strokeWeight: 1.1, alpha: 0.92 }
    });
    const ids = plot.underwood(HAIKU, width * 0.09, height * 0.26, {
      size,
      pitch: size * (o.spacing === undefined ? 2.4 : o.spacing),
      lineHeight: size * 5.6
    });
    return { plot, ids };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.wideCarriage = Object.freeze({ build });
})(typeof window === "undefined" ? globalThis : window);

(function(global) {
  "use strict";

  function build(options) {
    const o = options || {};
    const width = o.width || 900;
    const height = o.height || 620;
    const seed = o.seed === undefined ? 19600319 : o.seed;
    const plot = new global.GysinPlot({
      p: o.p || null,
      seed,
      width,
      height,
      style: { stroke: "#161616", strokeWeight: 1.05, alpha: 0.9 }
    });

    const textOptions = {
      size: Math.min(width * 0.14, height * 0.21),
      slices: 5,
      sliceOffset: width * 0.016,
      sliceDropout: 0.025
    };
    if (o.font) textOptions.font = o.font;
    plot.textCutup("SURFACE", width * 0.12, height * 0.56, textOptions);

    return { plot, seed };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.slicedText = Object.freeze({ build });
})(typeof window === "undefined" ? globalThis : window);

(function(global) {
  "use strict";

  const NOTE = [
    "THE RIBBON IS TIRED.",
    "EVERY KEY STILL LANDS,",
    "BUT LESS EXACTLY WITH EVERY LINE.",
    "",
    "THE MACHINE KEEPS WRITING.",
    "THE PAGE KEEPS REMEMBERING."
  ].join("\n");

  function build(options) {
    const o = options || {};
    const width = o.width || 760;
    const height = o.height || 560;
    const seed = o.seed === undefined ? 1912 : o.seed;
    const plot = new global.GysinPlot({
      p: o.p || null,
      seed,
      width,
      height,
      style: { stroke: "#171717", strokeWeight: 1.1, alpha: 0.92 }
    });
    const ids = plot.underwood(NOTE, width * 0.08, height * 0.2, {
      size: width * 0.022,
      wear: o.wear === undefined ? 2.2 : o.wear
    });
    return { plot, ids };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.tiredRibbon = Object.freeze({ build });
})(typeof window === "undefined" ? globalThis : window);

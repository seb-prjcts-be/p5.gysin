(function(global) {
  "use strict";

  const SOURCES = Object.freeze([
    Object.freeze({ id: "radio", text: "Rain tonight, clearing by morning. Wind from the west." }),
    Object.freeze({ id: "recipe", text: "Add the salt slowly. Stir until the water clears." }),
    Object.freeze({ id: "letter", text: "Come home when the light changes. Bring nothing." }),
    Object.freeze({ id: "manual", text: "Press and hold until the signal stops. Do not remove." })
  ]);

  function build(options) {
    const o = options || {};
    const width = o.width || 760;
    const height = o.height || 560;
    const seed = o.seed === undefined ? 1960 : o.seed;
    const lines = o.lines || 6;
    const x = width * 0.055;
    const y = height * 0.15;
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
      fragments: 3,
      size: width * 0.026,
      leading: (height - y * 2) / (lines - 1),
      maxWidth: width - x * 2
    });
    return { plot, ids };
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.chorus = Object.freeze({ build, sources: SOURCES });
})(typeof window === "undefined" ? globalThis : window);

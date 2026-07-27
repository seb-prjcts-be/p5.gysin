(function(global) {
  "use strict";

  if (!global.GysinWorks || !global.GysinWorks.plotterPoster) {
    throw new Error("Collage requires examples/plotter_export/composition.js.");
  }

  // Compatibility name for older links; the artwork has one canonical source.
  global.GysinPoster = global.GysinWorks.plotterPoster;
})(typeof window === "undefined" ? globalThis : window);

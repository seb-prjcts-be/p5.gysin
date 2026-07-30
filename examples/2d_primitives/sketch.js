// ═══════════════════════════════════════════════════════════════════
//  2D Primitives - five clean geometry methods, one mark each.
// ═══════════════════════════════════════════════════════════════════
//  New to p5.gysin? The complete drawing is six calls:
//
//      const plot = new GysinPlot({ seed: 1960 });
//      plot.line(...);
//      plot.rect(...);
//      plot.circle(...);
//      plot.polygon(...);
//      plot.path(...);
//      plot.draw();
//
//  Every primitive below uses its clean default. No disturbance
//  or export option is needed to draw these marks.
// ═══════════════════════════════════════════════════════════════════

let primitiveWork;

function setup() {
  const canvas = createCanvas(
    GysinWorks.primitives2d.width,
    GysinWorks.primitives2d.height
  );
  canvas.parent("sketch");
  describe(
    "Five clean p5.gysin primitives from left to right: a horizontal line, " +
    "a square, a circle, a diamond polygon, and an open zigzag path."
  );
  pixelDensity(1);
  noLoop();
  primitiveWork = GysinWorks.primitives2d.build();
}

function draw() {
  background("#f0efe9");
  GysinWorks.primitives2d.drawLabels(globalThis, primitiveWork.labels);
  primitiveWork.plot.draw();
}

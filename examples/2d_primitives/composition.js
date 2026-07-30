(function(global) {
  "use strict";

  const WIDTH = 720;
  const HEIGHT = 420;
  const LABELS = Object.freeze([
    Object.freeze({ text: "line()", x: 84 }),
    Object.freeze({ text: "rect()", x: 222 }),
    Object.freeze({ text: "circle()", x: 360 }),
    Object.freeze({ text: "polygon()", x: 498 }),
    Object.freeze({ text: "path()", x: 636 })
  ]);

  function build(options) {
    const o = options || {};
    const plot = new global.GysinPlot({
      p: o.p || null,
      seed: 1960,
      width: WIDTH,
      height: HEIGHT
    });

    plot.line(42, 180, 126, 180);
    plot.rect(176, 134, 92, 92);
    plot.circle(360, 180, 92);
    plot.polygon([[498, 126], [552, 180], [498, 234], [444, 180]]);
    plot.path([[588, 216], [612, 144], [636, 216], [660, 144], [684, 216]]);

    return { plot, width: WIDTH, height: HEIGHT, labels: LABELS };
  }

  function drawLabels(p, labels) {
    p.push();
    p.noStroke();
    p.fill("#6f6b63");
    p.textAlign(p.CENTER, p.CENTER);
    p.textFont("monospace");
    p.textSize(20);
    for (const label of labels) p.text(label.text, label.x, 330);
    p.pop();
  }

  global.GysinWorks = global.GysinWorks || {};
  global.GysinWorks.primitives2d = Object.freeze({
    build,
    drawLabels,
    height: HEIGHT,
    width: WIDTH
  });
})(typeof window === "undefined" ? globalThis : window);

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadLibrary(filename) {
  const context = { console };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filename, "utf8"), context, {
    filename
  });
  assert.equal(typeof context.GysinPlot, "function");
  assert.equal(typeof context["Human" + "Plot"], "undefined");
  return context.GysinPlot;
}

const SourcePlot = loadLibrary(path.join(__dirname, "..", "p5.gysin.js"));
const MinPlot = loadLibrary(path.join(__dirname, "..", "p5.gysin.min.js"));

function loadTextAddon(filename) {
  const context = {};
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename });
  assert.equal(typeof context.GysinText, "object");
  assert.equal(typeof context.GysinText.permute, "function");
  assert.equal(typeof context.GysinPlot, "undefined");
  return context.GysinText;
}

const SourceText = loadTextAddon(path.join(__dirname, "..", "p5.gysin.text.js"));
const MinText = loadTextAddon(path.join(__dirname, "..", "p5.gysin.text.min.js"));

const loveWalk = Array.from(SourceText.permute("I love you", { seed: 1960, limit: 6, order: "walk" }));
assert.equal(loveWalk.length, 6);
assert.equal(loveWalk[0], "I love you");
assert.equal(new Set(loveWalk).size, 6);
assert.deepEqual(
  Array.from(SourceText.permute("I love you", { seed: 1960, limit: 6, order: "walk" })),
  loveWalk
);
assert.deepEqual(
  Array.from(MinText.permute("I love you", { seed: 1960, limit: 6, order: "walk" })),
  loveWalk
);

const divinePermutations = Array.from(SourceText.permute("I AM THAT I AM", { limit: 100, order: "lexical" }));
assert.equal(divinePermutations.length, 30);
assert.equal(new Set(divinePermutations).size, 30);
assert.deepEqual(
  Array.from(SourceText.permute("one two three", { limit: 3, order: "rotate" })),
  ["one two three", "two three one", "three one two"]
);
assert.throws(() => SourceText.permute("  "), /at least one word/);
assert.throws(() => SourceText.permute("one two", { limit: 0 }), /from 1 through 1000/);
assert.throws(() => SourceText.permute("one two", { order: "grammar" }), /order must be one of/);

function build(Plot) {
  const plot = new Plot({ seed: 123, width: 400, height: 300 });
  const lineId = plot.line(10, 10, 390, 20, {
    wobble: 1,
    dropout: 0.02,
    repeat: 2,
    overshoot: 4
  });
  plot.rect(40, 40, 120, 80, { wobble: 0.5, dropout: 0.01 });
  plot.circle(260, 90, 80, { density: 1.2, wobble: 0.6 });
  plot.textCutup("RUB OUT", 40, 220, {
    size: 48,
    wobble: 1,
    dropout: 0.08,
    rubout: 0.1
  });
  plot.freeze(lineId);
  return {
    plot,
    lineId,
    svg: plot.exportSVG({ width: 400, height: 300 }),
    hpgl: plot.exportHPGL()
  };
}

const a = build(SourcePlot);
const b = build(SourcePlot);
const min = build(MinPlot);

assert.equal(a.svg, b.svg);
assert.equal(min.svg, a.svg);
assert.equal(min.hpgl, a.hpgl);
assert.match(a.svg, /p5\.gysin export/);
assert.match(min.svg, /viewBox="0 0 400 300"/);
assert.doesNotMatch(min.svg, /viewBox="0 0 400300"/);
assert.match(a.hpgl, /PU/);
assert.match(a.hpgl, /PD/);

const frozenBefore = JSON.stringify(a.plot.get(a.lineId).generated);
a.plot.setSeed(999);
const frozenAfter = JSON.stringify(a.plot.get(a.lineId).generated);
assert.equal(frozenAfter, frozenBefore);

const json = JSON.parse(a.plot.exportJSON());
assert.equal(json.library, "p5.gysin");
assert.equal(json.shapes.length, 4);

const minJson = JSON.parse(min.plot.exportJSON());
assert.equal(minJson.library, "p5.gysin");
assert.equal(minJson.shapes.length, 4);

assert.throws(() => new SourcePlot().circle(0, 0, Infinity), /finite number/);
assert.throws(() => new SourcePlot().path([[0, 0]], {}), /at least 2 points/);
assert.throws(() => new SourcePlot().line(0, 0, 1, 1, { repeat: 1001 }), /from 1 through 1000/);
assert.throws(() => new SourcePlot().line(0, 0, 10, 0, {
  bleed: 0.2,
  bleedSpread: 0
}), /bleedSpread must be at least 0.1/);

function buildBleedPlot() {
  const plot = new SourcePlot({ seed: 77, width: 420, height: 180 });
  const id = plot.textCutup("INK BUILDS", 20, 100, {
    size: 42,
    slices: 7,
    sliceOffset: 5,
    sliceDropout: 0.02,
    bleed: 0.42,
    bleedPasses: 3,
    bleedSpread: 1.1,
    bleedCluster: 12,
    simplify: 0,
    minSegmentLength: 0,
    segmentLength: 3
  });
  return { plot, id };
}

const bleedA = buildBleedPlot();
const bleedB = buildBleedPlot();
const bleedShape = bleedA.plot.get(bleedA.id);
const bleedTraces = bleedShape.generated.filter((trace) => trace.role === "bleed");
const baseTraces = bleedShape.generated.filter((trace) => trace.role === "base");
const serializedBaseTraces = new Set(baseTraces.map((trace) => JSON.stringify(trace.points)));
const bleedStats = bleedA.plot.stats({ drawSpeed: 20, travelSpeed: 60 });

assert.ok(bleedTraces.length > 0);
assert.ok(baseTraces.length > 0);
assert.deepEqual(bleedA.plot.get(bleedA.id).generated, bleedB.plot.get(bleedB.id).generated);
assert.equal(bleedTraces.some((trace) => serializedBaseTraces.has(JSON.stringify(trace.points))), false);
assert.equal(bleedStats.bleedPaths, bleedTraces.length);
assert.equal(bleedStats.extraPasses, bleedStats.bleedPaths);
assert.ok(bleedStats.bleedLength > 0);
assert.ok(bleedStats.overdrawRatio > 0);
assert.ok(bleedStats.maxLocalPasses >= 2 && bleedStats.maxLocalPasses <= 4);
assert.match(bleedA.plot.exportSVG(), /data-role="bleed"/);
assert.match(bleedA.plot.exportSVG(), /data-pass="[2-4]"/);

const bladeStats = bleedA.plot.stats({ tool: "blade", drawSpeed: 20, travelSpeed: 60 });
const bladeSvg = bleedA.plot.exportSVG({ tool: "blade" });
assert.equal(bladeStats.tool, "blade");
assert.equal(bladeStats.bleedPaths, 0);
assert.equal(bladeStats.maxLocalPasses, 1);
assert.equal(bladeStats.paths, baseTraces.length);
assert.doesNotMatch(bladeSvg, /data-role="bleed"/);
assert.doesNotMatch(bladeSvg, /data-pass="[2-9]/);
assert.ok((bleedA.plot.exportHPGL().match(/PD/g) || []).length > (bleedA.plot.exportHPGL({ tool: "blade" }).match(/PD/g) || []).length);
assert.throws(() => bleedA.plot.exportSVG({ tool: "laser" }), /tool must be either pen or blade/);

const noBleedDefault = new SourcePlot({ seed: 81 });
noBleedDefault.line(0, 0, 100, 0, { simplify: 0, minSegmentLength: 0 });
const noBleedExplicit = new SourcePlot({ seed: 81 });
noBleedExplicit.line(0, 0, 100, 0, {
  bleed: 0,
  bleedPasses: 3,
  bleedSpread: 2,
  bleedCluster: 30,
  simplify: 0,
  minSegmentLength: 0
});
assert.equal(noBleedExplicit.exportSVG(), noBleedDefault.exportSVG());
assert.equal(noBleedExplicit.stats().bleedPaths, 0);
assert.equal(noBleedExplicit.stats().maxLocalPasses, 1);

const addressing = new SourcePlot({ seed: 4 });
const addressingId = addressing.line(0, 0, 80, 0, { id: "trace", wobble: 2 });
assert.throws(() => addressing.line(0, 0, 1, 1, { id: "trace" }), /already exists/);
const regenerated = JSON.stringify(addressing.get(addressingId).generated);
addressing.regenerate(addressingId);
assert.equal(JSON.stringify(addressing.get(addressingId).generated), regenerated);
addressing.reroll(addressingId);
assert.notEqual(JSON.stringify(addressing.get(addressingId).generated), regenerated);
const publicSnapshot = addressing.get(addressingId);
publicSnapshot.params.x2 = 999;
publicSnapshot.generated[0].points[0].x = 999;
assert.equal(addressing.get(addressingId).params.x2, 80);
assert.notEqual(addressing.get(addressingId).generated[0].points[0].x, 999);
const reservedAutoId = new SourcePlot();
reservedAutoId.line(0, 0, 1, 1, { id: "hp_1" });
assert.equal(reservedAutoId.line(0, 0, 1, 1), "hp_2");

const pagePlot = new SourcePlot({ seed: 9 });
pagePlot.circle(20, 20, 30, { layer: "red", stroke: "#d22", density: 1.4 });
pagePlot.line(0, 0, 90, 60, { layer: "blue", stroke: "#24c", wobble: 0.4 });
const page = { width: 100, height: 80, units: "mm", margin: 5, clip: true };
const pageSvg = pagePlot.exportSVG({ page, optimize: true });
const pageHpgl = pagePlot.exportHPGL({ page, penMap: { red: 2, blue: 3 }, maxPointsPerCommand: 3, speed: 20 });
const pageStats = pagePlot.stats({ page, optimize: true, drawSpeed: 20, travelSpeed: 60 });
assert.match(pageSvg, /width="100mm"/);
assert.match(pageSvg, /id="layer-red"/);
assert.match(pageSvg, /clip-path="url\(#p5-gysin-page\)"/);
assert.match(pageHpgl, /SP2;/);
assert.match(pageHpgl, /SP3;/);
assert.ok((pageHpgl.match(/PD/g) || []).length > 2);
assert.equal(pageStats.page.units, "mm");
assert.ok(pageStats.drawnLength > 0);
assert.ok(pageStats.estimatedSeconds > 0);

for (const layer of ["__proto__", "constructor", "toString"]) {
  const specialLayerPlot = new SourcePlot();
  specialLayerPlot.line(0, 0, 10, 0, { layer, simplify: 0, minSegmentLength: 0 });
  assert.equal(Object.prototype.hasOwnProperty.call(specialLayerPlot.stats().layers, layer), true);
  assert.match(specialLayerPlot.exportHPGL(), /PD/);
}

const closedPlot = new SourcePlot({ seed: 1 });
const closedId = closedPlot.circle(50, 50, 80, { wobble: 10, simplify: 0, minSegmentLength: 0 });
const closedTrace = closedPlot.get(closedId).generated[0];
assert.deepEqual(closedTrace.points[0], closedTrace.points[closedTrace.points.length - 1]);
assert.equal(closedTrace.closed, true);
assert.match(closedPlot.exportSVG(), / Z"/);

const updatePlot = new SourcePlot();
const updateId = updatePlot.path([[0, 0], [10, 0]]);
updatePlot.update(updateId, { params: { points: [[0, 0], [20, 0]] } });
assert.equal(updatePlot.get(updateId).params.points[1].x, 20);
assert.equal(updatePlot.get(updateId).params.points[1].y, 0);
assert.throws(() => updatePlot.update(updateId, {
  wobble: 5,
  params: { points: [[0, 0], [Infinity, 0]] }
}), /finite number/);
assert.equal(updatePlot.get(updateId).human.wobble, 0);
assert.equal(updatePlot.get(updateId).params.points[1].x, 20);
assert.equal(updatePlot.get(updateId).params.points[1].y, 0);

const frozenStylePlot = new SourcePlot();
const frozenStyleId = frozenStylePlot.line(0, 0, 10, 0);
frozenStylePlot.freeze(frozenStyleId);
frozenStylePlot.update(frozenStyleId, { stroke: "#ff0000" });
assert.equal(frozenStylePlot.get(frozenStyleId).generated[0].style.stroke, "#ff0000");
assert.match(frozenStylePlot.exportSVG(), /stroke="#ff0000"/);

const instancePlot = new SourcePlot({ p: { width: 321, height: 123 } });
instancePlot.line(0, 0, 10, 10);
assert.equal(instancePlot.stats().page.width, 321);
assert.equal(instancePlot.stats().page.height, 123);
assert.match(instancePlot.exportSVG(), /viewBox="0 0 321 123"/);

assert.throws(() => instancePlot.exportSVG({ decimals: 1.5 }), /whole number/);
assert.throws(() => instancePlot.exportSVG({ decimals: 13 }), /from 0 through 12/);

const manyTracesPlot = new SourcePlot();
manyTracesPlot.line(0, 0, 10, 0, { repeat: 1000, simplify: 0, minSegmentLength: 0 });
manyTracesPlot.line(0, 1, 10, 1, { repeat: 1000, simplify: 0, minSegmentLength: 0 });
manyTracesPlot.line(0, 2, 10, 2, { repeat: 1, simplify: 0, minSegmentLength: 0 });
assert.throws(() => manyTracesPlot.exportSVG({ optimize: true }), /at most 2000 traces/);

const outlineFont = {
  textToPoints() { return []; },
  font: {
    getPath() {
      return {
        commands: [
          { type: "M", x: 0, y: 0 }, { type: "L", x: 20, y: 0 }, { type: "L", x: 20, y: 20 }, { type: "Z" },
          { type: "M", x: 6, y: 6 }, { type: "L", x: 14, y: 6 }, { type: "L", x: 14, y: 14 }, { type: "Z" }
        ]
      };
    }
  }
};
const outlinePlot = new SourcePlot();
const outlineId = outlinePlot.text("O", 0, 0, { size: 20, font: outlineFont, simplify: 0 });
assert.equal(outlinePlot.get(outlineId).paths.length, 2);

let p5TextSize = null;
let p5Pushes = 0;
let p5Pops = 0;
const p5V2Font = {
  textToContours(value, x, y, options) {
    assert.equal(value, "WIDE");
    assert.equal(x, 10);
    assert.equal(y, 60);
    assert.equal(p5TextSize, 42);
    assert.equal(options.sampleFactor, 0.18);
    return [[
      { x: 10, y: 20 },
      { x: 110, y: 20 },
      { x: 110, y: 60 },
      { x: 10, y: 60 },
      { x: 10, y: 20 }
    ]];
  },
  textToPoints() {
    throw new Error("p5.js 2 text must not use the legacy width argument");
  }
};
const p5V2Plot = new SourcePlot({
  p: {
    push() { p5Pushes += 1; },
    pop() { p5Pops += 1; },
    textSize(size) { p5TextSize = size; },
    width: 200,
    height: 100
  }
});
const p5V2Id = p5V2Plot.text("WIDE", 10, 60, {
  size: 42,
  font: p5V2Font,
  simplify: 0,
  minSegmentLength: 0
});
const p5V2Shape = p5V2Plot.get(p5V2Id);
assert.equal(p5V2Shape.bounds.width, 100);
assert.equal(p5V2Shape.bounds.height, 40);
assert.equal(p5Pushes, 1);
assert.equal(p5Pops, 1);

const root = path.join(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(
  path.join(root, "docs", "p5.gysin.manifest.json"),
  "utf8"
));
const examplesPage = fs.readFileSync(path.join(root, "docs", "examples.html"), "utf8");
const examplesDir = path.join(root, "examples");
const exampleDirs = fs.readdirSync(examplesDir, { withFileTypes: true })
  .filter(function(entry) {
    return entry.isDirectory();
  })
  .map(function(entry) {
    return entry.name;
  })
  .sort();

assert.deepEqual(manifest.examples, exampleDirs);

for (const name of manifest.examples) {
  assert.ok(fs.existsSync(path.join(examplesDir, name, "index.html")), `${name} index.html`);
  assert.ok(fs.existsSync(path.join(examplesDir, name, "sketch.js")), `${name} sketch.js`);
  assert.match(examplesPage, new RegExp(`\\.\\./examples/${name}/`));
  assert.match(examplesPage, new RegExp(`\\.\\./examples/${name}/sketch\\.js`));
}

console.log("p5.gysin snapshot ok");

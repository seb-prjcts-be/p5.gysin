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

const addressing = new SourcePlot({ seed: 4 });
const addressingId = addressing.line(0, 0, 80, 0, { id: "trace", wobble: 2 });
assert.throws(() => addressing.line(0, 0, 1, 1, { id: "trace" }), /already exists/);
const regenerated = JSON.stringify(addressing.get(addressingId).generated);
addressing.regenerate(addressingId);
assert.equal(JSON.stringify(addressing.get(addressingId).generated), regenerated);
addressing.reroll(addressingId);
assert.notEqual(JSON.stringify(addressing.get(addressingId).generated), regenerated);
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

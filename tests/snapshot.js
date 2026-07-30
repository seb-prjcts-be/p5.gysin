const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadLibrary(filename, libraryConsole = console) {
  const context = { console: libraryConsole };
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
  assert.equal(typeof context.GysinText.weave, "function");
  assert.equal(typeof context.GysinText.splice, "undefined", "the pre-release splice name has no alias");
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

for (const textApi of [SourceText, MinText]) {
  for (const order of ["walk", "random"]) {
    for (let seed = 1; seed <= 25; seed++) {
      const rows = textApi.permute("ONE TWO THREE FOUR FIVE", { seed, limit: 6, order });
      assert.equal(rows.length, 6, `${order} respects limit for seed ${seed}`);
    }
  }
}

// --- weave(): source collision with exact provenance ------------------------
const weaveSources = [
  { id: "window", text: "The window keeps the last light of the street." },
  { id: "letter", text: "Your letter arrived after the room was empty." },
  { id: "notice", text: "Leave every borrowed name beside the door." }
];
const weaveInputBefore = JSON.stringify(weaveSources);
const weaveA = SourceText.weave(weaveSources, { seed: 1960, lines: 4, unit: "phrase" });
const weaveB = SourceText.weave(weaveSources, { seed: 1960, lines: 4, unit: "phrase" });
const weaveMin = MinText.weave(weaveSources, { seed: 1960, lines: 4, unit: "phrase" });
assert.equal(weaveA.lines.length, 4);
assert.equal(JSON.stringify(weaveA), JSON.stringify(weaveB), "weave is deterministic");
assert.equal(JSON.stringify(weaveA), JSON.stringify(weaveMin), "weave min build matches source");
assert.equal(JSON.stringify(weaveSources), weaveInputBefore, "weave does not mutate its sources");
for (const line of weaveA.lines) {
  assert.ok(new Set(line.fragments.map((fragment) => fragment.source)).size >= 2);
  for (const fragment of line.fragments) {
    const source = weaveSources[fragment.sourceIndex];
    assert.equal(source.id, fragment.source);
    assert.equal(source.text.slice(fragment.start, fragment.end), fragment.text);
  }
}
assert.notEqual(
  JSON.stringify(SourceText.weave(weaveSources, { seed: 1961, lines: 4 })),
  JSON.stringify(weaveA),
  "a new weave seed can form a new collision"
);
for (const unit of ["word", "phrase", "clause"]) {
  const result = SourceText.weave(weaveSources, { seed: 3, lines: 2, unit });
  assert.ok(result.lines.length > 0, `${unit} produces weave lines`);
}
assert.equal(SourceText.weave(["one", "two"], { lines: 4, fragments: 2 }).lines.length, 2);
assert.throws(() => SourceText.weave("one"), /sources must be an array/);
assert.throws(() => SourceText.weave(["one"]), /from 2 through 8 sources/);
assert.throws(() => SourceText.weave(Array(9).fill("one")), /from 2 through 8 sources/);
assert.throws(() => SourceText.weave(["one", "  "]), /needs visible text/);
assert.throws(() => SourceText.weave(["one", null]), /must be text or an object with text/);
assert.throws(() => SourceText.weave(["one", {}]), /must be text or an object with text/);
assert.throws(() => SourceText.weave([{ id: "same", text: "one" }, { id: "same", text: "two" }]), /duplicated/);
assert.throws(() => SourceText.weave(["one", "two"], { unit: "letter" }), /unit must be one of/);
assert.throws(() => SourceText.weave(["one", "two"], { lines: 0 }), /from 1 through 100/);
assert.throws(() => SourceText.weave(["one", "two"], { fragments: 7 }), /from 2 through 6/);
assert.throws(() => SourceText.weave(["x".repeat(20001), "two"]), /exceeds 20000/);

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

// breathe is the poetic alias for wobble: same value, same trace - and an
// explicit breathe wins when a wobble is also present (merged-in defaults).
{
  const size = { width: 200, height: 100 };
  const withWobble = new SourcePlot({ seed: 77, width: 200, height: 100 });
  withWobble.line(10, 20, 190, 30, { wobble: 1.4, dropout: 0.02 });
  const withBreathe = new SourcePlot({ seed: 77, width: 200, height: 100 });
  withBreathe.line(10, 20, 190, 30, { breathe: 1.4, dropout: 0.02 });
  assert.equal(withBreathe.exportSVG(size), withWobble.exportSVG(size));
  const both = new SourcePlot({ seed: 77, width: 200, height: 100 });
  both.line(10, 20, 190, 30, { wobble: 0.2, breathe: 1.4, dropout: 0.02 });
  assert.equal(both.exportSVG(size), withWobble.exportSVG(size));
  const minBreathe = new MinPlot({ seed: 77, width: 200, height: 100 });
  minBreathe.line(10, 20, 190, 30, { breathe: 1.4, dropout: 0.02 });
  assert.equal(minBreathe.exportSVG(size), withWobble.exportSVG(size));
}

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
assert.match(pageSvg, /\n  <g fill="none" stroke-linecap="round" stroke-linejoin="round">\n    <g id="layer-red"/);
assert.match(pageHpgl, /SP2;/);
assert.match(pageHpgl, /SP3;/);
assert.ok((pageHpgl.match(/PD/g) || []).length > 2);
assert.equal(pageStats.page.units, "mm");
assert.ok(pageStats.drawnLength > 0);
assert.ok(pageStats.estimatedSeconds > 0);

// A plotter SVG is a separate, strong-default route. Generic export stays
// byte-compatible while this route requires physical dimensions, clips actual
// geometry, optimizes within each pen group, and exposes true, numbered
// Inkscape layers at SVG root.
for (const Plot of [SourcePlot, MinPlot]) {
  const implicit = new Plot({ width: 100, height: 80 });
  implicit.line(0, 0, 10, 10);
  assert.throws(() => implicit.exportPlotterSVG(), /explicit physical page/);
  assert.throws(
    () => implicit.exportPlotterSVG({ page: { width: 100, height: 80, units: "px" } }),
    /units mm, cm, or in/
  );
  assert.throws(
    () => implicit.exportPlotterSVG({ page: { width: 100, units: "mm" } }),
    /explicit physical page/
  );

  for (const [preset, pageWidth, pageHeight] of [
    ["A5", 148, 210],
    ["A4", 210, 297],
    ["A3", 297, 420],
    ["A2", 420, 594]
  ]) {
    const isoPlot = new Plot({ seed: 1, width: 720, height: 1018, page: preset });
    isoPlot.line(0, 0, 720, 0, { simplify: 0, minSegmentLength: 0 });
    const isoSvg = isoPlot.exportPlotterSVG();
    assert.match(isoSvg, new RegExp(`width="${pageWidth}mm" height="${pageHeight}mm"`));
    assert.match(
      isoSvg,
      new RegExp(`<clipPath id="p5-gysin-page"><rect x="10" y="10" width="${pageWidth - 20}" height="${pageHeight - 20}"`)
    );
    assert.equal(isoPlot.stats().page.scale, (pageWidth - 20) / 720);
  }

  const presetPlot = new Plot({ seed: 1, width: 720, height: 1018, page: "A3" });
  presetPlot.line(0, 0, 720, 0, { simplify: 0, minSegmentLength: 0 });
  const presetSvg = presetPlot.exportPlotterSVG();
  assert.match(presetSvg, /width="297mm" height="420mm"/);
  assert.match(presetSvg, /<clipPath id="p5-gysin-page"><rect x="10" y="10" width="277" height="400"/);
  assert.match(presetSvg, /<path d="M 10 10[^"]*L 287 10"/);

  const explicitPlot = new Plot({
    seed: 1,
    width: 720,
    height: 1018,
    page: {
      width: 297,
      height: 420,
      units: "mm",
      margin: 10,
      scale: 277 / 720
    }
  });
  explicitPlot.line(0, 0, 720, 0, { simplify: 0, minSegmentLength: 0 });
  assert.equal(presetSvg, explicitPlot.exportPlotterSVG());

  const exportPresetPlot = new Plot({ seed: 1, width: 720, height: 1018 });
  exportPresetPlot.line(0, 0, 720, 0, { simplify: 0, minSegmentLength: 0 });
  assert.equal(presetSvg, exportPresetPlot.exportPlotterSVG({ page: "a3" }));
  assert.throws(() => exportPresetPlot.exportPlotterSVG({ page: "A0" }), /Unsupported page preset/);

  const route = new Plot({ seed: 1 });
  route.line(-10, 10, 20, 10, { layer: "black", simplify: 0, minSegmentLength: 0 });
  route.line(900, 10, 920, 10, { layer: "black", simplify: 0, minSegmentLength: 0 });
  route.line(30, 10, 50, 10, { layer: "black", simplify: 0, minSegmentLength: 0 });
  const physicalPage = { width: 1000, height: 100, units: "mm", scale: 1 };
  const safeSvg = route.exportPlotterSVG({ page: physicalPage });
  assert.match(safeSvg, /width="1000mm"/);
  assert.match(safeSvg, /&quot;geometricClipping&quot;:true/);
  assert.match(safeSvg, /&quot;routeOptimized&quot;:true/);
  assert.match(safeSvg, /&quot;pathModel&quot;:&quot;centerline&quot;/);
  assert.match(safeSvg, /&quot;inkscapeLayers&quot;:true/);
  assert.match(safeSvg, /&quot;layerLabelPrefix&quot;:&quot;physical pen number&quot;/);
  assert.match(safeSvg, /&quot;ignoredScreenStyles&quot;:\[&quot;alpha&quot;,&quot;strokeWeight&quot;,&quot;pressure&quot;\]/);
  assert.match(safeSvg, /xmlns:inkscape="http:\/\/www\.inkscape\.org\/namespaces\/inkscape"/);
  assert.match(safeSvg, /\n  <g id="layer-1-black" data-layer="black" data-pen="1" inkscape:groupmode="layer" inkscape:label="1 black" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="0\.1mm" data-path-model="centerline" clip-path=/);
  assert.doesNotMatch(safeSvg, /\n  <g fill="none" stroke-linecap=/);
  assert.doesNotMatch(safeSvg, /<path[^>]*\s(?:opacity|stroke-width)=/);
  assert.doesNotMatch(safeSvg, /<path d="[^"]*-\d/);
  assert.ok(safeSvg.indexOf('data-shape-id="hp_1"') < safeSvg.indexOf('data-shape-id="hp_3"'));
  assert.ok(safeSvg.indexOf('data-shape-id="hp_3"') < safeSvg.indexOf('data-shape-id="hp_2"'));

  const preservedSvg = route.exportPlotterSVG({ page: physicalPage, optimize: false });
  assert.match(preservedSvg, /&quot;routeOptimized&quot;:false/);
  assert.ok(preservedSvg.indexOf('data-shape-id="hp_1"') < preservedSvg.indexOf('data-shape-id="hp_2"'));
  assert.ok(preservedSvg.indexOf('data-shape-id="hp_2"') < preservedSvg.indexOf('data-shape-id="hp_3"'));

  const passes = new Plot({ seed: 2 });
  passes.line(10, 10, 90, 10, {
    layer: "ink",
    repeat: 3,
    simplify: 0,
    minSegmentLength: 0
  });
  const passesSvg = passes.exportPlotterSVG({
    page: { width: 100, height: 100, units: "mm" },
    tool: "pen"
  });
  assert.match(passesSvg, /data-pass="2"/);
  assert.match(passesSvg, /data-pass="3"/);

  const numbered = new Plot({ seed: 3 });
  numbered.line(10, 10, 20, 10, { layer: "red", stroke: "#b5362b" });
  numbered.line(10, 20, 20, 20, { layer: "blue", stroke: "#244f73" });
  numbered.line(10, 30, 20, 30, { layer: "black", stroke: "#151515" });
  const numberedSvg = numbered.exportPlotterSVG({
    page: { width: 100, height: 100, units: "mm" },
    penMap: { black: 1, red: 2, blue: 3 }
  });
  assert.match(numberedSvg, /inkscape:label="1 black"/);
  assert.match(numberedSvg, /inkscape:label="2 red"/);
  assert.match(numberedSvg, /inkscape:label="3 blue"/);
  assert.ok(numberedSvg.indexOf('inkscape:label="1 black"') < numberedSvg.indexOf('inkscape:label="2 red"'));
  assert.ok(numberedSvg.indexOf('inkscape:label="2 red"') < numberedSvg.indexOf('inkscape:label="3 blue"'));
}

const capturedPlotterWarnings = [];
const WarningPlot = loadLibrary(path.join(__dirname, "..", "p5.gysin.js"), {
  warn(message) {
    capturedPlotterWarnings.push(message);
  }
});
const warningPlot = new WarningPlot();
warningPlot.line(10, 10, 20, 10, {
  layer: "mixed",
  stroke: "#111111",
  strokeWeight: 1,
  alpha: 0.5,
  simplify: 0,
  minSegmentLength: 0
});
warningPlot.line(30, 10, 40, 10, {
  layer: "mixed",
  stroke: "#cc0000",
  strokeWeight: 2,
  alpha: 1,
  simplify: 0,
  minSegmentLength: 0
});
const warningSvg = warningPlot.exportPlotterSVG({
  page: { width: 100, height: 100, units: "mm" }
});
assert.match(warningSvg, /&quot;ignoredScreenStyles&quot;:\[&quot;alpha&quot;,&quot;strokeWeight&quot;,&quot;pressure&quot;\]/);
assert.match(warningSvg, /was split into 2 stroke groups/);
assert.match(warningSvg, /id="layer-1-mixed-stroke-111111"/);
assert.match(warningSvg, /id="layer-2-mixed-stroke-cc0000"/);
assert.match(warningSvg, /inkscape:label="1 mixed #111111"/);
assert.match(warningSvg, /inkscape:label="2 mixed #cc0000"/);
assert.match(warningSvg, /data-stroke="#111111"/);
assert.match(warningSvg, /data-stroke="#cc0000"/);
assert.doesNotMatch(warningSvg, /<path[^>]*\s(?:opacity|stroke-width)=/);
assert.match(warningSvg, /stroke-width="0\.1mm" data-path-model="centerline"/);
const warningGenericSvg = warningPlot.exportSVG({
  page: { width: 100, height: 100, units: "mm" }
});
assert.match(warningGenericSvg, /stroke-width="1" opacity="0\.5"/);
assert.match(warningGenericSvg, /stroke-width="2" opacity="1"/);
assert.doesNotMatch(warningGenericSvg, /xmlns:inkscape|inkscape:groupmode|inkscape:label|data-pen=/);
assert.equal(capturedPlotterWarnings.length, 1);
assert.ok(capturedPlotterWarnings.every((warning) => warning.startsWith("[p5.gysin plotter]")));

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

const manyLayerTracesPlot = new SourcePlot();
manyLayerTracesPlot.line(0, 0, 10, 0, { layer: "one", repeat: 1000, simplify: 0, minSegmentLength: 0 });
manyLayerTracesPlot.line(0, 1, 10, 1, { layer: "two", repeat: 1000, simplify: 0, minSegmentLength: 0 });
manyLayerTracesPlot.line(0, 2, 10, 2, { layer: "two", repeat: 1, simplify: 0, minSegmentLength: 0 });
assert.doesNotThrow(() => manyLayerTracesPlot.stats({ optimize: true }));

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

// --- fill engine, step 1: hatch ---------------------------------------------
function buildFillRect(Plot) {
  const plot = new Plot({ seed: 5, width: 200, height: 200 });
  const id = plot.rect(20, 20, 100, 60, {
    fill: "hatch",
    hatchSpacing: 6,
    wobble: 0,
    simplify: 0,
    minSegmentLength: 0
  });
  return { plot, id };
}

const fillRect = buildFillRect(SourcePlot);
const fillTraces = fillRect.plot.get(fillRect.id).generated.filter((t) => t.role === "fill");
assert.ok(fillTraces.length > 0, "hatch fill produces fill traces");
const fillStats = fillRect.plot.stats();
assert.equal(fillStats.fillPaths, fillTraces.length);
assert.ok(fillStats.fillLength > 0);
assert.match(fillRect.plot.exportSVG(), /data-role="fill"/);

// deterministic, and identical between source and min build
const fillTracesJSON = JSON.stringify(fillRect.plot.get(fillRect.id).generated);
assert.equal(JSON.stringify(buildFillRect(SourcePlot).plot.get("hp_1").generated), fillTracesJSON);
assert.equal(JSON.stringify(buildFillRect(MinPlot).plot.get("hp_1").generated), fillTracesJSON);

// a blade must not fill an interior
assert.doesNotMatch(fillRect.plot.exportSVG({ tool: "blade" }), /data-role="fill"/);
assert.equal(fillRect.plot.stats({ tool: "blade" }).fillPaths, 0);

// default (no fill) stays byte-identical: no fill traces, no fill length
const noFill = new SourcePlot({ seed: 5, width: 200, height: 200 });
const noFillId = noFill.rect(20, 20, 100, 60, { wobble: 0 });
assert.equal(noFill.get(noFillId).generated.filter((t) => t.role === "fill").length, 0);
assert.equal(noFill.stats().fillPaths, 0);

// open shapes and the bitmap alphabet have no fillable interior
const openFill = new SourcePlot();
const openFillId = openFill.line(0, 0, 50, 0, { fill: "hatch" });
assert.equal(openFill.get(openFillId).generated.filter((t) => t.role === "fill").length, 0);
const bitmapFill = new SourcePlot();
const bitmapFillId = bitmapFill.text("A", 0, 40, { size: 40, fill: "hatch" });
assert.equal(bitmapFill.get(bitmapFillId).generated.filter((t) => t.role === "fill").length, 0);

// even-odd: an outline glyph counter stays empty (the hole is not filled)
const holeFillPlot = new SourcePlot();
const holeFillId = holeFillPlot.text("O", 0, 0, {
  size: 20,
  font: outlineFont,
  fill: "hatch",
  hatchSpacing: 2,
  wobble: 0,
  glyphJitter: 0,
  simplify: 0,
  minSegmentLength: 0
});
const holeFill = holeFillPlot.get(holeFillId).generated.filter((t) => t.role === "fill");
assert.ok(holeFill.length > 0, "outline text fills");
let counterScanline = false;
let counterCovered = false;
for (const trace of holeFill) {
  for (let i = 0; i + 1 < trace.points.length; i++) {
    const p = trace.points[i];
    const q = trace.points[i + 1];
    if (Math.abs(p.y - 9) < 0.5 && Math.abs(q.y - 9) < 0.5) {
      counterScanline = true;
      const lo = Math.min(p.x, q.x);
      const hi = Math.max(p.x, q.x);
      if (lo < 12 - 1e-6 && hi > 12 + 1e-6) counterCovered = true;
    }
  }
}
assert.ok(counterScanline, "a scanline crosses the counter height");
assert.equal(counterCovered, false, "hatch fill must leave the glyph counter empty");

// --- per-glyph variation: every generated letter must differ --------------
// Two identical 10x10 square glyphs, spaced apart. With glyphJitter each is
// transformed independently, so after re-centering they must no longer match.
const twoGlyphFont = {
  textToPoints() { return []; },
  font: {
    getPath() {
      return {
        commands: [
          { type: "M", x: 0, y: 0 }, { type: "L", x: 10, y: 0 }, { type: "L", x: 10, y: 10 }, { type: "L", x: 0, y: 10 }, { type: "Z" },
          { type: "M", x: 20, y: 0 }, { type: "L", x: 30, y: 0 }, { type: "L", x: 30, y: 10 }, { type: "L", x: 20, y: 10 }, { type: "Z" }
        ]
      };
    }
  }
};

function centerContour(contour) {
  let sx = 0;
  let sy = 0;
  for (const p of contour) { sx += p.x; sy += p.y; }
  const cx = sx / contour.length;
  const cy = sy / contour.length;
  return contour.map((p) => ({ x: p.x - cx, y: p.y - cy }));
}

const glyphVaryPlot = new SourcePlot();
const glyphVaryId = glyphVaryPlot.text("HI", 0, 0, {
  size: 10,
  font: twoGlyphFont,
  glyphJitter: 0.7,
  wobble: 0,
  simplify: 0,
  minSegmentLength: 0
});
const glyphPaths = glyphVaryPlot.get(glyphVaryId).paths;
assert.equal(glyphPaths.length, 2, "two glyph contours");
const avgX = (c) => c.reduce((s, p) => s + p.x, 0) / c.length;
const gLeft = centerContour(glyphPaths[avgX(glyphPaths[0]) < avgX(glyphPaths[1]) ? 0 : 1]);
const gRight = centerContour(glyphPaths[avgX(glyphPaths[0]) < avgX(glyphPaths[1]) ? 1 : 0]);
let glyphMaxDev = 0;
for (let i = 0; i < gLeft.length; i++) {
  glyphMaxDev = Math.max(glyphMaxDev, Math.abs(gLeft[i].x - gRight[i].x), Math.abs(gLeft[i].y - gRight[i].y));
}
assert.ok(glyphMaxDev > 0.05, "each glyph must vary independently");

// deterministic and reroll-varying
const glyphVaryPlot2 = new SourcePlot();
glyphVaryPlot2.text("HI", 0, 0, { size: 10, font: twoGlyphFont, glyphJitter: 0.7, wobble: 0, simplify: 0, minSegmentLength: 0 });
assert.equal(JSON.stringify(glyphVaryPlot2.get("hp_1").paths), JSON.stringify(glyphPaths));
glyphVaryPlot.reroll(glyphVaryId);
assert.notEqual(JSON.stringify(glyphVaryPlot.get(glyphVaryId).paths), JSON.stringify(glyphPaths));

// glyphJitter: 0 opts out - the two identical squares stay identical
const noJitterPlot = new SourcePlot();
const noJitterId = noJitterPlot.text("HI", 0, 0, { size: 10, font: twoGlyphFont, glyphJitter: 0, simplify: 0, minSegmentLength: 0 });
const noJitterPaths = noJitterPlot.get(noJitterId).paths;
const njLeft = centerContour(noJitterPaths[0]);
const njRight = centerContour(noJitterPaths[1]);
let noJitterMaxDev = 0;
for (let i = 0; i < njLeft.length; i++) {
  noJitterMaxDev = Math.max(noJitterMaxDev, Math.abs(njLeft[i].x - njRight[i].x), Math.abs(njLeft[i].y - njRight[i].y));
}
assert.ok(noJitterMaxDev < 1e-9, "without jitter identical glyphs stay identical");

// --- asemic gesture generator ----------------------------------------------
const asemicPlot = new SourcePlot({ seed: 3 });
const asemicId = asemicPlot.asemic(0, 0, 120, 80, { loops: 5 });
assert.ok(asemicPlot.get(asemicId).generated.length > 0, "asemic produces traces");
assert.equal(asemicPlot.get(asemicId).type, "path");
const asemicPlot2 = new SourcePlot({ seed: 3 });
asemicPlot2.asemic(0, 0, 120, 80, { loops: 5 });
assert.equal(JSON.stringify(asemicPlot2.get("hp_1").generated), JSON.stringify(asemicPlot.get(asemicId).generated));
assert.throws(() => new SourcePlot().asemic(0, 0, Infinity, 10), /finite/);

// --- text fields: letters() and symbols() ----------------------------------
const fieldPlot = new SourcePlot({ seed: 6 });
const letterIds = fieldPlot.letters("RUB OUT THE WORD", 10, 10, 300, 120, { size: 12 });
assert.ok(letterIds.length > 1, "letters() emits multiple rows");
assert.equal(fieldPlot.get(letterIds[0]).type, "text");
const symbolIds = fieldPlot.symbols(10, 140, 300, 60, { size: 11, set: "+#/" });
assert.ok(symbolIds.length > 1, "symbols() emits multiple rows");
const fieldPlot2 = new SourcePlot({ seed: 6 });
fieldPlot2.letters("RUB OUT THE WORD", 10, 10, 300, 120, { size: 12 });
assert.equal(JSON.stringify(fieldPlot2.get(letterIds[0]).generated), JSON.stringify(fieldPlot.get(letterIds[0]).generated));
assert.throws(() => new SourcePlot().letters("", 0, 0, 10, 10), /at least one letter/);
assert.throws(() => new SourcePlot().symbols(0, 0, 0, 10), /positive w, h/);

// --- grid() modular frame ---------------------------------------------------
const gridPlot = new SourcePlot({ seed: 7 });
const gridCells = gridPlot.grid(0, 0, 300, 200, 3, 2, { gap: 4 });
assert.equal(gridCells.length, 6, "grid returns cols*rows cells");
assert.equal(gridCells[0].w, 300 / 3 - 8);
assert.equal(gridCells[5].col, 2);
assert.equal(gridCells[5].row, 1);
assert.ok(gridPlot.shapes.length >= 7, "grid draws outer + cell frames");
assert.throws(() => new SourcePlot().grid(0, 0, 10, 10, 0, 2), /greater than zero/);
assert.throws(() => new SourcePlot().grid(0, 0, 10, 10, 2.5, 2), /whole number/);
const gridNoCells = new SourcePlot().grid(0, 0, 100, 100, 2, 2, { cells: false, outer: false });
assert.equal(gridNoCells.length, 4);

// cross-hatch fill produces more lines than single hatch
const hatchOnly = new SourcePlot({ seed: 9 });
hatchOnly.rect(0, 0, 80, 60, { fill: "hatch", hatchSpacing: 5, wobble: 0, simplify: 0, minSegmentLength: 0 });
const crossOnly = new SourcePlot({ seed: 9 });
crossOnly.rect(0, 0, 80, 60, { fill: "cross", hatchSpacing: 5, wobble: 0, simplify: 0, minSegmentLength: 0 });
assert.ok(crossOnly.stats().fillPaths > hatchOnly.stats().fillPaths, "cross fill adds a second pass");

// fill validation
assert.throws(() => new SourcePlot().rect(0, 0, 10, 10, { fill: "solid" }), /fill must be one of/);
assert.throws(() => new SourcePlot().rect(0, 0, 10, 10, { fill: "hatch", hatchSpacing: 0.1 }), /hatchSpacing must be at least/);
assert.throws(() => new SourcePlot().rect(0, 0, 10, 2000, { fill: "hatch", hatchSpacing: 0.25 }), /hatch lines/);

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
  glyphJitter: 0,
  simplify: 0,
  minSegmentLength: 0
});
const p5V2Shape = p5V2Plot.get(p5V2Id);
assert.equal(p5V2Shape.bounds.width, 100);
assert.equal(p5V2Shape.bounds.height, 40);
assert.equal(p5Pushes, 1);
assert.equal(p5Pops, 1);

// --- rub(): the decay intent verb ------------------------------------------
function buildRub(Plot) {
  const plot = new Plot({ seed: 1960, width: 520, height: 620 });
  const ids = plot.rub("FIRST TRACE", 46, 248);
  return { plot, ids };
}
const rubA = buildRub(SourcePlot);
const rubB = buildRub(SourcePlot);
const rubMin = buildRub(MinPlot);
assert.equal(rubA.ids.length, 6, "rub default = 3 stages + 3 tangles");
assert.equal(
  JSON.stringify(rubA.ids.map((id) => rubA.plot.get(id).type)),
  JSON.stringify(["text", "text", "text", "path", "path", "path"])
);
// deterministic, and identical between source and min build
const rubJSON = JSON.stringify(rubA.ids.map((id) => rubA.plot.get(id).generated));
assert.equal(JSON.stringify(rubB.ids.map((id) => rubB.plot.get(id).generated)), rubJSON);
assert.equal(JSON.stringify(rubMin.ids.map((id) => rubMin.plot.get(id).generated)), rubJSON);
// every copy is addressable and can be frozen on its own
assert.ok(rubA.plot.get(rubA.ids[0]), "rub id is addressable");
assert.ok(rubA.plot.freeze(rubA.ids[3]), "an individual rub trace can be frozen");
// decay 0 leaves the word unburied (the three copies, no asemic tail)
assert.equal(new SourcePlot({ seed: 1960 }).rub("X", 10, 10, { decay: 0 }).length, 3);
// tail:false opts out of burial
assert.equal(new SourcePlot({ seed: 3 }).rub("X", 0, 0, { tail: false }).length, 3);
// custom stages drive the copy count; verbs are validated
assert.equal(new SourcePlot({ seed: 4 }).rub("X", 0, 0, { stages: [{ verb: "text" }], tail: false }).length, 1);
assert.throws(() => new SourcePlot().rub("X", 0, 0, { stages: [{ verb: "circle" }] }), /must be "text" or "textCutup"/);
assert.throws(() => new SourcePlot().rub("X", 0, 0, { stages: [] }), /non-empty array/);
assert.throws(() => new SourcePlot().rub("X", Infinity, 0), /finite number/);

// --- missing-addon stubs: fail loudly and name the file to load -----------------
for (const Plot of [SourcePlot, MinPlot]) {
  assert.throws(() => new Plot().chant("CUT", 0, 0), /requires the optional addon p5\.gysin\.text\.js/);
  assert.throws(() => new Plot().weave(["CUT", "PASTE"], 0, 0), /requires the optional addon p5\.gysin\.text\.js/);
  assert.throws(() => new Plot().underwood("CUT", 0, 0), /requires the optional addon p5\.gysin\.underwood\.js/);
  assert.ok(Plot.prototype.chant.gysinAddonStub, "chant stub carries the marker the addon checks");
  assert.ok(Plot.prototype.weave.gysinAddonStub, "weave stub carries the marker the addon checks");
  assert.equal(typeof Plot.prototype.splice, "undefined", "the pre-release splice verb has no core stub");
  assert.ok(Plot.prototype.underwood.gysinAddonStub, "underwood stub carries the marker the addon checks");
}

// --- underwood(): period single-stroke typewriter (optional module) -------------
function loadCoreWithType(coreFile, typeFile) {
  const context = { console };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(coreFile, "utf8"), context, { filename: coreFile });
  vm.runInContext(fs.readFileSync(typeFile, "utf8"), context, { filename: typeFile });
  assert.equal(typeof context.GysinPlot.prototype.underwood, "function");
  assert.ok(!context.GysinPlot.prototype.underwood.gysinAddonStub, "addon replaced the core stub");
  assert.equal(typeof context.GysinUnderwood, "object");
  return context.GysinPlot;
}
const TypePlot = loadCoreWithType(
  path.join(__dirname, "..", "p5.gysin.js"),
  path.join(__dirname, "..", "p5.gysin.underwood.js")
);
const TypeMinPlot = loadCoreWithType(
  path.join(__dirname, "..", "p5.gysin.min.js"),
  path.join(__dirname, "..", "p5.gysin.underwood.min.js")
);
function buildType(Plot, opts) {
  const plot = new Plot({ seed: 1961, width: 600, height: 300 });
  const ids = plot.underwood("RUB OUT", 40, 80, opts || { size: 20 });
  return { plot, ids };
}
const typeA = buildType(TypePlot);
const typeB = buildType(TypePlot);
const typeMin = buildType(TypeMinPlot);
assert.ok(typeA.ids.length > 0, "underwood() emits shapes");
// deterministic, and identical between source and min build
const typeJSON = JSON.stringify(typeA.ids.map((id) => typeA.plot.get(id).generated));
assert.equal(JSON.stringify(typeB.ids.map((id) => typeB.plot.get(id).generated)), typeJSON);
assert.equal(JSON.stringify(typeMin.ids.map((id) => typeMin.plot.get(id).generated)), typeJSON);
// bold overstrikes every glyph: more shapes than the mechanically clean default
const typeClean = new TypePlot({ seed: 1961 }).underwood("RUB OUT", 40, 80, { size: 20, wear: 0 });
const typeBold = new TypePlot({ seed: 1961 }).underwood("RUB OUT", 40, 80, { size: 20, wear: 0, bold: true });
assert.ok(typeBold.length > typeClean.length, "bold doubles every strike");
// underline draws the underscore rule(s) on top of the clean glyphs
const typeUnderline = new TypePlot({ seed: 1961 }).underwood("RUB", 40, 80, { size: 20, wear: 0, underline: 2 });
const typeNoRule = new TypePlot({ seed: 1961 }).underwood("RUB", 40, 80, { size: 20, wear: 0 });
assert.equal(typeUnderline.length - typeNoRule.length, 2, "underline:2 adds two rules");
// underwood passes the layer option through to every emitted path
const layeredTypePlot = new TypePlot({ seed: 1961 });
const layeredTypeIds = layeredTypePlot.underwood("+#&%= /", 10, 40, { size: 18, wear: 0, layer: "operators" });
assert.ok(layeredTypeIds.length > 0, "Underwood emits real ASCII operator paths");
assert.ok(layeredTypeIds.every((id) => layeredTypePlot.get(id).exportSettings.layer === "operators"), "Underwood preserves export layers");
assert.throws(() => new TypePlot().underwood("X", 0, 0, { size: 0 }), /size must be greater than zero/);
assert.throws(() => new TypePlot().underwood("X", Infinity, 0), /finite number/);

// --- chant: the permutation poem as one intent verb -------------------------
function loadCombined(coreFile, textFile) {
  const context = { console };
  context.globalThis = context;
  vm.createContext(context);
  for (const filename of [coreFile, textFile]) {
    const absolute = path.join(__dirname, "..", filename);
    vm.runInContext(fs.readFileSync(absolute, "utf8"), context, { filename: absolute });
  }
  assert.equal(typeof context.GysinPlot.prototype.chant, "function");
  assert.ok(!context.GysinPlot.prototype.chant.gysinAddonStub, "addon replaced the core stub");
  assert.equal(typeof context.GysinPlot.prototype.weave, "function");
  assert.ok(!context.GysinPlot.prototype.weave.gysinAddonStub, "addon replaced the core stub");
  assert.equal(typeof context.GysinPlot.prototype.splice, "undefined", "the pre-release splice verb has no addon alias");
  return context;
}

const chantSource = loadCombined("p5.gysin.js", "p5.gysin.text.js");
const chantMin = loadCombined("p5.gysin.min.js", "p5.gysin.text.min.js");

function buildChant(ctx, options) {
  const plot = new ctx.GysinPlot({ seed: 1919, width: 560, height: 560 });
  const ids = plot.chant("CUT ARRANGE GLUE", 60, 90, options);
  return { ids, svg: plot.exportSVG({ width: 560, height: 560 }) };
}

const chantDefault = buildChant(chantSource);
assert.equal(chantDefault.ids.length, 5, "chant draws five lines by default");
assert.equal(chantDefault.svg, buildChant(chantSource).svg, "chant is deterministic");
assert.equal(chantDefault.svg, buildChant(chantMin).svg, "chant min build matches source");

// chant() keeps sentence order visible: its default is exactly permute + text
{
  const manual = new chantSource.GysinPlot({ seed: 1919, width: 560, height: 560 });
  const rows = chantSource.GysinText.permute("CUT ARRANGE GLUE", { seed: 1919, limit: 5, order: "walk" });
  rows.forEach((row, i) => {
    manual.text(row, 60, 90 + i * 90, { size: 34 });
  });
  const verb = buildChant(chantSource, { leading: 90 });
  assert.equal(verb.svg, manual.exportSVG({ width: 560, height: 560 }), "chant equals the manual permute + text recipe");
}

// Explicit cut controls retain the earlier advanced recipe without making it
// the default sentence treatment; ordinary material options still pass through.
const chantFlat = buildChant(chantSource, { descent: 0, breathe: 0.5 });
assert.equal(chantFlat.ids.length, 5);
assert.notEqual(chantFlat.svg, chantDefault.svg, "an explicit cut control and material option change the trace");
{
  const plot = new chantSource.GysinPlot({ seed: 1919, width: 560, height: 560 });
  const ids = plot.chant("CUT ARRANGE GLUE", 60, 90, { slices: 5 });
  assert.ok(ids.every((id) => plot.get(id).type === "textCutup"), "explicit slices opt chant into the rare surface effect");
}
assert.throws(() => buildChant(chantSource, { lines: 0 }), /from 1 through 1000/);
assert.throws(() => buildChant(chantSource, { order: "grammar" }), /order must be one of/);
assert.throws(() => chantSource.GysinPlot.prototype.chant.call({}, "A B", 0, 0), /needs a GysinPlot/);

// weave() draws readable text lines, preserves provenance in JSON, and stays
// compatible with the ordinary addressing contract.
function buildWeave(ctx, options) {
  const plot = new ctx.GysinPlot({ seed: 1960, width: 700, height: 420 });
  const ids = plot.weave(weaveSources, 54, 90, Object.assign({
    size: 25,
    leading: 58,
    breathe: 0.35,
    layer: "third"
  }, options));
  return { plot, ids };
}

const weavePlotA = buildWeave(chantSource);
const weavePlotB = buildWeave(chantSource);
const weavePlotMin = buildWeave(chantMin);
assert.equal(weavePlotA.ids.length, 4);
assert.ok(weavePlotA.ids.every((id) => weavePlotA.plot.get(id).type === "text"));
assert.equal(
  JSON.stringify(weavePlotA.ids.map((id) => weavePlotA.plot.get(id).generated)),
  JSON.stringify(weavePlotB.ids.map((id) => weavePlotB.plot.get(id).generated)),
  "plot.weave is deterministic"
);
assert.equal(
  JSON.stringify(weavePlotA.ids.map((id) => weavePlotA.plot.get(id).generated)),
  JSON.stringify(weavePlotMin.ids.map((id) => weavePlotMin.plot.get(id).generated)),
  "plot.weave min build matches source"
);
for (const id of weavePlotA.ids) {
  const shape = weavePlotA.plot.get(id);
  assert.equal(shape.exportSettings.layer, "third");
  assert.equal(shape.params.weave.fragments.length, 3);
  assert.ok(shape.params.weave.fragments.every((fragment) => fragment.source));
}
const detachedWeave = weavePlotA.plot.get(weavePlotA.ids[0]);
const originalWeaveSource = detachedWeave.params.weave.fragments[0].source;
detachedWeave.params.weave.fragments[0].source = "changed outside";
assert.equal(
  weavePlotA.plot.get(weavePlotA.ids[0]).params.weave.fragments[0].source,
  originalWeaveSource,
  "weave provenance in snapshots is detached"
);
const weaveJSON = JSON.parse(weavePlotA.plot.exportJSON());
assert.equal(weaveJSON.shapes[0].params.weave.unit, "phrase");
assert.equal(weaveJSON.shapes[0].params.weave.fragments[0].source.length > 0, true);
assert.match(weavePlotA.plot.exportSVG(), /data-shape-id=/);
assert.match(weavePlotA.plot.exportHPGL(), /PD/);

function rightmostWeaveInk(shape) {
  let maxX = shape.bounds ? shape.bounds.maxX : -Infinity;
  for (const trace of shape.generated) {
    for (const point of trace.points) maxX = Math.max(maxX, point.x);
  }
  return maxX;
}

const fittedWeave = buildWeave(chantSource, { maxWidth: 260 });
const fittedWeaveMin = buildWeave(chantMin, { maxWidth: 260 });
const fittedSizes = fittedWeave.ids.map((id) => fittedWeave.plot.get(id).params.size);
assert.equal(new Set(fittedSizes).size, 1, "weave maxWidth gives every line one shared size");
assert.ok(fittedSizes[0] < 25, "weave maxWidth shrinks an oversized group");
for (const id of fittedWeave.ids) {
  assert.ok(
    rightmostWeaveInk(fittedWeave.plot.get(id)) <= 54 + 260,
    "weave maxWidth keeps every line inside the available width"
  );
}
assert.equal(
  JSON.stringify(fittedWeave.ids.map((id) => fittedWeave.plot.get(id).generated)),
  JSON.stringify(fittedWeaveMin.ids.map((id) => fittedWeaveMin.plot.get(id).generated)),
  "fitted plot.weave min build matches source"
);
for (let reroll = 0; reroll < 20; reroll++) {
  fittedWeave.plot.reroll();
  for (const id of fittedWeave.ids) {
    assert.ok(
      rightmostWeaveInk(fittedWeave.plot.get(id)) <= 54 + 260,
      "fitted weave stays inside maxWidth after reroll"
    );
  }
}

const roomyWeave = buildWeave(chantSource, { maxWidth: 2000 });
assert.ok(
  roomyWeave.ids.every((id) => roomyWeave.plot.get(id).params.size === 25),
  "weave maxWidth never enlarges text"
);
assert.equal(
  JSON.stringify(roomyWeave.ids.map((id) => roomyWeave.plot.get(id).generated)),
  JSON.stringify(weavePlotA.ids.map((id) => weavePlotA.plot.get(id).generated)),
  "a roomy maxWidth leaves the existing weave byte-identical"
);

const scalableOutlineFont = {
  textToPoints() { return []; },
  font: {
    getPath(value, x, y, size) {
      return {
        commands: [
          { type: "M", x, y },
          { type: "L", x: x + String(value).length * size * 0.6, y }
        ]
      };
    }
  }
};
const fittedOutlineWeave = buildWeave(chantSource, {
  maxWidth: 220,
  font: scalableOutlineFont,
  breathe: 0,
  glyphJitter: 0
});
assert.equal(
  new Set(fittedOutlineWeave.ids.map((id) => fittedOutlineWeave.plot.get(id).params.size)).size,
  1,
  "weave maxWidth shares one size with an outline font"
);
assert.ok(
  fittedOutlineWeave.ids.every((id) => rightmostWeaveInk(fittedOutlineWeave.plot.get(id)) <= 54 + 220),
  "weave maxWidth measures the supplied outline vectors"
);

const frozenWeaveId = weavePlotA.ids[0];
const movingWeaveId = weavePlotA.ids[1];
const frozenWeaveBefore = JSON.stringify(weavePlotA.plot.get(frozenWeaveId).generated);
const movingWeaveBefore = JSON.stringify(weavePlotA.plot.get(movingWeaveId).generated);
const frozenWeaveText = weavePlotA.plot.get(frozenWeaveId).params.value;
const movingWeaveText = weavePlotA.plot.get(movingWeaveId).params.value;
weavePlotA.plot.freeze(frozenWeaveId);
weavePlotA.plot.reroll();
assert.equal(JSON.stringify(weavePlotA.plot.get(frozenWeaveId).generated), frozenWeaveBefore);
assert.notEqual(JSON.stringify(weavePlotA.plot.get(movingWeaveId).generated), movingWeaveBefore);
assert.equal(weavePlotA.plot.get(frozenWeaveId).params.value, frozenWeaveText);
assert.equal(weavePlotA.plot.get(movingWeaveId).params.value, movingWeaveText);
assert.throws(() => buildWeave(chantSource, { size: 0 }), /size must be greater than zero/);
assert.throws(() => buildWeave(chantSource, { leading: 0 }), /leading must be greater than zero/);
assert.throws(() => buildWeave(chantSource, { maxWidth: 0 }), /maxWidth must be greater than zero/);
assert.throws(() => chantSource.GysinPlot.prototype.weave.call({}, weaveSources, 0, 0), /needs a GysinPlot/);

// The turned sheet: angle/pivot and the lattice() verb stay deterministic and
// identical across the source and min builds; angle 0 stays byte-identical.
function buildTurned(Plot) {
  const plot = new Plot({ seed: 1959, width: 400, height: 400 });
  const lineId = plot.line(100, 100, 200, 100, { angle: 90, pivot: { x: 100, y: 100 }, wobble: 0 });
  const latticeIds = plot.lattice("RUB OUT THE WORD", 40, 40, 320, 320, { size: 16 });
  return { plot, lineId, latticeIds };
}

const turnedSource = buildTurned(SourcePlot);
const turnedMin = buildTurned(MinPlot);
const turnedEnd = turnedSource.plot.get(turnedSource.lineId).paths[0].slice(-1)[0];
assert.ok(Math.abs(turnedEnd.x - 100) < 1e-9 && Math.abs(turnedEnd.y - 200) < 1e-9);
assert.ok(turnedSource.latticeIds.length > 2);
// JSON comparison: each vm context has its own Object.prototype, so
// deepStrictEqual would reject structurally identical points across builds.
assert.equal(
  JSON.stringify(turnedSource.plot.get(turnedSource.latticeIds[3]).paths),
  JSON.stringify(turnedMin.plot.get(turnedMin.latticeIds[3]).paths)
);

const flatA = new SourcePlot({ seed: 7, width: 200, height: 200 });
const flatB = new SourcePlot({ seed: 7, width: 200, height: 200 });
const flatIdA = flatA.text("TURN", 40, 60, { size: 20 });
const flatIdB = flatB.text("TURN", 40, 60, { size: 20, angle: 0 });
assert.deepEqual(flatA.get(flatIdA).paths, flatB.get(flatIdB).paths);

assert.throws(() => flatA.text("X", 0, 0, { pivot: "links" }), /pivot/);
assert.throws(() => flatA.lattice("  ", 0, 0, 10, 10), /non-empty/);

const root = path.join(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(
  path.join(root, "docs", "p5.gysin.manifest.json"),
  "utf8"
));
const enterPage = fs.readFileSync(path.join(root, "index.html"), "utf8");
const showcasePage = fs.readFileSync(path.join(root, "docs", "openings.html"), "utf8");
const readmePage = fs.readFileSync(path.join(root, "README.md"), "utf8");
const collagePage = fs.readFileSync(path.join(root, "docs", "collage", "index.html"), "utf8");
const systemPage = fs.readFileSync(path.join(root, "docs", "system.html"), "utf8");
const visionPage = fs.readFileSync(path.join(root, "docs", "vision.html"), "utf8");
const plotterContract = fs.readFileSync(path.join(root, "docs", "plotter-export-contract.md"), "utf8");
const releaseNotes110 = fs.readFileSync(path.join(root, "docs", "release-notes-1.1.0.md"), "utf8");
const releaseNotes120 = fs.readFileSync(path.join(root, "docs", "release-notes-1.2.0.md"), "utf8");
const collageComposition = fs.readFileSync(path.join(root, "docs", "collage", "composition.js"), "utf8");
const collageCuration = fs.readFileSync(path.join(root, "docs", "collage", "curation.js"), "utf8");
const siteStyle = fs.readFileSync(path.join(root, "docs", "style.css"), "utf8");
const examplesRedirectPage = fs.readFileSync(path.join(root, "docs", "examples.html"), "utf8");
const examplesDir = path.join(root, "examples");
const sharedCompositions = new Map([
  ["gysin_demo", "slicedText"],
  ["permutation_poem", "permutationPoem"],
  ["weave", "weave"]
]);
const sharedCompositionVerbs = new Map([
  ["gysin_demo", "textCutup"],
  ["permutation_poem", "chant"],
  ["weave", "weave"]
]);
const exampleDirs = fs.readdirSync(examplesDir, { withFileTypes: true })
  .filter(function(entry) {
    return entry.isDirectory();
  })
  .map(function(entry) {
    return entry.name;
  })
  .sort();

assert.deepEqual(manifest.examples, exampleDirs);
assert.match(readmePage, /built-in presets are `"A5"`, `"A4"`, `"A3"`, and `"A2"`/i);
assert.match(systemPage, /Built-in pages[\s\S]*<code>"A5"<\/code>[\s\S]*<code>"A2"<\/code>/);
assert.match(plotterContract, /## Normale ISO-paginaroute[\s\S]*page: "A3"/);
assert.match(releaseNotes110, /requires an explicit page in `mm`, `cm`, or `in`/);
assert.doesNotMatch(releaseNotes110, /A5-A2|page presets/i);
assert.equal(manifest.version, "1.2.0");
assert.match(releaseNotes120, /`page: "A5"`[\s\S]*`page: "A2"`/);
assert.match(releaseNotes120, /exportPlotterSVG\(\)[\s\S]*exportHPGL\(\)[\s\S]*stats\(\)/);
assert.match(releaseNotes120, /p5\.gysin@v1\.2\.0\/p5\.gysin\.min\.js/);
assert.ok(manifest.added_apis.some((entry) =>
  entry.name === "page: A5|A4|A3|A2" &&
  entry.added_in === "1.2.0" &&
  entry.status === "stable"
));
assert.match(examplesRedirectPage, /href="openings\.html#examples"/);
assert.match(examplesRedirectPage, /location\.replace\("openings\.html#examples"\)/);
assert.match(enterPage, /<section id="hero">/);
assert.match(enterPage, /<html lang="en" class="enter-page">/);
assert.match(siteStyle, /html\.enter-page\s*\{[^}]*overflow-y:\s*scroll;/s);
assert.match(enterPage, /href="docs\/openings\.html#studies" class="cta-btn">Enter the three libraries<\/a>/);
assert.match(enterPage, /location\.replace\("docs\/openings\.html" \+ location\.hash\)/);
assert.match(enterPage, /<script src="docs\/sketch\.js\?v=word-sentence-1"><\/script>/);
assert.doesNotMatch(enterPage, /id="(?:origin-note|studies|examples|lib-core|lib-text|lib-underwood)"/);
assert.doesNotMatch(enterPage, /examples\/(?:gysin_demo|permutation_poem|weave|plotter_export)\/composition\.js/);
assert.match(showcasePage, /<title>Openings \| p5\.gysin<\/title>/);
assert.match(showcasePage, /https:\/\/seb-prjcts-be\.github\.io\/p5\.gysin\/docs\/openings\.html/);
assert.match(showcasePage, /<a href="openings\.html" class="active">Openings<\/a>/);
assert.match(showcasePage, /<script src="\.\.\/p5\.gysin\.min\.js\?v=word-sentence-1"><\/script>/);
assert.match(showcasePage, /data-page="\.\.\/examples\/first_trace\/"/);
assert.doesNotMatch(showcasePage, /<section id="hero">|docs\/sketch\.js/);
assert.match(showcasePage, /<\/nav>\s*<section id="studies"/);
assert.doesNotMatch(showcasePage, /origin-note|origin-sheet|pull-quote|Writing is fifty years behind painting/);
assert.doesNotMatch(siteStyle, /\.(?:origin-note|origin-sheet|pull-quote)\b/);
assert.match(visionPage, /Gysin&rsquo;s sentence &ldquo;Writing is fifty years behind painting&rdquo;/);
assert.doesNotMatch(visionPage, /quotation on Enter/);
assert.match(showcasePage, /<strong>Word<\/strong><small>Isolate it\. Enlarge it\. Wear it\.<\/small>/);
assert.match(showcasePage, /<strong>Trace<\/strong><small>Parameters, contours, paths\.<\/small>/);
assert.match(showcasePage, /<strong>Ink<\/strong><small>Additive return passages\.<\/small>/);
assert.match(showcasePage, /<strong>Page<\/strong><small>Millimetres, pens, layers, export\.<\/small>/);
assert.match(showcasePage, /<strong>Sentence<\/strong><small>Order, sequence, source\.<\/small>/);
assert.match(showcasePage, /<strong>Typewriter<\/strong><small>Fixed pitch, line height, double strike\.<\/small>/);
assert.match(showcasePage, /<strong>Surface<\/strong><small>A late disturbance, used sparingly\.<\/small>/);
assert.doesNotMatch(showcasePage, /Sentence \/ page|Voice needs measure and margin/);
assert.match(showcasePage, /<div class="work-band work-band-word">/);
assert.match(
  siteStyle,
  /\.work-band-word \.work-band-head\s*\{[^}]*border-top:\s*0;/s,
  "the Word heading has no top rule"
);
assert.match(
  siteStyle,
  /\.work-band-head strong\s*\{[^}]*color:\s*var\(--red\);/s,
  "every example category heading reuses the title red"
);
const coreSheetStart = showcasePage.indexOf('id="lib-core"');
const coreSheetEnd = showcasePage.indexOf('id="plate-first-trace"', coreSheetStart);
const coreSheet = showcasePage.slice(coreSheetStart, coreSheetEnd);
assert.ok(
  coreSheet.indexOf("<strong>Word</strong>") <
    coreSheet.indexOf("<strong>Trace</strong>") &&
    coreSheet.indexOf("<strong>Trace</strong>") <
      coreSheet.indexOf("<strong>Ink</strong>") &&
    coreSheet.indexOf("<strong>Ink</strong>") <
      coreSheet.indexOf("<strong>Page</strong>") &&
    coreSheet.indexOf("<strong>Page</strong>") <
      coreSheet.indexOf("<strong>Surface</strong>"),
  "the core examples progress from word through trace, ink and page to the late surface gesture"
);
assert.match(
  siteStyle,
  /\.cs-tile\.active\s*\{[^}]*border:\s*2px solid var\(--ink\);[^}]*background:\s*rgba\(251, 250, 245, 0\.56\);/s,
  "the active work remains a framed paper tile"
);

const collageChips = collagePage.match(/<li><a href="#[^"]+">\d{2} /g) || [];
const collageModules = collagePage.match(/<section class="[^"]*ce-module[^"]*" id="[^"]+">/g) || [];
const collageParagraphs = collagePage.match(/class="section-desc"/g) || [];
const collagePreviews = collagePage.match(/class="ex-preview"/g) || [];
const collageCodeBlocks = collagePage.match(/class="ex-code-block"/g) || [];
assert.equal(collageChips.length, 12);
assert.equal(collageModules.length, 12);
assert.equal(collageParagraphs.length, 12);
assert.equal(collagePreviews.length, 10);
assert.equal(collageCodeBlocks.length, 10);
assert.doesNotMatch(collagePage, /ce-thesis|ce-strip|ce-step|ce-demo|section-dark/);
assert.doesNotMatch(siteStyle, /\.ce-(?:thesis|strip|step|demo|plot-specimen)\b/);
assert.doesNotMatch(siteStyle, /\.ce-module \.section-tag/);
assert.match(collagePage, /<li><a href="#overview">00 whole poster<\/a><\/li>/);
assert.match(collagePage, /<li><a href="#canvas">01 canvas<\/a><\/li>/);
assert.match(collagePage, /<li><a href="#layers">02 layers<\/a><\/li>/);
assert.match(collagePage, /<li><a href="#paper">10 paper<\/a><\/li>/);
assert.match(collagePage, /<li><a href="#full">11 export<\/a><\/li>/);
assert.ok(
  collagePage.indexOf('id="overview"') < collagePage.indexOf('id="canvas"') &&
    collagePage.indexOf('id="paper"') < collagePage.indexOf('id="full"'),
  "Collage begins with the canonical composition and ends with physical export"
);
assert.match(collagePage, /id="m-overview" class="ce-canvas" data-step="all"/);
assert.match(collagePage, /id="m-full" class="ce-canvas" data-step="all"/);
assert.match(
  collagePage,
  /<script src="\.\.\/\.\.\/examples\/plotter_export\/composition\.js\?v=collage-layered-poster"><\/script>\s*<script src="composition\.js\?v=collage-layered-poster"><\/script>\s*<script src="curation\.js\?v=collage-layered-poster"><\/script>/
);
assert.match(collagePage, /A5 &middot; 148 &times; 210 mm/);
assert.match(collagePage, /A4 &middot; 210 &times; 297 mm/);
assert.match(collagePage, /A3 &middot; 297 &times; 420 mm/);
assert.match(collagePage, /A2 &middot; 420 &times; 594 mm/);
assert.match(collagePage, /Three JavaScript strings set the paper, black ink and red ink on screen\./);
assert.match(collagePage, /<code>page: "A4"<\/code> chooses a physical export preset/);
assert.match(collagePage, /black layer &rarr; pen 1 &middot; red layer &rarr; pen 2/);
assert.match(collagePage, /their ink and width remain physical\./);
assert.match(collagePage, /<pre class="ex-code-block"><code class="language-javascript">const PAPER/);
assert.doesNotMatch(siteStyle, /\.ce-colour-specimen/);
assert.match(systemPage, /<section class="guide-block" id="export">/);
assert.match(systemPage, /show every layer beginning with <code>1<\/code>, install pen 1 and plot; then hide those layers and repeat for <code>2<\/code>, <code>3<\/code>, and so on/);
assert.match(systemPage, /<h3 id="hpgl">HPGL<\/h3>/);
assert.match(systemPage, /plot\.exportHPGL\(options\)[\s\S]*plot\.downloadHPGL\(filename, options\)/);
assert.match(systemPage, /const hpgl = plot\.exportHPGL\(hpglOptions\);[\s\S]*plot\.downloadHPGL\("drawing\.hpgl", hpglOptions\);/);
assert.match(systemPage, /For physical output, pass both an explicit physical page and <code>optimize: true<\/code>/);
assert.match(systemPage, /without <code>page<\/code> it falls back to the plot or canvas dimensions[\s\S]*without <code>optimize: true<\/code> it preserves drawing order/);
assert.match(systemPage, /A layer match wins over a colour match; an unmapped trace uses pen 1/);
for (const option of ["page", "optimize", "penMap", "speed", "scale", "offsetX", "offsetY", "maxPointsPerCommand", "tool"]) {
  assert.match(systemPage, new RegExp(`<li><code>${option}</code>:`), `System documents HPGL ${option}`);
}
assert.match(systemPage, /HPGL stores coordinates, pen selections, and optional speed—not SVG colours, opacity, varying stroke width, layer names, or page metadata/);
assert.match(systemPage, /sending that file to a specific machine remains the responsibility of the plotter software or controller/);

const canonicalPosterSource = fs.readFileSync(
  path.join(root, "examples", "plotter_export", "composition.js"),
  "utf8"
);
for (const verb of ["rect", "line", "symbols", "circle", "underwood", "asemic", "text"]) {
  assert.match(canonicalPosterSource, new RegExp(`plot\\.${verb}\\(`), `whole sheet contains ${verb}()`);
}
assert.match(canonicalPosterSource, /const WIDTH = 720;/);
assert.match(canonicalPosterSource, /const HEIGHT = 900;/);
assert.match(canonicalPosterSource, /const PEN_MAP = \{ black: 1, red: 2 \}/);
assert.match(canonicalPosterSource, /frames: addFrames,[\s\S]*rules: addRules,[\s\S]*symbols: addSymbols,[\s\S]*ring: addRing,[\s\S]*hand: addHand,[\s\S]*words: addWords,[\s\S]*write: addWrite/);
assert.match(collageComposition, /global\.GysinPoster = global\.GysinWorks\.plotterPoster/);
assert.doesNotMatch(collageComposition, /plot\.(?:rect|line|symbols|circle|underwood|asemic|text)\(/);
assert.match(collageCuration, /record\.work = poster\.build\(\{/);
assert.match(collageCuration, /record\.p\.scale\(record\.p\.width \/ poster\.width\)/);
assert.match(collageCuration, /const work = poster\.build\(\{ seed: poster\.seed \}\);/);
assert.match(collageCuration, /work\.plot\.downloadPlotterSVG\(`gysin-remembers-\$\{state\.format\.toLowerCase\(\)\}\.svg`, \{/);
assert.match(collageCuration, /page: state\.format,[\s\S]*penMap: poster\.penMap/);
assert.doesNotMatch(collageCuration, /record\.work\.plot\.downloadPlotterSVG/);

const collageContext = { console };
collageContext.globalThis = collageContext;
vm.createContext(collageContext);
for (const filename of [
  "p5.gysin.js",
  "p5.gysin.underwood.js",
  path.join("examples", "plotter_export", "composition.js"),
  path.join("docs", "collage", "composition.js")
]) {
  vm.runInContext(fs.readFileSync(path.join(root, filename), "utf8"), collageContext, { filename });
}
const poster = collageContext.GysinPoster;
assert.equal(poster, collageContext.GysinWorks.plotterPoster);
const posterWork = poster.build({ seed: poster.seed });
const posterSvg = posterWork.plot.exportPlotterSVG({
  page: "A4",
  penMap: poster.penMap
});
const posterLayers = Array.from(posterSvg.matchAll(/inkscape:label="([^"]+)"/g), (match) => match[1]);
assert.deepEqual(posterLayers, ["1 black", "2 red"]);
assert.ok(posterLayers.every((label) => /^[12] /.test(label)));
assert.doesNotMatch(posterSvg, /\s(?:opacity|stroke-width)="(?!0\.1mm)/);
assert.equal(posterWork.plot.shapes.length, 285);
for (const step of poster.steps) {
  assert.ok(poster.build({ step }).plot.shapes.length > 0, `${step} builds an isolated poster step`);
}
assert.match(siteStyle, /body\.chapters #chapter-prev,[\s\S]*bottom: 12px/);

const plotterExportPage = fs.readFileSync(path.join(examplesDir, "plotter_export", "index.html"), "utf8");
const plotterExportSketch = fs.readFileSync(path.join(examplesDir, "plotter_export", "sketch.js"), "utf8");
const plotterExportComposition = fs.readFileSync(
  path.join(examplesDir, "plotter_export", "composition.js"),
  "utf8"
);
assert.match(plotterExportPage, /1 · Canvas style[\s\S]*2 · SVG layers[\s\S]*3 · Physical pens[\s\S]*4 · A5, A4, A3, or A2/);
assert.equal((plotterExportPage.match(/<section class="guide-block">/g) || []).length, 4);
assert.match(plotterExportPage, /<div class="guide-layout">[\s\S]*<section class="guide-block">/);
assert.match(plotterExportPage, /<p><code>PAPER<\/code>/);
assert.match(plotterExportPage, /Colour alone makes no SVG layer/);
assert.match(plotterExportPage, /<code>page: "A4"<\/code> sets the SVG paper, margin and fit/);
assert.match(plotterExportPage, /The 720 × 900 composition stays where it is/);
assert.doesNotMatch(plotterExportPage, /class="demo-step"|demo-source-note|class="demo-code"/);
assert.match(plotterExportPage, /<select id="plot-size">[\s\S]*value="A5">A5 · 148 × 210 mm[\s\S]*value="A4" selected>A4 · 210 × 297 mm[\s\S]*value="A3">A3 · 297 × 420 mm[\s\S]*value="A2">A2 · 420 × 594 mm[\s\S]*<\/select>/);
assert.match(plotterExportPage, /<script src="composition\.js"><\/script>\s*<script src="sketch\.js"><\/script>/);
assert.match(plotterExportComposition, /width: WIDTH,[\s\S]*height: HEIGHT,[\s\S]*style: \{ stroke: INK \},[\s\S]*export: \{ layer: "black" \}/);
assert.match(plotterExportComposition, /plot\.circle\(256, 337, 450, \{[\s\S]*stroke: RED,[\s\S]*layer: "red"/);
assert.match(plotterExportComposition, /plot\.underwood\("REMEMBERS", 82, 360, \{[\s\S]*stroke: RED,[\s\S]*layer: "red"/);
assert.match(plotterExportComposition, /const PEN_MAP = \{ black: 1, red: 2 \}/);
assert.match(plotterExportSketch, /downloadPlotterSVG\([\s\S]*page: format,[\s\S]*penMap: poster\.penMap/);
assert.doesNotMatch(plotterExportSketch, /\b(?:ISO_PAGES|physicalPage|downloadJSON|downloadHPGL|optimize|tool)\b/);
assert.match(showcasePage, /<script src="\.\.\/examples\/plotter_export\/composition\.js"><\/script>/);
assert.match(showcasePage, /GysinWorks\.plotterPoster\.build\(\{ p \}\)/);
assert.match(showcasePage, /data-ratio="1\.25"/);

const plotterPosterContext = { console };
plotterPosterContext.globalThis = plotterPosterContext;
vm.createContext(plotterPosterContext);
for (const filename of [
  "p5.gysin.js",
  "p5.gysin.underwood.js",
  path.join("examples", "plotter_export", "composition.js")
]) {
  vm.runInContext(
    fs.readFileSync(path.join(root, filename), "utf8"),
    plotterPosterContext,
    { filename }
  );
}
const plotterPoster = plotterPosterContext.GysinWorks.plotterPoster.build();
for (const [format, width, height] of [
  ["A5", 148, 210],
  ["A4", 210, 297],
  ["A3", 297, 420],
  ["A2", 420, 594]
]) {
  const svg = plotterPoster.plot.exportPlotterSVG({
    page: format,
    penMap: plotterPoster.penMap
  });
  assert.match(svg, new RegExp(`width="${width}mm" height="${height}mm"`));
  assert.deepEqual(
    Array.from(svg.matchAll(/inkscape:label="([^"]+)"/g), (match) => match[1]),
    ["1 black", "2 red"]
  );
  assert.doesNotMatch(svg, /#f0efe9/i, "canvas paper is not a plotted SVG path");
}

const plotterCalibrationPage = fs.readFileSync(path.join(examplesDir, "plotter_calibration", "index.html"), "utf8");
const plotterCalibrationSketch = fs.readFileSync(path.join(examplesDir, "plotter_calibration", "sketch.js"), "utf8");
assert.match(plotterCalibrationPage, /real pen passes/);
assert.match(plotterCalibrationPage, /downloadPlotterSVG\("calibration\.svg", \{ page: PAGE, penMap: PEN_OF \}\)/);
assert.match(plotterCalibrationSketch, /5 : PEN PASSES · repeat/);
assert.match(plotterCalibrationSketch, /\[1, 2, 3, 4, 5, 6\]/);
assert.match(plotterCalibrationSketch, /wobble 1\.2/);
assert.match(plotterCalibrationSketch, /penMap: PEN_OF/);
assert.match(plotterCalibrationSketch, /downloadPlotterSVG\("p5-gysin-calibration\.svg", EXPORT\)/);
assert.doesNotMatch(plotterCalibrationSketch, /\b(?:alpha|pressure|strokeWeight)\s*:/);
const calibrationPreviewStart = showcasePage.indexOf('makePreview("ex-calibration"');
const calibrationPreviewEnd = showcasePage.indexOf('makePreview("ex-export"', calibrationPreviewStart);
const calibrationPreview = showcasePage.slice(calibrationPreviewStart, calibrationPreviewEnd);
assert.match(calibrationPreview, /repeat: index \+ 1/);
assert.doesNotMatch(calibrationPreview, /\b(?:alpha|pressure|strokeWeight)\s*:/);

for (const name of manifest.examples) {
  assert.ok(fs.existsSync(path.join(examplesDir, name, "index.html")), `${name} index.html`);
  assert.ok(fs.existsSync(path.join(examplesDir, name, "sketch.js")), `${name} sketch.js`);
  assert.match(showcasePage, new RegExp(`href="\\.\\./examples/${name}/"`));
  const sourceFile = sharedCompositions.has(name) ? "composition.js" : "sketch.js";
  assert.match(showcasePage, new RegExp(`href="\\.\\./examples/${name}/${sourceFile.replace(".", "\\.")}"`));
}

for (const [name, workName] of sharedCompositions) {
  const directory = path.join(examplesDir, name);
  const composition = fs.readFileSync(path.join(directory, "composition.js"), "utf8");
  const sketch = fs.readFileSync(path.join(directory, "sketch.js"), "utf8");
  const page = fs.readFileSync(path.join(directory, "index.html"), "utf8");
  const nonBlankLines = composition.split(/\r?\n/).filter((line) => line.trim()).length;
  const verb = sharedCompositionVerbs.get(name);

  assert.ok(nonBlankLines <= 40, `${name} composition stays at or below 40 nonblank lines`);
  assert.equal(
    (composition.match(new RegExp(`plot\\.${verb}\\(`, "g")) || []).length,
    1,
    `${name} composition has one ${verb}() gesture`
  );
  assert.doesNotMatch(composition, /\bdocument\b|download[A-Z]|createCanvas|function\s+(?:setup|draw)\b/);
  assert.doesNotMatch(sketch, new RegExp(`plot\\.${verb}\\(`));
  assert.match(page, /<script src="composition\.js"><\/script>\s*<script src="sketch\.js"><\/script>/);
  assert.match(sketch, new RegExp(`GysinWorks\\.${workName}\\.build\\(`));
  assert.match(showcasePage, new RegExp(`src="\\.\\./examples/${name}/composition\\.js"`));
  assert.match(showcasePage, new RegExp(`GysinWorks\\.${workName}\\.build\\(`));

  if (name === "weave") {
    assert.doesNotMatch(composition, /\b(?:breathe|dropout|repeat|rubout)\b|textCutup|reroll/);
    assert.match(composition, /lines\s*=\s*o\.lines\s*\|\|\s*4/);
    assert.match(composition, /unit:\s*"clause"/);
    assert.match(composition, /fragments:\s*2/);
    assert.match(page, /id="weave-button">Weave again<\/button>/);
    assert.doesNotMatch(page, /Reroll ink|id="ink-button"|id="cut-button"/);
  }
  if (name === "permutation_poem") {
    assert.doesNotMatch(composition, /\b(?:descent|slices|sliceOffset|sliceDropout|breathe|dropout|repeat|rubout|drift)\b|textCutup/);
    assert.match(page, /id="reroll-button">New order<\/button>/);
    assert.match(sketch, /page:\s*"A3"/);
    assert.doesNotMatch(sketch, /function\s+a3Page|width:\s*297|scale:\s*277\s*\/\s*POSTER_WIDTH/);
  }
}

console.log("p5.gysin snapshot ok");

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

function load(files) {
  function P5() {}
  P5.prototype = {};
  const context = { console, p5: P5 };
  context.globalThis = context;
  vm.createContext(context);
  for (const filename of files) {
    const fullPath = path.join(root, filename);
    vm.runInContext(fs.readFileSync(fullPath, "utf8"), context, { filename });
  }
  return context;
}

function inventory(context) {
  const methods = ["new GysinPlot"];
  for (const name of Object.getOwnPropertyNames(context.GysinPlot.prototype)) {
    if (name !== "constructor" && !name.startsWith("_")) methods.push(`GysinPlot.${name}`);
  }
  if (typeof context.p5.prototype.createGysinPlot === "function") {
    methods.push("p5.createGysinPlot");
  }
  for (const name of Object.keys(context.GysinText || {})) {
    if (typeof context.GysinText[name] === "function") methods.push(`GysinText.${name}`);
  }
  for (const name of Object.keys(context.GysinUnderwood || {})) {
    if (typeof context.GysinUnderwood[name] === "function") methods.push(`GysinUnderwood.${name}`);
  }
  return methods;
}

const source = inventory(load([
  "p5.gysin.js",
  "p5.gysin.text.js",
  "p5.gysin.underwood.js"
]));
const build = inventory(load([
  "p5.gysin.min.js",
  "p5.gysin.text.min.js",
  "p5.gysin.underwood.min.js"
]));
assert.deepEqual(build, source, "browser builds expose a different public API than source");

const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "docs", "p5.gysin.manifest.json"), "utf8")
);
assert.deepEqual(
  manifest.public_methods,
  source,
  "manifest public_methods differs from the source API; run npm run manifest"
);

const system = fs.readFileSync(path.join(root, "docs", "system.html"), "utf8");
function systemToken(method) {
  if (method === "new GysinPlot") return "new GysinPlot(";
  if (method === "p5.createGysinPlot") return "p.createGysinPlot(";
  if (method.startsWith("GysinPlot.")) return `plot.${method.slice("GysinPlot.".length)}(`;
  return `${method}(`;
}
const missing = source.filter((method) => !system.includes(systemToken(method)));
assert.deepEqual(missing, [], `System is missing public methods: ${missing.join(", ")}`);

console.log(`p5.gysin API/docs contract ok (${source.length} public methods)`);

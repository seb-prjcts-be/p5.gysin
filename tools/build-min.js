const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const packagePath = path.join(root, "package.json");
const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const builds = [
  ["p5.gysin.js", "p5.gysin.min.js"],
  ["p5.gysin.text.js", "p5.gysin.text.min.js"],
  ["p5.gysin.underwood.js", "p5.gysin.underwood.min.js"]
];

for (const [sourceName, outputName] of builds) {
  const sourcePath = path.join(root, sourceName);
  const outputPath = path.join(root, outputName);
  const source = fs.readFileSync(sourcePath, "utf8").replace(/\r\n/g, "\n");

  // Keep each distributable semantically identical to its source. A previous
  // whitespace-only minifier broke spaces inside template literals.
  const body = source.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, "").trimEnd();
  const banner = `/* ${sourceName.replace(/\.js$/, "")} v${pkg.version} | ${pkg.license} | https://github.com/seb-prjcts-be/p5.gysin */\n`;

  fs.writeFileSync(outputPath, `${banner}${body}\n`, "utf8");
  console.log(`Built ${outputName} (${fs.statSync(outputPath).size} bytes)`);
}

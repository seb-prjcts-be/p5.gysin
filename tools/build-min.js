const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const packagePath = path.join(root, "package.json");
const sourcePath = path.join(root, "p5.gysin.js");
const outputPath = path.join(root, "p5.gysin.min.js");

const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const source = fs.readFileSync(sourcePath, "utf8").replace(/\r\n/g, "\n");

// Keep the distributable semantically identical to the source. A previous
// whitespace-only minifier broke spaces inside template literals, corrupting
// SVG path data and viewBox values.
const body = source.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, "").trimEnd();
const banner = `/* ${pkg.name} v${pkg.version} | ${pkg.license} | https://github.com/seb-prjcts-be/p5.gysin */\n`;

fs.writeFileSync(outputPath, `${banner}${body}\n`, "utf8");

const bytes = fs.statSync(outputPath).size;
console.log(`Built p5.gysin.min.js (${bytes} bytes)`);

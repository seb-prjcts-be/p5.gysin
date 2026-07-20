const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const pages = ["index.html", ...findHtmlPages(path.join(root, "docs")), ...findHtmlPages(path.join(root, "examples"))];
const broken = [];

for (const page of pages) {
  const source = stripCodeSamples(fs.readFileSync(path.join(root, page), "utf8"));
  for (const match of source.matchAll(/(?:href|src)="([^"#?]+)"/g)) {
    const target = match[1];
    if (/^(https?:|mailto:|data:)/.test(target)) continue;
    if (!fs.existsSync(path.resolve(root, path.dirname(page), target))) {
      broken.push(`${page} -> ${target}`);
    }
  }
}

if (broken.length) {
  process.stderr.write(`Broken local links:\n${broken.join("\n")}\n`);
  process.exit(1);
}

console.log(`p5.gysin local links ok (${pages.length} pages)`);

function stripCodeSamples(source) {
  return source
    .replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, "")
    .replace(/<code\b[^>]*>[\s\S]*?<\/code>/gi, "");
}

function findHtmlPages(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return findHtmlPages(absolute);
    return entry.name.endsWith(".html") ? [path.relative(root, absolute)] : [];
  });
}

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const pages = ["index.html", ...findHtmlPages(path.join(root, "docs")), ...findHtmlPages(path.join(root, "examples"))];
const broken = [];
const internalBlank = [];

for (const page of pages) {
  const source = stripCodeSamples(fs.readFileSync(path.join(root, page), "utf8"));
  for (const match of source.matchAll(/(?:href|src)="([^"#?]+)"/g)) {
    const target = match[1];
    if (/^(https?:|mailto:|data:)/.test(target)) continue;
    if (!fs.existsSync(path.resolve(root, path.dirname(page), target))) {
      broken.push(`${page} -> ${target}`);
    }
  }
  for (const match of source.matchAll(/<a\b[^>]*>/gi)) {
    const anchor = match[0];
    const href = getAttribute(anchor, "href");
    const target = getAttribute(anchor, "target");
    if (href && target && target.toLowerCase() === "_blank" && isInternalHref(href)) {
      internalBlank.push(`${page} -> ${href}`);
    }
  }
}

if (broken.length) {
  process.stderr.write(`Broken local links:\n${broken.join("\n")}\n`);
}

if (internalBlank.length) {
  process.stderr.write(`Internal links opening a new tab:\n${internalBlank.join("\n")}\n`);
}

if (broken.length || internalBlank.length) {
  process.exit(1);
}

console.log(`p5.gysin local links and same-tab policy ok (${pages.length} pages)`);

function stripCodeSamples(source) {
  return source
    .replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, "")
    .replace(/<code\b[^>]*>[\s\S]*?<\/code>/gi, "");
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match ? match[2] : "";
}

function isInternalHref(href) {
  if (/^(?:mailto:|tel:|data:)/i.test(href)) return false;
  if (!/^https?:\/\//i.test(href)) return true;
  try {
    const url = new URL(href);
    return url.hostname === "seb-prjcts-be.github.io" &&
      (url.pathname === "/p5.gysin" || url.pathname.startsWith("/p5.gysin/"));
  } catch (error) {
    return true;
  }
}

function findHtmlPages(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return findHtmlPages(absolute);
    return entry.name.endsWith(".html") ? [path.relative(root, absolute)] : [];
  });
}

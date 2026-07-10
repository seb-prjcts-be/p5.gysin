# AGENTS.md

Project-specific instructions and working memory for agents working on
`p5.gysin`.

## Repository Rule

- This repository is `seb-prjcts-be/p5.gysin`.
- Only commit and push to:
  `https://github.com/seb-prjcts-be/p5.gysin.git`
- Before every push, verify the push URL exactly:
  `git remote get-url --push origin`
- Refuse the push if the URL is anything else.
- Commits/pushes in Seb's name use:
  `Seb <108084902+seb-prjcts-be@users.noreply.github.com>`

## Current Remote State

- Local branch: `main`
- Remote branch: `origin/main`
- Initial pushed commit:
  `a25dbb7 Initial p5.gysin library structure`
- The initial push used the correct GitHub identity and remote.

## Project Identity

- Library name: `p5.gysin`
- Public class: `GysinPlot`
- Removed legacy names: `HumanPlot`, `createHumanPlot`, `p5.humanplot`
- Do not reintroduce `humanplot` as a public API, alias, file name, or docs name.
- Concept: vector-first traces for generative, plotter-friendly drawings.
- Influences: Brion Gysin, cut-up, rubout, concrete poetry, vulnerable machine traces, worn print, plotter art.
- Audience: public creative-coding and plotter users. Do not frame the library
  as classroom-only material; examples should work for artists, designers,
  educators, studios, plotter users, and general p5.js users.

## Structure

The project follows the same broad structure as `p5.waves`:

- `p5.gysin.js` - source library at repository root
- `p5.gysin.min.js` - minified browser build at repository root
- `index.html` - GitHub Pages showcase
- `docs/` - Pages docs and guide
- `examples/` - standalone example pages
- `examples/gysin_demo/index.html` + `sketch.js` - first demo
- `tests/snapshot.js` - minimal runtime/snapshot check
- `docs/p5.gysin.manifest.json` - manual MVP manifest until a generator exists

Do not move the library back into `lib/`.

## Design Decisions

- Background color is `245` / `#f5f5f5`.
- Title/logo font is Oswald.
- Body font remains Arial for readability.
- The library stays dependency-free for the MVP.
- p5.js target is 2.x, while keeping code mostly compatible with 1.x where practical.
- Text uses `p5.Font.textToPoints()` when a font is passed.
- Without a font, text falls back to the internal vector alphabet.
- Output must remain vector-first and plotter-friendly.
- Avoid raster effects as final output.

## Public API

Current MVP methods:

- `plot.line(x1, y1, x2, y2, options)`
- `plot.rect(x, y, w, h, options)`
- `plot.circle(x, y, diameter, options)`
- `plot.polygon(points, options)`
- `plot.path(points, options)`
- `plot.text(value, x, y, options)`
- `plot.textCutup(value, x, y, options)`
- `plot.draw()`
- `plot.exportSVG(options)`
- `plot.exportJSON(options)`
- `plot.exportHPGL(options)`
- `plot.downloadSVG(filename, options)`
- `plot.downloadJSON(filename, options)`
- `plot.downloadHPGL(filename, options)`
- `plot.stats(options)`

Addressing:

- `plot.get(id)`
- `plot.select(id)`
- `plot.freeze(id)`
- `plot.thaw(id)`
- `plot.regenerate(id)`
- `plot.reroll(id)`
- `plot.remove(id)`
- `plot.update(id, options)`

## CDN Notes

Development CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/p5@2/lib/p5.js"></script>
<script src="https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.gysin@main/p5.gysin.min.js"></script>
```

Latest-tag CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.gysin@latest/p5.gysin.min.js"></script>
```

Stable release CDN should use a version tag:

```html
<script src="https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.gysin@v0.2.0/p5.gysin.min.js"></script>
```

Use `@latest` only when changing behavior automatically is acceptable.

## Validation Commands

Use the bundled Node/Git paths if normal `node` or `git` are unavailable.

```powershell
node --check p5.gysin.js
node --check p5.gysin.min.js
node --check docs/sketch.js
node --check examples/gysin_demo/sketch.js
node tests/snapshot.js
```

Also run the local HTML-link check after docs or example path changes.

## Current Goals

- Keep the library small, readable, and useful for creative coding work.
- Preserve the p5.waves-like repository structure.
- Keep demos and docs on GitHub Pages.
- Add a generated manifest later, replacing the manual MVP manifest.
- Improve text support later with real font outlines, likely through `opentype.js`.
- Add more examples only when each one has a standalone page and is linked from `docs/examples.html`.
- Keep SVG/JSON/HPGL export plotter-safe.
- Add route simplification and path optimization later.
- Add tagged CDN releases when the API stabilizes.

## Example System

Examples follow the p5.waves three-level rule:

1. Gallery/live preview and short snippet in `docs/examples.html`.
2. Standalone page in `examples/<name>/index.html`.
3. Complete sketch in `examples/<name>/sketch.js`.

When changing an example, update all three levels together. The snippet should
teach the transferable idea; the sketch file remains the complete source.
Use public-facing language for makers and plotter users, not classroom-only
language.
The `p5_editor` example uses the pinned `v0.2.0` jsDelivr URL. Use `@main`
only for development copy-paste snippets where moving behavior is intentional.

## Accepted Roadmap

These are the active product goals for future agents. Treat them as the
working roadmap until Seb changes direction.

### User Track

Make `p5.gysin` easy to use in sketches, studios, workshops, and small
creative coding projects.

- Provide stable CDN snippets with pinned release tags for public docs and
  examples.
- Keep `@latest` documented only as an experimental or fast-moving option.
- Add copy-paste examples for basic shapes, text, cut-up, layers, export, and
  parameter exploration.
- Add ergonomic presets for common visual identities such as worn print,
  rubout, ghost lines, mechanical hand, and type damage.
- Add clearer warnings or clamping for invalid or extreme option values.
- Build GitHub Pages examples around real sketches, not marketing pages.
- Keep p5 1.x compatibility in mind, but use p5 2.x as the primary target.

### Plotter Track

Make exports trustworthy for real pen-plotter workflows.

- Add a page model: paper size, units, margins, origin, rotation, and scale.
- Improve SVG export with physical units, viewBox discipline, metadata, and
  layer groups.
- Improve HPGL export with pen selection, speed, origin, scaling, clipping, and
  command batching.
- Add route optimization that can reduce pen-up travel without destroying the
  intended drawing structure.
- Add plot statistics such as drawn length, travel length, path count, bounds,
  and estimated plotting time.
- Support layer and multi-pen workflows with color-to-pen mapping.
- Add calibration examples for margins, circles, squares, overshoot, and
  dropout behavior.

### Creator Track

Keep the library expressive and maintainable for Seb as the author.

- Shape the internal architecture as a clear pipeline: capture, sample,
  distort, erase, repeat, optimize, export.
- Keep creative identity close to Brion Gysin, cut-up, rubout, concrete poetry,
  vulnerable machine traces, worn print, and plotter art.
- Develop true typography later with real glyph contours, holes, word/letter
  segmentation, and deterministic per-glyph seeds.
- Turn cut-up into a compositional system with slices, words, lines, overlap,
  rearrangement, and lockable seeds.
- Add project-state support for saving, loading, freezing, and regenerating
  selected groups.
- Automate release discipline: minified build, manifest generation, snapshot
  tests, CDN snippets, and version tags.

## Suggested Delivery Order

1. Save and commit `AGENTS.md` and `.gitignore` when Seb explicitly asks.
2. Add release tooling: minified build script, manifest generator/check, and
   version-tag checklist.
3. Harden plotter export: page units, margins, SVG/HPGL options, and stats.
4. Expand Pages with focused examples and a parameter playground.
5. Improve text and cut-up internals once export behavior is stable.
6. Add broader tests and CI after the public API settles.

## Agent Findings

- 2026-07-08: User-track agent prioritized CDN docs, a minimum API reference,
  a beginner-first example, and friendlier warnings.
- 2026-07-08: Plotter-track agent prioritized a page/export model, shared trace
  collection, `plot.stats()`, SVG physical units, HPGL options, route ordering,
  and structural export tests.
- 2026-07-08: Creator-track agent found a P0 release issue: the previous
  minified build removed necessary spaces inside template literals, corrupting
  SVG values such as `viewBox="0 0 400 300"` into
  `viewBox="0 0 400300"`.
- 2026-07-08: p5.waves example-system study adopted the three-level example
  structure for p5.gysin: live gallery snippet, standalone page, complete
  `sketch.js`. The examples are public-facing, not classroom-only.
- The minified build must remain semantically identical to `p5.gysin.js`.
  Always run `node tools/build-min.js` and `node tests/snapshot.js` before
  release or CDN advice. `npm run build:min` and `npm test` are convenience
  wrappers when npm is available.

## Important Gotchas

- Global Git ignore on this machine ignores `info.json`; the project `.gitignore`
  must explicitly unignore `info.json`, `docs/info.json`, and
  `examples/info.json`.
- `p5.gysin.min.js` is intentionally committed. Do not ignore it.
- If `p5.gysin.js` changes, regenerate and verify `p5.gysin.min.js`.
- Do not use unsafe regex or whitespace-only minification on this library;
  template literals contain SVG and path data where spaces are semantic.
- Regenerate `docs/p5.gysin.manifest.json` with `node tools/gen-manifest.js`
  after changing example folders, version metadata, or public API lists.
- Do not use `@latest` in public docs or examples unless Seb explicitly wants
  moving behavior.
- Do not commit or push unless asked.

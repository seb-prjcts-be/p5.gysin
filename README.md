# p5.gysin

[Open the public p5.gysin site](https://seb-prjcts-be.github.io/p5.gysin/)

p5.gysin is a vector-first p5.js library for generative, plottable drawings:
cut-up text, rubout zones, wobble, dropout, selective ink bleed, and export to
SVG, JSON, and HPGL. Version 0.2.0 adds physical page settings, layers/pen
mapping, optional route optimization, and plot statistics.

The repository follows the same publishing structure as `p5.waves`: the library
lives at the root, GitHub Pages uses `index.html` and `docs/`, and examples live
as standalone pages under `examples/`.

## Structure

- `p5.gysin.js` - source library
- `p5.gysin.min.js` - semantically identical browser build for examples/docs; intentionally not aggressively minified
- `p5.gysin.text.js` - optional, standalone text permutations; runs without p5.js and without the core
- `p5.gysin.text.min.js` - semantically identical browser build of the text module
- `index.html` - Pages showcase
- `docs/examples.html` - overview of examples
- `docs/guide.html` - public guide
- `docs/about.html` - context and status
- `docs/technical-blueprint.md` - technical blueprint
- `docs/ink-bleed-design.md` - design and safety model for additive ink build-up
- `examples/gysin_demo/` - standalone demo
- `tests/snapshot.js` - minimal runtime/snapshot check

## Basic usage

```html
<script src="https://cdn.jsdelivr.net/npm/p5@2/lib/p5.js"></script>
<script src="p5.gysin.min.js"></script>
```

```js
let plot;

function setup() {
  createCanvas(800, 800);
  plot = new GysinPlot({ seed: 1960 });

  plot.text("RUB OUT THE WORD", 80, 180, {
    size: 72,
    wobble: 2,
    dropout: 0.12,
    bleed: 0.2,
    bleedPasses: 2,
    bleedSpread: 0.8,
    rubout: 0.25
  });

  plot.line(80, 260, 720, 280, {
    wobble: 1,
    dropout: 0.05,
    overshoot: 8
  });

plot.draw();
}
```

## Intent verbs

The calls above are primitives — you compose them yourself. `rub()` is the first
*intent verb*: one call that composes `text`, `textCutup`, and `asemic` into a
finished gesture — a word worn away in three copies (legible, cut up, asemic
scribble). Strong defaults make the one-liner complete; every option is an opt-in
escape hatch, and the primitives stay underneath.

```js
plot.rub("RUB OUT", 46, 248);                        // the whole gesture, defaults
plot.rub("RUB OUT", 46, 248, { decay: 2 });          // one knob scales the wear
plot.rub("RUB OUT", 46, 248, { font: outlineFont }); // fills the legible head
```

- `decay` (default 1) scales wobble/drift/dropout/rubout/fray across every copy at
  once; `0` draws clean, higher wears the word away and buries it wider.
- `size` (default 46), `font` (fills the legible head), `stroke`.
- `tail` (default true) is the asemic burial of the last copy; set `false` to leave
  the word unburied.
- `stepX`/`stepY` set the drift between copies; `stages`/`tangles` replace the
  built-in recipe wholesale.

`rub()` returns the id of every copy and tangle, so each can be `freeze`d,
`reroll`ed, updated, or exported like any other shape. Same seed, same result. See
the `worn_word` example — the whole sketch is this one call.

## Selective ink build-up

`dropout` and `rubout` remove line material. `bleed` is the additive
counterpart: the core deterministically selects contiguous fragments and gives
only those one or more extra, slightly shifted passes.

```js
plot.textCutup("RUB OUT THE WORD", 80, 180, {
  bleed: 0.22,       // share of the written contour length
  bleedPasses: 2,    // max number of extra passes, capped at 3
  bleedSpread: 0.8,  // coherent shift; at least 0.1 when bleed is active
  bleedCluster: 18   // desired length of an ink cluster
});
```

The extra traces get `role: "bleed"` and a physical pass number in SVG/JSON.
`plot.stats()` reports `bleedPaths`, `bleedLength`, `overdrawRatio`, and
`maxLocalPasses`. For cutting tools, `tool: "blade"` filters all second and
later passes out of the export; `tool: "pen"` keeps the ink build-up.

## Filled shapes and letters

Letterforms and closed shapes are outline-only by default. `fill: "hatch"`
fills the interior with parallel plotter lines, so type becomes solid instead of
hollow:

```js
plot.rect(40, 40, 200, 120, { fill: "hatch", hatchSpacing: 3, hatchAngle: 30 });

plot.text("RUB OUT", 60, 200, {
  size: 96,
  font: outlineFont,   // fill requires real font contours
  fill: "hatch",
  hatchSpacing: 2
});
```

- `hatchSpacing` (default 2) is the distance between the fill lines; minimum 0.25.
- `hatchAngle` (default 0) rotates the hatching, in degrees.
- `fill: "cross"` lays two hatchings perpendicular to each other; that reads more
  even and solid than single strokes — nicer for filled typography.

**Readability of filled text.** The outline is always drawn as well, so filled
letters have sharp edges and a filled body. Practical rule of thumb: use fill for
**display sizes (≥~16px)** — there `"cross"` reads solid and legible — and leave
**small text outline-only or single-stroke**.

**Pen width and small text (plotter).** With a real pen, the double lines of a
small outline or filled letter close up into a blot. For small text, use the
**built-in single-stroke alphabet** (omit `font`): there the pen width itself is
the stroke, so it scales along. That font draws on a `size/7` grid, so the
strokes stay separate as long as:

```text
glyph size  ≳  7–8 × pen width
```

Example: with a 1.7px pen, `size 14` is the legible lower bound; with a thicker
pen it shifts up accordingly. Keep `glyphJitter` low (~0.1) for small text.
Filled/outline fonts need ~2–3× more size to stay legible, so they are for
headings, not small fields.
- The fill uses the even-odd rule, so letter counters and holes (the cavity in
  `O`, `A`, `e`) stay open.
- Fill works on `rect`, `circle`, `polygon`, and on `text`/`textCutup` with an
  outline font. Open shapes (`line`, `path`) and the built-in bitmap alphabet
  have no interior and are skipped.
- Fill lines get `role: "fill"`; `plot.stats()` reports `fillPaths` and
  `fillLength`. `tool: "blade"` leaves out all fill (a blade doesn't fill an
  area), `tool: "pen"` keeps them.

> Roadmap: `fill: "dots"` (loose plotter dots with a density gradient for letter
> decay and tables) is the next step in
> [`docs/composition-plan.md`](docs/composition-plan.md).

### Every letter unique

No two rendered letters are identical — not even the same letter twice. Every
glyph gets its own, independent variation (small rotation, shift, and scale
around its centroid). The fill inherits this, since it is computed from the
varied contour.

```js
plot.text("RUB OUT THE WORD", 60, 200, {
  size: 72,
  font: outlineFont,
  glyphJitter: 0.6   // 0 = off (exact font shape), higher = more deviation
});
```

`glyphJitter` defaults to `0.35`. The variation is deterministic: the same seed
gives the same letters, `reroll()` gives a new set. Works on `text` and
`textCutup` (outline and bitmap alphabet). Set `glyphJitter: 0` for mechanically
exact type.

## Optional text permutations

Load the text module only when you want to reorder sentences. The module needs
no p5.js or `GysinPlot` and returns plain strings:

```html
<script src="p5.gysin.text.min.js"></script>
```

```js
const rows = GysinText.permute("I LOVE YOU", {
  seed: 1960,
  limit: 6,
  order: "walk"
});
```

Combine both modules to run each permutation through the existing graphic
cut-up:

```js
rows.forEach((row, index) => {
  plot.textCutup(row, 70, 150 + index * 100, {
    slices: 7 + index,
    sliceOffset: 14 + index * 6
  });
});
```

Available orderings are `walk`, `random`, `lexical`, and `rotate`. The original
sentence always comes first; duplicate words don't produce duplicate lines.
`limit` defaults to 24 and maxes at 1,000.

The language and image processing stay deliberately separate:
`GysinText.permute()` deconstructs the word order, after which `textCutup()`
re-slices each chosen line as letter contours. The `permutation_poem` example
uses this two-step method for a monochrome A3 composition with repeated text
fields, a symbolic code column, and a modular grid.

## Examples

Open locally:

```text
index.html
docs/examples.html
examples/first_trace/index.html
examples/gysin_demo/index.html
examples/p5_editor/index.html
examples/parameter_lab/index.html
examples/plotter_export/index.html
```

The examples follow the same three-layer structure as `p5.waves`:

- live preview and snippet in `docs/examples.html`
- standalone page in `examples/<name>/index.html`
- full sketch in `examples/<name>/sketch.js`

Available examples:

- `first_trace` - minimal trace composition
- `gysin_demo` - cut-up typography and rubout
- `permutation_poem` - A3 poster where all word permutations run through `textCutup()` again
- `p5_editor` - copy-paste starter for editor.p5js.org
- `parameter_lab` - live control over trace parameters
- `plotter_export` - SVG/JSON/HPGL export workflow
- `font_outlines` - real font contours with separate counters
- `plotter_calibration` - physical A4 sizes, margins, and pen layers
- `signal_score` - abstract paths and repeatable data scores
- `worn_word` - one word worn away: the `rub()` intent verb in a single call

## Plotter export

Use an optional page model to bring the same trace data to physical SVG and HPGL
output:

```js
const page = {
  width: 210,
  height: 297,
  units: "mm",
  margin: 10,
  scale: 0.25,
  clip: true
};

plot.downloadSVG("drawing.svg", { page, optimize: true, tool: "pen" });
plot.downloadHPGL("drawing.hpgl", {
  page,
  tool: "pen",
  penMap: { frame: 1, type: 2 },
  speed: 20
});

console.log(plot.stats({ page, tool: "pen", drawSpeed: 20, travelSpeed: 60 }));
```

Make a safe variant for a blade without rebuilding the composition:

```js
plot.downloadSVG("drawing-blade.svg", { page, tool: "blade" });
```

`regenerate()` keeps the seed; use `reroll()` to give only unfrozen shapes a new
variant. Non-finite geometry, duplicate ids, and extreme sampling are rejected
early with a clear error.

## Compatibility

Version 0.2.0 supports p5.js 2.x in global mode and instance mode. In instance
mode, create a linked plot after `p.createCanvas()` with
`p.createGysinPlot(options)`. The vector and export core needs no p5 runtime,
but p5.js 1.x is not part of the tested support matrix.

The distribution is intended as a browser script via GitHub/jsDelivr. The
package is currently not set up as an npm, ESM, CommonJS, or TypeScript package.

## Test

```powershell
npm test
```

Regenerate release files:

```powershell
node tools/build-min.js
node tools/gen-manifest.js
npm test
```

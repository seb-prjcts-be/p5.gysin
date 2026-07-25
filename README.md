# p5.gysin

[Open the public p5.gysin site](https://seb-prjcts-be.github.io/p5.gysin/)

p5.gysin is a vector-first p5.js library for generative, plottable drawings.
It captures cut-up text, interrupted traces, repeated ink, and composed fields,
then exports the same work to SVG, JSON, or HPGL.

## Start

Load p5.js, then the core library:

```html
<script src="https://cdn.jsdelivr.net/npm/p5@2.3.1/lib/p5.js"></script>
<script src="https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.gysin@v1.0.0/p5.gysin.min.js"></script>
```

```js
function setup() {
  createCanvas(700, 300);

  const plot = new GysinPlot({ seed: 1960 });
  plot.text("RUB OUT THE WORD", 60, 170, {
    size: 52,
    breathe: 2
  });
  plot.draw();
}
```

The complete API, options, mutation model, and export model are documented in
[System](https://seb-prjcts-be.github.io/p5.gysin/docs/system.html). The
[gallery](https://seb-prjcts-be.github.io/p5.gysin/#examples) leads to
standalone works with their source code.

## Distribution

- `p5.gysin.js` and `p5.gysin.min.js` contain the core.
- `p5.gysin.text.js` and `p5.gysin.text.min.js` add pure permutation and
  semantic-splice operations, plus `plot.chant()` and `plot.splice()`.
- `p5.gysin.underwood.js` and `p5.gysin.underwood.min.js` add
  `plot.underwood()` and the low-level `GysinUnderwood` helper.
- `index.html` and `docs/` form the public site.
- `examples/<name>/` contains each standalone work and its sketch.

The `.min.js` files are release builds of the adjacent source files. They are
kept readable and must remain behaviourally identical to their sources.

Load either addon after the core and before your sketch:

```html
<script src="https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.gysin@v1.0.0/p5.gysin.text.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.gysin@v1.0.0/p5.gysin.underwood.min.js"></script>
```

The pure `GysinText.permute()` and `GysinText.splice()` functions can also run
from the text addon without p5.js or the core.

## Compatibility

Version 1.0.0 supports p5.js 2.x in global and instance mode. In instance mode,
create a linked plot after `p.createCanvas()` with
`p.createGysinPlot(options)`. The vector and export core needs no p5 runtime.
p5.js 1.x is not part of the tested support matrix.

The distribution is intended for browser scripts through GitHub or jsDelivr.
It is not packaged as npm, ESM, CommonJS, or TypeScript.

## Verify a checkout

```powershell
npm test
```

Regenerate and verify release files:

```powershell
node tools/build-min.js
node tools/gen-manifest.js
npm test
```

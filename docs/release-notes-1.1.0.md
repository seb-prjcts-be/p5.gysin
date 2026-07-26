# p5.gysin v1.1.0

## Plotter-safe physical SVG

- `plot.exportPlotterSVG()` returns a physical, plotter-safe SVG.
- `plot.downloadPlotterSVG()` downloads the same format directly.
- The route requires an explicit page in `mm`, `cm`, or `in`, always clips
  geometry to that page, and optimizes travel inside each physical pen group.
- `penMap` assigns physical pen numbers. The SVG writes true top-level Inkscape
  layers whose visible labels start with those numbers.
- Plotter files contain centre lines. Screen-only `alpha`, `strokeWeight`, and
  pressure styling are deliberately omitted.
- The existing `exportSVG()` and `downloadSVG()` screen-oriented contract stays
  unchanged.

## Current library behaviour

- Every public method present on `main` is included in the three browser
  builds; no v1.0.1 method was removed.
- `rub()` now keeps its default word stages readable and reserves horizontal
  slicing for an explicit custom `textCutup` stage.
- `chant()` likewise draws readable permutations by default; passing
  `descent`, `slices`, `sliceOffset`, or `sliceDropout` opts into the sliced
  treatment.

## Compatibility

- Version 1.1.0 targets p5.js 2.x in global and instance mode.
- The vector and export core remains usable without a p5 runtime.
- The existing v1.0.1 tag remains unchanged.

## Loading 1.1.0

```html
<script src="https://cdn.jsdelivr.net/npm/p5@2.3.1/lib/p5.js"></script>
<script src="https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.gysin@v1.1.0/p5.gysin.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.gysin@v1.1.0/p5.gysin.text.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.gysin@v1.1.0/p5.gysin.underwood.min.js"></script>
```

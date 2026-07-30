# p5.gysin v1.2.0

## Built-in physical pages

- Use `page: "A5"`, `page: "A4"`, `page: "A3"`, or `page: "A2"` instead of
  repeating a custom page object in ordinary plotter sketches.
- Each preset supplies exact ISO millimetre dimensions, 10 mm margins, a
  top-left origin, geometric clipping, and a width-fitting scale derived from
  the canvas.
- The presets work across `exportSVG()`, `exportPlotterSVG()`, `exportHPGL()`,
  and `stats()`. Existing custom page objects remain supported for deliberate
  mappings, centred compositions, and calibration sheets.

## Physical export guidance

- System now gives HPGL its own practical section, including page setup,
  route optimization, pen mapping, speed, coordinate scaling, command limits,
  and the boundary between file generation and machine control.
- Plotter Export demonstrates a layered black-and-red composition while
  preserving the same canvas composition across A5, A4, A3, and A2 output.
- Plotter-safe SVG still clips and optimizes by default. Generic SVG and HPGL
  retain their opt-in behavior so existing drawing order remains unchanged.

## Compatibility

- Version 1.2.0 targets p5.js 2.x in global and instance mode.
- No public v1.1.0 method was removed.
- The vector and export core remains usable without a p5 runtime.
- The existing v1.1.0 tag remains unchanged.

## Loading 1.2.0

```html
<script src="https://cdn.jsdelivr.net/npm/p5@2.3.1/lib/p5.js"></script>
<script src="https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.gysin@v1.2.0/p5.gysin.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.gysin@v1.2.0/p5.gysin.text.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.gysin@v1.2.0/p5.gysin.underwood.min.js"></script>
```

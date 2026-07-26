# p5.gysin v1.0.1

## Text within the sheet

- `plot.weave()` accepts an optional positive `maxWidth`.
- When one woven line exceeds that width, every line in the group receives the
  same smaller type size.
- Fitting only shrinks: a group that already fits remains byte-identical.
- The Weave example now keeps every generated cut inside equal left and right
  margins.

## Compatibility

- No method was removed or renamed.
- Omitting `maxWidth` preserves the v1.0.0 result.
- Provenance, ids, freeze, reroll, canvas, SVG, JSON, and HPGL behaviour remain
  available.
- The existing `v1.0.0` tag remains unchanged.

## Loading 1.0.1

```html
<script src="https://cdn.jsdelivr.net/npm/p5@2.3.1/lib/p5.js"></script>
<script src="https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.gysin@v1.0.1/p5.gysin.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.gysin@v1.0.1/p5.gysin.text.min.js"></script>
```

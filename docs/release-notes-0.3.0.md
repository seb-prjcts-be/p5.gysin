# p5.gysin v0.3.0

## Intent verbs

- `rub(text, x, y, options)` - one call composing `text`, `textCutup`, and
  `asemic` into a finished gesture: a word worn away in three copies
  (legible, cut up, asemic scribble). See the `worn_word` example.
- `chant(text, x, y, options)` - loads with the text addon; permutes a
  phrase and sends every ordering through `textCutup()`, each line cut a
  little deeper. See the `permutation_poem` example.
- `underwood(text, x, y, options)` - the optional typewriter addon: a
  period-correct single-stroke typed page (fixed monospace pitch and line
  height, light strike wear). See the `typewriter` example.

## New primitives

- `grid(x, y, w, h, cols, rows, options)` - a ruled block grid.
- `letters(source, x, y, w, h, options)` - individual letterforms shaken
  loose from their positions.
- `symbols(x, y, w, h, options)` - a light machine index of typed symbols
  over a grid.
- `asemic(x, y, w, h, options)` - pure scribble, the endpoint of `rub()`'s
  decay.

## Addons

- `p5.gysin.text.js` / `p5.gysin.text.min.js` - dependency-free seeded word
  permutations (`GysinText.permute()`); runs without p5.js or `GysinPlot`.
- `p5.gysin.underwood.js` / `p5.gysin.underwood.min.js` - the typewriter
  addon described above.

## Examples

Seven new examples: `font_outlines`, `ink_bleed`, `permutation_poem`,
`plotter_calibration`, `signal_score`, `typewriter`, and `worn_word`.

## Site

The public site was reworked: a new System page (`docs/system.html`) is the
public API reference, a new Vision page (`docs/vision.html`) covers context
and background, and a new Collage page (`docs/collage/index.html`) is a
long-form guide through the library's modules.

## Notes

- No API removals since v0.2.0.
- Manifest entries for `GysinText.permute`, `bleed`, and `tool:pen|blade`
  are now marked `added_in: 0.3.0`.

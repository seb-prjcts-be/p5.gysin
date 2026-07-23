# p5.gysin v0.4.0

## The turned sheet

- Every shape takes `angle` (degrees) and `pivot` - the physical gesture of
  the studio (write, turn the paper, write again) as shape geometry. The turn
  runs before breathe, dropout, bleed and hatching, so every disturbance
  lives on the turned line. `angle: 0` stays byte-identical to a shape
  without the option.
- `pivot: "anchor"` (default) turns text about its pen-down point, rect and
  circle about their centre, path and polygon about their centroid, line
  about its midpoint. `pivot: "center"` turns about the sampled bounds; an
  `{ x, y }` object sets the pin explicitly.
- `update(id, { angle, pivot })` turns any standing shape in place.
- Page-level `page.rotation` is unchanged and still means the whole exported
  sheet.

## Intent verb

- `lattice(text, x, y, w, h, options)` - the calligraphic method as one
  call: a phrase written in rows that fill a field, then the sheet turned
  (`turns`, default `[0, 90]`) and written across again. Each row cycles the
  word order by one, so the permutation runs inside the turning; `wear`
  scales breathe/dropout/drift per pass from one knob. Returns the id of
  every written row, pass by pass, so a pass can be frozen, re-tuned, or
  rerolled on its own.

## Examples

- `rotations` reworked from illustration to method, then from emblem to
  palimpsest. Layered the way the studio layered: the machine drawing (a
  roller grid via `grid()`, turned a few degrees off true) as ground,
  `lattice()` writing the whole sheet edge to edge in two off-square passes
  (`turns: [4, 94]` - the hand against the machine), and the silent script
  over everything: the five cyclic orders of the phrase scattered at their
  own angles, columns among rows, one upside down. Nothing centres, nothing
  reads top-left to bottom-right. The wear knob re-tunes every standing row
  through `update()`, "freeze first pass" makes the first writing the fixed
  ground the later hand keeps rerolling over, and "SVG turned 180" is the
  first living demo of `page.rotation`.
- Every example now works its own phrase: `rotations` takes COME TO FREE
  THE WORDS and `parameter_lab` takes PISTOL POEM, so no two examples
  iterate the same words.

## Test

- `tests/snapshot.js` covers the turn: angle-0 byte-identity, a 90-degree
  line about an explicit pin, `lattice()` determinism across the source and
  min builds, and the pivot/lattice error paths.

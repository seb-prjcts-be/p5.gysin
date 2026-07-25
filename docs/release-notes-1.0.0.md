# p5.gysin v1.0.0

## Text splice

- `GysinText.splice(sources, options)` recombines two to eight supplied text
  sources by word, phrase, or clause.
- `plot.splice(sources, x, y, options)` draws the resulting lines through the
  existing text and trace system.
- The same seed and sources return the same cut.
- Every fragment records its source id, source index, exact character offsets,
  and text. Plot shapes retain that provenance in JSON export.
- The method performs no network request and includes no text corpus.

## Existing API

- No v0.4.0 method was removed or renamed.
- Existing ids, seeds, freeze/thaw, regenerate/reroll, drawing, SVG, JSON, and
  HPGL behaviour remain available.
- The text and underwood addons remain optional browser scripts.
- The supported runtime is p5.js 2.x in global or instance mode; the vector and
  export core can run without p5.js.

## Public site and documentation

- Example pages keep operation help beside their controls and leave
  interpretation to the work.
- The homepage is an entry and contact sheet; System holds the complete API;
  README is limited to loading and distribution.
- Collage keeps its fifteen chapters, previews, code blocks, keyboard route,
  and copy controls with less repeated explanation.
- Vision separates personal origin, checked museum sources, and the limits of
  the project&rsquo;s claim.

## Release checks

- Source and browserbuild APIs, System, and manifest agree on forty public
  methods.
- Snapshot, API/docs, link, syntax, HTTP, desktop, and mobile checks pass.
- The preserved v0.4.0 tag and its pinned CDN files are unchanged.

## Loading 1.0.0

```html
<script src="https://cdn.jsdelivr.net/npm/p5@2.3.1/lib/p5.js"></script>
<script src="https://cdn.jsdelivr.net/gh/seb-prjcts-be/p5.gysin@v1.0.0/p5.gysin.min.js"></script>
```

Load `p5.gysin.text.min.js` or `p5.gysin.underwood.min.js` from the same tag
after the core when those addons are needed.

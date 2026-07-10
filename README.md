# p5.gysin

p5.gysin is een vector-first p5.js-library voor generatieve, plotbare
tekeningen: cut-up tekst, rubout-zones, wobble, dropout, repeat, drift en
export naar SVG, JSON en HPGL. Versie 0.2.0 voegt fysieke pagina-instellingen,
lagen/penmapping, optionele route-optimalisatie en plotstatistieken toe.

De repository volgt dezelfde publicatiestructuur als `p5.waves`: de library
staat op root, GitHub Pages gebruikt `index.html` en `docs/`, en voorbeelden
leven als standalone pagina's onder `examples/`.

## Structuur

- `p5.gysin.js` - source library
- `p5.gysin.min.js` - browser build voor examples/docs
- `index.html` - Pages showcase
- `docs/examples.html` - overzicht van voorbeelden
- `docs/guide.html` - publieke handleiding
- `docs/about.html` - context en status
- `docs/technical-blueprint.md` - technische blauwdruk
- `examples/gysin_demo/` - standalone demo
- `tests/snapshot.js` - minimale runtime/snapshot-check

## Basisgebruik

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
    repeat: 2,
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

## Voorbeelden

Open lokaal:

```text
index.html
docs/examples.html
examples/first_trace/index.html
examples/gysin_demo/index.html
examples/p5_editor/index.html
examples/parameter_lab/index.html
examples/plotter_export/index.html
```

De voorbeelden volgen dezelfde drie-lagenstructuur als `p5.waves`:

- live preview en snippet in `docs/examples.html`
- standalone pagina in `examples/<naam>/index.html`
- volledige sketch in `examples/<naam>/sketch.js`

Beschikbare voorbeelden:

- `first_trace` - minimale trace-compositie
- `gysin_demo` - cut-up typography en rubout
- `p5_editor` - copy-paste starter voor editor.p5js.org
- `parameter_lab` - live controle over trace-parameters
- `plotter_export` - SVG/JSON/HPGL exportworkflow

## Plotterexport

Gebruik een optioneel page model om dezelfde trace-data naar fysieke SVG- en
HPGL-uitvoer te brengen:

```js
const page = {
  width: 210,
  height: 297,
  units: "mm",
  margin: 10,
  scale: 0.25,
  clip: true
};

plot.downloadSVG("drawing.svg", { page, optimize: true });
plot.downloadHPGL("drawing.hpgl", {
  page,
  penMap: { frame: 1, type: 2 },
  speed: 20
});

console.log(plot.stats({ page, drawSpeed: 20, travelSpeed: 60 }));
```

`regenerate()` behoudt de seed; gebruik `reroll()` om alleen niet-bevroren
vormen een nieuwe variant te geven. Niet-eindige geometrie, dubbele ids en
extreme sampling worden vroeg afgewezen met een duidelijke fout.

## Test

```powershell
node tools/build-min.js
node tools/gen-manifest.js
node tests/snapshot.js
```

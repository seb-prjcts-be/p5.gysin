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
- `p5.gysin.min.js` - semantisch identieke browserbuild voor examples/docs; bewust niet agressief geminified
- `p5.gysin.text.js` - optionele, zelfstandige tekstpermutaties; draait zonder p5.js en zonder de core
- `p5.gysin.text.min.js` - semantisch identieke browserbuild van de tekstmodule
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

## Optionele tekstpermutaties

Laad de tekstmodule alleen wanneer je zinnen wilt herordenen. De module heeft
geen p5.js of `GysinPlot` nodig en retourneert gewone strings:

```html
<script src="p5.gysin.text.min.js"></script>
```

```js
const regels = GysinText.permute("I LOVE YOU", {
  seed: 1960,
  limit: 6,
  order: "walk"
});
```

Combineer beide modules om iedere permutatie door de bestaande grafische
cut-up te sturen:

```js
regels.forEach((regel, index) => {
  plot.textCutup(regel, 70, 150 + index * 100, {
    slices: 7 + index,
    sliceOffset: 14 + index * 6
  });
});
```

Beschikbare ordeningen zijn `walk`, `random`, `lexical` en `rotate`. De
originele zin staat altijd eerst; dubbele woorden leveren geen dubbele regels
op. `limit` is standaard 24 en maximaal 1.000.

De taal- en beeldbewerking blijven bewust gescheiden: `GysinText.permute()`
deconstrueert de woordvolgorde, waarna `textCutup()` elke gekozen regel opnieuw
versnijdt als lettercontour. Het voorbeeld `permutation_poem` gebruikt die
tweestapsmethode voor een monochrome A3-compositie met herhaalde tekstvelden,
een symbolische codekolom en een modulair raster.

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
- `permutation_poem` - A3-poster waarin alle woordpermutaties opnieuw door `textCutup()` gaan
- `p5_editor` - copy-paste starter voor editor.p5js.org
- `parameter_lab` - live controle over trace-parameters
- `plotter_export` - SVG/JSON/HPGL exportworkflow
- `font_outlines` - echte fontcontouren met afzonderlijke counters
- `plotter_calibration` - fysieke A4-maten, marges en penlagen
- `signal_score` - abstracte paths en herhaalbare datascores

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

## Compatibiliteit

Versie 0.2.0 ondersteunt p5.js 2.x in global mode en instance mode. Maak in
instance mode na `p.createCanvas()` een gekoppelde plot met
`p.createGysinPlot(options)`. De vector- en exportkern heeft geen p5-runtime
nodig, maar p5.js 1.x behoort niet tot de geteste supportmatrix.

De distributie is bedoeld als browser-script via GitHub/jsDelivr. Het package
is momenteel niet ingericht als npm-, ESM-, CommonJS- of TypeScript-package.

## Test

```powershell
npm test
```

Releasebestanden opnieuw genereren:

```powershell
node tools/build-min.js
node tools/gen-manifest.js
npm test
```

# p5.gysin

[Open de publieke p5.gysin-site](https://seb-prjcts-be.github.io/p5.gysin/)

p5.gysin is een vector-first p5.js-library voor generatieve, plotbare
tekeningen: cut-up tekst, rubout-zones, wobble, dropout, selectieve ink bleed en
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
- `docs/ink-bleed-design.md` - ontwerp en veiligheidsmodel voor additieve inktopbouw
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

## Selectieve inktopbouw

`dropout` en `rubout` halen lijnmateriaal weg. `bleed` is de additieve
tegenhanger: de core kiest deterministisch aaneengesloten fragmenten en geeft
alleen die één of meer extra, licht verschoven passages.

```js
plot.textCutup("RUB OUT THE WORD", 80, 180, {
  bleed: 0.22,       // aandeel van de geschreven contourlengte
  bleedPasses: 2,    // maximaal aantal extra passages, begrensd op 3
  bleedSpread: 0.8,  // coherente verschuiving; minimaal 0.1 bij actieve bleed
  bleedCluster: 18   // gewenste lengte van een inktcluster
});
```

De extra traces krijgen in SVG/JSON `role: "bleed"` en een fysiek
passagenummer. `plot.stats()` rapporteert `bleedPaths`, `bleedLength`,
`overdrawRatio` en `maxLocalPasses`. Voor snijgereedschap filtert
`tool: "blade"` alle tweede en latere passages uit de export; `tool: "pen"`
behoudt de inktopbouw.

## Gevulde vormen en letters

Lettervormen en gesloten vormen zijn standaard alleen omtrek. `fill: "hatch"`
vult het binnenwerk met parallelle plotterlijnen, zodat type solide wordt in
plaats van hol:

```js
plot.rect(40, 40, 200, 120, { fill: "hatch", hatchSpacing: 3, hatchAngle: 30 });

plot.text("RUB OUT", 60, 200, {
  size: 96,
  font: outlineFont,   // vulling vereist echte fontcontouren
  fill: "hatch",
  hatchSpacing: 2
});
```

- `hatchSpacing` (standaard 2) is de afstand tussen de vullijnen; minimaal 0.25.
- `hatchAngle` (standaard 0) draait de arcering, in graden.
- `fill: "cross"` legt twee arceringen haaks op elkaar; dat leest egaler en
  soliede dan enkele strepen — prettiger voor gevulde typografie.

**Leesbaarheid van gevulde tekst.** De outline wordt altijd mee getekend, dus
gevulde letters hebben scherpe randen én een gevuld lijf. Vuistregel uit de
praktijk: gebruik vulling voor **displaymaten (≥~16px)** — daar leest `"cross"`
solide en leesbaar — en laat **kleine tekst enkel outline of single-stroke**.

**Pendikte en kleine tekst (plotter).** Bij een echte pen lopen de dubbele
lijnen van een klein outline- of gevuld letter dicht tot een vlek. Gebruik voor
kleine tekst het **ingebouwde single-stroke alfabet** (laat `font` weg): daar is
de pendikte zélf de streek, dus het schaalt mee. Dat font tekent op een
`size/7`-raster, dus de strepen blijven los zolang:

```text
glyph-grootte  ≳  7–8 × pendikte
```

Voorbeeld: met een pen van 1.7px is `size 14` de leesbare ondergrens; met een
dikkere pen schuift die mee omhoog. Houd `glyphJitter` laag (~0.1) voor kleine
tekst. Gevulde/outline-fonts hebben ~2–3× méér grootte nodig om leesbaar te
blijven, dus die zijn voor koppen, niet voor kleine velden.
- De vulling gebruikt de even-odd-regel, dus letter-counters en gaten (de holte
  in `O`, `A`, `e`) blijven open.
- Vulling werkt op `rect`, `circle`, `polygon` en op `text`/`textCutup` met een
  outline-font. Open vormen (`line`, `path`) en het ingebouwde bitmap-alfabet
  hebben geen binnenwerk en worden overgeslagen.
- Vullijnen krijgen `role: "fill"`; `plot.stats()` rapporteert `fillPaths` en
  `fillLength`. `tool: "blade"` laat álle vulling weg (een mes vult geen vlak),
  `tool: "pen"` behoudt ze.

> Roadmap: `fill: "dots"` (losse plotterpunten met een dichtheids-gradiënt voor
> letter-verval en tabellen) staat als volgende stap in
> [`docs/composition-plan.md`](docs/composition-plan.md).

### Elke letter uniek

Geen twee gerenderde letters zijn identiek — ook niet twee keer dezelfde letter.
Iedere glyph krijgt een eigen, onafhankelijke variatie (kleine rotatie,
verschuiving en schaal rond zijn zwaartepunt). De vulling erft dat mee, want die
wordt uit de gevarieerde contour berekend.

```js
plot.text("RUB OUT THE WORD", 60, 200, {
  size: 72,
  font: outlineFont,
  glyphJitter: 0.6   // 0 = uit (exacte fontvorm), hoger = meer afwijking
});
```

`glyphJitter` staat standaard op `0.35`. De variatie is deterministisch: dezelfde
seed geeft dezelfde letters, `reroll()` geeft een nieuwe set. Werkt op `text` en
`textCutup` (outline- en bitmap-alfabet). Zet `glyphJitter: 0` voor mechanisch
exacte type.

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

plot.downloadSVG("drawing.svg", { page, optimize: true, tool: "pen" });
plot.downloadHPGL("drawing.hpgl", {
  page,
  tool: "pen",
  penMap: { frame: 1, type: 2 },
  speed: 20
});

console.log(plot.stats({ page, tool: "pen", drawSpeed: 20, travelSpeed: 60 }));
```

Maak een veilige variant voor een mes zonder de compositie opnieuw te bouwen:

```js
plot.downloadSVG("drawing-blade.svg", { page, tool: "blade" });
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

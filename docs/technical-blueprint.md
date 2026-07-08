# p5.gysin technische blauwdruk

Naam: `p5.gysin`. De namen `rubout` en `ghostline` passen goed als interne modi
of presets, maar de library zelf draagt de Gysin-referentie expliciet.

Deze eerste versie mikt op p5.js 1.x en 2.x in global mode, zonder build system.
Omdat p5.js 2.x asset loading met `async setup()` werkt, laadt de library zelf
geen fonts. Tekst gebruikt optioneel een meegegeven `p5.Font` met
`font.textToPoints()`. Zonder font valt ze terug op een eenvoudige vector-font.

## 1. Algemene architectuur

### Capture laag

De gebruiker tekent niet rechtstreeks met `line()`, `rect()` of `text()`, maar
met methods op een `GysinPlot` instantie:

```js
plot.line(80, 260, 720, 280, { wobble: 1, dropout: 0.05 });
plot.text("RUB OUT THE WORD", 80, 180, { size: 72, rubout: 0.25 });
```

Elke call bewaart eerst een vectorvorm met originele parameters. Er wordt dus
niet achteraf naar canvaspixels gekeken.

### Sampling laag

Elke vorm wordt omgezet naar een of meer paden van punten:

- lijn: punten op een segment
- rechthoek: vier gesamplede zijden
- cirkel: polyline over de omtrek
- polygon: gesamplede randen
- tekst: `font.textToPoints()` wanneer beschikbaar, anders vectorfallback
- path: rechtstreeks meegegeven puntpad

De sampling gebruikt `density` en `segmentLength`. Hogere `density` betekent
meer punten; lagere `segmentLength` betekent kortere segmenten.

### Humanizing laag

De punten worden niet direct getekend. Ze gaan eerst door een deterministische
humanizing-pipeline:

- `wobble`: kleine verplaatsing per punt
- `dropout`: onderbreekt lijnen
- `repeat`: tekent varianten boven elkaar
- `overshoot`: verlengt open lijnen voorbij begin/einde
- `drift`: verschuift herhalingen licht
- `rubout`: maakt uitgewiste zones
- `fray`: voegt korte rafelige lijntjes toe
- `hesitate`: voegt kleine haperingen toe
- `pressure`: varieert stroke weight/alpha in de schermweergave

De output blijft een lijst van polylines. Geen rasterfilter, geen pixelanalyse.

### Addressing laag

Elke vorm krijgt een `id` en blijft aanspreekbaar:

```js
plot.get(id);
plot.select(id);
plot.freeze(id);
plot.thaw(id);
plot.regenerate(id);
plot.remove(id);
plot.update(id, { wobble: 3 });
```

Dit is belangrijk voor iteratief werk: een tekstblok kan bevroren blijven terwijl
een cirkel opnieuw gegenereerd wordt.

### Drawing laag

`plot.draw()` tekent de gegenereerde polylines in p5.js met `beginShape()` en
`vertex()`. De schermweergave is dus dezelfde data als de exportdata.

### Export laag

De eerste versie bevat:

- `exportSVG()` voor plotbare SVG-paden
- `exportJSON()` voor data-uitwisseling en debugging
- `exportHPGL()` als eenvoudige eerste pen-up/pen-down export

Voor plotbaarheid worden extreem korte fragmenten weggefilterd en kunnen paden
met Ramer-Douglas-Peucker vereenvoudigd worden.

## 2. Interne datastructuur

Elke vorm wordt intern zo bewaard:

```js
{
  id: "hp_1",
  type: "line",
  params: {
    x1: 80,
    y1: 260,
    x2: 720,
    y2: 280
  },
  points: [
    { x: 80, y: 260 },
    { x: 88, y: 260.25 }
  ],
  paths: [
    [{ x: 80, y: 260 }, { x: 88, y: 260.25 }]
  ],
  closed: false,
  style: {
    stroke: "#111111",
    strokeWeight: 1,
    alpha: 1
  },
  seed: 1283912,
  human: {
    density: 1,
    wobble: 1,
    dropout: 0.05,
    hesitate: 0,
    overshoot: 8,
    repeat: 1,
    drift: 0,
    rubout: 0,
    fray: 0,
    pressure: 0,
    segmentLength: 8,
    seed: null
  },
  exportSettings: {
    simplify: 0.35,
    minSegmentLength: 1.5,
    layer: "default"
  },
  frozen: false,
  generated: [
    {
      points: [{ x: 72, y: 259 }, { x: 88.4, y: 260.6 }],
      style: { stroke: "#111111", strokeWeight: 1, alpha: 1 }
    }
  ]
}
```

`points` en `paths` zijn de oorspronkelijke gesamplede vectorvorm. `generated`
zijn de humanized paden die worden getekend en geexporteerd.

## 3. Basis API

```js
let plot;

function setup() {
  createCanvas(800, 800);
  plot = new GysinPlot({ seed: 1960 });

  plot.text("RUB OUT THE WORD", 80, 180, {
    size: 72,
    density: 1,
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

Vormen:

```js
plot.line(x1, y1, x2, y2, options);
plot.rect(x, y, w, h, options);
plot.circle(x, y, diameter, options);
plot.polygon(points, options);
plot.path(points, options);
plot.text(value, x, y, options);
plot.textCutup(value, x, y, options);
```

Export:

```js
let svg = plot.exportSVG({ width: 800, height: 800 });
let json = plot.exportJSON();
let hpgl = plot.exportHPGL({ scale: 40 });
plot.downloadSVG("gysin.svg");
```

## 4. Belangrijkste parameters

`density`
: Vermenigvuldigt het aantal samplingpunten. `1` is normaal; `2` geeft ongeveer
twee keer zoveel punten. Meer punten betekent fijnere wobble, maar ook grotere
exports.

`wobble`
: Maximale afwijking in pixels per punt. Dit maakt lijnen onvast zonder ze te
rasteren.

`dropout`
: Kans dat een punt of stukje lijn wordt overgeslagen. Dit maakt onderbroken
plotterlijnen.

`hesitate`
: Kans op kleine haperingen: een extra tussenpunt of mini-terugtrekking rond
een punt. Geeft mechanische twijfel.

`overshoot`
: Verlengt open lijnen voorbij hun begin en einde. Vooral bruikbaar bij
`line()` en open `path()`.

`repeat`
: Aantal bijna-identieke herhalingen van dezelfde vorm. Elke herhaling krijgt
een eigen drift en wobble.

`drift`
: Maximale globale verschuiving per herhaling. Goed voor slecht geregistreerde
druk of een plotter die opnieuw probeert.

`rubout`
: Sterkte van uitgewiste zones. De library maakt vectorzones en laat punten
binnen die zones wegvallen.

`fray`
: Voegt korte losse lijntjes toe aan contouren. Houd laag voor plotters.

`pressure`
: Varieert scherm-stroke weight en alpha. Voor echte penplotters is dit metadata
of een latere pen/snelheid-strategie.

`segmentLength`
: Gewenste afstand tussen gesamplede punten voor `density = 1`.

`seed`
: Seed per vorm. Zonder vormseed wordt een seed afgeleid uit de globale seed,
het object-id en het type.

## 5. Tekst

Gewone `text()` in p5.js geeft geen bruikbare fontcontouren terug. Daarom zijn
er meerdere strategieen:

1. **p5.Font `textToPoints()`**
   Wanneer `options.font` een p5.Font bevat, gebruikt `plot.text()` die methode.
   Dit is de beste MVP-route voor echte lettervormen.

2. **Opentype.js later**
   Een latere versie kan `opentype.js` gebruiken om contours, holes en glyphs
   correct te bewaren. Dat is sterker dan losse punten, maar voegt een dependency
   toe.

3. **Fallback vectorletters**
   Zonder font gebruikt de MVP een eenvoudige 5x7 vectorfont. Dat is bewust
   sober, plotbaar en begrijpelijk voor leerlingen.

4. **Tekst als contourmateriaal**
   Zodra tekst punten of contouren zijn, mag dezelfde humanizing pipeline erop
   losgelaten worden: dropout, repeat, rubout, drift, fray.

Tekstaantasting:

- horizontale cut-up slices
- verschoven letterstroken
- ontbrekende stukken
- herhaalde contouren
- versleten drukwerk via dropout/rubout
- rubout-zones die woorden gedeeltelijk laten verdwijnen

## 6. Brion Gysin modus

`plot.textCutup(value, x, y, options)` behandelt tekst niet als nette typografie
maar als materiaal.

Gedrag:

- verdeelt tekst in horizontale stroken
- verschuift stroken links/rechts
- laat sommige stroken of punten wegvallen
- herhaalt contouren met lichte drift
- gebruikt dezelfde plotbare polyline-output

Voorbeeld:

```js
plot.textCutup("I THINK THEREFORE I AM", 70, 370, {
  size: 58,
  slices: 9,
  sliceOffset: 18,
  sliceDropout: 0.12,
  wobble: 1.4,
  dropout: 0.08,
  repeat: 2,
  rubout: 0.18
});
```

## 7. Plotbaarheid

Plotbaarheid is een ontwerpeis, geen export-optie.

- Output blijft paden/puntlijnen.
- Geen blur, filter, canvas pixelread of raster erase als eindresultaat.
- Zeer korte fragmenten worden weggegooid.
- `simplify` vereenvoudigt overbodige punten.
- SVG gebruikt `path` met `fill="none"`.
- HPGL gebruikt `PU`/`PD` logica.
- JSON bewaart de bronvormen en gegenereerde paden.

Aanbevolen defaults voor plotters:

```js
{
  segmentLength: 8,
  simplify: 0.35,
  minSegmentLength: 1.5,
  dropout: 0.03,
  fray: 0.2
}
```

## 8. Addressing

Alle capture-methods retourneren een id:

```js
let titleId = plot.text("RUB OUT THE WORD", 80, 180, { wobble: 2 });
plot.freeze(titleId);
plot.update(titleId, { stroke: "#cc3333" });
plot.thaw(titleId);
plot.regenerate(titleId);
```

`freeze(id)` bewaart de gegenereerde paden. Een bevroren vorm verandert niet bij
`setSeed()` of `regenerate()`, tenzij je eerst `thaw(id)` aanroept.

## 9. Seeds

De globale seed bepaalt het geheel:

```js
plot = new GysinPlot({ seed: 12071960 });
```

Elke vorm krijgt daarna een eigen seed:

```js
plot.line(0, 0, 100, 0, { seed: 42 });
```

Regels:

- dezelfde globale seed + dezelfde calls = hetzelfde beeld
- dezelfde vormseed = dezelfde humanizing voor die vorm
- bevroren vormen veranderen niet
- `regenerate(id)` verandert alleen niet-bevroren vormen

## 10. Minimale eerste versie

Deze repository bevat een haalbare MVP:

- `line`
- `rect`
- `circle`
- `polygon`
- `path`
- eenvoudige `text` met `p5.Font.textToPoints()` of vectorfallback
- `textCutup`
- `wobble`
- `dropout`
- `repeat`
- `draw`
- `exportSVG`
- `exportJSON`
- eenvoudige `exportHPGL`
- addressing en seeds

Niet in de MVP:

- volledige opentype contourhierarchie
- boolean path operations
- echte pen pressure mapping
- multi-pen kleurplanning
- route optimization voor korte plottertijd

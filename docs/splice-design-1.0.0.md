# p5.gysin 1.0.0 — semantische cut-up

Status: implementatiecontract voor fase 5

Werknaam en aanbeveling: `splice()`

## Diagnose

`textCutup()` verandert de contour van één tekst. `GysinText.permute()`
verandert de volgorde van woorden binnen één korte frase. `chant()` tekent die
permutaties als steeds verder gesneden regels. `rub()` laat één woord grafisch
slijten.

Het ontbrekende gebaar ligt vóór het tekenen: fragmenten uit verschillende
bronnen moeten nieuwe buren krijgen. De botsing moet leesbaar blijven; anders
wordt semantisch toeval opnieuw alleen textuur.

## Bestaande contracten die blijven gelden

- `GysinText.permute(value, options)` blijft ongewijzigd.
- `textCutup()` blijft een grafische contoursnede.
- `chant()` blijft één frase permuteren en tekenen.
- `rub()` blijft één woord visueel slijten.
- `freeze()` bewaart de gegenereerde trace van een gekozen shape.
- `reroll()` verandert de tracevariatie van niet-bevroren shapes.
- `exportJSON()` serialiseert shape-params; provenance wordt daar bewaard.
- SVG en HPGL blijven de getekende traces exporteren.

`reroll()` verandert in 1.0.0 bewust niet stilzwijgend de woorden van een
bestaande shape. Een nieuwe semantische botsing ontstaat door `splice()` met
een andere seed opnieuw aan te roepen. Zo blijft een eenmaal gekozen zin
adresseerbaar en reproduceerbaar.

## Naamvergelijking

### `splice()` — aanbevolen

- Concreet: knippen en verbinden.
- Werkt voor tekst, tape, film en code zonder een historisch kostuum te worden.
- Kort naast `rub()`, `chant()` en `lattice()`.
- Nadeel: JavaScript kent `Array.prototype.splice()`. Deze methode muteert
  bronnen echter nooit en staat duidelijk onder `GysinText` of een plot.

### `interleave()`

- Technisch precies voor afwisseling.
- Te ordelijk: suggereert een vast weefpatroon in plaats van een snede.

### `crosscut()`

- Materieel en filmisch.
- Stuurt de uitkomst te sterk naar montage tussen exact twee bronnen, terwijl
  het contract twee of meer bronnen ondersteunt.

Besluit: `splice()`.

## Publieke API

### Pure taalbewerking

```js
const result = GysinText.splice(
  [
    { id: "a", text: "The first source ..." },
    { id: "b", text: "The second source ..." }
  ],
  {
    seed: 1960,
    lines: 4,
    unit: "phrase"
  }
);
```

Resultaat:

```js
{
  seed: 1960,
  unit: "phrase",
  lines: [
    {
      text: "a readable collision of fragments",
      fragments: [
        {
          source: "a",
          sourceIndex: 0,
          start: 4,
          end: 22,
          text: "readable collision"
        }
      ]
    }
  ]
}
```

Het resultaat en de geneste records zijn losgekoppeld van de invoer. De
bronteksten worden niet gewijzigd.

### Getekend gebaar

```js
const ids = plot.splice(sources, 60, 90);
```

Defaults:

```js
{
  seed: plot.globalSeed,
  lines: 4,
  unit: "phrase",
  fragments: 3,
  size: 26,
  leading: 42
}
```

Normale opties:

- `seed`
- `lines`
- `unit`: `"word"`, `"phrase"` of `"clause"`
- `size`
- `leading`

Advanced escape hatch:

- `fragments`: fragmenten per regel, geheel getal 2–6
- bestaande `text()`-materiaalopties zoals `breathe`, `dropout`, `stroke`,
  `layer` en `font`

De gewone defaults tekenen leesbare `text()`-regels. `splice()` gebruikt
standaard niet opnieuw `textCutup()`: de taalsnede moet zichtbaar blijven.

Return: `id[]`, één id per regel.

## Bronnen

Geaccepteerd:

```js
["plain string", "second string"]
```

of:

```js
[
  { id: "letter", text: "..." },
  { id: "notice", text: "..." }
]
```

Regels:

- minimaal 2 en maximaal 8 bronnen;
- iedere bron bevat zichtbare tekst;
- ids zijn uniek, niet leeg en worden als strings behandeld;
- plain strings krijgen ids `source-1`, `source-2`, enzovoort;
- maximaal 20.000 tekens per bron;
- invoerarrays en bronobjecten worden nooit gemuteerd.

## Fragmentatie

### `word`

Eén zichtbaar woord met aansluitende interpunctie. Whitespace is geen fragment.

### `phrase` — default

Een venster van twee tot vier opeenvolgende woorden. De seed bepaalt start en
lengte. Het venster overschrijdt geen bron.

### `clause`

Tekst tussen komma, puntkomma, dubbele punt, gedachtestreep, regelbreuk of
zinseinde. Afsluitende interpunctie blijft bij het fragment.

Ieder fragment bewaart:

- bron-id;
- bronindex;
- exacte `start`- en `end`-offset in de genormaliseerde bron;
- letterlijke fragmenttekst.

## Selectie en toeval

Per regel:

1. Kies een startbron met de seeded generator.
2. Kies volgende bronnen zonder dezelfde bron direct te herhalen wanneer een
   alternatief bestaat.
3. Neem standaard drie fragmenten.
4. Zorg dat minstens twee verschillende bronnen in iedere regel voorkomen.
5. Voeg fragmenten samen met één spatie en herstel spaties vóór interpunctie.
6. Weiger een dubbele regel en probeer begrensd opnieuw.
7. Stop na maximaal `lines × 80` pogingen; geef de unieke regels die bestaan.
8. Als niet minstens één regel kan worden gevormd, geef een duidelijke fout.

Dezelfde bronnen, opties en seed geven byte-identiek hetzelfde resultaat.

## Provenance in het plot

Iedere door `plot.splice()` gemaakte text-shape krijgt in `params`:

```js
{
  splice: {
    seed: 1960,
    unit: "phrase",
    line: 0,
    fragments: [...]
  }
}
```

`exportJSON()` neemt dit bestaande `params`-veld automatisch mee.

SVG en HPGL bewaren de zichtbare traces en shape-ids. Ze dupliceren de volledige
brontekst niet in path-attributen. Dat voorkomt opgeblazen of onbedoeld
publieke plotbestanden.

## Freeze en reroll

- `freeze(id)` bewaart de gekozen regel als exacte trace.
- `reroll(id)` verandert alleen de getekende variatie van die regel.
- Een nieuwe semantische variant gebruikt een nieuwe `seed` en een nieuwe
  `splice()`-aanroep.
- Het voorbeeld maakt deze grens zichtbaar als `new cut` tegenover
  `reroll ink`.

## Fouten

Expliciete fouten voor:

- minder dan twee of meer dan acht bronnen;
- lege of te lange bron;
- dubbele bron-id;
- onbekende `unit`;
- `lines` buiten 1–100;
- `fragments` buiten 2–6;
- ongeldige `size`, `leading`, `x` of `y`;
- `plot.splice()` zonder text-addon;
- een tokenisatie die geen bruikbare botsing kan maken.

## Voorbeeldsketch — 18 regels

```js
const sources = [
  { id: "window", text: "The window keeps the last light of the street." },
  { id: "letter", text: "Your letter arrived after the room was empty." }
];

let plot;

function setup() {
  createCanvas(700, 420);
  plot = new GysinPlot({ seed: 1960 });
  plot.splice(sources, 54, 90, {
    size: 25,
    leading: 58,
    breathe: 0.35
  });
  plot.draw();
  noLoop();
}
```

## Testcontract

### `GysinText.splice()`

- bronstrings en `{ id, text }`;
- twee en acht bronnen geldig;
- minder/meer ongeldig;
- lege, te lange en dubbele bron ongeldig;
- `word`, `phrase`, `clause`;
- onbekende unit ongeldig;
- `lines` en `fragments` grenzen;
- minstens twee bronnen per regel;
- exacte offsets leveren de fragmenttekst terug;
- determinisme;
- andere seed kan ander resultaat geven;
- unieke regels;
- invoer niet gemuteerd;
- source/min-build parity.

### `plot.splice()`

- addon vervangt de core-stub;
- zonder addon duidelijke fout;
- één id per resultaatregel;
- ids zijn adresseerbaar;
- provenance staat in `get(id).params.splice`;
- provenance staat in JSON;
- `freeze()` bewaart trace;
- `reroll()` verandert niet-bevroren trace, niet de tekst;
- SVG/HPGL bevatten de shapes;
- materiaalopties en layer gaan door;
- ongeldige coördinaten, size en leading geven duidelijke fouten;
- source/min-build parity.

## Niet bouwen

- geen externe URL-fetch;
- geen ingebouwd corpus;
- geen taalmodel of grammaticale reparatie;
- geen verborgen “beste regel”-scoring;
- geen automatische auteursvermelding buiten provenance;
- geen nieuwe UI in de core;
- geen semantische mutatie in algemeen `reroll()`;
- geen tweede intent verb in 1.0.0.

## Beslissing tijdens de marathon

Seb heeft menselijke controles expliciet naar het laatste blok verplaatst en
opgedragen de marathon niet te onderbreken. Daarom geldt dit afgebakende
contract als implementatiebasis voor fase 5. Naam, defaults en het uiteindelijke
beeld blijven gemarkeerd voor zijn slotcontrole; agents mogen het contract
onderweg niet uitbreiden.

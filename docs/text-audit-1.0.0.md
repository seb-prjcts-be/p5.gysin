# p5.gysin 1.0.0 — volledige tekstaudit

Datum: 25 juli 2026

Baseline: `6f179d8`

Status: beslislijst; publieke copy nog niet gewijzigd

## Methode

Iedere pagina is gelezen als interface, werk, referentie of historische
context. Passages zijn beoordeeld als:

- `HANDELING`
- `REFERENTIE`
- `DUBBEL`
- `INTERPRETATIE`
- `HISTORIE`

Beslisvolgorde: schrappen → verplaatsen → pas dan herschrijven.

## Sitebrede bevindingen

- “One call”, “the whole” en totaliserende varianten worden op homepage,
  voorbeelden, `Collage`, `README` en `System` herhaald.
- `System` mag technisch expliciet blijven; de herhaling op werken en homepage
  is meestal `DUBBEL`.
- Viewer- en toetsenbordhulp staat te vaak in artistieke introducties in plaats
  van bij controls.
- Meerdere werken hebben “How to read”, “What to look for” of een volledige
  interpretatieve legenda vóór het beeld.
- `Collage` is de grootste concentratie: bijna ieder hoofdstuk bevat een
  artistieke uitleg én drie technische herhalingen.
- De redirectpagina's zijn functioneel en behoeven geen nieuwe stem.

## Pagina-per-pagina beslissingen

### `index.html`

Classificatie: ingang + contact sheets.

- **Behouden:** hero, drie librarygroepen, titels, live previews, viewer,
  toegankelijke navigatie.
- **Schrappen:** de volledige “Click a tile…”-rondleiding en herhaalde
  “Everything/one call”-claims.
- **Verplaatsen:** pijlen, Enter en Escape naar zichtbare viewerhulp.
- **Herschrijven:** groepsintro's tot materiaal/methode; kaartcopy alleen waar
  het werk zonder label niet identificeerbaar is.
- **Niet doen:** aantal werken of visueel systeem wijzigen.

### `docs/collage/index.html`

Classificatie: montagegids, nu te veel lineaire cursus.

- **Behouden:** vijftien bestaande hoofdstukken, live previews, copyknoppen,
  code en materiaalvolgorde.
- **Schrappen:** interpretatieve totaalzinnen en technische drielingen die code
  herhalen.
- **Verplaatsen:** API-opties en exportdetails naar `System`.
- **Herschrijven:** per hoofdstuk maximaal één noodzakelijke passage vóór
  beeld/code.
- **Specifieke hotspots:** `Arrange`, `Wear`, `The collage`,
  `Take it with you`.

### `docs/system.html`

Classificatie: `REFERENTIE`.

- **Behouden:** volledige methode-, optie-, addressing- en exportinformatie.
- **Schrappen:** alleen interne duplicaten.
- **Toevoegen in 1.0:** de goedgekeurde semantische methode, provenance en
  foutgevallen.
- **Niet doen:** technisch materiaal poëtisch of korter maken ten koste van
  vindbaarheid.

### `README.md`

Classificatie: praktische start + distributie.

- **Behouden:** scripts, minimale sketch, bestandsstructuur, compatibility,
  tests en exportstart.
- **Schrappen:** herhaalde voorbeeldinterpretaties en meerdere verklaringen van
  dezelfde intent verbs.
- **Verplaatsen:** volledige API-opties naar `System`.
- **Herschrijven:** na implementatie één korte 1.0-start met de stabiele
  publieke oppervlakte.

### `docs/vision.html`

Classificatie: `HISTORIE` + projectpositionering.

- **Behouden:** ontstaansgeschiedenis, rechtenwaarschuwing en betrouwbare
  bronnen.
- **Controleren:** iedere biografische, technische en interpretatieve claim.
- **Schrappen:** promotionele totaliseringen en naamherhaling zonder functie.
- **Herschrijven:** de grens tussen historische methode en deze library sober.

### Redirects

Bestanden:

- `docs/about.html`
- `docs/curation-engine/index.html`
- `docs/examples.html`
- `docs/guide.html`

Beslissing: functionele redirectcopy behouden; alleen linkcheck uitvoeren.

## Voorbeelden

### `examples/worn_word/index.html`

- **Behouden:** `rub()`, drie passages, decay, freeze/thaw/reroll.
- **Schrappen:** “intent verb”, “whole sketch”, “one call”, vergelijking van
  regelaantallen en volledige betekenisboog.
- **Verplaatsen:** bediening bij controls.
- **Rol:** eerste piloot.

### `examples/permutation_poem/index.html`

- **Behouden:** eigen invoer, vier orders, order/seed-controls, exports.
- **Schrappen:** “How to read it”, voorgeschreven leesroute, lijst canonieke
  frases en volledige uitleg van elk beeldvlak.
- **Verplaatsen:** ordermodi en exportdetails naar utility/reference.
- **Rol:** tweede, complexe piloot.

### `examples/rotations/index.html`

- **Behouden:** palimpsest, kruising van machineveld en schrift, wear/freeze,
  turned export.
- **Schrappen:** volledige laag-voor-laag ontleding en “Everything stays
  addressable”.
- **Herschrijven:** één compacte passage; controls apart.
- **Rol:** richtingaanwijzer, geen letterlijk sjabloon.

### `examples/first_trace/index.html`

- **Behouden:** phrase cycle, seed/decay en reproductie.
- **Schrappen:** “Read it top to bottom” en volledige toestandinterpretatie.
- **Verplaatsen:** decay-toetsen naast control.

### `examples/ink_bleed/index.html`

- **Behouden:** verschil tussen subtractief en additief spoor, pen/blade.
- **Schrappen:** volledige beschrijving van alle drie rijen.
- **Verplaatsen:** knob, toetsen en fysieke exportdetails naar utility/System.

### `examples/frequencies/index.html`

- **Behouden:** vijf signalen, reproduceerbare reading, nieuwe reading.
- **Schrappen:** route langs ieder symbool en voorschrift hoe de score te
  decoderen.
- **Verplaatsen:** `R` bij de control.
- **Let op:** het werk mag abstract blijven; geen nieuwe signaalmythologie.

### `examples/gysin_demo/index.html`

- **Behouden:** typografische poster, controls, freeze en export.
- **Schrappen:** “battle cry”, biografische miniles, “What to look for”,
  zone-voor-zone interpretatie en dubbele keyboarduitleg.
- **Verplaatsen:** parameter- en sneltoetsinformatie naar controls.
- **Herschrijven:** titel/bron alleen wanneer historisch gestaafd.

### `examples/parameter_lab/index.html`

- **Behouden:** één slider ↔ één element, hover/touchrelatie, stats.
- **Inkorten:** effectopsomming wanneer labels dit al tonen.
- **Niet doen:** de noodzakelijke didactische helderheid hermetisch maken.

### `examples/font_outlines/index.html`

- **Behouden:** counters, hatch/cross-hatch, weave-control.
- **Schrappen:** volledige vooraflezing van het hele blad en “What to try”.
- **Verplaatsen:** controlgevolgen naast slider; counterlabel mag in het werk.

### `examples/plotter_export/index.html`

- **Behouden:** penmap, layers, downloads, reproduceerbaarheid en controls.
- **Schrappen:** “How to read it” en beeld-voor-beeld route.
- **Verplaatsen:** technische laagbeschrijving naar legenda/System.
- **Niet doen:** exportduidelijkheid verminderen.

### `examples/plotter_calibration/index.html`

- **Behouden:** A4, drie pennen, referentie/reroll, shortcuts en meetfunctie.
- **Schrappen:** de extreem lange inventaris van ieder meetvlak.
- **Verplaatsen:** zone-uitleg naar labels/legenda; shortcuts bij controls.
- **Niet doen:** kalibratie-informatie verbergen.

### `examples/typewriter/index.html`

- **Behouden:** concrete machinebeperkingen, fixed pitch, strike en
  `Sperrsatz` wanneer historisch gecontroleerd.
- **Schrappen:** “complete gesture”, “every option” en nostalgische uitweiding
  die geen methode verklaart.
- **Controleren:** Underwood/Burroughs-historische claims.

### `examples/the_letter/index.html`

- **Behouden:** brief als natuurlijke vorm, typed-over word, lowercase.
- **Schrappen:** “Look closely” en volledige route naar de vierde regel.
- **Herschrijven:** één korte passage; het blad toont de rest.

## Uitvoeringsvolgorde

1. `worn_word`
2. `permutation_poem`
3. menselijke stemcontrole aan het einde van de marathon
4. semantische methode ontwerpen en implementeren
5. homepage
6. overige voorbeelden
7. `Collage`
8. `System`, `README`, `Vision`
9. sitebrede anti-verwatering-review

## Buiten scope

- nieuw visueel ontwerp;
- werken verwijderen of toevoegen behalve het ene semantische voorbeeld;
- alle teksten dezelfde lengte geven;
- een globale zoek/vervangactie;
- nieuwe historische slogans of Gysin-frases als decoratie;
- bestaande redirects opruimen.

## Fase 10 — sitebrede hercontrole

Uitgevoerd op 25 juli 2026, na de consolidatie van homepage, voorbeelden,
Collage, System, README en Vision.

### Concrete overtreding

Dertien volledige voorbeeldsketches begonnen nog met varianten van hetzelfde
lange tutorialsjabloon: “New to p5.gysin?”, “the whole core”, “every option” en
een voorgeschreven leesroute van boven naar beneden. Die tekst stond niet meer
op de voorbeeldpagina, maar bleef bereikbaar via elke link naar de bronsketch.

Beslissing: de repetitieve kopcommentaren zijn vervangen door één tot drie
werk-specifieke technische regels. Uitvoerbare JavaScript, controls, ids en
beeldopbouw zijn niet gewijzigd.

### Bewust behouden

- “This page moved” op drie redirects: noodzakelijke routehulp.
- “the whole exported sheet” in System: precieze afbakening tussen
  shape-rotatie en paginarotatie.
- de ene tegenstelling “not as clean geometry but as fragile vector material”
  in Sebs persoonlijke oorsprongstekst: geen terugkerend sjabloon.
- de naam Gysin in Vision en in API-/bestandsnamen; op de werkpagina’s spreekt
  de methode zelf.
- korte technische commentaren waarin “whole” letterlijk een volledig vlak,
  spoor of exportblad aanduidt.

### Samenhang

De veertien werkintro’s tellen 7 tot 19 woorden en gebruiken geen vaste
openingszin. `worn_word` en `permutation_poem` blijven de twee korte
toonankers. Bedieningshulp staat bij controls of sneltoetsen; de actuele site
bevat 77 knoppen, 11 inputs en 2 tekstvelden. De signalenscan is handmatig
beoordeeld; er is geen globale vervanging uitgevoerd.

# Voorbeeld-conventie: simpel → rijk

Doel: wie een voorbeeld opent, ziet meteen dat de library klein is. De
elaboratie is optioneel en komt daarna. Een voorbeeld mag een kunstwerk zijn,
maar het mag nooit *lijken* alsof je die hele berg opties nodig hebt.

Aanleiding: alle 9 voorbeelden waren 200-355 regels, terwijl het echte minimum
drie regels is (`new GysinPlot` → `plot.text(...)` → `plot.draw()`). Er ontbrak
een on-ramp tussen die twee.

## Regel 1 - On-ramp-kop bovenaan elke `sketch.js`

Elke sketch begint met dit blok (namen/woorden per voorbeeld invullen):

```js
// ═══════════════════════════════════════════════════════════════════
//  <naam> - <één zin: wat je ziet>
// ═══════════════════════════════════════════════════════════════════
//  Nieuw met p5.gysin? De hele library is drie regels:
//
//      const plot = new GysinPlot({ seed: 1960 });
//      plot.text("WOORD", x, y);   // schone, mechanische tekst
//      plot.draw();
//
//  Alle opties hieronder (wobble, dropout, rubout, fill, cut-up, asemic…)
//  zijn OPTIONELE verstoring bovenop die kern. Defaults staan allemaal op
//  nul, dus een call zonder opties tekent gewoon schoon. Dit voorbeeld
//  bouwt de lagen op in volgorde - lees de genummerde secties hieronder
//  van boven naar beneden; elke sectie staat op zichzelf.
// ═══════════════════════════════════════════════════════════════════
```

## Regel 2 - Genummerde sectiebanners in de bouwfunctie

Binnen `buildPlot()` (of setup) krijgt elk teken-blok een banner:

```js
// ── 1 · <laag> ──────────────────────────────
```

De banners benoemen **compositielagen in teken-volgorde** (achter → voor), niet
moeilijkheidsgraad. De on-ramp-kop levert de moeilijkheids-opbouw; de banners
leveren de navigatie.

## Regel 3 - Teken-volgorde NIET veranderen

Herordenen van teken-calls verandert de afbeelding, om twee redenen:

1. Auto-geseede vormen (`asemic`, `letters`, `symbols`) gebruiken een oplopende
   teller in hun seed (`${seed}:asemic:${n}` in `p5.gysin.js`). Andere volgorde
   → andere seed → andere vorm.
2. Latere vormen tekenen bovenop eerdere (z-volgorde / overlap).

Dus: alleen commentaar en kop toevoegen; parameters, waarden en call-volgorde
blijven byte-voor-byte hetzelfde. Zo blijft de output identiek en blijven de
snapshot-tests groen.

## Regel 4 - De korte code wijst meteen naar de volledige compositie

Een `examples/<naam>/index.html` opent met de kleinste uitvoerbare artistieke
aanroep uit de compositie. Toon het echte librarywerkwoord, niet de interne
`GysinWorks`-bedrading. Als het werk een gedeelde `composition.js` heeft, staat
de directe link **Complete composition** er onmiddellijk naast. Kopieer de
volledige compositie niet naar HTML: één bron moet de waarheid blijven.

Voor oudere voorbeelden zonder gedeelde compositie blijft het complete
3-regel-minimum gelden tot ze gemigreerd zijn.

## Regel 5 - Eén werk, één canonieke compositie

Voor een werk dat op Enter én op een zelfstandige pagina verschijnt:

- Enter en `examples/<naam>/sketch.js` laden dezelfde
  `examples/<naam>/composition.js`.
- `composition.js` bevat alleen het werk: geen p5-lifecycle, DOM-controls,
  downloadknoppen, statuscopy of schermdecoratie.
- De twee contexten mogen schalen via `width` en `height`, maar gebruiken
  dezelfde tekst, seed, tekenvolgorde en grafische structuur.
- De Enter-plaat is één grafische gedachte. Bouw geen handmatige ladder van
  drie parameterstanden, tenzij die opeenvolging het eigenlijke werk is.
- Een methode als `chant()` of `weave()` mag meerdere regels opleveren: dat is
  één systeem en één call, geen verzameling losse demonstraties.
- Ongeveer 10 librarycalls of 40 compositieregels is een stopsignaal: verbeter
  dan eerst de abstractie in plaats van de orkestratie te verbergen.
- **Uitzondering:** meerdere elementen mogen wanneer ze sámen het concept zijn
  én de snippet ze allemaal benoemt (Plotter Calibration: frame + cirkels +
  arcering, alle drie in de `penMap`).
- **Intent verbs:** een kaart rond een intent verb (zoals `rub()`) draait op de
  defaults van dat verb; alleen wat de snippet toont (bv. `size`) wijkt af.

Doorgevoerd op alle 12 kaarten (juli 2026, Ink Bleed erbij); toets elke
nieuwe kaart hieraan.

## Regel 6 - Homepage-volgorde: schaal vóór methode

De homepage is een tentoonstelling, geen alfabetische API-catalogus. Elke
bibliotheek toont eerst op welke **schaal** ze werkt:

1. **Word**: `text()` en `rub()` isoleren één woordlichaam. Het krijgt formaat,
   positie, herhaling en slijtage.
2. **Surface**: `textCutup()` is een late, zeldzame contoursnede. Deze kaart
   staat apart van de woord- en zinsbewerkingen.
3. **Trace & page**: velden, inkt, kalibratie en export behandelen het blad.
4. **Sentence**: `chant()` en `weave()` laten volgorde, sequentie en bron
   leesbaar blijven.
5. **Sentence / page**: `underwood()` geeft langere stem vaste maat, regelval
   en marge.

De `.work-band`-opmaak maakt dat onderscheid zichtbaar vóór een bezoeker de
functienamen leest. Een nieuw voorbeeld krijgt eerst een schaal en pas daarna
een plaats in het bijbehorende bibliotheekblad.

## Regel 7 - Woord, zin en oppervlakte blijven verschillende gebaren

- **Woord:** groot of geïsoleerd; behandel het als één lichaam. `rub()` slijt
  standaard met `text()` en `asemic()`, zonder horizontale knip.
- **Zin:** behoud voldoende leesbaarheid om veranderende woordvolgorde,
  bronbotsing en ritme te kunnen volgen. `chant()` en `weave()` tekenen daarom
  standaard gewone tekstregels.
- **Oppervlakte:** `textCutup()` verschuift horizontale contourstroken. Het is
  geen historische cut-up en geen automatische tussenfase. Alleen een
  expliciete call of expliciete snij-optie mag het activeren.
- **Stem:** het ingebouwde single-stroke-alfabet, een outline-font en
  `underwood()` hebben elk een eigen materiële logica. Een Enter-plaat gebruikt
  dezelfde stem en compositie als haar volledige voorbeeld.

## Regel 8 - Geen lege toonvlakken ("tone blocks")

Abstracte fill-hatch-vlakken als compositievulling vallen uit de toon; alle
gevallen zijn verwijderd (jul 2026, Sebs besluit: "eerst volledig
verwijderen en eventueel vervangen door alternatief indien nodig").

- **Een blok op het blad bestaat uit dicht gezette lijnen, letters of
  tekens** - zie parameter_lab (lijnenblok van 9 rules), p5_editor (anker:
  kader + rules), gysin_demo (het letterveld ís de massa).
- **`fill` blijft in de API** en is er voor LETTERS (echte font-contouren),
  het calibratie-instrument (dat meet hatch-dichtheid voor die letters) en
  kleine data-markers (frequencies-diamanten). Nooit voor lege vlakken.

## Regel 9 - Ordeningscontract voor catalogus-pagina's (README & System)

README en `docs/system.html` zijn catalogus-pagina's: kort, opzoekbaar, met een
**vaste sectievolgorde** (het skelet). Een nieuwe release deponeert zijn nieuwe
laag ÍN het skelet, op de plek waar de lezer hem zoekt - niet naast het
nieuwste idee. De homepage en Collage/Vision zijn essay-pagina's en vallen
buiten dit contract; daar geldt Regel 6.

Het skelet, in volgorde:

1. **Laden** - de scriptbestanden, basic use, constructor/instance mode.
2. **Eerste sporen** - shape methods en hun opties (incl. tekst/fonts).
3. **Verstoren** - trace-parameters, ink accumulation.
4. **Componeren** - intent verbs, the turned sheet, de optionele addons.
5. **Adresseren** - ids, freeze/thaw, update, regenerate/reroll.
6. **Pagina en export** - page model, SVG/JSON/HPGL, stats, pen/blade.
7. **Meta** - compatibiliteit, input safety, test.

Doorgevoerd op 24 jul 2026 (eenmalige hersortering van beide pagina's, tekst
verbatim verplaatst). Toets elke nieuwe sectie hieraan: "in welke van de zeven
lagen zoekt een lezer dit?" - en zet hem daar, ook als het idee jonger is dan
alles eromheen.

## Regel 10 - Eén site, één menubalk

Interne voorbeelden blijven binnen de gewone sitenavigatie. Enter en Collage
wisselen bestaande platen of hoofdstukken in de normale documentstroom; zij
bedekken de hoofdnavigatie niet met een tweede menubalk.

- `target="_blank"` is alleen toegestaan voor externe websites.
- Een volledig voorbeeld mag zijn zelfstandige URL behouden, maar een interne
  link ernaartoe opent in hetzelfde tabblad.
- De Enter-tegels tonen precies één `.plate` en houden de primaire menubalk
  zichtbaar; links/rechts gebruikt hetzelfde sobere pijlenpatroon als Collage.
- `tools/check-links.js` bewaakt zowel lokale doelen als dit same-tab-contract.

## Checklist per voorbeeld

- [ ] On-ramp-kop toegevoegd, met het juiste woord/de juiste maten.
- [ ] Genummerde banners voor elk teken-blok.
- [ ] Teken-volgorde, parameters en waarden ongewijzigd.
- [ ] Het codeblok toont de kleinste aanroep en verwijst direct naar de
      canonieke compositie; zonder `composition.js` opent het met het
      3-regel-minimum (Regel 4).
- [ ] Sketch rendert nog identiek in de browser (`http://localhost/...`).
- [ ] `npm test` groen.
- [ ] Galerij en zelfstandige pagina laden dezelfde `composition.js`; p5/DOM en
      export blijven in `sketch.js` (Regel 5).
- [ ] Letterstem klopt: cut-up alleen als concept; kaart in de stem van het
      voorbeeld (Regel 7).
- [ ] Geen lege toonvlakken; een blok is lijnen/letters/tekens (Regel 8).
- [ ] Interne links blijven in hetzelfde tabblad en onder de gewone menubalk
      (Regel 10).

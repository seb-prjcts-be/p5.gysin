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

## Regel 4 - "Core snippet" op de pagina opent met het minimum

Elke `examples/<naam>/index.html` heeft een handgeschreven `<pre><code>` "Core
snippet". Die moet **openen met het complete 3-regel-minimum** ("dit alleen is
al een volledige sketch"), en pas daarna de elaboratie tonen. Dit is wat een
bezoeker op de site als eerste leest.

## Regel 5 - Showcase-kaarten: één concept, de snippet vertelt de waarheid

Voor de galerij-kaarten op de homepage (preview + korte snippet):

- **De preview tekent alleen wat de snippet beschrijft.** Elk element dat in de
  preview zichtbaar is, staat ook in de snippet - geen verborgen extra lagen,
  lussen of calls.
- **Liever variaties binnen één concept dan losse elementen.** Wil een kaart
  meer tonen dan één call, herhaal dan dezelfde call in oplopende staten
  (bv. hetzelfde woord op drie decay-niveaus, dezelfde cut-up op drie
  sliderstanden). Dat verbeeldt het concept; heterogene elementen verwateren
  het.
- **Uitzondering:** meerdere elementen mogen wanneer ze sámen het concept zijn
  én de snippet ze allemaal benoemt (Plotter Calibration: frame + cirkels +
  arcering, alle drie in de `penMap`).
- **Intent verbs:** een kaart rond een intent verb (zoals `rub()`) draait op de
  defaults van dat verb; alleen wat de snippet toont (bv. `size`) wijkt af.

Doorgevoerd op alle 12 kaarten (juli 2026, Ink Bleed erbij); toets elke
nieuwe kaart hieraan.

## Regel 6 - Homepage-volgorde: drie studies, dan methodes

De homepage is een tentoonstelling, geen catalogus. De vaste volgorde:

1. **Drie studies openen de pagina** onder de method-strip: CUT (Cut-Up
   Typography), PERMUTE (Permutation Poem), FREE (Worn Word). Zij dragen de
   boog cut -> permute -> free; Worn Word is als FREE-studie naar voren
   gehaald.
2. **Methods** groepeert de losse verb-voorbeelden (First Trace, Typewriter,
   Parameter Lab, Font Outlines, Frequencies).
3. **Learn & plot** sluit af met de praktische route (p5 Editor, Calibration,
   Export).

Secties wisselen licht/donker af; elke groep heeft een eigen intro-sectie
(`group-intro`). Een nieuw voorbeeld krijgt een plek in groep 2 of 3;
de drie studies blijven met z'n drieën.

## Regel 7 - Drie letterstemmen in balans; cut-up alleen als concept

De bibliotheek spreekt drie letterstemmen: het ingebouwde single-stroke-alfabet
(klein, plotter-veilig), echte outline-fonts (Oswald: koppen en gevulde
letters) en de `underwood()`-typemachine. Aanleiding (jul 2026): op Enter
stonden 7 kaarten in het ingebouwde alfabet tegenover 1 typemachine, en
`textCutup()` sloop in bijna elk voorbeeld.

- **`textCutup()` alleen waar snijden hét concept is** (CUT-studie,
  permutatie, p5_editor, het cut-up-stadium van first_trace). Elders:
  `text()` met outline-font, of `underwood()`.
- **Een galerij-kaart tekent in dezelfde letterstem als zijn volledige
  voorbeeld.** Laadt het voorbeeld Oswald, dan de kaart ook (helper
  `makeOutlinePreview` in `index.html`: async font-load, bitmap-fallback).
- **Houd de verdeling op Enter in het oog** - geen stem laten domineren.
  Stand jul 2026: 5 outline / 1 typemachine / 3 ingebouwd / 2 zonder type.

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

## Checklist per voorbeeld

- [ ] On-ramp-kop toegevoegd, met het juiste woord/de juiste maten.
- [ ] Genummerde banners voor elk teken-blok.
- [ ] Teken-volgorde, parameters en waarden ongewijzigd.
- [ ] "Core snippet" in `index.html` opent met het 3-regel-minimum.
- [ ] Sketch rendert nog identiek in de browser (`http://localhost/...`).
- [ ] `npm test` groen.
- [ ] Galerij-kaart (indien aanwezig): preview = snippet, variaties binnen één
      concept (Regel 5).
- [ ] Letterstem klopt: cut-up alleen als concept; kaart in de stem van het
      voorbeeld (Regel 7).
- [ ] Geen lege toonvlakken; een blok is lijnen/letters/tekens (Regel 8).

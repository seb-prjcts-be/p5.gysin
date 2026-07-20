# Voorbeeld-conventie: simpel → rijk

Doel: wie een voorbeeld opent, ziet meteen dat de library klein is. De
elaboratie is optioneel en komt daarna. Een voorbeeld mag een kunstwerk zijn,
maar het mag nooit *lijken* alsof je die hele berg opties nodig hebt.

Aanleiding: alle 9 voorbeelden waren 200-355 regels, terwijl het echte minimum
drie regels is (`new GysinPlot` → `plot.text(...)` → `plot.draw()`). Er ontbrak
een on-ramp tussen die twee.

## Regel 1 — On-ramp-kop bovenaan elke `sketch.js`

Elke sketch begint met dit blok (namen/woorden per voorbeeld invullen):

```js
// ═══════════════════════════════════════════════════════════════════
//  <naam> — <één zin: wat je ziet>
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
//  bouwt de lagen op in volgorde — lees de genummerde secties hieronder
//  van boven naar beneden; elke sectie staat op zichzelf.
// ═══════════════════════════════════════════════════════════════════
```

## Regel 2 — Genummerde sectiebanners in de bouwfunctie

Binnen `buildPlot()` (of setup) krijgt elk teken-blok een banner:

```js
// ── 1 · <laag> ──────────────────────────────
```

De banners benoemen **compositielagen in teken-volgorde** (achter → voor), niet
moeilijkheidsgraad. De on-ramp-kop levert de moeilijkheids-opbouw; de banners
leveren de navigatie.

## Regel 3 — Teken-volgorde NIET veranderen

Herordenen van teken-calls verandert de afbeelding, om twee redenen:

1. Auto-geseede vormen (`asemic`, `letters`, `symbols`) gebruiken een oplopende
   teller in hun seed (`${seed}:asemic:${n}` in `p5.gysin.js`). Andere volgorde
   → andere seed → andere vorm.
2. Latere vormen tekenen bovenop eerdere (z-volgorde / overlap).

Dus: alleen commentaar en kop toevoegen; parameters, waarden en call-volgorde
blijven byte-voor-byte hetzelfde. Zo blijft de output identiek en blijven de
snapshot-tests groen.

## Regel 4 — "Core snippet" op de pagina opent met het minimum

Elke `examples/<naam>/index.html` heeft een handgeschreven `<pre><code>` "Core
snippet". Die moet **openen met het complete 3-regel-minimum** ("dit alleen is
al een volledige sketch"), en pas daarna de elaboratie tonen. Dit is wat een
bezoeker op de site als eerste leest.

## Checklist per voorbeeld

- [ ] On-ramp-kop toegevoegd, met het juiste woord/de juiste maten.
- [ ] Genummerde banners voor elk teken-blok.
- [ ] Teken-volgorde, parameters en waarden ongewijzigd.
- [ ] "Core snippet" in `index.html` opent met het 3-regel-minimum.
- [ ] Sketch rendert nog identiek in de browser (`http://localhost/...`).
- [ ] `npm test` groen.

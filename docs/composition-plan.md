# Compositie-laag - stappenplan

**Doel (de noordster).** De library moet Brion Gysin / William Burroughs'
*"RUB OUT THE WORD"* (1961) kunnen bouwen met korte, logische functies - niet met
honderden regels handmatige coördinaat-rekenkunde zoals nu in
`examples/permutation_poem/sketch.js`.

Die referentie bestaat uit **vijf lagen**:

1. **Woordpermutatie-blok** - leesbare permutaties in een uitgelijnd raster met
   scheidingsglyphs (`+ & " //`).
2. **Letter-verval-veld** - woorden zakken door naar losse letters die permuteren
   en herhalen; hier en daar duikt weer een woord op.
3. **Symbool-textuur** - een blok met alleen typemachine-operatoren.
4. **Asemisch gebaren-raster** - kalligrafische pen-lussen, één gebaar per cel.
5. **Modulair kader-raster** - inkt-doorgelopen zwarte cellen, sommige verschoven.

## Twee materiaal-eisen (van Seb)

- **Gevulde letters.** Lettervormen zijn niet enkel omtrek, maar *ingevuld* - de
  solide type in het beeld. → **hatch-vulling** (parallelle plotterlijnen).
- **Verval met enkele plotterpunten.** Het letter-verval en de tabellen worden
  gerealiseerd met *losse plotterpunten*; de puntdichtheid ís het verval. →
  **dot-vulling**.

Dat zijn twee waarden van één simpel `fill`-concept, zodat de bibliotheek klein
blijft: `fill: "none" | "hatch" | "dots"`.

## Ontwerpprincipe: 3 concepten

Scheid **layout** (waar) van **veld** (wat) van **materiaal** (hoe het rafelt).
De hele poster wordt dan ~5 leesbare calls:

```js
const g = plot.grid(4, 6, { gap: 6, frame: { bleed: 0.3, wobble: 0.5 } });
g.at(0, 0).words("RUB OUT THE WORD", { orders: 5, gutter: ['+','&','"'] }); // laag 1
g.span(0, 1, 4, 3).letters("RUB OUT THE WORD", { fill: "decay" });          // laag 2
g.span(0, 4, 4, 1).symbols({ set: '+"#&/', density: 0.9 });                 // laag 3
g.span(0, 5, 4, 3).asemic({ perCell: 1, loops: 4, wobble: 3 });             // laag 4
```

Het materiaal-vocabulaire (`wobble/dropout/rubout/bleed/fill`) blijft overal
gelijk. De permutatie-engine (`GysinText`) blijft losgekoppeld en geeft strings.

## Stappen (elk los testbaar en gedocumenteerd)

| # | Stap | Levert | Status |
|---|------|--------|--------|
| 1 | **Vul-engine - hatch** | `fill: "hatch"` op vormen + outline-tekst = gevulde letters. Hergebruikt het lijn-trace-model, geen export-wijziging. | klaar |
| 1b | **Per-glyph variatie** | `glyphJitter` (standaard 0.35): elke letter krijgt een eigen affiene variatie zodat geen twee letters gelijk zijn; de vulling erft dat mee. | klaar |
| 2 | **Vul-engine - dots + verval** | `fill: "dots"` met dichtheids-gradiënt = losse plotterpunten; nieuwe "dab"-trace + SVG/HPGL-export. Realiseert laag 2 en de tabellen. | te doen |
| 3 | **Grid-ruggengraat** | `plot.grid(x,y,w,h,cols,rows,opts)` tekent een ink-bled kaderraster en geeft de cel-rechthoeken terug. Basis staat; `span/at`-API nog niet. | basis klaar |
| 4 | **Velden** | `plot.letters()` (verval-veld) en `plot.symbols()` (operator-textuur, `cluster`-optie) staan. `GysinText.permute` met `unit:"letter"` nog te doen. | grotendeels klaar |
| 5 | **Asemic** | `plot.asemic(x,y,w,h,opts)` - vloeiende cursieve gebaren via een draaiende walk met centrum-drift. | klaar |

## Bereikt (reproductie-loop, 5 iteraties)

Een reproductie van de referentie haalde gemiddeld ~8/10 op vier assen
(kunstzinnigheid/gelijkenis/grafiek/gebruiksgemak). De hele poster is nu ~30
leesbare calls. Nog open voor een hogere score op laag 2: `fill: "dots"` als
plotterpunt-verval (Sebs expliciete wens) en een dichter woord-ditto-raster.

## Regels tijdens het bouwen

- **Additief en veilig.** Nieuwe opties defaulten naar het oude gedrag, zodat
  bestaande sketches byte-identieke output houden (de snapshot-test bewaakt dit).
- **Klein houden.** Eén `fill`-concept met modi, niet tien losse functies.
- **Elke stap documenteren** in README, `docs/guide.html` en dit plan.
- **Testen in de échte context** (browser), niet enkel de node-snapshot.

## Migratiepad

Zodra stap 3–4 er zijn, wordt `examples/permutation_poem/sketch.js` herschreven
met `grid + velden` als levend bewijs dat de 291 regels handwerk verdwijnen.

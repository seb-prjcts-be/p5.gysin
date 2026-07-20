# API-redesign — klein plan: intentie-werkwoorden bovenop de primitieven

Status: **voorstel, wacht op Sebs akkoord.** Nog niets geïmplementeerd.

## De regel waar dit uit volgt
Sebs productregel (STATUS.md, 20 jul): de publieke hoofdroute lost problemen op
met **betekenisvolle werkwoorden en sterke defaults**. Seeds, sampling-details en
parameterbundels zijn **escape hatches**, niet de normale gebruikerservaring.

## De diagnose (kort)
De library geeft nu alleen *primitieven*: `line / rect / circle / text / textCutup
/ asemic / path / grid / letters / symbols`. Krachtig, maar low-level. Om iets
artistieks te maken orkestreer je alles zelf: stage-tabellen, een decay-multiplier,
per-vorm opties-bags van 10+ sleutels, de asemic-staart, fontfallback. Daarom zijn
de voorbeelden ~250 regels. De on-ramp-sweep (gecommit) kadert dat beter in, maar
**verkort het niet**. Dit plan neemt de orkestratie de library in.

## Het patroon: een intentie-werkwoord
Een intentie-werkwoord is een high-level methode die *intern* de bestaande
primitieven aanroept met sterke defaults, en een kleine oppervlakte toont. Het
erft gratis alles wat de kern al kan: determinisme, per-glyph-variatie, `freeze`/
`reroll`, SVG/HPGL-export, pen/blade. Regels:

1. **Eén zin werkt.** `plot.<verb>(inhoud, x, y)` levert een compleet, mooi
   resultaat zonder opties.
2. **Opties zijn opt-in escape hatches**, met dezelfde namen als de primitieven
   (`decay`, `wobble`, `stages`, …), zodat de power-user niets nieuws hoeft te
   leren.
3. **Geeft id's terug** (net als de primitieven) zodat `freeze`/`update`/`reroll`
   blijven werken.
4. **Additief.** Geen enkele bestaande methode verandert; de primitieven blijven
   de escape hatch onder het werkwoord.

> Naam gekozen: **`rub`** (het gebaar). `decayText` hieronder was de
> werktitel; overal `rub` lezen. `tippex` is geparkeerd als tweede, hárde
> wisser voor later (bedekken tot niets), niet dit trage verval.

## Eerste werkwoord om te bouwen: `rub()` (werktitel was `decayText`)

Dit is de grootste hefboom: `first_trace`, `gysin_demo`, `parameter_lab` en
`p5_editor` bouwen alle vier met de hand "een woord dat vervalt van leesbaar →
cut-up → asemic". Dat wordt één call.

```js
// vandaag: ~60 regels stage-tabel + decayed()-wrapper + loop + tangles
// straks:
plot.decayText("FIRST TRACE", 46, 248);              // compleet vervalverloop
plot.decayText("FIRST TRACE", 46, 248, { decay: 2 }); // sterker verval
plot.draw();
```

Voorgestelde signatuur en defaults:

```
plot.decayText(text, x, y, {
  size:   46,          // typemaat
  steps:  3,           // legible -> cut-up -> asemic
  decay:  1,           // één knop: schaalt wobble/dropout/rubout/fray over alle stappen
  drift:  "down-right",// richting waarin de stappen wegvallen
  tail:   true,        // asemic-tangles die de laatste kopie begraven
  font:   <plot-default of bitmap>,
  // escape hatches:
  stages: [...],       // eigen stap-descriptoren i.p.v. de ingebouwde 3
  gap, spread, ...     // fijnregeling van de layout
}) -> id[]             // adresseerbaar per stap
```

Intern is dit exact de `STAGES`/`TANGLES`/`decayed()`-logica uit `first_trace`,
nu met defaults in de library. Meetbare winst: het teken-lichaam van `first_trace`
zakt van ~60 regels naar ~5. Die meting is de go/no-go voor meer werkwoorden.

## Kandidaten voor later (NIET nu bouwen — alleen richting)
- `score(rows, x, y, w, h, opts)` — de herhaalbare datascore van `signal_score`
  (meerdere `path`-signalen + notatie + pieken) als één datagedreven call.
- Fontfallback als plot-optie: `new GysinPlot({ font })` zodat elk werkwoord dat
  automatisch erft (geen per-call `if (font)`-gedoe meer).
- `calibrationSheet(page)` en de export-workflow zijn al vrij declaratief; laag
  prioriteit.

UI (knoppen/sliders) blijft in de sketch — dat is niet de taak van de library.

## Aanpak, gefaseerd
1. **Alleen `decayText()`** implementeren in `p5.gysin.js`, met snapshot-tests
   (determinisme, opt-out, id-adressering, export erft mee).
2. `first_trace` herschrijven naar de één-regel-versie bovenaan, met de
   handmatige primitief-versie eronder als "hoe het werkwoord van binnen werkt"
   (sluit aan op de on-ramp-conventie: simpel → rijk).
3. Meten: regelwinst op `first_trace`. Bij duidelijke winst → `gysin_demo`,
   `parameter_lab`, `p5_editor` omzetten en pas dan een tweede werkwoord wegen.
4. Release-stappen: `node tools/build-min.js`, `node tools/gen-manifest.js`,
   `npm test`, README + `docs/guide.html` bijwerken.

## Wat ik van Seb nodig heb om te starten
- Akkoord op de **naam** `decayText` (alternatief: `decay`, `fade`, `erode`).
- Akkoord op de **oppervlakte** hierboven (defaults + escape hatches).
- Bevestiging dat we met **één** werkwoord beginnen en meten vóór we uitbreiden.

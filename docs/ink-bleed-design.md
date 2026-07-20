# Selectieve inktopbouw - ontwerpnotitie

Status: geïmplementeerd in de core op 14 juli 2026; deze notitie bewaart de materiaal- en veiligheidsbeslissingen achter de API.

## Waarom dit nodig is

De historische Gysin-referentie die Seb op 14 juli 2026 aanleverde toont twee tegengestelde processen:

1. **inkt wegnemen** - tekstdelen vallen uit, worden onderbroken of uitgewist;
2. **inkt opbouwen** - bepaalde tekstfragmenten worden enkele keren opnieuw geraakt en krijgen daardoor de densiteit van bleed, overprint of een versleten lint dat plaatselijk blijft hangen.

`dropout` en `rubout` modelleren vandaag vooral het eerste proces. Het bestaande `repeat` + `drift` herhaalt een volledige vorm en is te grof voor het tweede proces. Bij bijna identieke volledige contouren kan het bovendien papier beschadigen.

Dit is geen louter visueel effect: het is een ontbrekende **additieve tegenhanger** van dropout.

## Gewenst gedrag

- De selectie gebeurt in **aaneengesloten fragmenten** langs een tekstcontour, niet als losse willekeurige punten.
- Alleen sommige fragmenten krijgen één of meer extra passages.
- Extra passages hebben een kleine, seeded verschuiving zodat ze als inktspreiding lezen en niet als een exact dubbel pad.
- Dezelfde seed levert dezelfde fragmentkeuze en verschuivingen.
- Preview, SVG en HPGL gebruiken dezelfde echte vectorpaden; geen rasterfilter dat in export verdwijnt.
- De standaard blijft uitgeschakeld en verandert bestaand gedrag niet.

## API

```js
plot.textCutup("RUB OUT THE WORD", 80, 180, {
  bleed: 0.22,       // aandeel van de contourlengte dat extra inkt krijgt
  bleedPasses: 2,    // maximaal aantal extra passages per gekozen fragment
  bleedSpread: 0.8,  // maximale seeded verschuiving in canvas-eenheden
  bleedCluster: 18   // gewenste lengte van een aaneengesloten fragment
});
```

`bleed` hoort bij de menselijke lijnkarakteristieken en werkt daarom op tekst én op de andere vectorprimitieven. Voor het Gysin-materiaal blijven `text()` en `textCutup()` de belangrijkste toepassingen.

## Plotterveiligheid

- Geen exacte kopie van een volledig pad genereren.
- `bleedPasses` laag begrenzen, voorlopig maximaal 3 extra passages.
- Een minimumspreiding is verplicht: actieve bleed weigert `bleedSpread` onder 0.1.
- Statistieken bevatten `extraPasses`, `bleedPaths`, `bleedLength`, `overdrawRatio` en `maxLocalPasses`.
- `tool: "blade"` filtert iedere tweede en latere passage uit SVG, HPGL en statistieken; `tool: "pen"` bewaart ze.
- In het Lab duidelijk onderscheiden: **single pass**, **pen bleed** en **blade safe**.

## Implementatieschets

1. Verdeel na sampling iedere contour op booglengte in fragmentclusters.
2. Kies clusters met een seeded generator en een coverage-doel in plaats van een kans per punt.
3. Maak alleen voor gekozen clusters extra traces.
4. Verschuif iedere extra trace coherent met zachte variatie; vermijd puntgewijze ruis die kartels maakt.
5. Laat de bestaande dropout/rubout-pipeline en bleed samenwerken: eerst structuur beschadigen, daarna selectief inkt opbouwen.

## Vereiste regressietests

- `bleed: 0` is byte-/snapshot-compatibel met het huidige gedrag.
- Zelfde seed geeft dezelfde gekozen fragmenten.
- Geen extra trace is exact gelijk aan de brontrace.
- Het ingestelde maximum aantal passages kan nergens worden overschreden.
- Bleed werkt na `GysinText.permute()` omdat de permutaties gewone strings blijven die door `textCutup()` gaan.
- SVG-, HPGL- en stats-uitvoer tellen de extra passages werkelijk mee.

## Lab-integratie

`p5.gysin_lab` krijgt een paneel **Ink accumulation**. Het Lab toont de additieve as naast dropout, verwart beide niet, en maakt bij hogere waarden de fysieke plotterwaarschuwing zichtbaar. De keuze pen/blade moet preview, export en statistiek samen sturen.

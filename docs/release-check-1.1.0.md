# Technische releasecontrole — p5.gysin 1.1.0

Uitgevoerd op 26 juli 2026 op branch `codex/release-v1.1.0`, vanaf
`main`-commit `a6c3ce8`. Dit is lokaal controlebewijs; er is nog geen commit,
tag, GitHub Release of versioned CDN-publicatie uitgevoerd.

## Releasegrens

- De publieke releaseversie gaat van 1.0.1 naar 1.1.0 omdat twee nieuwe
  achterwaarts compatibele methoden worden toegevoegd:
  `GysinPlot.exportPlotterSVG()` en `GysinPlot.downloadPlotterSVG()`.
- De v1.0.1-build heeft 39 aanroepbare publieke ingangen; de voorbereide
  v1.1.0-build heeft er 41. Er is niets verwijderd.
- De API/docs-contracttest telt daarnaast de constructor als publieke ingang
  en controleert zo 42 ingangen tussen bron, browserbuilds, System en manifest.
- `tools/manifest.curated.json` markeert de plotterroute niet langer als
  `next`/release candidate, maar als stabiel en toegevoegd in 1.1.0.

## Build en statische controles

- `npm run build:min`: groen; core 103.086 bytes, text 18.848 bytes,
  underwood 16.252 bytes.
- `npm run manifest`: groen; versie 1.1.0 en veertien voorbeelden.
- `npm test`: snapshot, API/docs-contract en 22 lokale links groen.
- Alle 31 gevolgde JavaScriptbestanden slagen voor `node --check`.
- Actuele versie-uitingen en CDN-snippets staan op 1.1.0; de resterende
  v1.0.1-verwijzingen zijn uitsluitend historische releasebestanden.
- `git diff --check`: groen.

## Lokale site en echte browser

- Alle 22 gevolgde HTML-routes antwoorden via XAMPP met HTTP 200.
- Chrome controleerde die 22 routes op 1400 × 900 en 390 × 844:
  44 controles zonder consolefout, paginastoring of horizontale uitloop.
- In de echte lokale browserbuild waren alle 42 manifestingangen aanwezig.
- `exportPlotterSVG()` leverde 210 × 297 mm, een echte Inkscape-laag,
  pennummer 1, één 0,1 mm-centerline en geen `opacity`.
- De generieke `exportSVG()` bleef vrij van plotter/Inkscape-attributen.
- `downloadPlotterSVG()` veroorzaakte een echte browserdownload:
  `release-1.1.0-test.svg`, 1.541 bytes, met geldige A4-maat en Inkscape-laag.

## Publicatiegrens

De gedocumenteerde `@v1.1.0`-CDN-paden worden pas bereikbaar nadat Seb
expliciet toestemming geeft om de release te committen, taggen en pushen.
Daarna moeten de drie jsDelivr-bestanden live met de tagbestanden worden
vergeleken. De bestaande v1.0.1-tag blijft onaangeroerd.

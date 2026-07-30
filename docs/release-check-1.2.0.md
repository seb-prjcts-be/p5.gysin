# Technische releasecontrole — p5.gysin 1.2.0

Uitgevoerd op 30 juli 2026 op `main`, vanaf commit `0214744`. Dit document
legt de controle vóór publicatie vast; de uiteindelijke tag, GitHub Release,
jsDelivr-assets en Pages-publicatie worden na de release afzonderlijk live
geverifieerd.

## Releasegrens

- De publieke releaseversie gaat van 1.1.0 naar 1.2.0 omdat een nieuwe,
  achterwaarts compatibele mogelijkheid wordt toegevoegd: ingebouwde fysieke
  ISO-pagina's via `page: "A5"`, `"A4"`, `"A3"` en `"A2"`.
- De pagina's leveren exacte millimeterafmetingen, 10 mm marge, linksboven als
  oorsprong, geometrische clipping en een breedteschaal vanuit het canvas.
- Er wordt geen publieke methode verwijderd of toegevoegd. Bron, minified
  builds, System en manifest blijven 42 publieke ingangen delen.
- Bestaande custom page objects blijven geldig voor bewuste composities,
  gecentreerde vierkanten en kalibratie.

## Build en statische controles

- `npm run build:min`: groen; core 104.949 bytes, text 18.848 bytes,
  underwood 16.252 bytes.
- `npm run manifest`: groen; versie 1.2.0 en veertien voorbeelden.
- `npm test`: snapshots, 42-ingangen-API/docs-contract en 22 lokale links
  groen.
- Alle 32 gevolgde JavaScriptbestanden slagen voor `node --check`.
- `git diff --check`: groen.

## Lokale site en headless browser

- Alle 23 gevolgde HTML-routes antwoorden via XAMPP met HTTP 200.
- Headless Chrome controleerde die routes op 1.400 × 900 en 390 × 844:
  46 controles zonder paginafout of horizontale uitloop.
- De enige 404 was de bekende impliciete aanvraag naar
  `http://localhost/favicon.ico`; alle projectbestanden laadden.

## Functionele exportcontrole

- Bron en minified build geven dezelfde ISO-pagina's en uitvoer.
- De manifesten van v1.1.0 en v1.2.0 bevatten exact dezelfde 42 publieke
  ingangen; er is niets toegevoegd of verwijderd.
- A5, A4, A3 en A2 leveren de verwachte exacte afmetingen en 10 mm marge.
- De bestaande bytegelijkheidscontrole voor de A3-compositie blijft groen.
- Een echte headless-Chromeproef van HPGL op A4 downloadde hetzelfde bestand
  als `exportHPGL()` retourneerde; de punten bleven binnen de fysieke marge.

## Publicatiegrens

De `@v1.2.0`-CDN-paden worden pas bereikbaar nadat de releasecommit, de
annotated tag en de GitHub Release zijn gepubliceerd. Daarna worden bron,
tag en jsDelivr byte voor byte vergeleken en worden Pages en live voorbeelden
op inhoud gecontroleerd. De bestaande v1.1.0-tag blijft onaangeroerd.

## Gedaan
- `GysinText.permute()` toegevoegd als zelfstandige optionele module; iedere gegenereerde regel kan daarna door de bestaande `textCutup()`-pipeline.
- Monochrome A3-permutatieposter toegevoegd, geïnspireerd door dichte tekstvelden, gecodeerde kolommen en modulaire rasters.
- README en docs-site uitgebreid met de tweestapsmethode en het nieuwe voorbeeld.
- P5.js 2.x-tekst gebruikt nu afzonderlijke `textToContours()`-paden met de juiste `textSize`; regressietest bewaakt horizontale tekstbounds.
- Alle `repeat`/`drift`-retracing uit de permutation-poster verwijderd, zodat dichte partijen niet meermaals bijna identiek worden geplot.
- De herstelde poster in de lokale browser gecontroleerd: horizontale tekstvelden, geen zwarte snijkolom en geen browserwaarschuwingen of -fouten.

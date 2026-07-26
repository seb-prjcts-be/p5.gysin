# Plotter-safe SVG export contract

Datum: 26 juli 2026
Status: basis uitgevoerd op `main` in commit `72b7fdc`; genummerde
Inkscape-lagen zijn de lokale vervolgcorrectie van 26 juli 2026.

## Aanleiding

De directe `downloadSVG()`-export van `gysin-remembers (1).svg` was geldig en
plotbaar, maar niet zelfstandig plotterveilig:

- de impliciete canvaspagina gebruikte `px`;
- clipping en routesortering waren opt-in;
- geometrie buiten de `viewBox` bleef in de paden staan;
- semantische penlagen zaten onder één decoratieve SVG-groep;
- opacity en verschillende stroke-widths suggereerden fysieke verschillen die
  een pen niet automatisch kan uitvoeren.

De bestaande functies konden elk technisch onderdeel al uitvoeren. Het
probleem zat in het exportcontract: de gebruiker moest de veilige combinatie
zelf kennen en telkens opnieuw samenstellen.

## Afgewogen oplossingen

### 1. De defaults van `exportSVG()` en `downloadSVG()` wijzigen

Afgewezen. Automatisch clippen en routes herschikken zou bestaande scherm-SVG's
en bewust gekozen tekenvolgordes veranderen. De bestaande export moet
bytecompatibel blijven.

### 2. Alleen documentatie of een vpype-nabewerking aanbieden

Afgewezen als hoofdoplossing. Dat kan oude bestanden redden, maar schuift de
verantwoordelijkheid opnieuw naar de gebruiker en maakt een externe tool
verplicht.

### 3. Een optie zoals `{ plotter: true }` toevoegen

Afgewezen als publieke hoofdroute. Ze is klein, maar opnieuw een instelling die
men moet onthouden en maakt het verschil tussen scherm- en plotterexport slecht
zichtbaar.

### 4. Een expliciete intentieroute toevoegen

Gekozen: `exportPlotterSVG()` en `downloadPlotterSVG()`. De methodenaam zegt wat
het resultaat moet zijn en kan daarom veilige defaults afdwingen zonder het
bestaande SVG-contract te breken.

## Contract

De plotterroute:

1. vereist een expliciete pagina met `width`, `height` en fysieke units
   `mm`, `cm` of `in`;
2. forceert geometrische clipping op de paginagrenzen;
3. sorteert routes standaard binnen iedere fysieke pengroep;
4. schrijft elke penlaag als een echte Inkscape-laag rechtstreeks onder de
   SVG-root; de zichtbare laagnaam begint met het fysieke nummer uit
   `penMap`, bijvoorbeeld `1 black`, `2 red`, `3 blue`; zonder map gebruikt
   de route een deterministische volgorde vanaf 1;
5. splitst een laag met meerdere stroke-kleuren automatisch in afzonderlijke
   pengroepen;
6. bewaart bij `tool: "pen"` alle bewuste herhalingen en bleed-passes;
7. schrijft centerlines zonder opacity of variabele stroke-width, met één
   uniforme `0.1mm` haarlijn die alleen de SVG-preview zichtbaar houdt;
8. noemt `alpha`, `strokeWeight` en daarvan afgeleide `pressure`-schermstijl
   permanent als genegeerd in SVG-metadata; alleen een fysiek uitvoerbare actie,
   zoals automatisch gesplitste kleurengroepen, wordt nog als waarschuwing
   gemeld;
9. weigert optimalisatie duidelijk wanneer één pengroep meer dan 2.000 traces
   bevat; het oude totaalmaximum geldt niet meer over onafhankelijke lagen heen.

`optimize: false` blijft een bewuste escape hatch wanneer de fysieke
tekenvolgorde belangrijker is dan reistijd, bijvoorbeeld bij natte inkt.
Clipping kan in de plotterroute niet worden uitgezet; daarvoor blijft de
generieke `exportSVG()` bestaan.

## Voor het onderzochte 720 x 900-bestand

```js
plot.downloadPlotterSVG("gysin-remembers.svg", {
  page: {
    width: 210,
    height: 297,
    units: "mm",
    margin: { top: 23.5, right: 5, bottom: 23.5, left: 5 },
    scale: 200 / 720
  },
  penMap: { [INK]: 1, [RED]: 2 },
  tool: "pen"
});
```

Deze correctie verplaatst of hertekent geen enkel compositie-element. De vorm
die bewust boven de canvasrand staat, blijft in de sketch staan en wordt alleen
in het fysieke exportbestand op de pagina afgesneden.

## Verificatiegrenzen

De automatische tests moeten bewijzen dat:

- source en distributiebundel hetzelfde plotter-SVG produceren;
- generieke SVG-export bytegelijk blijft aan de vorige bron;
- negatieve buitengeometrie werkelijk uit de path data verdwijnt;
- routes standaard per pengroep worden gesorteerd en expliciet bewaard kunnen
  blijven;
- penpasses 2 en 3 in penmodus aanwezig blijven;
- schermstijl niet als opacity of variabele lijndikte in het plotter-SVG staat;
- waarschuwingen en top-level penlagen in het echte SVG staan;
- iedere plotterlaag een echte Inkscape-laag is en de zichtbare namen in
  fysieke penvolgorde met `1`, `2`, `3` beginnen;
- de generieke scherm-SVG geen Inkscape-attributen krijgt;
- meer dan 2.000 traces verdeeld over veilige lagen niet ten onrechte worden
  geweigerd.

Een machineproef blijft nodig vóór een releaseclaim over specifieke
plotterhardware. SVG-structuur kan penliftvertraging, natte inkt, mesdruk of
drivergedrag niet simuleren.

## Publieke basisinstellingen

Het bestaande Plotter Export-postervoorbeeld is de zichtbare instap voor het
contract. De vrije vierkante maatregelaar is verwijderd. De enige keuzes zijn
exacte staande ISO-formaten A4 (210 × 297 mm), A3 (297 × 420 mm) en A2
(420 × 594 mm), met centerlines, geometrische clipping, route-optimalisatie en
drie fysieke pennen. Het vierkante werk wordt met minstens 5 mm marge
gecentreerd en passend geschaald; de schermcompositie blijft op 560 × 560 staan.

Het Plotter Calibration-blad gebruikt eveneens alleen fysieke variabelen:
millimeters, arceerafstand, geometrische verstoring en één tot zes echte
penpassages. `alpha`, `strokeWeight` en `pressure` zijn uit beide
plottervoorbeelden verwijderd. Ze blijven uitsluitend beschikbaar voor
schermweergave en de generieke SVG-route.

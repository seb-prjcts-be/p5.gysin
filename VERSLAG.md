# Auditverslag p5.gysin

Datum: 11 juli 2026

Versie in repository: 0.2.0

Scope: huidige lokale werkboom, inclusief reeds aanwezige niet-gecommitte wijzigingen

> Implementatiestatus 12 juli 2026: de correctheidsproblemen uit dit verslag zijn
> verwerkt op `codex/fix-audit-findings`. Gesloten paden, atomische updates,
> tuple-normalisatie, prototypeveilige lagen, instance-afmetingen, uitvoerlimieten,
> SVG-precisie en read-only snapshots hebben regressietests. De site kreeg mobiele
> navigatie, zichtbare acties, canvasbeschrijvingen, live status en uitgebreidere
> documentatie. p5.js 1.x is niet langer een supportclaim; echte geautomatiseerde
> browsertests en een snellere routeplanner blijven vervolgwerk.

## 1. Samenvatting

`p5.gysin` is een compacte, dependencyvrije p5.js-library die gewone geometrie en tekst omzet in reproduceerbare, menselijk verstoorde vectorlijnen. De basis is sterk: dezelfde gegenereerde polylines worden gebruikt voor canvasweergave, SVG, JSON, HPGL en statistieken. Daardoor is het conceptueel model helder en blijft de uitvoer plottergericht.

De repository is bruikbaar als experimentele library en inspirerende showcase. De standaardtests slagen volledig. Toch is versie 0.2.0 nog niet robuust genoeg om zonder voorbehoud als afgewerkte plotterlibrary of zelfstandige lesbron te beschouwen. De belangrijkste redenen zijn:

1. gesloten vormen krijgen bij `wobble` een zichtbare open naad;
2. `update()` is niet atomair en kan na een fout interne state beschadigen;
3. speciale geldige laagnamen kunnen HPGL-export en statistieken breken;
4. instance-mode gebruikt zonder expliciete maat ten onrechte 800 x 800 voor export;
5. de compatibiliteitsclaim voor p5.js 1.x en 2.x wordt niet in echte browsers getest;
6. mobiele navigatie en delen van de publieke documentatie zijn onvolledig.

Eindoordeel: **sterk concept en goede kernarchitectuur, maar enkele middelgrote tot hoge correctheidsproblemen moeten vóór een stabiele release worden opgelost.**

## 2. Onderzoeksmethode

Het project is vanuit vier perspectieven onderzocht:

- architectuur en API-ontwerp;
- bugs, randgevallen, veiligheid en prestaties;
- gebruiker, leerling, docent en toegankelijkheid;
- onderhoud, distributie en documentatie.

Uitgevoerde controles:

- volledige inspectie van broncode, documentatie, voorbeelden en tooling;
- `npm test`;
- gerichte Node/VM-reproducties op de echte broncode;
- vergelijking van bronbestand en browserbuild;
- controle van lokale links, manifest en voorbeeldinventaris;
- controle van p5.js global mode, instance-mode-aannames en 1.x/2.x-documentatie.

De reeds aanwezige wijzigingen aan `docs/examples.html`, `examples/font_outlines/sketch.js` en het nieuwe Oswald-fontbestand zijn niet aangepast.

## 3. Werking van de library

### 3.1 Publieke ingang

De library publiceert één klasse, `GysinPlot`, via een IIFE als globale browsernaam. Als p5.js al geladen is, worden ook `p5.GysinPlot` en `p.createGysinPlot()` toegevoegd (`p5.gysin.js:6-7`, `p5.gysin.js:133-147`, `p5.gysin.js:1556-1563`).

Een plot bewaart:

- een globale seed;
- standaardinstellingen voor vervorming, stijl en export;
- een geordende lijst vormen;
- een `Map` voor snelle opzoeking via id;
- pagina- en canvasinstellingen.

### 3.2 Verwerkingsketen

De architectuur volgt consequent vijf stappen:

1. **Capture**: `line`, `rect`, `circle`, `polygon`, `path`, `text` of `textCutup` registreert een vorm (`p5.gysin.js:149-194`).
2. **Sampling**: geometrie wordt omgezet naar puntpaden (`p5.gysin.js:573-644`).
3. **Tekstomzetting**: echte fontcontouren, `textToPoints()` of een ingebouwd 5x7-vectorfont (`p5.gysin.js:647-729`, `p5.gysin.js:1211-1268`).
4. **Humanizing**: wobble, dropout, repeat, drift, rubout, fray, hesitate, overshoot en pressure worden deterministisch toegepast (`p5.gysin.js:774-849`).
5. **Weergave/export**: dezelfde `generated` traces gaan naar p5.js, SVG, JSON, HPGL of statistieken (`p5.gysin.js:196-225`, `p5.gysin.js:332-450`, `p5.gysin.js:529-558`).

Dit gedeelde datamodel is de belangrijkste architecturale sterkte van het project.

### 3.3 Determinisme en addressing

Een eigen pseudo-randomgenerator maakt uitvoer reproduceerbaar (`p5.gysin.js:111-130`). Elke vorm krijgt een afgeleide seed en variatie-index. De API ondersteunt:

- `get()` en `select()`;
- `freeze()` en `thaw()`;
- `regenerate()` met dezelfde seed;
- `reroll()` met een nieuwe reproduceerbare variatie;
- `update()` en `remove()`;
- `setSeed()` voor het geheel.

Zie `p5.gysin.js:227-330`.

### 3.4 Export

- **SVG**: fysieke maten, metadata, lagen, clipping en stijl (`p5.gysin.js:332-360`).
- **JSON**: bronvormen en optioneel gegenereerde traces (`p5.gysin.js:363-370`).
- **HPGL**: penkeuze, snelheid, batching en schaal (`p5.gysin.js:373-406`).
- **Stats**: tekenafstand, reisafstand, bounds, lagen en tijdsschatting (`p5.gysin.js:421-449`).
- **Page model**: units, marges, origin, rotatie, schaal en clipping (`p5.gysin.js:503-558`, `p5.gysin.js:1011-1027`).

## 4. Functieoverzicht

| Groep | Functies | Beoordeling |
|---|---|---|
| Geometrie | `line`, `rect`, `circle`, `polygon`, `path` | Heldere, kleine capture-API met basisvalidatie |
| Tekst | `text`, `textCutup` | Sterke fallbackstrategie; echte fontcontouren worden waar mogelijk behouden |
| Verstoring | `wobble`, `dropout`, `hesitate`, `overshoot`, `repeat`, `drift`, `rubout`, `fray`, `pressure` | Expressief en deterministisch; sommige combinaties missen randgevaltests |
| Sampling | `density`, `segmentLength`, `simplify`, `minSegmentLength` | Goede defaults en lokale limiet, maar geen totale outputlimiet |
| State | ids, selecteren, bevriezen, regenereren, rerollen, wijzigen, verwijderen | Bruikbaar voor iteratief werk; mutabiliteit en updategedrag zijn risicovol |
| Export | SVG, JSON, HPGL, downloads | Breed en coherent vanuit één tracecollectie |
| Plotplanning | layers, penMap, optimize, stats | Nuttig voor echte plotters; speciale laagnamen en schaalbaarheid vragen werk |
| p5-integratie | global class, optionele instance-helper | Global mode is duidelijk; instance-mode is onvolledig getest en bevat een maatfout |

## 5. Sterke punten

### Architectuur

- Scherm en exports gebruiken dezelfde vectorgegevens; er is geen pixelanalyse of parallelle exportimplementatie.
- Seeds en rerolls zijn voorspelbaar en goed geïntegreerd.
- Vormregistratie combineert een array voor volgorde met een `Map` voor adressering.
- Pagina-transformatie, clipping en routevolgorde zijn centraal gedeeld.
- XML-waarden worden escaped en SVG-laag-id's worden gesaneerd (`p5.gysin.js:336-353`, `p5.gysin.js:1466-1468`, `p5.gysin.js:1544-1549`).

### Product en didactiek

- De kernbelofte is snel begrijpelijk in README en publieke site.
- De voorbeelden bouwen inhoudelijk goed op van eerste trace naar parameters, fontcontouren, kalibratie en export.
- Het parameterlab gebruikt gelabelde HTML-sliders (`examples/parameter_lab/index.html:39-55`).
- Het project bevat zowel snelle starters als uitgebreidere, plottergerichte demonstraties.

### Onderhoud

- De library heeft geen runtime-dependencies.
- Bron en distributiebestand zijn semantisch identiek.
- Het manifest wordt deels gegenereerd uit package, bron en voorbeeldmappen.
- De bestaande tests bewijzen determinisme, bron/build-equivalentie, freeze/reroll, duplicate ids, basisvalidatie, lagen, HPGL, fontcontouren en manifestkoppeling (`tests/snapshot.js:46-144`).

## 6. Oorspronkelijke gebreken, geprioriteerd

De onderstaande sectie bewaart het auditbewijs van vóór de correctieronde. De
implementatiestatus staat in de notitie bovenaan; de reproducties dienen nu als
regressietests waar dat technisch mogelijk is.

### Hoog — gesloten vormen sluiten niet betrouwbaar bij wobble

**Bewijs:** gesloten sampling herhaalt het beginpunt aan het einde, maar de humanizer geeft beide exemplaren afzonderlijke jitter (`p5.gysin.js:610-644`, `p5.gysin.js:793-817`). `draw()` gebruikt geen `CLOSE` en SVG schrijft geen `Z` (`p5.gysin.js:196-224`, `p5.gysin.js:1484-1490`).

**Gemeten repro met seed 1, wobble 10 en simplify 0:**

- cirkel: naad van 17,246 px;
- rechthoek: naad van 8,833 px;
- polygon: naad van 11,512 px.

**Impact:** zogenaamd gesloten contouren krijgen een zichtbare kier en zijn ook voor een plotter geometrisch open.

**Aanbeveling:** humanize het unieke beginpunt één keer en kopieer het exact naar het einde, of bewaar sluiting expliciet en laat render/export daar correct op reageren. Voeg regressietests toe voor canvas-, SVG- en HPGL-sluiting.

### Middel — `update()` is niet atomair

**Bewijs:** `update()` schrijft human-, stijl-, export- en parametervelden direct naar de bestaande vorm en valideert pas daarna (`p5.gysin.js:295-317`).

**Repro:** een lijn met `x2 = 10` krijgt `update(id, { wobble: 5, params: { x2: Infinity } })`. De call gooit terecht een fout, maar daarna blijven `wobble = 5` en `x2 = Infinity` opgeslagen. Latere regeneratie of export faalt opnieuw.

**Impact:** een fout die de gebruiker opvangt, kan de voordien geldige vorm blijvend beschadigen.

**Aanbeveling:** maak en normaliseer eerst een kandidaatkopie; commit de volledige update alleen als alle validatie en regeneratie slagen.

### Middel — punt-tuples werken bij creatie maar niet bij `update()`

**Bewijs:** capture normaliseert `[x, y]` naar `{x, y}`, maar update bewaart ruwe params. De validator berekent een genormaliseerde waarde zonder ze terug te schrijven (`p5.gysin.js:175-181`, `p5.gysin.js:304-307`, `p5.gysin.js:898-914`, `p5.gysin.js:1045-1046`).

**Repro:** een geldige update met `[[0, 0], [20, 0]]` eindigt tijdens sampling in de misleidende fout dat meer dan 100.000 punten zouden ontstaan.

**Impact:** hetzelfde gedocumenteerde invoerformaat gedraagt zich anders per API-pad en kan state beschadigen.

**Aanbeveling:** centraliseer parameternormalisatie per vorm en gebruik die zowel bij capture als update.

### Middel — speciale laagnamen breken stats en HPGL

**Bewijs:** iedere niet-lege laagnaam is geldig, maar `stats()` gebruikt een gewoon object en `penForTrace()` leest zonder own-propertycontrole (`p5.gysin.js:424-436`, `p5.gysin.js:984-990`, `p5.gysin.js:1477-1481`).

**Gereproduceerd met:** `__proto__`, `constructor` en `toString`.

**Resultaat:** de laag verdwijnt uit `stats().layers` en `exportHPGL()` gooit een fout over een niet-eindig pennummer.

**Aanbeveling:** gebruik `Map` of `Object.create(null)` voor laagstatistieken en `Object.hasOwn()` voor penmapping.

### Middel — instance-mode export gebruikt verkeerde standaardmaat

**Bewijs:** tekenen gebruikt correct `this.p`, maar `_resolvePage()` zoekt fallbackmaten uitsluitend op de globale `width` en `height`. `createGysinPlot()` geeft alleen `p: this` mee (`p5.gysin.js:503-511`, `p5.gysin.js:852-854`, `p5.gysin.js:1558-1562`).

**Repro:** een p5-instance van 320 x 240 exporteert zonder expliciete maten met `viewBox="0 0 800 800"`.

**Impact:** canvas, SVG, HPGL en statistieken spreken elkaar tegen tenzij de gebruiker maten dubbel opgeeft.

**Aanbeveling:** gebruik eerst `this.p.width` en `this.p.height`, daarna globale maten en pas dan 800.

### Middel — samplinglimiet beschermt niet de totale vorm

**Bewijs:** `MAX_SAMPLE_POINTS` geldt per segment, terwijl een polygon of pad onbeperkt veel segmenten kan bevatten (`p5.gysin.js:610-627`, `p5.gysin.js:1061-1066`). Ook `repeat` heeft geen praktische bovengrens (`p5.gysin.js:956-969`).

**Impact:** grote maar formeel geldige input kan veel geheugen gebruiken of de browser blokkeren. De README-belofte dat extreme sampling vroeg wordt afgewezen is daardoor slechts gedeeltelijk waar (`README.md:109-111`).

**Aanbeveling:** houd een cumulatief punt- en tracebudget bij en geef vóór allocatie een duidelijke fout of waarschuwing.

### Middel/laag — route-optimalisatie schaalt kwadratisch

**Bewijs:** voor elk resterend pad wordt de volledige kandidatenlijst opnieuw gescand (`p5.gysin.js:1433-1463`).

**Gemeten:** ongeveer 112 ms voor 1.000 traces, 1,05 s voor 3.000 en 4,14 s voor 6.000 traces in de testomgeving.

**Impact:** `optimize: true` kan de browserinterface meerdere seconden bevriezen bij veel dropout-, fray- of repeat-traces.

**Aanbeveling:** documenteer een schaalgrens en gebruik voor grotere sets een ruimtelijke index, clustering of worker.

### Middel/laag — freeze en stijlupdate spreken elkaar tegen

**Bewijs:** `update()` wijzigt `shape.style`, maar een bevroren vorm wordt niet opnieuw gegenereerd. Draw en export gebruiken de oude stijl die in `generated` is gekopieerd (`p5.gysin.js:295-317`, `p5.gysin.js:839-849`). De guide toont juist `freeze()` gevolgd door een stroke-update (`docs/guide.html:104-115`).

**Impact:** de API-state meldt de nieuwe kleur, terwijl beeld en export de oude kleur houden tot `thaw()` plus `regenerate()`.

**Aanbeveling:** definieer freeze expliciet als geometrieslot of volledig slot. Bij een geometrieslot kan stijl los van `generated` worden gelezen.

### Laag — ongeldige SVG-precisie wordt stil geaccepteerd

`exportSVG({ decimals })` valideert `decimals` niet (`p5.gysin.js:332-353`, `p5.gysin.js:1539-1542`). Waarde 309 produceert onder meer `width="NaNpx"`; een fractionele waarde geeft onverwachte precisie.

**Aanbeveling:** vereis een geheel getal binnen een klein bereik, bijvoorbeeld 0 tot 12.

### Laag — interne state is publiek muteerbaar

`get()` retourneert het echte interne shape-object (`p5.gysin.js:233-235`). Een gebruiker kan ids, params, paths of dirty-state wijzigen zonder validatie en zo de array en `Map` inconsistent maken.

**Aanbeveling:** retourneer een read-only snapshot, of documenteer dit bewust als geavanceerde maar onveilige escape hatch.

## 7. Gebreken in site, UX en documentatie

### Mobiele navigatieblokker

Onder 800 px verbergt de CSS `.nav-links` en verwacht ze `.nav-open` (`docs/style.css:440-465`). `guide.html` en `about.html` hebben echter geen hamburgerknop, anders dan index en examples (`docs/guide.html:10-18`, `docs/about.html:10-18`, `index.html:17-28`).

**Gevolg:** op mobiele schermen verdwijnt de hoofdnavigatie volledig op Guide en About.

### Misleidend downloadvoorbeeld

De guide maakt een fysiek `page`-object en gebruikt het voor `exportSVG()`, maar roept daarna `downloadSVG("gysin.svg")` zonder `{ page }` aan (`docs/guide.html:121-143`). De download krijgt dus de px/canvas-default in plaats van het getoonde fysieke formaat.

### Onvolledige API-reference

De publieke guide toont vormmethoden en slechts een deel van de parameters (`docs/guide.html:74-100`). Niet of nauwelijks beschreven zijn onder meer:

- constructoropties en defaults;
- returnwaarden en foutgedrag;
- style- en exportopties;
- text-, cutup- en closed-opties;
- geldige units en origins;
- SVG-, HPGL- en statsopties;
- `p.createGysinPlot()`.

Hierdoor is broncode-inspectie nodig voor normaal gebruik.

### Tegenstrijdige compatibiliteitsclaim

De technische blauwdruk claimt p5.js 1.x en 2.x (`docs/technical-blueprint.md:6-9`), het manifest noemt 2.x en alle publieke pagina's laden `p5@2`. De tests gebruiken een kale Node-VM zonder echte p5-runtime (`tests/snapshot.js:6-19`).

**Aanbeveling:** kies één expliciet contract: ondersteund, getest en voorbeeldversie. Voeg browserintegratietests toe voor elke geclaimde hoofdlijn.

### Documentatiedrift

- README noemt vijf voorbeelden, terwijl manifest en site er acht bevatten (`README.md:56-82`, `docs/p5.gysin.manifest.json:21-29`).
- De blauwdruk zet route-optimalisatie nog onder “Niet in de MVP”, terwijl versie 0.2.0 ze implementeert (`docs/technical-blueprint.md:381-405`, `p5.gysin.js:529-558`).
- README gebruikt losse testcommando's in plaats van de canonieke `npm test`-route.
- De publieke site is Engels, README en blauwdruk zijn Nederlands; de doelgroep- en taalkeuze is niet expliciet.
- API-namen staan op enkele HTML-pagina's letterlijk tussen Markdown-backticks in plaats van in `<code>`.

### Toegankelijkheid

- Canvasdemo's hebben geen `describe()` of tekstueel alternatief.
- Dynamische statusregels missen meestal `role="status"` of `aria-live`.
- First Trace en Parameter Lab bieden sommige acties alleen via canvasklik of sneltoets, niet via zichtbare knoppen voor touchgebruikers.
- Er zijn hoverstijlen, maar geen consistente expliciete focusstijlen of reduced-motion-behandeling aangetroffen.

De site is visueel bruikbaar, maar nog niet zelfstandig toegankelijk voor toetsenbord-, touch- en screenreadergebruikers.

## 8. Test- en kwaliteitsstatus

### Geslaagd

`npm test` geeft:

```text
p5.gysin snapshot ok
p5.gysin local links ok (12 pages)
```

De distributiebouw is exact synchroon met de bron.

### Beperkingen

De huidige “snapshot”-test bevat vooral assertions en gelijkheidscontroles; er is geen vast goedgekeurd SVG/HPGL-goldenbestand. Verder ontbreken:

- echte browsertests;
- p5.js 1.x- en 2.x-matrix;
- global- én instance-mode integratietests;
- visuele regressie van gesloten vormen;
- update-rollbacktests;
- tests voor prototype-achtige laagnamen;
- download- en Blob-tests;
- performancegrenzen;
- toegankelijkheidscontroles.

`p5.gysin.min.js` is bovendien niet geminified: de build verwijdert alleen de openingscomment en voegt een banner toe (`tools/build-min.js:12-18`). De gemeten reductie is circa 0,06%. Dit is functioneel veilig, maar de bestandsnaam wekt een andere verwachting.

## 9. Veiligheid

Er is geen onderbouwde code-injection of ernstig beveiligingsprobleem gevonden. Positief zijn de SVG/XML-escaping, beperkte units/origins en numerieke validatie.

Resterende aandachtspunten zijn vooral robuustheid en supply-chainbeheer:

- publieke pagina's gebruiken een zwevende `p5@2`-CDNverwijzing;
- er is geen Content Security Policy;
- inline `onclick` bemoeilijkt een strikte CSP;
- resource-uitputting blijft mogelijk via zeer grote maar formeel geldige input.

Voor deze statische, lokale creative-codinglibrary is correctheid momenteel belangrijker dan klassieke applicatiebeveiliging.

## 10. Onderhoud en distributie

- `package.json` heeft `private: true` en de bron biedt geen ESM-, CommonJS- of TypeScript-export (`package.json:5-19`, `p5.gysin.js:1556-1564`). De feitelijke distributie is dus browser-script via GitHub/jsDelivr.
- Versie 0.2.0 staat handmatig in package, HTML-footers en CDN-snippets. Alleen het manifest wordt gegenereerd.
- De buildnaam “min” is misleidend zolang geen syntaxbewuste minifier wordt gebruikt.

Dit is prima als bewuste GitHub Pages-library, maar moet als distributiecontract worden beschreven. Voor npm-publicatie zijn exports, types, packagevalidatie en het verwijderen van `private: true` nodig.

## 11. Aanbevolen uitvoeringsvolgorde

### Fase 1 — correctheid

1. Sluit closed paths exact na humanizing en voeg regressietests toe.
2. Maak `update()` atomair en centraliseer parameternormalisatie.
3. Repareer layer-opslag en penMap-lookup voor alle geldige strings.
4. Gebruik p5-instanceafmetingen in `_resolvePage()`.
5. Valideer `decimals` en voeg cumulatieve outputlimieten toe.

### Fase 2 — integratie en schaal

6. Voeg browsertests toe voor de werkelijk ondersteunde p5.js-versies en modes.
7. Leg freeze-semantiek vast en test stijlupdates.
8. Begrens of verbeter route-optimalisatie.
9. Voeg performance- en grote-inputtests toe.

### Fase 3 — product en lesbaarheid

10. Herstel mobiele navigatie en het SVG-downloadvoorbeeld.
11. Maak een volledige API-reference met defaults, types, returnwaarden en fouten.
12. Synchroniseer README, blueprint, manifest, voorbeelden en versies.
13. Voeg canvasbeschrijvingen, live status, zichtbare actieknoppen en focusstijlen toe.
14. Documenteer de bedoelde taal, doelgroep en distributievorm.

## 12. Slotbeoordeling per perspectief

| Perspectief | Beoordeling |
|---|---|
| Creative coder | Aantrekkelijke, kleine API met direct herkenbaar resultaat |
| Plottergebruiker | Goede exportbasis, maar closed-path- en schaalproblemen moeten eerst weg |
| Leerling | Inspirerend en snel te starten; guide is nog te onvolledig voor zelfstandig leren |
| Docent | Sterke voorbeeldreeks, maar mist expliciete leerlijn, opdrachten en compatibiliteitscontract |
| Maintainer | Overzichtelijke kern zonder dependencies; testsuite dekt nog te weinig integratie en randgevallen |
| Toegankelijkheid | Basis-HTML is redelijk, maar canvassen, status en touch-/mobiele bediening vragen werk |
| Security | Geen kritiek lek gevonden; vooral resource- en CDN-hardening resteert |

De beste eigenschap om te behouden is de ene gedeelde vectorpipeline. De eerstvolgende release zou vooral de invarianten rond gesloten geometrie, updates, lagen en canvasmaten moeten versterken; daarna kan documentatie en browserdekking de library van een sterke showcase naar een betrouwbare publieke tool tillen.

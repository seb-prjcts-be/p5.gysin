# TODO — p5.gysin 1.0.0

## Bruikbaar waar het moet, licht hermetisch waar het mag

Dit document is de **canonieke opdracht voor versie 1.0.0**. Het bewaakt de
artistieke richting, de uitvoeringsvolgorde en de continuïteit tussen
AI-sessies.

Een agent mag:

- de eerstvolgende open taak uitvoeren;
- een checkbox pas afvinken nadat het bewijs onder die fase klopt;
- feitelijke voortgang in `STATUS.md` zetten.

Een agent mag niet:

- de opdracht onderweg ruimer, mooier of “creatiever” interpreteren;
- meerdere fases tegelijk aanpakken;
- vanuit een oude chat verder werken zonder eerst dit bestand, `AGENTS.md`,
  `STATUS.md` en de actuele diff te lezen;
- het conceptcontract hieronder wijzigen zonder een nieuwe, expliciete
  beslissing van Seb;
- committen, pushen, taggen of publiceren zonder expliciete toestemming.

Als een chat en dit document elkaar tegenspreken, geldt de **laatste expliciete
instructie van Seb**. Werk dan eerst dit document bij en pas daarna de code.

---

## 1. Vast vertrekpunt

- De bewaarde release is `v0.4.0`, tag
  `c655440503eb868ff57dd606141467eb2fcf2c49`.
- De startcommit voor dit plan is `6f179d8`.
- De bestaande publieke API en gegenereerde werken blijven werken.
- Versie 1.0.0 is geen vrijbrief om de hele site, library of vormgeving opnieuw
  te ontwerpen.
- `v0.4.0` blijft onaangeroerd. Nooit de tag verplaatsen of overschrijven.
- Een version-tag bewaart bronbestanden en CDN-URLs. GitHub Pages volgt `main`;
  de oude website-interface blijft dus niet automatisch online. Voor release
  moet Seb beslissen of toegang via tag/CDN volstaat, of dat ook een
  versie-archief van de oude site nodig is.

---

## 2. De opdracht in één zin

Maak van p5.gysin 1.0.0 een volwassen instrument waarin de **handeling helder**
blijft, de **betekenis niet wordt voorgekauwd**, en toeval niet alleen een
Gysin-achtig oppervlak maakt maar ook taal werkelijk kan laten botsen.

---

## 3. Niet-onderhandelbaar conceptcontract

Deze regels mogen tijdens de uitvoering niet geleidelijk verwateren.

### 3.1 Wat p5.gysin is

- Een vector-first instrument voor tekst, tekens, toeval, handeling en papier.
- Een hedendaagse verwerking van methodes: knippen, permuteren, draaien,
  overschrijven, slijten, bewaren en opnieuw laten ontstaan.
- Een library die artistieke problemen oplost met betekenisvolle werkwoorden en
  sterke defaults.
- Een systeem waarin dezelfde traces naar canvas, SVG, JSON en HPGL gaan.

### 3.2 Wat p5.gysin niet wordt

- Geen verzameling Gysin-achtige filters.
- Geen parameterwand met steeds meer seeds, sliders en beschadigingseffecten.
- Geen historische verkleedpartij of Beat-nostalgie.
- Geen museumrondleiding die ieder werk vooraf uitlegt.
- Geen bundel door AI geschreven kunstaforismen.
- Geen volledige simulatie van Gysins leven of oeuvre.
- Geen frameworkproject en geen nieuwe dependency zonder afzonderlijk akkoord.

### 3.3 Hoofdregel voor tekst

> De handeling moet helder zijn. De betekenis mag weerstand bieden.

- Interface: kort en ondubbelzinnig.
- Werken: weinig tekst; beeld, bron en handeling krijgen voorrang.
- `System`: technisch volledig en precies.
- `README`: praktisch en niet dubbel.
- `Vision`: historisch, controleerbaar en sober.
- Licht hermetisch ontstaat door montage, selectie en weglating — niet door
  duistere reclametaal.

### 3.4 Hoofdregel voor nieuwe functionaliteit

Versie 1.0.0 krijgt hoogstens **één** nieuwe conceptuele methode:
een semantische cut-up die twee of meer aangeleverde tekstbronnen kan laten
botsen. Werknaam: `splice()`.

Deze methode:

- veroorzaakt nieuwe betekenis, niet alleen nieuwe contourruis;
- werkt bruikbaar met één eenvoudige aanroep;
- bewaart de bestaande trace-, id-, seed-, freeze-, reroll- en exportlogica;
- houdt provenance bij: welk fragment kwam uit welke bron;
- haalt zelf geen externe teksten op;
- voegt geen tweede laag van tientallen normale opties toe;
- wordt niet geïmplementeerd voordat naam, signatuur en defaults door Seb zijn
  goedgekeurd.

Alle andere nieuwe features blijven buiten 1.0.0.

---

## 4. Definition of done voor 1.0.0

Versie 1.0.0 is pas klaar als **alle** onderstaande punten waar zijn.

- [ ] De bestaande v0.4.0-methodes en outputs blijven achterwaarts compatibel.
- [ ] `splice()` of de goedgekeurde alternatieve naam laat minstens twee
      tekstbronnen semantisch botsen met sterke defaults.
- [ ] De nieuwe methode ondersteunt provenance, ids, determinisme,
      `freeze()`, `reroll()` en export.
- [ ] De publieke site legt handelingen helder uit zonder werken vooraf te
      interpreteren.
- [ ] De homepage geeft toegang en atmosfeer, geen volledige rondleiding.
- [ ] Voorbeeldpagina’s herhalen de code niet in proza.
- [ ] `Collage` blijft bruikbaar maar leest niet meer als een lineaire cursus.
- [ ] `System` bevat alle technische details die elders bewust zijn weggelaten.
- [ ] `README`, `System`, voorbeelden, manifest en broncode spreken elkaar niet
      tegen.
- [ ] Er zijn goedgekeurde tekstvoorbeelden waarmee een nieuwe AI-sessie de
      juiste stem opnieuw kan herkennen.
- [ ] Alle automatische tests, linkchecks en syntaxiscontroles slagen.
- [ ] De echte localhost-site is op desktop en mobiel gecontroleerd.
- [ ] Seb heeft de pilootpagina’s en de uiteindelijke site visueel goedgekeurd.
- [ ] Beslist is hoe de oude v0.4.0-site raadpleegbaar blijft.
- [ ] De versie wordt pas op het einde overal naar `1.0.0` gebracht.
- [ ] Tag, commit, push en publicatie gebeuren alleen na expliciet akkoord.

---

## 5. Vaste continuïteitsprocedure voor iedere AI-sessie

### 5.1 Verplicht bij de start

Voer deze volgorde uit voordat iets wordt gewijzigd:

1. Lees `AGENTS.md` volledig.
2. Lees dit bestand volledig.
3. Lees `STATUS.md`.
4. Controleer branch, `git status`, laatste commit en actuele diff.
5. Controleer of er bestaand werk van Seb of een andere agent in de betrokken
   bestanden staat.
6. Kies uitsluitend de **eerste open checkbox van de actieve fase**.
7. Benoem in één korte update:
   - welke checkbox wordt uitgevoerd;
   - welke bestanden mogen wijzigen;
   - welke acceptance check daarna wordt gedaan.

### 5.2 Verplicht tijdens het werk

- Werk aan één afgebakend werkpakket tegelijk.
- Bewerk alleen bestanden die bij de actieve checkbox genoemd worden.
- Gebruik kleine patches; geen globale AI-herschrijving van volledige pagina’s.
- Verwijder en verplaats eerst. Herschrijf pas wat daarna werkelijk nodig blijft.
- Laat werk van Seb en ongerelateerde lokale bestanden ongemoeid.
- Als een smaakbeslissing niet uit dit plan of de goedgekeurde voorbeelden
  volgt: zet ze als blokkade in `STATUS.md` en stop daar.
- Voeg geen “mooie” zin toe alleen omdat er na schrappen witruimte ontstaat.
- Verander geen gedrag terwijl de actieve taak alleen tekst betreft.
- Verander geen tekst terwijl de actieve taak alleen librarygedrag betreft,
  behalve de expliciet genoemde documentatiesynchronisatie.

### 5.3 Verplicht na iedere afgeronde deeltaak

1. Voer de acceptance checks van die taak uit.
2. Bekijk de volledige diff van alleen de betrokken bestanden.
3. Vink de taak uitsluitend af als het bewijs groen is.
4. Werk `STATUS.md` bij met exact deze betekenis:

```markdown
## Nu bezig
- v1.0.0 — fase X, eerstvolgende open taak Y

## Volgende stap
- open <bestand> bij <onderdeel> en voer <één concrete actie> uit

## Blokkades
- alleen beslissingen of handelingen die op Seb wachten

## Gedaan
- afgeronde deeltaak + korte vermelding van het controlebewijs
```

5. Laat geen vage volgende stap achter zoals “teksten verder verbeteren”.
6. Commit of push niet, tenzij Seb daar op dat moment expliciet om vraagt.

### 5.4 Hervatten na tokenpauze, crash of lange onderbreking

- Vertrouw niet op de oude conversatie.
- Herbegin bij §5.1.
- Gebruik `git diff` om half werk te herkennen.
- Neem nooit aan dat een half gewijzigde pagina artistiek is goedgekeurd.
- Als `STATUS.md`, dit plan en de diff niet overeenkomen: voer geen nieuwe
  wijziging uit voordat de toestand opnieuw feitelijk is vastgelegd.
- Begin niet opnieuw aan reeds groen gecontroleerd werk.

---

## 6. Tekstcontrole: vaste beslisregels

Label bij de audit iedere tekstpassage als:

- `HANDELING` — nodig om iets te bedienen; helder houden.
- `REFERENTIE` — technische informatie; naar `System` of `README`.
- `DUBBEL` — staat al in code, UI of elders; verwijderen.
- `INTERPRETATIE` — vertelt wat het werk betekent; verwijderen of tot fragment
  terugbrengen.
- `HISTORIE` — unieke, verifieerbare context; sober behouden met bron.

Stel per passage vier vragen:

1. Moet de bezoeker dit weten vóór een handeling?
2. Is dit al zichtbaar in het beeld, de code of een label?
3. Schrijft dit voor wat de bezoeker moet denken of ervaren?
4. Staat dezelfde bewering elders al beter?

### 6.1 Signalen van overuitleg

Controleer onder andere op:

```text
one call
the whole
everything
every option
how to read
this page
this example
look closely
not X but Y
click here
```

Dit zijn waarschuwingssignalen, geen automatische verboden. In `System` kan
dezelfde formulering functioneel zijn; bij een kunstwerk kan ze de spanning
wegnemen.

### 6.2 Signalen van nieuwe AI-kunsttaal

Afkeuren wanneer een tekst:

- drie perfect parallelle zinnen achter elkaar zet;
- iedere observatie meteen samenvat;
- herhaaldelijk “niet X, maar Y” gebruikt;
- zonder bron nieuwe grote uitspraken over taal, toeval of machines maakt;
- de code in eleganter proza nogmaals vertelt;
- iedere onduidelijkheid in dezelfde alinea oplost;
- een lege plaats automatisch met een nieuwe aforistische zin vult.

### 6.3 Praktische tekstgrenzen

Dit zijn reviewgrenzen, geen uitnodiging om tekst kunstmatig op lengte te maken.

- Boven een werk: maximaal één korte artistieke passage, richtwaarde 45 woorden.
- Bedieningsuitleg: naast de betrokken control, niet in de interpretatieve intro.
- Contact sheet: titel + methode of materiaal; geen verkooppraatje per tegel.
- `Collage`: per stap maximaal één noodzakelijke passage vóór beeld/code.
- `System`: geen kunstmatige woordlimiet; volledigheid en vindbaarheid winnen.
- `Vision`: een historische claim moet controleerbaar zijn of duidelijk als
  interpretatie worden benoemd.

---

## 7. Faseplan

Werk strikt in deze volgorde. Een volgende fase start pas wanneer de acceptance
gate van de vorige fase groen is.

### Fase 0 — Baseline veiligstellen

**Doel:** aantonen wat vóór 1.0.0 bestond en zorgen dat niets stilzwijgend
verdwijnt.

Toegestane wijzigingen:

- dit plan;
- `STATUS.md`;
- lokale, genegeerde baselinebestanden onder `temp/`.

Taken:

- [x] Controleer dat tag `v0.4.0` bestaat en noteer de commit.
- [x] Controleer dat de werkbranch vanaf de bedoelde `main`-commit vertrekt.
- [x] Draai de bestaande tests vóór productwijzigingen.
- [x] Maak lokale referentiebeelden van:
      homepage, `worn_word`, `permutation_poem`, `rotations`, `the_letter`,
      `Collage` en `System`.
- [x] Noteer welke ontracked bestanden al van Seb waren; raak ze niet aan.
- [ ] **MORGEN — menselijke controle:** laat Seb kiezen:
      **A.** v0.4.0 blijft beschikbaar via tag/CDN, of
      **B.** ook de oude site wordt onder een versiepad gearchiveerd.

Acceptance:

- `npm test` is groen.
- Baselinebeelden zijn lokaal terug te vinden.
- `git diff` bevat geen library-, site- of voorbeeldwijzigingen.
- De archiefkeuze mag als enige blokkade open blijven terwijl fase 1 start.

### Fase 1 — Stemcontract en volledige tekstaudit

**Doel:** eerst beslissen wat voor soort tekst waar thuishoort; nog geen
publieke copy herschrijven.

Toegestane wijzigingen:

- een duurzaam stemcontract;
- een lokale auditlijst;
- `STATUS.md`;
- dit plan voor afgevinkte taken en bewijs, niet voor conceptwijzigingen.

Taken:

- [x] Leg de regels uit §3.3 en §6 vast in één kort stemcontract.
- [x] Inventariseer homepage, voorbeelden, `Collage`, `System`, `README` en
      `Vision`.
- [x] Label passages als `HANDELING`, `REFERENTIE`, `DUBBEL`,
      `INTERPRETATIE` of `HISTORIE`.
- [x] Markeer herhaalde claims zoals “one call” en “the whole”.
- [x] Maak per pagina een beslislijst: behouden, verplaatsen, schrappen,
      herschrijven.
- [x] Verander nog geen publieke tekst.

Acceptance:

- Iedere publieke pagina staat in de audit.
- Iedere voorgestelde wijziging heeft een reden.
- Er staat nergens “alles herschrijven”.
- De eerstvolgende taak wijst exact naar `worn_word`.

### Fase 2 — Tekstpiloot 1: Worn Word

**Doel:** de nieuwe verhouding tussen bruikbaarheid en weglating testen op één
kleine, duidelijke pagina.

Toegestane bestanden:

- `examples/worn_word/index.html`;
- alleen indien technisch noodzakelijk de direct gekoppelde lokale sketch;
- stemcontract, audit, `STATUS.md`.

Taken:

- [x] Behoud de zichtbare handeling: `rub()`, drie passages en `decay`.
- [x] Verplaats bediening naar de controls of een compacte utilityregel.
- [x] Schrap uitleg die de code herhaalt.
- [x] Schrap “this whole sketch is one call” en vergelijkbare verkooptaal.
- [x] Voeg geen vervangende kunstaforismen toe.
- [x] Controleer dat links, toetsen, controls en sketch identiek blijven werken.

Acceptance:

- De betekenis van het werk wordt niet vooraf volledig verteld.
- De bezoeker kan de decay-control zonder zoeken gebruiken.
- De sketchoutput is functioneel ongewijzigd.
- Localhost desktop en mobiel zijn gecontroleerd.
- Voor/na-beeld en tekstdiff zijn aan Seb voorgelegd.

**Menselijke gate — MORGEN:** Sebs oordeel over de stem is bewust naar het
laatste marathonblok verplaatst. Automatische en visuele controles zijn groen;
de uitvoering gaat op zijn expliciete verzoek door.

### Fase 3 — Tekstpiloot 2: Permutation Poem

Start alleen als Seb de richting van fase 2 goedkeurt.

**Doel:** bewijzen dat dezelfde stem ook werkt bij een complex interactief werk.

Toegestane bestanden:

- `examples/permutation_poem/index.html`;
- alleen noodzakelijke direct gekoppelde stijl- of scriptregels;
- stemcontract, audit, `STATUS.md`.

Taken:

- [x] Verwijder de kop “How to read it”.
- [x] Laat nummering en compositie het leespad dragen.
- [x] Behoud één concrete invoerinstructie bij het invoerveld.
- [x] Verplaats ordermodi en exportdetails naar een compacte technische noot.
- [x] Verwijder de lijst met canonieke Gysin-frases.
- [x] Controleer lege invoer, Enter, nieuwe order, nieuwe seed en export.
- [ ] **MORGEN — menselijke controle:** leg de door Seb goedgekeurde passages uit
      fase 2 en 3 als toonvoorbeelden vast.

Acceptance:

- Het werk blijft zonder handleiding bedienbaar.
- De tekst schrijft geen interpretatie voor.
- Alle interacties en exports werken.
- De goedgekeurde voorbeelden staan in het stemcontract.

**Menselijke gate — MORGEN:** Seb keurt de twee pilootpagina’s samen goed.
Op zijn expliciete marathoninstructie gaat de technische uitvoering door; de
definitieve toonvoorbeelden worden pas na zijn oordeel vastgezet.

### Fase 4 — Semantische cut-up ontwerpen

**Doel:** één nieuwe methode ontwerpen die taalinhoud laat botsen zonder de
library te verbreden tot een nieuw parametersysteem.

Toegestane wijzigingen:

- ontwerpdocument;
- testspecificatie;
- `STATUS.md`;
- nog geen librarycode.

Taken:

- [x] Beschrijf exact wat `textCutup()`, `GysinText.permute()`, `chant()`,
      `rub()`, `freeze()` en `reroll()` nu doen.
- [x] Wijs aan waar toeval grafisch werkt en waar het betekenis verandert.
- [x] Vergelijk maximaal drie namen; geef één gemotiveerde aanbeveling.
- [x] Ontwerp één minimale aanroep met twee bronnen.
- [x] Ontwerp fragmentatie op woord-, frase- en zinsdeelniveau.
- [x] Definieer provenance in JSON-export.
- [x] Definieer ids, determinisme, freeze, reroll en exportgedrag.
- [x] Schrijf één voorbeeldsketch van maximaal 40 regels.
- [x] Schrijf concrete tests en foutgevallen.
- [x] Benoem expliciet wat niet wordt gebouwd.

Acceptance:

- Eén gewone aanroep levert een bruikbaar werk.
- Normaal gebruik vereist geen technische parameterbundel.
- Geen externe bronfetching en geen ingebouwd auteursrechtelijk corpus.
- Bestaande API hoeft niet te breken.

**Menselijke gate — MORGEN:** naam, signatuur en defaults blijven voor Sebs
slotcontrole gemarkeerd. Zijn expliciete marathoninstructie verplaatst deze
controle naar achteren en machtigt uitvoering volgens het nu bevroren contract.

### Fase 5 — Semantische cut-up implementeren

Start alleen na de gate van fase 4.

**Doel:** de goedgekeurde methode klein, additief en volledig getest toevoegen.

Toegestane bestanden worden vóór start exact in `STATUS.md` genoteerd en zijn
beperkt tot:

- core of passend optioneel addonbestand;
- semantisch identieke browserbuild;
- tests;
- één afzonderlijk voorbeeld;
- noodzakelijke API-documentatie.

Taken:

- [ ] Implementeer alleen het goedgekeurde contract.
- [ ] Voeg tests toe voor twee bronnen, duplicaten, lege invoer, provenance,
      determinisme, freeze, reroll en alle exports.
- [ ] Houd source en browserbuild semantisch gelijk.
- [ ] Maak één voorbeeld met twee originele of door Seb aangeleverde bronnen.
- [ ] Gebruik geen canonieke Gysin-catchphrases als standaardinhoud.
- [ ] Meet voorbeeldcomplexiteit; de normale sketch blijft maximaal 40 regels.

Acceptance:

- Alle nieuwe tests zijn groen.
- Alle oude tests blijven groen.
- De methode werkt zonder nieuwe dependency.
- De gewone aanroep heeft sterke defaults.
- Een code-review tegen het goedgekeurde contract vindt geen extra features.

### Fase 6 — Homepage en toegangshiërarchie

**Doel:** de ingang laten uitnodigen zonder de hele ervaring uit te leggen.

Toegestane bestanden:

- `index.html`;
- alleen noodzakelijke gedeelde stijl of viewerlabels;
- audit, `STATUS.md`.

Taken:

- [ ] Verwijder de volledige viewerhandleiding uit de introductie.
- [ ] Zet noodzakelijke pijltjes- en Escape-hints in of bij de viewer.
- [ ] Behoud toegankelijke labels en toetsenbordbediening.
- [ ] Beperk contact-sheetcopy tot titel + methode of materiaal.
- [ ] Laat “one call” en volledige API-uitleg naar `System` verwijzen.
- [ ] Controleer dat alle werken nog bereikbaar zijn.
- [ ] Verander het aantal werken niet zonder afzonderlijk akkoord.

Acceptance:

- Een nieuwe bezoeker herkent wat klikbaar is zonder rondleidingsparagraaf.
- Viewer, pijlen, Escape, Enter en no-JavaScript-links blijven werken.
- De homepage schrijft niet voor hoe ieder werk gelezen moet worden.

### Fase 7 — Overige voorbeeldpagina’s

**Doel:** de goedgekeurde stem consequent toepassen zonder alles uniform te
maken.

Volgorde:

1. `rotations`
2. `first_trace`
3. `ink_bleed`
4. `frequencies`
5. `gysin_demo`
6. `parameter_lab`
7. `plotter_export`
8. `plotter_calibration`
9. `font_outlines`
10. `typewriter`
11. `the_letter`

Per pagina:

- [ ] Auditbeslissingen uitvoeren: eerst schrappen/verplaatsen, dan herschrijven.
- [ ] Bedieningsinformatie naast de bediening zetten.
- [ ] Geen code in proza navertellen.
- [ ] Geen nieuwe aforismen toevoegen om ruimte op te vullen.
- [ ] Unieke stem en functie van het werk behouden.
- [ ] Desktop, mobiel en interactie controleren.
- [ ] Pas daarna naar de volgende pagina gaan.

Acceptance:

- Iedere pagina is afzonderlijk gecontroleerd.
- De pagina’s klinken verwant, niet identiek.
- Geen functionaliteit of bronlink is verloren.

### Fase 8 — Collage uitdunnen

**Doel:** `Collage` als montage laten werken, niet als lineaire cursus.

Toegestane bestanden:

- `docs/collage/index.html`;
- alleen noodzakelijke gekoppelde stijl/script;
- audit, `STATUS.md`.

Taken:

- [ ] Behoud de materiële hoofdstukstructuur:
      sheet, scraps, word, scissors, arrange, turn, glue, wear en de overige
      bestaande delen.
- [ ] Beperk iedere stap tot de noodzakelijke passage vóór beeld/code.
- [ ] Verwijder herhaling van `chant()`, `rub()` en “one call”.
- [ ] Verplaats API-details naar `System`.
- [ ] Behoud copy-knoppen, navigatie, canvassen en code.
- [ ] Maak de pagina niet kunstmatig cryptisch.

Acceptance:

- De volgorde blijft bruikbaar zonder alles vooraf te verklaren.
- Geen hoofdstuk herhaalt de code volledig in proza.
- Navigatie en alle previews werken.

### Fase 9 — System, README en Vision consolideren

**Doel:** alle weggelaten praktische informatie één duidelijke thuis geven en
historische tekst sober houden.

Volgorde:

1. `docs/system.html`
2. `README.md`
3. `docs/vision.html`

Taken:

- [ ] `System` aanvullen waar voorbeelden bewust uitleg verloren.
- [ ] Controleren dat iedere publieke methode vindbaar is.
- [ ] Dubbele uitleg binnen `System` zelf verwijderen.
- [ ] `README` tot praktische start en distributie-informatie beperken.
- [ ] `Vision` controleren op bron, feit, interpretatie en promotietaal.
- [ ] Geen historisch citaat toevoegen zonder primaire of gezaghebbende bron.
- [ ] Duidelijk houden dat p5.gysin een studie/instrument is, geen
      vertegenwoordiging van Gysins oeuvre.

Acceptance:

- Een gebruiker kan laden, tekenen, variëren en exporteren via `README` +
  `System`.
- Werken hoeven die technische informatie niet meer te dragen.
- Historische beweringen zijn controleerbaar en terughoudend geformuleerd.

### Fase 10 — Sitebrede anti-verwatering-review

**Doel:** controleren dat afzonderlijk goede edits samen niet opnieuw één gladde
AI-stem vormen.

Taken:

- [ ] Zoek sitebreed op de signalen uit §6.1.
- [ ] Beoordeel treffers handmatig; geen blinde zoek/vervangactie.
- [ ] Vergelijk alle pagina’s met de goedgekeurde pilootteksten.
- [ ] Controleer dat niet ieder werk dezelfde zinsbouw en lengte heeft.
- [ ] Controleer dat interfacehulp niet per ongeluk verdween.
- [ ] Controleer dat Gysin niet voortdurend bij naam wordt gebruikt waar de
      methode zelf kan spreken.
- [ ] Laat een read-only review alleen concrete overtredingen van dit plan
      rapporteren.

Acceptance:

- De bezoeker weet wat hij kan doen, maar niet vooraf wat hij moet denken.
- De site is niet onnodig duister.
- Er staat geen generieke marketing- of AI-kunsttaal op de hoofdroute.

### Fase 11 — Technische releasecontrole

**Doel:** bewijzen dat tekst, nieuwe methode, builds en distributie één coherent
pakket vormen.

Taken:

- [ ] `npm run build:min`
- [ ] `npm run manifest`
- [ ] `npm test`
- [ ] `node --check` op gewijzigde JavaScriptbestanden
- [ ] `git diff --check`
- [ ] Lokale HTTP 200-controle voor homepage, docs en alle voorbeelden
- [ ] Desktop- en mobiele browsercontrole
- [ ] Bron/build/API/manifest-methoden vergelijken
- [ ] Zoeken op achtergebleven versies en tijdelijke labels:
      `0.4.0`, `next`, oude CDN-paden
- [ ] Controleren dat v0.4.0-tag en URLs onaangeroerd blijven
- [ ] Beslissing over een eventueel site-archief uitvoeren en testen

Acceptance:

- Alle controles zijn groen.
- Geen ongewenste of ongerelateerde bestanden in de diff.
- Geen version bump voordat deze fase inhoudelijk groen is.

### Fase 12 — Versie 1.0.0 voorbereiden

Start alleen wanneer fase 11 groen is en Seb expliciet zegt dat de release mag
worden voorbereid.

Taken:

- [ ] Versienummer op alle afgesproken plaatsen naar `1.0.0`.
- [ ] Release-informatie sober en feitelijk schrijven.
- [ ] Definitieve builds en manifest genereren.
- [ ] Volledige releasecontrole opnieuw uitvoeren.
- [ ] Seb de exacte staged files, diff-samenvatting en testresultaten tonen.

Daarna afzonderlijke toestemmingen:

- [ ] Seb geeft toestemming om te committen.
- [ ] Seb geeft toestemming om tag `v1.0.0` te maken.
- [ ] Seb geeft toestemming om te pushen/publiceren.
- [ ] Live Pages en versioned CDN na publicatie controleren.

---

## 8. Scope-alarm: onmiddellijk stoppen

Stop en zet een blokkade in `STATUS.md` wanneer één van deze situaties ontstaat:

- een taak vereist een nieuwe dependency;
- een bestaande API moet breken;
- een werk moet visueel opnieuw ontworpen worden om de tekstedit te laten werken;
- meer dan één nieuwe conceptuele methode lijkt nodig;
- een agent wil alle copy in één pass herschrijven;
- niet duidelijk is of tekst praktische hulp of artistieke interpretatie is;
- een historisch feit of citaat kan niet betrouwbaar worden gestaafd;
- bestaand werk van Seb overlapt met de actieve bestanden;
- de oude site blijkt niet op de afgesproken manier bewaard;
- tests zijn rood en de oorzaak valt buiten de actieve taak;
- commit, tag, push of publicatie is nodig zonder actuele toestemming.

---

## 9. Eerstvolgende concrete actie

Voer **Fase 0 — Baseline veiligstellen** uit. Begin met:

1. `npm test`;
2. lokale baselinebeelden;
3. feitelijke inventaris van de reeds aanwezige untracked bestanden;
4. daarna `STATUS.md` bijwerken.

Nog geen publieke tekst, librarycode, voorbeeldcode of versievelden wijzigen.

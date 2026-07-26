# Voorstel - van fysieke pagina naar Gysin-poster

Datum: 26 juli 2026
Status: lokaal uitgevoerd; fysieke A4-proef nog nodig
Werknaam: **Gysin remembers**

## Vastgelegd besluit

De Collage volgt deze route en bewaart de drie open kaders uit Sebs test als
ruggengraat. Zwart houdt de pagina; rood is uitsluitend de terugkerende tweede
stem.

De centrale vorm volgt de eerder gekozen
[p5.waves Curation Engine-aanpak](https://seb-prjcts-be.github.io/p5.waves/docs/curation-engine/index.html):

1. toon eerst het volledige werk als belofte;
2. ontleed daarna exact dat werk, één functie of concept per frame;
3. bouw van fysiek blad naar compositie en niet van losse effecten naar een
   toevallig eindbeeld;
4. eindig met exact hetzelfde volledige werk;
5. gebruik één canonieke compositiebuilder voor totaalbeeld, losse frames en
   fysieke export.

De genummerde bouw begint, zoals Seb nu vraagt, bij **formaat en lagen**.

De uitvoering staat in drie gedeelde bestanden:

- `docs/collage/composition.js` - één canonieke posterbron voor opening,
  hoofdstukken en export;
- `docs/collage/index.html` - opening, 17 frames en hetzelfde slotbeeld;
- `docs/collage/curation.js` - hoofdstuknavigatie, luie previews, formaatkeuze,
  reroll en plotter-SVG.

De lokale SVG-controle is geslaagd voor A4, A3 en A2. Publicatie en een echte
plot met zwarte en rode pen zijn afzonderlijke vervolgstappen.

## Wat elk frame altijd bevat

Elk frame krijgt dezelfde vijfdelige grammatica:

1. **Gysin vooraf** - één korte historische verwijzing of curatoriële these,
   vóór preview en code;
2. **Start** - welk materiaal al uit het vorige frame bestaat;
3. **Build** - exact één nieuwe functie of één nieuw concept;
4. **Result** - wat dit zichtbaar aan het beeld verandert;
5. **In de poster** - waar exact hetzelfde ingrediënt in het totaalbeeld zit.

Historisch feit, curatoriële interpretatie en hedendaagse plottervertaling
worden zichtbaar van elkaar onderscheiden. Een eigen tekst krijgt nooit
aanhalingstekens of Gysins naam alsof het een citaat is.

Een frame mag dezelfde functie meermaals aanroepen wanneer de herhaling het ene
concept vormt, bijvoorbeeld drie `rect()`-kaders. Het frame introduceert nooit
twee nieuwe functies tegelijk. Gedeelde bedrading zoals `plot.draw()` en de
vaste seed blijft buiten de hoofdstukken.

## Fysiek contract

### Formaat

- De compositie gebruikt één staand artboard van **560 x 792
  compositie-eenheden**, dezelfde verhouding als de ISO A-reeks.
- De gebruiker kiest alleen **A4, A3 of A2**:
  - A4: 210 x 297 mm;
  - A3: 297 x 420 mm;
  - A2: 420 x 594 mm.
- A4 is de standaard en de eerste fysieke proef.
- De veilige inhoudsmarge is 10 mm. Geometrische clipping blijft altijd aan.
- De compositie wordt proportioneel geschaald; elementen verschuiven niet per
  papiermaat.

### Pennen en lagen

De poster gebruikt twee fysieke pennen en meerdere semantische lagen:

| Zichtbare Inkscape-laag | Rol | Pen |
|---|---|---:|
| `1 frame` | open kaders | 1 zwart |
| `1 rules` | regels en rasterritme | 1 zwart |
| `1 word` | woord, permutatie en snede | 1 zwart |
| `1 machine` | getypte bronstem en colofon | 1 zwart |
| `1 fields` | letters, operatoren en lattice | 1 zwart |
| `2 return` | rode ring en terugkerende accenten | 2 rood |
| `2 hand` | rode asemische hand | 2 rood |

De export gebruikt dus semantische laagnamen in de code, maar
`penMap` vertaalt ze naar fysieke nummers. Iedere zichtbare Inkscape-laag begint
met `1` of `2`, omdat dat op Sebs machine nodig is om ze afzonderlijk te
plotten.

Er zijn geen plotterinstellingen voor `alpha`, `strokeWeight` of `pressure`.
Fysieke dekking en lijndikte komen van de echte pen. De SVG bevat centerlines.

## Tekst- en beeldmateriaal

De poster gebruikt een klein, vast vocabulaire:

- bronregel: **I rub out the word.**
- woordlichaam: **WRITE**
- terugkerend woord: **REMEMBERS**
- permutatiemateriaal: **CUT TURN RETURN**
- kleine bron-/proceslabels: **Brion Gysin**, **observe**, **continue**

De eerste vier zijn inhoudelijk materiaal; de kleine labels zijn context en
machinegrammatica. Nieuwe pseudo-Gysin-zinnen, Beat-decoratie en drugsreferenties
horen niet in het beeld.

Zwart houdt de pagina en de leesbare bron vast. Rood is geen algemene
accentkleur maar één tweede stem: terugkeer, ring en hand.

## Openingsbeeld - het volledige werk

De pagina opent met de volledige zwart-rode poster, groot genoeg om verlangen
op te wekken. Dit is geen genummerd tutorialframe.

De opening zegt in één eigen, redactionele zin:

> Een fysieke pagina houdt de woorden vast; permutatie, snede, herhaling en
> handschrift laten ze in andere verhoudingen terugkeren.

Daaronder staat een compacte route:

`paper → frame → word → cut → field → return → hand → plot`

De opening gebruikt exact dezelfde compositiebuilder en standaardseed als het
slotbeeld en de SVG-export.

## Voorgestelde framevolgorde

### 01 - The sheet

**Gysin vooraf:** Gysins ontmoeting van schrijven en schilderen is het
inhoudelijke vertrekpunt. Wij vertalen dat niet naar een historische
papiermaat, maar naar een echte, begrensde plotpagina.

**Nieuw concept:** ISO-pagina, oriëntatie, schaal, marge en clipping.

**In de poster:** het volledige witte blad en de vaste veilige inhoudszone.

**Codefocus:** alleen het `page`-object met A4, A3 of A2.

### 02 - The layers

**Gysin vooraf:** machine, woordveld en handschrift krijgen verschillende
verantwoordelijkheden. Dat is onze curatoriële ordening van Gysins
meervoudige praktijk, geen reconstructie van zijn atelier.

**Nieuw concept:** semantische `layer`-rollen en numerieke `penMap`.

**In de poster:** zwart houdt structuur en taal; rood keert terug als ring en
hand.

**Codefocus:** alleen laagrollen en `penMap`, nog zonder tekenen.

### 03 - The frames

**Gysin vooraf:** het raster is eerst gezag. Een uitbraak wordt pas zichtbaar
wanneer de grens waaruit ze ontsnapt nog te zien is.

**Nieuwe functie:** `rect()`.

**In de poster:** drie open kaders uit Sebs oorspronkelijke test, achter alle
taal en velden.

**Codefocus:** drie `rect()`-calls, allemaal op laag `frame`.

### 04 - The rules

**Gysin vooraf:** in Gysins grids krijgt herhaling een zichtbare maat. De
regels zijn geen achtergronddecoratie maar een ritme waartegen afwijking kan
werken.

**Nieuwe functie:** `line()`.

**In de poster:** een beperkt ruled field in het onderste zwarte kader.

**Codefocus:** één regelreeks met `line()`, zonder letters of symbolen.

### 05 - The word

**Gysin vooraf:** de bron moet leesbaar blijven voordat ze kan verschuiven.
Het woord is eerst een lichaam, niet meteen een effect.

**Nieuwe functie:** `text()`.

**In de poster:** één grote, heldere **WRITE** als zwart woordlichaam.

**Codefocus:** één schone `text()`-call met alleen positie, maat en laag.

### 06 - The permutation

**Gysin vooraf:** Gysins permutation poems behouden de woorden maar veranderen
hun onderlinge positie. De regel is de compositie.

**Nieuwe functie:** `chant()`.

**In de poster:** een leesbare reeks uit **CUT TURN RETURN** in het bovenste
kader.

**Codefocus:** één `chant()`-call; geen contourknip of willekeurige beschadiging.

### 07 - The cut

**Gysin vooraf:** de historische cut-up snijdt en herschikt bronfragmenten;
toeval opent een mogelijkheid, selectie maakt er opnieuw een werk van.

**Nieuwe functie:** `weave()`.

**In de poster:** één korte strook waarin twee geverifieerde bronregels elkaar
ontmoeten, met hun provenance buiten het beeld bewaard.

**Codefocus:** één `plot.weave()`-call met twee bronnen. Dit is de talige
cut-up-route.

### 08 - The surface

**Gysin vooraf:** dit frame draagt bewust een waarschuwing. Horizontale
contourstroken zijn een hedendaagse grafische snede en niet Gysins historische
cut-up.

**Nieuwe functie:** `textCutup()`.

**In de poster:** één kleine, late snede door **REMEMBERS**, nooit de
dominante taalbehandeling.

**Codefocus:** één `textCutup()`-call met vijf stroken.

### 09 - The letter field

**Gysin vooraf:** wanneer grammatica losser wordt, blijven letters als
materiaal, ritme en herinnering op de pagina aanwezig.

**Nieuwe functie:** `letters()`.

**In de poster:** een dun veld van letters uit het eigen bronvocabulaire in
het onderste kader.

**Codefocus:** één `letters()`-call; luchtig genoeg om de hoofdtekst niet te
verdringen.

### 10 - The mark field

**Gysin vooraf:** operatoren kunnen hun zinsfunctie verliezen en toch richting,
scheiding en maat blijven suggereren. Dit is onze curatoriële lezing, geen
Gysin-citaat.

**Nieuwe functie:** `symbols()`.

**In de poster:** een korte band met `/ " ( ) - :`, uitsluitend tekens die het
ingebouwde alfabet werkelijk bezit.

**Codefocus:** één `symbols()`-call, zonder ontbrekende glyphs of vraagtekens.

### 11 - The typed voice

**Gysin vooraf:** de mechanische stem contrasteert met woordveld en vrije hand.
Beperking is hier een stem: vaste pitch, slag, onderstreping en overstrike.

**Nieuwe functie:** `underwood()`.

**In de poster:** de bronregel **I rub out the word.**, kleine labels en de
colofon in één consequente typewriterstem.

**Codefocus:** één korte `underwood()`-passage. Hoofdletters blijven voor
woordmassa; bronstem en metadata blijven mixed case.

### 12 - The turned sheet

**Gysin vooraf:** permutatie kan niet alleen de woordvolgorde maar ook de
richting van het blad organiseren. Het grid blijft aanwezig terwijl een tweede
leesrichting erdoorheen loopt.

**Nieuwe functie:** `lattice()`.

**In de poster:** één compacte kruising van horizontale regels en een gedraaide
tekstpassage.

**Codefocus:** één `lattice()`-call. Geen handmatige lus van losse letters.

### 13 - The return

**Gysin vooraf:** de Dreamachine is hier alleen een structurele verwijzing:
een eenvoudig mechanisme keert cyclisch terug en produceert meer dan één
stilstaand moment. De poster simuleert de Dreamachine niet.

**Nieuwe functie:** `circle()`.

**In de poster:** de grote rode ring uit Sebs test, als terugkerende tweede
stem.

**Codefocus:** één `circle()`-call op laag `return`; `repeat: 3` maakt de
fysieke terugkeer zichtbaar.

### 14 - The worn word

**Gysin vooraf:** **I rub out the word.** maakt verdwijnen niet leeg: het woord
blijft als spoor en handeling aanwezig.

**Nieuwe functie:** `rub()`.

**In de poster:** **WRITE** keert onderaan terug in drie toestanden.

**Codefocus:** één `rub()`-call op zijn sterke defaults.

### 15 - The hand

**Gysin vooraf:** in Gysins werk kan schrift gelezen worden als taal, ritme of
teken. De code maakt geen namaak-Gysin-kalligrafie, maar opent een zone waar
richting en gebaar vóór vertaling komen.

**Nieuwe functie:** `asemic()`.

**In de poster:** vier rode, richtinghebbende gebaren in de ondermarge.

**Codefocus:** één herhaalde `asemic()`-handeling op laag `hand`.

**Open ontwerpgate:** eerst een lokale proef maken. De huidige `asemic()`
keert sterk naar het midden; als dat geen horizontale schrijfbeweging geeft,
wordt niet stil de core aangepast. Dan volgt eerst een afzonderlijk voorstel.

### 16 - The ink

**Gysin vooraf:** dit is geen historische Gysin-claim maar de fysieke
vertaling van herhaling naar pen en papier. Inkt stapelt door echte passages,
niet door scherm-opacity.

**Nieuw concept:** `bleed`.

**In de poster:** één begrensde lokale inktzone; niet elke lijn wordt
gelijktijdig zwaar.

**Codefocus:** één bestaand element met uitsluitend de bleed-opties als nieuw
verschil. De plotterroute bewaart de echte extra passages.

### 17 - The plot

**Gysin vooraf:** het werk eindigt niet als canvaspreview. De hedendaagse
vertaling wordt pas volledig wanneer dezelfde centerlines als fysieke
penlagen naar papier vertrekken.

**Nieuwe functie:** `downloadPlotterSVG()`.

**In de poster:** geen nieuw grafisch element; dit frame toont de fysieke
bestemming van alle vorige ingrediënten.

**Codefocus:** één exportcall met `page`, `penMap` en `tool: "pen"`.

De preview ernaast toont:

- gekozen A-maat;
- 10 mm veilige marge;
- `1 ...` en `2 ...` Inkscape-lagen;
- centerlines;
- clipping aan;
- route-optimalisatie per penlaag.

## Slotbeeld - exact dezelfde poster

Na frame 17 keert de volledige poster terug. Dit slotbeeld is geen nieuwe
compositie en bevat geen verrassingslaag. Het bewijst dat ieder geïsoleerd frame
een echt ingrediënt was.

Bij het slot staan slechts drie acties:

1. **Reroll** - dezelfde compositierollen, nieuwe deterministische variatie;
2. **A4 / A3 / A2** - dezelfde verhoudingen, andere fysieke schaal;
3. **Plotter SVG** - de genummerde Inkscape-lagen downloaden.

## Wat bewust geen frame krijgt

Dit blijft een posterproces, geen volledige API-catalogus.

- `polygon()` en vrije `path()` zijn nuttige primitives, maar geen noodzakelijke
  ingrediënten van deze poster.
- `freeze()`, `thaw()`, `select()`, `update()` en `remove()` zijn
  adresseringsgereedschap, geen zichtbaar postergebaar.
- JSON, HPGL en `stats()` blijven bereikbaar via System en de aparte
  plottervoorbeelden. Het curatoriële slot focust op de plotterveilige SVG.
- `alpha`, `strokeWeight` en `pressure` krijgen nergens een plotterframe omdat
  de vaste pen ze niet uitvoert.
- `grid()` blijft buiten dit voorstel omdat de drie open `rect()`-kaders en het
  ruled `line()`-veld Sebs eigen testmateriaal specifieker bewaren.

## Visuele zones van de eindposter

De compositie krijgt vijf leesbare zones:

1. **Source / machine** - kleine getypte bronstem en metadata;
2. **Word / order** - helder woord, permutatie en één talige cut-up;
3. **Return** - rode ring die door zwart woord en kader loopt;
4. **Fields / turn** - letters, operatoren en lattice met voldoende witruimte;
5. **Wear / hand** - versleten woord en rode gebaren richting onderrand.

De zones zijn geen vijf losse posters. Kader, ring en leesrichting verbinden ze
tot één blad.

## Bronankers voor de Gysin-inzetten

De publieke teksten worden uitsluitend uit een kleine, gecontroleerde bronset
geschreven:

1. **Writing and painting** - de korte regel uit *Cut-Ups Self-Explained*,
   met de reeds gebruikte
   [Centre Pompidou-dossierverwijzing](https://www.centrepompidou.fr/media/document/01/b6/01b6f3030d125773fee07a7557fdabfc/normal.pdf);
2. **Cut-up** -
   [Musée d'Art Moderne de Paris](https://www.mam.paris.fr/en/node/2213) over
   de herneming en uitbreiding van de cut-up;
3. **Permutation and grid** -
   [Centre Pompidou over The Last Museum](https://www.centrepompidou.fr/en/magazine/article/focus-on-the-last-museum-by-brion-gysin)
   en museale documentatie over permutatie als visuele ordening;
4. **Writing and calligraphy** -
   [Musée d'Art Moderne de Paris](https://www.mam.paris.fr/en/node/2213) en
   Centre Pompidou over schrijven, tekenen en kalligrafische marks;
5. **Dreamachine** - het
   [Centre Pompidou collection record](https://www.centrepompidou.fr/en/ressources/oeuvre/crgBkGx),
   uitsluitend als structurele referentie voor mechanisme en herhaling;
6. **I rub out the word.** - de eerder brongecontroleerde korte ICA-regel,
   zonder onzekere datering van een specifiek beeldobject.

Iedere frame-inzet verwijst naar één van deze ankers of draagt expliciet het
label **contemporary translation**.

## Uitvoeringsvolgorde na goedkeuring

### Gate 1 - bron en volgorde

Seb keurt eerst goed:

- de 17 frames;
- het kleine tekstvocabulaire;
- de twee penrollen;
- welke Gysin-inzet bij elk frame hoort.

Nog geen code.

### Gate 2 - drie zwart-rode totaalbeeldschetsen

Maak drie lokale compositieroughs met exact dezelfde ingrediënten en lagen:

1. streng verticaal;
2. open midden met dominante rode ring;
3. dichter raster boven, vrijere hand onder.

Kies één poster. Geen publieke pagina wijzigen.

### Gate 3 - canonieke compositiebuilder

Bouw één gedeelde `composition.js`:

- genormaliseerd op 560 x 792;
- vaste standaardseed;
- functies in tekenvolgorde;
- alle lagen expliciet;
- geen DOM, controls of exportknoppen in de compositiebuilder.

### Gate 4 - frames uit dezelfde bron

Ieder hoofdstuk roept hetzelfde ingrediënt uit de canonieke builder aan of
gebruikt exact dezelfde kleine helper/data. Geen handmatig nagetekende
lookalikes.

### Gate 5 - technische en fysieke verificatie

Minimaal:

- `npm run build:min`;
- `npm run manifest`;
- `npm test`;
- `node --check` op gewijzigde JavaScriptbestanden;
- `git diff --check`;
- lokale browsercontrole op desktop en 390 px;
- SVG-controle op A4, A3 en A2;
- Inkscape-laagnamen beginnen werkelijk met `1` of `2`;
- één fysieke A4-proef met zwarte en rode pen.

Pas na de fysieke A4-proef kan de poster als plotterbewezen worden beschreven.

## Vastgelegd vormbesluit

De uitgevoerde route is:

**volledige poster als opening → 17 frames van page tot plot → dezelfde poster
als slot**.

De drie open kaders uit de test blijven de ruggengraat. De dominante rode ring
verbindt de velden; de onderste zone blijft vrijer voor slijtage en hand.

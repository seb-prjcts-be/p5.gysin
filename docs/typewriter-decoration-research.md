# Typmachine-decoratie - wat kon in die tijd (design-constraint)

**Doel.** De typmachine-modus mag alleen tekstdecoratie gebruiken die een
manuele/elektrische typmachine uit de Gysin/Burroughs-tijd (jaren '50-'60)
echt kon. Geen digitale trucs die als typmachine vermomd zijn. Deze notitie is
de bron van waarheid voor die grens; onderzoek met bronnen onderaan.

## Kernregel: er was geen bold en geen italic

Een typebalk slaat altijd dezelfde vaste glyph aan. Er is geen tweede
lettervorm, dus **echte bold en echte italic waren mechanisch onmogelijk** op
een gewone typmachine. Alle nadruk moest uit andere trucs komen.

(Uitzondering, buiten scope: de IBM Selectric "golfball" (1961+) kon een hele
italic-bol wisselen, maar alleen voor een heel document/sectie, nooit inline
gemengd. Gysin/Burroughs typten op gewone portables (Olivetti e.d.). Behandel
Selectric-italic als anachronistisch voor dit werk.)

## Wat WEL mocht (period-correct)

**Nadruk zonder bold/italic:**
- **Overstrike / dubbelslag** - dezelfde letter er nog eens overheen typen (soms
  een haar verschoven) = de enige "bold". Dit is precies onze `overstrike`.
- **HOOFDLETTERS** - altijd beschikbaar, standaard nadrukmiddel.
- **Spatiëring** - `S P A T I E` woorden met een volle spatie tussen elke letter
  (de Duitse *Sperrsatz*-conventie, in typoscript overgenomen juist omdat
  italic/bold ontbraken).
- **Onderlijning met de underscore** - het dominante, editorieel gecodificeerde
  nadrukmiddel. Mechanisch: woord typen, carriage terug, `_` eronder slaan.
  Er bestond een hele **nadruk-ladder** (correctie-conventie voor de zetter):
  - enkele onderlijning = italic
  - dubbele onderlijning = bold / small caps
  - drievoudige onderlijning = kapitalen
  - golvende onderlijning = vet

**Symbool-dividers / pagina-indeling** (allemaal uit echte toetsen):
- rij asterisken `********` of gecentreerd `* * *` (de "dinkus", sectiebreuk)
- streepjes-liniaal `--------` en underscore-liniaal `________`
- punt-leiders `........` (inhoudstafels)
- alternerende patronen `-_-_-_`, `+-+-+-`, `*-*-*-`  *(mechanisch triviaal en
  aannemelijk, maar niet als benoemde conventie gedocumenteerd - markeer als
  "geïmproviseerd ornament", niet als vaststaand feit)*

**Tonale velden via overprint** - meerdere tekens over dezelfde plek typen, en
tekendichtheid (licht `. , '` naar donker `M W # @`) gebruiken om grijswaarden
en textuur op te bouwen. Dit is historisch juist: het ís de
concrete-poëzie/typewriter-art-techniek (voorafgaand aan digitale ASCII-art),
en sluit aan op composition-plan laag 2 (`fill: "dots"`, verval als dichtheid).

## Wat NIET mocht (anachronistisch - vermijden of degraderen)

- **Echte inline bold of italic** (weight/schuinte). Nooit. "Bold" = alleen
  overstrike.
- **De pipe `|`** voor kaders/tabellen - dat is een teletype/computer-teken
  (ASCII 1963+), geen betrouwbare typmachinetoets. Gebruik `l`/`I` of een
  met-de-hand getrokken lijn.
- **`=` en `+` als gegarandeerde toetsen** - op veel machines afwezig; degradeer
  naar underscore+koppelteken of koppelteken+dubbelpunt. (Gysins plaat gebruikt
  wél `+`, dus zijn machine had het - per compositie optioneel toestaan.)
- **`1` en `0` als gegarandeerd** - vaak vervangen door `l` en `O` (period-mode).
- **`!` als gegarandeerd** - gebouwd uit apostrof + backspace + punt.
- **Krul-aanhalingstekens / echte prime** - alleen rechte `'` en `"`.
- **Wisselende lettergrootte in een regel, proportionele spatiëring, curven,
  sierletters** - allemaal anachronistisch. Monospace, één grootte, rechtop.

## Vertaling naar de library (typmachine-modus)

Uitgewerkt als de optionele intentie-verb **`plot.underwood()`** (module
`p5.gysin.underwood.js`, genoemd naar Burroughs' Underwood No. 5). Single-stroke
Hershey-face meegebundeld, period-metriek (10 cpi pitch, 6 lpi lijnhoogte) als
default.

| Period-truc | In `underwood()` |
|---|---|
| "bold" = dubbelslag | `bold: true` (overstrike elke glyph); anders lichte overstrike bij slijtage |
| HOOFDLETTERS | string upper-casen (invoer bepaalt case) |
| spatiëring (Sperrsatz) | volle spaties in de string (`"S P A C E D"`) |
| onderlijning + ladder | `underline: 1..3` -> single-stroke rule(s) onder de regel |
| dividers (`***` `-_-_` `...`) | gewoon getypte strings |
| slijtage (aanslag/lint) | `wear` (0 = mechanisch schoon) schaalt wobble/jitter/inkVary/overstrike/dropout |
| tonale velden (overprint) | `letters()`/`symbols()` + overstrike; later `fill:"dots"` |

**Gevolg (uitgevoerd):** de eerdere `fill: "cross"`-massa was nep-bold en dus
niet period-correct. `underwood()` is single-stroke: massa komt van dubbelslag,
niet van vulling. Geen echte bold/italic, geen wisselende grootte in een regel.

## Bronnen
- Overstrike / typografische benadering: en.wikipedia.org/wiki/Typographic_approximation ; dernocua.github.io/notes/beyond-overstrike.html
- Spatiëring / Sperrsatz: en.wikipedia.org/wiki/Letterspace ; Emphasis (typography), Wikipedia
- Onderlijnings-ladder (single/double/triple/wavy): typographyforlawyers.com/underlining.html ; practicaltypography.com/underlining.html
- Dividers / dinkus: cambric.pub/guides/scene-breaks/ ; knowadays.com scene-breaks
- Typewriter-art / overprint + concrete poëzie: fastcompany.com "A Short History of Typewriter Art" ; asciiart.eu/history-of-ascii-art
- Ontbrekende toetsen (`1 0 ! + =`): medium.com/@PostHasteCo "Why Old Typewriters Lack A '1' Key" ; ask.metafilter.com/46743
- `|` als computer-tijdperk: en.wikipedia.org/wiki/Vertical_bar
- Lijn Gysin: Dom Sylvester Houédard ("typestracts", Olivetti Lettera 22), Bob Cobbing, Henri Chopin - designobserver.com "Cosmic Typewriter" ; itsnicethat.com "Typestracts"

# Klein onderzoek: tekstpermutaties in p5.gysin

## Conclusie

Tekstpermutatie past inhoudelijk sterk bij p5.gysin: de **volgorde van de
woorden** wordt het materiaal. `textCutup()` is daarvan gescheiden; die functie
verschuift alleen horizontale delen van lettercontouren en geldt sinds de
herijking van 26 juli 2026 als een zeldzame grafische oppervlaktebewerking.

De twee bewerkingen moeten afzonderlijk blijven:

1. een tekstfunctie ordent woorden opnieuw;
2. `text()` zet elke gekozen regel leesbaar om in plotbare contouren;
3. alleen een expliciete keuze voegt daarna `textCutup()` of andere aantasting toe.

Zo wordt eerst de betekenis gedeconstrueerd en daarna de vorm, terwijl de
bestaande vector-first exportketen intact blijft.

## Historische aansluiting

Gysins permutation poems vertrekken van een korte zin en herschikken de woorden
systematisch. Voor `I AM THAT I AM` bestaan door de herhaalde woorden dertig
unieke volgordes. Ian Sommerville hielp Gysin in 1960 met een computerprogramma
dat zulke permutaties genereerde. Dat maakt een kleine, deterministische
tekstgenerator niet alleen passend bij de naam van de library, maar ook bij de
geschiedenis van computergegenereerde literatuur.

De bredere cut-upmethode is anders: bestaand tekstmateriaal wordt in stukken
gesneden en opnieuw gemonteerd. Het is daarom nuttig om in de API onderscheid te
maken tussen **permutation** (alle woorden van een korte zin herschikken) en een
latere **cut-up**-modus (brokken uit een of meer langere teksten mengen).

Bronnen:

- [Spencer Museum of Art - *I Am That I Am*](https://spencerart.ku.edu/art/collections-online/object/25857)
- [WorldCat - *Permutations*](https://search.worldcat.org/title/Permutations/oclc/1289922133)
- [Brion Gysin - Cut ups](https://www.briongysin.com/cut-ups/)
- [David Pocknee - The Permutated Poems of Brion Gysin](https://davidpocknee.ricercata.org/gysin/)

## Aanbevolen eerste versie

Begin klein en dependencyvrij met een zuivere helper, los van tekenen:

```js
const regels = GysinText.permute("I love you", {
  seed: 1960,
  limit: 6,
  order: "walk"
});
```

Mogelijke uitvoer:

```text
I love you
you I love
love I you
I you love
you love I
love you I
```

De gebruiker kan de regels daarna zelf plaatsen:

```js
regels.forEach((regel, index) => {
  plot.text(regel, 70, 120 + index * 58, { size: 44 });
});
```

Een zuivere helper is een goede eerste stap omdat hij ook zonder p5-runtime te
testen is, geen bestaande shape-API verandert en bruikbaar blijft voor canvas,
SVG, JSON en HPGL.

## Kleine maar belangrijke ontwerpkeuzes

- **Unieke permutaties:** dubbele woorden mogen geen dubbele regels opleveren.
- **Harde limiet:** het aantal volgordes groeit faculteitsgewijs. Acht unieke
  woorden leveren al 40.320 regels op. Een veilige standaardlimiet is nodig.
- **Deterministisch:** `seed` moet zowel de selectie als de volgorde bepalen.
- **Originele regel eerst:** zo blijft het bronmateriaal zichtbaar.
- **Interpunctie behouden:** in de eerste versie blijft leestekenmateriaal aan
  het woord vastzitten; een slimme tokenizer kan later.
- **Geen grammaticale correctie:** vreemde zinnen zijn hier het materiaal, geen
  fout die de library moet repareren.
- **Geen taalmodel:** gewone combinatoriek is transparant, lokaal en passend bij
  de dependencyvrije library.

## Voorgestelde ordeningen

- `"random"`: gezaaide willekeurige volgorde van unieke permutaties.
- `"walk"`: per regel een kleine verwisseling, zodat het gedicht zichtbaar van
  de ene zin naar de andere schuift. Dit is de beste standaard voor beeldwerk.
- `"lexical"`: vaste, controleerbare volgorde; vooral handig voor tests.
- `"rotate"`: alleen cyclische verschuivingen; rustig en bruikbaar bij langere
  zinnen.

## Gerealiseerde eerste uitbreiding

De zelfstandige bestanden `p5.gysin.text.js` en `p5.gysin.text.min.js` bieden
nu `GysinText.permute()`, met regressietests voor unieke woorden, herhaalde
woorden, seed en limiet. Het standalone voorbeeld
`examples/permutation_poem/` gebruikt `I LOVE YOU` voor een monochrome
A3-compositie waarin `chant()` de permutaties als leesbare regels tekent.
`weave()` behandelt intussen fragmenten uit meerdere bronteksten.

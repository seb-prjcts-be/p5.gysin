# Technische releasecontrole — p5.gysin 1.0.0

Uitgevoerd op 25 juli 2026 op branch `codex/v1-text-voice-plan`, vóór de
versiesprong. Dit is controlebewijs, geen releasebericht.

## Build en contract

- `npm run build:min`: groen; core 96.141 bytes, text 16.771 bytes,
  underwood 16.252 bytes.
- `npm run manifest`: groen; veertien voorbeelden.
- `npm test`: snapshot, API/docs-contract en 22 lokale links groen.
- De API/docs-contracttest vergelijkt de drie bronbestanden met hun drie
  browserbuilds, `docs/p5.gysin.manifest.json` en `docs/system.html`.
- Veertig publieke methoden zijn in alle vier de lagen aanwezig.
- Alle 25 gevolgde JavaScriptbestanden slagen voor `node --check`.
- `git diff --check`: groen.

## Lokale site

- HTTP 200: alle 22 gevolgde HTML-routes.
- Chrome: 22 routes op 1400 × 900 en 390 × 844; geen paginastoring,
  ontbrekend beeld of horizontale uitloop.
- De matrix bracht één echt mobiel probleem aan het licht: de twee grid-items
  van Collage behielden hun automatische minimumbreedte. `min-width: 0` op
  preview en codeblok brengt het document terug van 416 naar exact 390 px;
  preview/code meten 334 px en het canvas 332 px.

## Versiegrens

Vóór de bump zijn 49 treffers op `0.4.0` geïnventariseerd. In fase 12 worden
alleen actuele versie-uitingen en gepinde installatiepaden vervangen:

- `package.json` en de drie gegenereerde buildbanners;
- README en System: actuele supporttekst en CDN-paden;
- homepage, Collage, System, Vision en voorbeeldfooters;
- het gegenereerde manifest.

Historische verwijzingen blijven staan: `added_in: "0.4.0"`, het
0.4.0-releasebericht en de controles/beslissingen in `TODO-1.0.0.md`.
Er zijn geen project-CDN-paden met `@next`, `@main`, `@master` of een release
vóór v0.4.0.

## Bewaarde v0.4.0

`v0.4.0` is een onaangeroerde geannoteerde tag:

- tagobject: `c655440503eb868ff57dd606141467eb2fcf2c49`;
- releasecommit: `85fb3d57a7404079bc8545bc530a20f5e3f75463`;
- lokale en remote object- en commithashes zijn gelijk.

De drie gepinde jsDelivr-bestanden antwoorden met HTTP 200 en zijn inhoudelijk
gelijk aan dezelfde bestanden op de tag:

- core: SHA-256
  `4a17f6cbc37d9adc271b5f88a9688517875684f706f19bede3a2194fffa6e5e6`;
- text: SHA-256
  `edc35f99fb1232182e6a17426af2de9acdc71ca5354f643431ffa37199bc8f4a`;
- underwood: SHA-256
  `3342e9e22aa520d442c9e5b6de3ab0423ebab04b31f3a10a8057e3fbe86bb9bd`.

De twee addonbestanden dragen in de oude tag nog hun historische
`v0.3.0`-banner. Dat is deel van de bewaarde bytes, geen reden om de tag te
verplaatsen. De 1.0.0-build krijgt nieuwe correcte banners.

Beslissing: geen dubbel Pages-archief bouwen. v0.4.0 blijft raadpleegbaar via
de bestaande tag en gepinde CDN-URLs, zoals Seb vóór de marathon aangaf.

## Scope

De drie vooraf bestaande lokale onderzoeksdocumenten blijven ongetrackt en
buiten iedere stagingactie. Er is nog geen 1.0.0-tag, release of publicatie
uitgevoerd.

## Definitieve 1.0.0-hercontrole

Uitgevoerd na de versiesprong en de definitieve build:

- package, manifest en drie buildbanners melden `1.0.0`;
- snapshot, API/docs-contract en 22-linktest groen;
- 26 JavaScriptbestanden slagen voor `node --check`;
- alle 22 HTML-routes antwoorden lokaal met HTTP 200;
- Chrome opnieuw groen voor 22 routes op desktop en mobiel: 44 controles;
- `git diff --check` groen;
- de resterende `0.4.0`-treffers zijn uitsluitend de hierboven vastgelegde
  historische verwijzingen;
- exacte v0.4.0-vergelijking groen voor een seeded compositie met bestaande
  core-methoden (JSON, SVG, HPGL en statistieken), de vier permutatiemodi en
  underwood-uitvoer.

De v1.0.0-CDN-URLs kunnen pas na een toegestane tag en publicatie worden
gecontroleerd. Tot dan zijn ze alleen de gedocumenteerde releasepaden.

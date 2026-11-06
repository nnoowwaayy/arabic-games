# Data sources and attribution

All playable datasets expose a source, scope and snapshot date. These are dated observations, not claims of live updates. The application never scrapes the reference's proprietary datasets.

| Data | Source | Definition / snapshot |
| --- | --- | --- |
| Moroccan cities | [HCP source](https://www.hcp.ma/file/242341/) and [DBClair commune ranking](https://dbclair.ma/fr/classements/) | 30 selected communes; legal population at 1 September 2024; not metropolitan population |
| Moroccan mountains | [GeoNames](https://www.geonames.org/ma/highest-mountains-in-morocco.html) | 10 elevations above sea level, exactly as recorded by this source; surveys differ |
| Moroccan league titles | [RSSSF](https://www.rsssf.org/tablesm/marochamp.html) | Selected clubs, men's first division since 1956 through 2023/24. Wydad = 17 in this scope; pre-independence titles excluded |
| Moroccan heritage and culture | [UNESCO](https://whc.unesco.org/en/statesparties/ma) | Nine World Heritage inscription years; not construction dates. Twelve culture and twelve geography/heritage quiz statements |
| Countries: total area / land neighbours | [mledoze/countries](https://github.com/mledoze/countries) | UN-member records from the source snapshot; borders and geographic definitions follow the provider. ODbL attribution applies |
| Country population | [World Bank SP.POP.TOTL](https://data.worldbank.org/indicator/SP.POP.TOTL) | 2023 observations, joined to country records by ISO2; regional aggregates and missing values excluded |
| Population density | [World Bank EN.POP.DNST](https://data.worldbank.org/indicator/EN.POP.DNST) | 2023 people per km² of land. This does not use the total-area denominator of the area game |
| Elements | [Periodic Table JSON](https://github.com/Bowserinator/Periodic-Table-JSON) | 30 familiar elements; atomic numbers, atomic masses and normal boiling temperatures in kelvin. CC BY-SA source |
| Pokémon | [PokéAPI](https://pokeapi.co/) | IDs 1–40; base-stat sum, base speed, weight converted from hectograms to kg. No proprietary reference artwork is used |
| Films | Individual linked Wikipedia film references | 16 original theatrical runtimes and release years. The retained API-check evidence is in `data/film-evidence.json`; rate-limited/missing checks are explicit, with the remaining pages checked through public page reads. Spirited Away uses the observed 124-minute entry |
| World Cup scorers | [IFFHS](https://portal.iffhs.com/posts/472) | 20-player historical sample through 2014, published 8 February 2018; not a current world ranking |
| World Cup titles | [RSSSF](https://www.rsssf.org/tablesw/worldcup.html) | All eight winning countries through 18 December 2022; later tournaments deliberately excluded |
| Skyscrapers | [CTBUH / CVU](https://www.skyscrapercenter.com/buildings) | 16 completed buildings; source-displayed architectural heights rounded to metres, excluding antennae |
| Planets | [NASA NSSDCA](https://nssdc.gsfc.nasa.gov/planetary/factsheet/) | All eight planets; mass in 10²⁴ kg and diameter in km. Sheet dated 18 March 2025 |

## Provenance and refresh

`data/manifest.json` records URLs, retrieval timestamps and SHA-256 hashes of the original feed payloads. Checked-in data is reduced to the fields used by the product; hashes identify the fetched original, not the trimmed file. `scripts/ingest-data.mjs` refreshes the permitted open feeds and stops on malformed input. Provider errors do not fabricate replacement values. Refreshes are manual; no recurring task has been scheduled.

Admin dataset editing validates all four locale slots, numerical finiteness, unique item IDs, at least eight records and at least two comparison values. It records an author and update timestamp. An administrator must still verify source accuracy; schema validation alone is not factual verification.

## Image and font credits

Moroccan photographs are independently sourced from Wikimedia Commons. Full source URLs and license metadata are retained in `data/image-credits.json` and displayed on `/sources`:

- Aït Benhaddou: Petar Milošević, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- Toubkal: SimonKing74, [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
- Merzouga dunes: Bjørn Christian Tørrissen, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

Other decorative images are from Unsplash and are enumerated in `scripts/download-assets.mjs`; they illustrate categories rather than depicting each individual item. Country flags are local SVG copies from [FlagCDN](https://flagcdn.com/). DM Sans and Noto Sans Arabic are self-hosted Google Fonts under the SIL Open Font License. No reference-site assets are included.

## Unpublished statistics

Market values, social follower counts, song/video plays, current ratings and nutrition estimates were not invented to fill the catalog. The Transfermarkt page returned 403, and no authorized live social-statistics API credentials were supplied. Moroccan city areas require a consistent administrative-boundary dataset. These modes remain in the documented backlog.

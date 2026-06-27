# Competitive Scan

Date: 2026-06-27

## Decision

Proceed with Stampy as an OSS project.

The closest public projects found during the scan are either:

- single-purpose stamp image generators,
- watermark/rubber-stamp utilities,
- full loyalty-card applications,
- or unrelated packages that use "stamp" to mean timestamp or object factories.

None of the sampled results combine Stampy's intended shape:

- framework-agnostic SVG stamp rendering,
- customizable stamp-press animation hooks,
- portable project JSON for design and runtime data,
- local Studio for editing/import/export,
- light/dark and English/Japanese authoring support,
- and easy static-site embedding.

## npm Search

Query: `stamp generator svg`

Representative top results:

- `time-stamp`: timestamp formatter, unrelated.
- `console-stamp`: console timestamp utility, unrelated.
- `@commercetools-uikit/stamp`: UI label component, unrelated to stamp
  authoring/export.
- `railroad-diagrams`: SVG syntax diagrams, unrelated.
- `d3-shape`: visualization primitives, unrelated.
- `@stamp/core`, `@stamp/compose`, `stampit`: object factory composition
  packages, unrelated to visual stamps.

Takeaway: npm did not show a close JavaScript package for editable SVG stamp
design plus embeddable press animations.

Re-check on 2026-06-27:

- `npm view @stampy/core version` returned `E404`, so the intended package name
  was not publicly readable at that time.
- `npm search stamp generator svg web component stamp --json` still returned
  timestamp utilities, UI labels, object factory packages, and unrelated SVG or
  SDK packages rather than a local stamp authoring/runtime toolkit.

## GitHub Search

Query: `"stamp generator"`

Representative results:

- `maykonsousa/stamp-generator`: small stamp generator app.
- `WiiLink24/Stamp-Generator`: Mii stamp generator using Astro and Express.
- `rebeccamanzi/cartela-brindes`: stamp/gift redemption app.

Query: `"loyalty stamp"`

Representative results:

- `tedd50/loyalty-stamp`
- `thomasmillergb/loyalty-stamps`
- `rehan141196/loyalty-stamps`
- `mkfowad/Saas-Loyalty-Stamp`
- `katiemcy/loyalty-stamp-card`

Takeaway: these are closer to full loyalty products or one-off projects than an
embeddable authoring/runtime toolkit.

## Web Search

Re-check on 2026-06-27:

- `make-stamp.online` and MyStampReady are close in the sense that they provide
  online stamp designers with PNG/SVG/PDF-oriented export, but they are hosted
  image makers rather than an OSS embeddable runtime with project JSON and press
  animation hooks.
- Online PNG Tools has an image-to-stamp converter, but it is a raster image
  conversion workflow rather than structured SVG stamp authoring data.
- SVGator and related SVG animation tools cover general vector animation export,
  but they do not specialize in stamp authoring, stamp-book data, or reusable
  press-animation APIs for web apps.

## Differentiation

Stampy should position itself as a stamp authoring and runtime toolkit, not a
generic image generator and not a hosted loyalty SaaS. The strongest narrow
promise is:

> Design a stamp locally, export it as SVG/PNG/JSON, and embed the same stamp
> with customizable press motion in any static site or web app.

## Re-check Triggers

Re-run this scan before public launch or npm publication if any of these change:

- the package name,
- the target positioning,
- the runtime moves from local/static-first to SaaS,
- or a discovered competitor ships project JSON plus embeddable animation hooks.

## Sources

- npm registry search: `npm search stamp generator svg web component stamp --json`.
- npm package-name check: `npm view @stampy/core version`.
- make-stamp.online: https://make-stamp.online/
- MyStampReady: https://mystampready.com/en/constructor/
- Online PNG Tools image-to-stamp converter:
  https://onlinepngtools.com/convert-image-to-stamp
- SVGator export documentation: https://www.svgator.com/help/export-and-file-formats

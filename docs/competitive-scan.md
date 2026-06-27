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
- `railroad-diagrams`: SVG syntax diagrams, unrelated.
- `d3-shape`: visualization primitives, unrelated.

Takeaway: npm did not show a close JavaScript package for editable SVG stamp
design plus embeddable press animations.

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

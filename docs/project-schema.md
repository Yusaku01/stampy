# Stampy Project Schema

Stampy Project JSON is the portable format shared by Studio, embedders, and
future CLI tooling. It is intentionally small and versioned.

## Version 1

```ts
type StampyProject = {
  schemaVersion: 1;
  name: string;
  locale: "en" | "ja";
  theme: "auto" | "light" | "dark";
  stamp: {
    id: string;
    shape: "circle" | "ticket" | "rounded";
    mainText: string;
    subText: string;
    dateText: string;
    ink: string;
    paper: string;
    icon: "steam" | "star" | "spark" | "none";
    distress: number;
    roughen: number;
    rotate: number;
  };
  animation: {
    preset: "classic" | "bounce" | "ink" | "none";
    durationMs: number;
    intensity: number;
  };
  updatedAt: string;
};
```

## Normalization Rules

Use `createStampyProject`, `parseStampyProject`, and `serializeStampyProject`
from `@stampy/core` instead of hand-writing schema logic.

- `schemaVersion` must be `1`.
- `locale` falls back to `en`.
- `theme` falls back to `auto`.
- missing stamp fields fall back to `defaultStampDesign`.
- `distress` is clamped to `0..1`.
- `roughen` is clamped to `0..8`.
- `rotate` is clamped to `-24..24`.
- animation `durationMs` is clamped to `120..1600`.
- animation `intensity` is clamped to `0.4..1.8`.

## Example

```json
{
  "schemaVersion": 1,
  "name": "Toukatsu Yumeguri visit stamp",
  "locale": "ja",
  "theme": "auto",
  "stamp": {
    "id": "toukatsu-yumeguri-visit",
    "shape": "circle",
    "mainText": "湯巡り済み",
    "subText": "東葛湯巡り",
    "dateText": "2026.06.27",
    "ink": "#b93632",
    "paper": "#fffaf4",
    "icon": "steam",
    "distress": 0.72,
    "roughen": 2.25,
    "rotate": -6
  },
  "animation": {
    "preset": "classic",
    "durationMs": 780,
    "intensity": 1
  },
  "updatedAt": "2026-06-27T00:00:00.000Z"
}
```

## Compatibility Policy

While `@stampy/core` is pre-1.0, schema additions may happen in minor releases.
Breaking schema changes must increment `schemaVersion` and keep a migration path
in core.

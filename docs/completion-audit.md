# Goal Completion Audit

Date: 2026-06-27

This audit maps the original project goal to current Stampy evidence. It is
kept separate from the release checklist because the checklist is operational,
while this document is about whether the OSS extraction goal is actually true.

## Requirements

| Requirement | Evidence | Status |
| --- | --- | --- |
| Extract the stamp concept from `toukatsu-yumeguri` into a separate project. | `examples/toukatsu-yumeguri.project.json` captures a Japanese visit-stamp sample, while `@stampy/core` owns reusable stamp rendering, project JSON, animation, export, and stamp-book helpers. | Done |
| Make stamps easy to generate, edit, and export. | `@stampy/studio` provides a localhost GUI for stamp fields, colors, roughness, rotation, animation settings, SVG export, PNG export, JSON export, JSON import, and embed copying. | Done |
| Make the result easy for other companies to embed in sites or apps. | `@stampy/core` exposes dependency-free TypeScript helpers, a `<stampy-mark>` Web Component, CSS export, Project JSON helpers, and an external consumer smoke test. `examples/vanilla` demonstrates a framework-free integration. | Done |
| Let users implement and customize stamp-press animations. | `pressStamp` accepts built-in presets and a custom `animator` callback. Studio exposes the animation controls and custom animator API example. | Done |
| Support Japanese and English. | Studio includes English and Japanese UI copy, and Project JSON stores `locale`. | Done |
| Support light and dark mode. | Studio supports `auto`, `light`, and `dark`, embed snippets include dark-mode CSS, and Project JSON stores `theme`. | Done |
| Keep the Studio sidebar extended down the left side. | Studio layout uses a persistent left `.sidebar` with full-height shell behavior. | Done |
| Stop if a close existing concept already exists. | `docs/competitive-scan.md` records npm, GitHub, and web checks. Similar tools are hosted image makers, stamp generators, loyalty apps, or general animation tools, not local OSS authoring plus embeddable runtime plus Project JSON plus press hooks. | Done |
| Make the project OSS-ready. | Public GitHub repo, MIT license, README, contributing guide, security policy, issue templates, PR template, Dependabot, CI, branch protection, and release checklist are present. | Done |
| Publish the reusable package. | `@stampy/core` is package-ready and passes local/CI pack plus external consumer verification, but npm auth is not available in the current environment and first release version still needs approval. | Pending external decision |

## Verification Gates

- `pnpm release:core:check` passed locally on 2026-06-27.
- GitHub Actions CI passed on `main` for the latest OSS maintenance commit.
- Studio and vanilla example were manually verified with browser automation on
  2026-06-27.
- `npm view @stampy/core version` returned `E404` on 2026-06-27.
- `npm whoami` returned `E401 Unauthorized` on 2026-06-27.

## Completion Decision

The implementation and repository preparation portions of the goal are complete.
The overall goal should stay open until the owner either approves npm
publication and supplies npm authentication, or decides that GitHub-only OSS
distribution is sufficient for the first public release.

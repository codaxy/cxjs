# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CxJS is a TypeScript framework for building data-intensive web front-ends — admin apps, dashboards, BI tools. This is a yarn 4 workspaces monorepo containing the `cx` package, its React adapter, themes, build plugins, the documentation site, and a testing playground.

Guidance for *using* CxJS in applications (conventions, patterns, pitfalls) lives in the [cxjs-skills](https://github.com/codaxy/cxjs-skills) repository, not here.

## Commands

Run from the repository root:

- `yarn build` — builds `cx-react`, then `cx`
- `yarn test` — runs the tests of `cx` and the Babel plugins
- `yarn litmus` — starts the litmus playground (webpack dev server)
- `yarn build:themes` — builds all `cx-theme-*` packages

Per package:

- `yarn workspace cx run test` — `cx` tests only (ts-mocha)
- `yarn workspace cx run check-types` — type-check `cx`
- `yarn workspace cxjs-homepage-and-documentation run dev` — documentation site (Astro)

## Repository Structure

- `packages/cx/` — the framework (`src/` is TypeScript and ships to npm alongside `build/`)
- `packages/cx-react/` — React adapter
- `packages/cx-theme-*/` — themes; `cx-theme-variables` is the CSS-custom-properties theme recommended for new projects
- `packages/*-plugin-*`, `babel-preset-cx-env`, `cx-build-tools`, `cx-cli`, `create-cx-app` — build tooling
- `homedocs/` — cxjs.io: homepage and documentation (Astro + MDX)
- `litmus/` — manual testing playground: `bugs/`, `features/`, `performance/`
- `legacy/` — old documentation, gallery, fiddle, benchmark and examples; not maintained
- `meta/` — design documents (CSS variables, TypeScript migration, modern Sass)

### `packages/cx/src/`

- `data/` — Store, bindings, `createModel` accessor chains, computables, immutable array/tree helpers
- `ui/` — Widget base classes, Controller, Instance, layouts, selections, adapters, `expr`/`tpl`/`bind`, app loop, History/Url
- `widgets/` — HTML elements, form fields, grid, overlays, navigation
- `charts/`, `svg/` — charting and bounded SVG objects
- `util/` — utilities (formatting, dates, DOM, debounce, …)
- `hooks/`, `locale/` — hooks and culture data
- `jsx-runtime.ts` — the CxJS JSX runtime used with `jsxImportSource: "cx"`

## Working on the Framework

### Widgets

Widgets are written in TypeScript; see `meta/MIGRATION.md` for the full pattern:

- widget files use React JSX: `/** @jsxImportSource react */`
- a `XxxConfig` interface with JSDoc on every prop, using bindable prop types (`StringProp`, `BooleanProp`, `Prop<T>`, …)
- class fields with `declare`, so they do not overwrite config values
- bindable props registered in `declareData`
- defaults set on the prototype after the class: `Xxx.prototype.baseClass = "xxx"`
- styles in `Xxx.scss`, with `Xxx.variables.scss` and `Xxx.maps.scss` next to it, using modern Sass modules (`@use`/`@forward`) — see `meta/MODERN_SASS.md`

### Tests

Tests are `*.spec.ts` / `*.spec.tsx` files next to the source they test, run with ts-mocha (`packages/cx/.mocharc.json`).

### Documentation

- Pages: `homedocs/src/pages/docs/<section>/<page>.mdx`
- Live examples: `homedocs/src/examples/<section>/*.tsx`, imported into pages with `?raw` for the code listing
- Navigation: `homedocs/src/data/navigation.js`. Entries marked `llms: "small"` are included in `llms-small.txt`; every page is also published as `.md` and in `llms-full.txt`
- Breaking changes: `homedocs/src/pages/docs/intro/breaking-changes.mdx`

### Releases

Bump the version in `packages/cx/package.json` and add an entry to `homedocs/src/pages/changelog.mdx`.

### Commit Messages

Conventional style with the widget as scope: `fix(Grid): …`, `feat(Svg): …`.

## Code Style

Follow `.editorconfig`: 3-space indentation, LF line endings, 120-character lines. Prettier is available at the root.

## Claude Code Notes

### File Paths

- Always use relative paths (e.g., `homedocs/tsconfig.json`) instead of absolute paths (e.g., `D:/Code/CxJS/cxjs/homedocs/tsconfig.json`) when reading and editing files to avoid "File has been unexpectedly modified" errors on Windows.

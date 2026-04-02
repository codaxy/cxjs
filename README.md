<br />

<p align="center">
  <a href="https://cxjs.io">
    <img src="misc/logo/cx.svg" alt="cxjs logo" height="140">
  </a>
</p>

<p align="center">
    <img src="https://img.shields.io/npm/v/cx" alt="version" /> 
    <img src="https://img.shields.io/npm/dm/cx" alt="downloads" />
</p>

<br />

CxJS is a TypeScript UI framework with 50+ widgets, data tables, charts, routing, and state management
designed for building data-intensive web applications such as portals, dashboards and admin apps.
Built on top of React, it provides everything needed to build complex front-ends out of the box.

Learn more at [cxjs.io/docs](https://cxjs.io/docs).

## Quick Start

Install the core packages:

```bash
npm install cx cx-react
```

Add a theme:

```bash
npm install cx-theme-variables
```

Configure TypeScript for CxJS JSX:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "cx"
  }
}
```

Set up the entry point:

```tsx
import { startAppLoop } from "cx/ui";
import { Store } from "cx/data";

import "cx-theme-variables/dist/widgets.css";
import { renderThemeVariables, defaultPreset } from "cx-theme-variables";

renderThemeVariables(defaultPreset);

const store = new Store();

startAppLoop(
  document.getElementById("app"),
  store,
  <div>
    <h1>Welcome to CxJS</h1>
  </div>,
);
```

A simple form with two-way data binding:

```tsx
import { createModel } from "cx/ui";
import { Button, LabelsTopLayout, MsgBox, TextField } from "cx/widgets";

interface PageModel {
  name: string;
}

const m = createModel<PageModel>();

export default (
  <LabelsTopLayout vertical>
    <TextField value={m.name} label="Name" />
    <Button
      text="Greet"
      onClick={(event, { store }) => {
        let name = store.get(m.name);
        MsgBox.alert(`Hello, ${name}!`);
      }}
    />
  </LabelsTopLayout>
);
```

For a complete project setup, use the CLI or one of the [application templates](https://cxjs.io/docs/intro/application-templates):

```bash
npx cx-cli create my-app
```

## Repository Structure

This is a monorepo managed with Yarn (v4) workspaces.

```
packages/
  cx/                     Core framework (widgets, charts, data binding, state management)
  cx-react/               React adapter
  cx-build-tools/         Rollup-based build tooling
  cx-theme-*/             Visual themes
  babel-plugin-*/         Babel plugins for CxJS JSX and import optimization
  swc-plugin-*/           SWC equivalents of the Babel plugins
  cx-cli, create-cx-app/  CLI tools for scaffolding projects
  cx-immer/               Immer integration for immutable store updates

homedocs/                 Documentation site (cxjs.io), built with Astro
litmus/                   Testing environment for bug reproduction and feature development
legacy/                   Previous-generation docs, gallery, and fiddle apps (being phased out)
```

## Development

```bash
yarn install              # Install dependencies
yarn build                # Build cx-react and cx
yarn build:themes         # Build all themes
yarn test                 # Run tests
```

### Running Apps

```bash
cd homedocs && yarn dev   # Documentation site
yarn litmus               # Litmus testing environment
```

## License

CxJS is available under [the MIT License](./LICENSE.md).

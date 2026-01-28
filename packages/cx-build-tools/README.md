# cx-build-tools

Build tools for creating CxJS themes and component packages.

## Installation

```bash
npm install cx-build-tools --save-dev
# or
yarn add cx-build-tools -D
```

## Available Tools

### getPathResolver

Creates a path resolver function for consistent path references.

```javascript
const getPathResolver = require("cx-build-tools/getPathResolver");

const resolvePath = getPathResolver(__dirname);
const srcPath = resolvePath("src");
const distPath = resolvePath("dist");
```

### buildJS

Bundles JavaScript/TypeScript output using Rollup.

```javascript
const buildJS = require("cx-build-tools/buildJS");

await buildJS(
   srcPath,      // Source directory
   distPath,     // Output directory
   entries,      // Entry configurations
   paths,        // Import path mappings (optional)
   externals     // External modules (optional)
);
```

### buildSCSS

Compiles SCSS files into CSS.

```javascript
const buildSCSS = require("cx-build-tools/buildSCSS");

await buildSCSS(
   ["src/variables.scss", "src/styles.scss"],  // Input files
   "dist/output.css"                            // Output file
);
```

Supports `~cx/` prefix for importing CxJS styles:
```scss
@import "~cx/widgets/Button";
```

## Building a Theme

### Project Structure

```
cx-theme-mytheme/
├── src/
│   ├── index.ts          # Theme overrides
│   └── variables.scss    # SCSS variables
├── build/                # TypeScript output
├── dist/                 # Final output
├── build.js
├── package.json
└── tsconfig.json
```

### package.json

```json
{
   "name": "cx-theme-mytheme",
   "version": "1.0.0",
   "main": "./build/index.js",
   "types": "./build/index.d.ts",
   "exports": {
      ".": {
         "types": "./build/index.d.ts",
         "default": "./build/index.js"
      },
      "./dist/": "./dist/"
   },
   "sideEffects": true,
   "scripts": {
      "compile": "tsc",
      "build": "node build"
   },
   "peerDependencies": {
      "cx": "*"
   },
   "devDependencies": {
      "cx-build-tools": "*",
      "typescript": "^5.0.0"
   }
}
```

### Recommended Scripts

- **`compile`** - Compiles TypeScript source to the `build/` folder
- **`build`** - Bundles JS and compiles SCSS to the `dist/` folder

Run in sequence:
```bash
yarn compile && yarn build
```

### build.js

```javascript
const getPathResolver = require("cx-build-tools/getPathResolver");
const buildJS = require("cx-build-tools/buildJS");
const buildSCSS = require("cx-build-tools/buildSCSS");
const fs = require("fs");

const theme = getPathResolver(__dirname);
const themeSrc = getPathResolver(theme("src"));
const themeBuild = getPathResolver(theme("build"));

// Ensure dist folder exists
if (!fs.existsSync(theme("dist"))) {
   fs.mkdirSync(theme("dist"));
}

async function build() {
   await Promise.all([
      buildJS(
         theme("src"),
         theme("dist"),
         [{
            name: "index",
            options: { input: [themeBuild("index.js")] },
            output: {}
         }],
         null,
         ["cx/ui", "cx/widgets"]
      ),
      buildSCSS(
         [themeSrc("variables.scss")],
         theme("dist/theme.css")
      )
   ]);
}

build().catch(console.error);
```

### src/index.ts

```typescript
import { Localization } from "cx/ui";

export function applyThemeOverrides() {
   Localization.override("cx/widgets/Dropdown", {
      arrow: false
   });
}

applyThemeOverrides();
```

## Building a Component Package

For packages with custom CxJS components:

```javascript
const getPathResolver = require("cx-build-tools/getPathResolver");
const buildJS = require("cx-build-tools/buildJS");

const pkg = getPathResolver(__dirname);
const pkgBuild = getPathResolver(pkg("build"));

async function build() {
   await buildJS(
      pkg("src"),
      pkg("dist"),
      [{
         name: "index",
         options: { input: [pkgBuild("index.js")] },
         output: {}
      }],
      null,
      ["cx/ui", "cx/widgets", "cx/util"]  // Mark cx imports as external
   );
}

build().catch(console.error);
```

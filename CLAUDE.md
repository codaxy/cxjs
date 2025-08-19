# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CxJS is a feature-rich JavaScript framework for building complex web front-ends, such as BI tools, dashboards and admin apps. This is a monorepo using yarn workspaces that contains the main cx package, documentation, gallery, testing environments, and various themes.

## Development Commands

### Build System
- `yarn build` or `npm run build` - Builds the main CxJS library using custom build tools
- `node packages/cx/build/index.js` - Direct build command for the cx package

### Testing
- `yarn test` or `npm test` - Runs tests using Mocha with custom configuration
- Tests are configured in `test/mocha.config.js`

### Development Servers
- `yarn start` or `npm start` - Runs documentation site development server
- `yarn docs` - Alternative command for documentation
- `yarn gallery` - Runs the gallery application showcasing widgets and themes
- `yarn litmus` - Runs the litmus testing environment for bug reproduction
- `yarn fiddle` - Runs the online code editor/playground

### TypeScript Examples
- `cd ts-minimal && yarn start` - Runs TypeScript minimal example development server
- `cd ts-minimal && yarn build` - Builds TypeScript minimal example for production

### Theme Building
- `npm run build:theme:core` - Builds core theme
- `npm run build:theme:dark` - Builds dark theme
- `npm run build:theme:frost` - Builds frost theme
- `npm run build:theme:material` - Builds material theme

## Architecture

### Monorepo Structure
The project uses yarn workspaces with these main areas:
- `packages/cx/` - Core framework source code
- `docs/` - Documentation site and content
- `gallery/` - Widget gallery and theme showcase
- `litmus/` - Bug reproduction and testing environment
- `fiddle/` - Online code editor
- `ts-minimal/` - TypeScript minimal example
- `themes/` - Various UI themes

### Core Package Structure (packages/cx/)
- `src/util/` - Utility functions and helpers
- `src/data/` - Data binding, stores, and state management
- `src/ui/` - Core UI framework and widgets
- `src/widgets/` - Form controls, grids, overlays
- `src/charts/` - Charting components
- `src/svg/` - SVG drawing utilities
- `src/hooks/` - React-like hooks for functional components

### Build System
- Custom build tools located in `cx-build-tools` package
- Uses Rollup for JavaScript bundling
- SCSS compilation for stylesheets
- Modular builds for different parts (util, data, ui, widgets, charts, svg, hooks)

## TypeScript Configuration

### JSX Configuration
- The project uses custom JSX configuration with `jsxImportSource: "cx"`
- For newer TypeScript projects, use `"jsx": "react-jsx"` and `"jsxImportSource": "cx"`
- For legacy projects, use `"jsxFactory": "cx"`

### Path Mapping
Configure TypeScript paths for development:
```json
{
  "paths": {
    "cx": ["../packages/cx/src"],
    "cx-react": ["../packages/cx-react"]
  }
}
```

## Key Framework Concepts

### Data Binding
- Uses two-way data binding with store-based state management
- Accessor chains for deep property access (e.g., `{bind: "user.profile.name"}`)
- Controllers for computed values and business logic

### Widget System
- All UI components inherit from Widget base class
- Supports both declarative configuration and functional components
- Rich set of form controls, grids, charts, and layout components

### Theming
- SCSS-based theming system with variables and mixins
- Multiple ready-to-use themes available as separate packages
- Theme packages follow pattern: `cx-theme-{name}`

## Testing Strategy

### Test Environments
- `litmus/` - Manual testing environment for bug reproduction and feature development
- Organized by bugs, features, and performance tests
- Examples in `litmus/bugs/`, `litmus/features/`, `litmus/performance/`

### Running Specific Tests
- Tests are located in various subdirectories
- Use Mocha test runner with Babel transpilation
- Configuration in `test/mocha.config.js`

## Development Workflow

### Adding New Features
1. Implement in appropriate `packages/cx/src/` subdirectory
2. Add TypeScript definitions (.d.ts files)
3. Create examples in `litmus/features/`
4. Add documentation in `docs/content/`
5. Update gallery examples if relevant

### Working with Themes
- Theme source files are in individual theme packages
- Use webpack configurations for building theme assets
- Test themes using gallery application

### Package Management
- Use yarn for consistency with workspace configuration
- Install dependencies at root level for shared packages
- Individual packages have their own package.json for specific dependencies
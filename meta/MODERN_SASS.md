# Modern Sass Migration Design Document

This document outlines the strategy for modernizing CxJS Sass files to use modern Sass features (`@use`, `@forward`) and eliminate deprecated `@import` statements.

## Table of Contents

1. [Current State](#current-state)
2. [Goals](#goals)
3. [Architecture Overview](#architecture-overview)
4. [Theme Override System](#theme-override-system)
5. [Migration Strategy](#migration-strategy)
6. [File Organization](#file-organization)
7. [Implementation Checklist](#implementation-checklist)
8. [Breaking Changes](#breaking-changes)

---

## Current State

### Progress Summary

The migration is approximately **60% complete**:

| Component | Status | Notes |
|-----------|--------|-------|
| Core framework (`packages/cx/src/`) | ✅ Complete | All files use `@use`/`@forward` |
| cx-theme-aquamarine | ✅ Complete | Fully modernized |
| cx-theme-dark | ❌ Pending | Uses `@import` |
| cx-theme-frost | ❌ Pending | Uses `@import` |
| cx-theme-material | ❌ Pending | Uses `@import` |
| cx-theme-material-dark | ❌ Pending | Uses `@import` |
| cx-theme-packed-dark | ❌ Pending | Uses `@import` (most complex) |
| cx-theme-space-blue | ❌ Pending | Uses `@import` |
| Gallery themes | ❌ Pending | Uses `@import` |
| Docs/litmus/fiddle | ❌ Pending | Uses `@import` |

### Files Changed (153 total)

The core framework has been fully migrated with consistent patterns established.

---

## Goals

1. **Eliminate all `@import` statements** - Replace with `@use` and `@forward`
2. **Use Sass modules** - `sass:math`, `sass:map`, `sass:color`, `sass:meta`
3. **Maintain theme override system** - Support three levels of customization
4. **Preserve backwards compatibility** - Themes should work without modification to their override patterns
5. **Improve maintainability** - Clear dependency graphs, explicit imports

---

## Architecture Overview

### Core Framework Structure

```
packages/cx/src/
├── index.scss              # Main entry - @use all modules
├── variables.scss          # @forward all variable files
├── maps.scss               # @forward all map files
├── util/
│   ├── index.scss          # Utility module aggregator
│   ├── variables.scss      # Forward utility variables
│   ├── maps.scss           # Forward utility maps
│   └── scss/
│       ├── variables.scss  # Core defaults ($cx-include-global-rules, etc.)
│       ├── defaults.scss   # Box model defaults
│       ├── besm.scss       # BEM-like naming convention
│       ├── deep-merge.scss # cx-deep-map-merge function
│       ├── add-rules.scss  # cx-add-rules mixin
│       ├── include.scss    # Widget inclusion system
│       ├── clockwise.scss  # Padding utilities (cx-top, cx-right, etc.)
│       └── ...
├── widgets/
│   ├── index.scss          # Widget styles aggregator
│   ├── variables.scss      # Forward widget variables
│   ├── maps.scss           # Forward widget maps
│   ├── box.scss            # Base box model variables
│   ├── Button.scss         # Button styles
│   ├── Button.variables.scss
│   ├── Button.maps.scss
│   ├── form/               # Form widgets
│   ├── grid/               # Grid components
│   ├── nav/                # Navigation components
│   └── overlay/            # Overlay/modal components
├── charts/
├── svg/
└── ui/
```

### File Naming Conventions

| Pattern | Purpose | Example |
|---------|---------|---------|
| `Widget.scss` | Component styles with mixin | `Button.scss` |
| `Widget.variables.scss` | Variable defaults with `!default` | `Button.variables.scss` |
| `Widget.maps.scss` | State style maps with `!default` | `Button.maps.scss` |
| `index.scss` | Directory aggregator | `widgets/index.scss` |
| `variables.scss` | Variable re-exporter | `widgets/variables.scss` |
| `maps.scss` | Map re-exporter | `widgets/maps.scss` |

### Import Pattern in Core Framework

Each component file uses explicit imports:

```scss
// Button.scss
@use "sass:math";
@use "sass:map";
@use "./Button.variables" as *;
@use "./Button.maps" as *;
@use "./box" as *;
@use "../util/scss/besm.scss" as *;
@use "../util/scss/add-rules.scss" as *;

@mixin cx-button(...) {
   // Implementation
}

@if (cx-should-include("cx/widgets/Button")) {
   @include cx-button;
}
```

---

## Theme Override System

CxJS themes can customize the framework at **three levels**:

### Level 1: Variable Defaults

Override variables using the `!default` flag mechanism. Variables defined before importing framework variables take precedence.

```scss
// Theme variables.scss
$cx-default-button-background-color: #1a1a1a !default;
$cx-default-border-radius: 8px !default;

// Then load framework variables
@use "cx/src/variables" as *;
```

### Level 2: State Style Maps

Modify component state maps using `cx-deep-map-merge()` for non-destructive merging.

```scss
// After loading framework
$cx-button-state-style-map: cx-deep-map-merge(
   $cx-button-state-style-map,
   (
      hover: (
         background-color: darken($cx-default-button-background-color, 5%),
      ),
      disabled: (
         opacity: 0.5,
      ),
   )
);
```

### Level 3: CSS Overrides

Direct CSS overrides for cases that can't be handled through variables or maps.

```scss
// Theme index.scss - after loading framework
.cxb-button {
   -webkit-tap-highlight-color: transparent;

   &.cxm-primary {
      text-transform: uppercase;
   }
}
```

### Theme Structure Pattern

```
packages/cx-theme-{name}/src/
├── index.scss          # Main entry point
├── variables.scss      # Variable overrides + map modifications
├── maps.scss           # Optional: complex map definitions
├── reset.scss          # Browser reset styles
├── widgets.scss        # CSS overrides
└── {Widget}.variables.scss  # Optional: widget-specific variable files
└── {Widget}.maps.scss       # Optional: widget-specific map overrides
```

---

## Three-Layer Theming with @forward...with()

A validated approach for enabling variable configuration through multiple layers using `@forward...with()`. This allows apps to override theme variables, and themes to override cx variables.

### Layer Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: APP                                               │
│  - Overrides theme variables via @forward...with()          │
│  - Overrides theme maps via cx-deep-map-merge()             │
│  - Adds app-specific CSS                                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: THEME                                             │
│  - Overrides cx variables via @forward...with()             │
│  - Overrides cx maps via cx-deep-map-merge()                │
│  - Adds theme-specific CSS                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: CX (base library)                                 │
│  - Defines all variables with !default                      │
│  - Defines all maps with !default                           │
│  - Generates CSS from variables and maps                    │
└─────────────────────────────────────────────────────────────┘
```

### Variable Override Chain

```
app/_variables.scss
    └── @forward "../theme/variables" with (app overrides)
            └── @forward "cx/src/variables" with (theme overrides)
                    └── @forward "widgets/variables"
                            └── defines defaults with !default
```

### Key Patterns

#### 1. Variable Files Only @forward

Variable files never `@use` other variable files - only `@forward`:

```scss
// widgets/_variables.scss
@forward "../util/defaults";
@forward "form/field-variables";
@forward "form/button-variables";
```

#### 2. Variable Files Can @use Utilities

Variables can depend on base utilities for derived values:

```scss
// form/_field-variables.scss
@use "../../util/defaults" as *;

$cx-default-input-border-radius: $cx-default-border-radius !default;
```

#### 3. Map Files @use Variables

Maps depend on variables, so they load them via `@use`:

```scss
// form/_field-maps.scss
@use "./field-variables" as *;

$cx-input-state-style-map: (
   default: (
      border-radius: $cx-default-input-border-radius,
   ),
) !default;
```

#### 4. Index Files @use Root Entry Points

Critical: index files load from root, not local files:

```scss
// form/_field-index.scss
@use "../../variables" as *;  // NOT ./field-variables
@use "../../maps" as *;       // NOT ./field-maps

.cxb-field { ... }
```

#### 5. Theme/App Forward Chain

Each layer forwards the previous with overrides:

```scss
// theme/_variables.scss
@forward "cx/src/variables" with (
   $cx-default-border-radius: 8px !default,
);

// app/_variables.scss
@forward "../theme/variables" with (
   $cx-default-border-radius: 0 !default,
);
```

#### 6. Map Overrides Use Deep Merge

Maps are overridden after forwarding:

```scss
// theme/_maps.scss
@forward "cx/src/maps";

@use "./variables" as *;
@use "cx/src/maps" as *;
@use "cx/src/util/scss/deep-merge" as *;

$cx-input-state-style-map: cx-deep-map-merge(
   $cx-input-state-style-map,
   (default: (box-shadow: 0 1px 3px rgba(0,0,0,0.1)))
);
```

#### 7. Aggregator Variables Must @forward Utilities

For variables to be available through the forward chain, aggregator files must `@forward` (not just `@use`) utility files:

```scss
// widgets/variables.scss
// Forward utility variables first (so they're available to consumers)
@forward "../util/scss/defaults.scss";
@forward "../util/scss/include.scss";

// Forward widget base variables
@forward "./box.scss";
@forward "Button.variables.scss";

// Use utilities locally for derived variable definitions
@use "sass:map";
@use "../util/scss/defaults.scss" as *;
@use "../util/scss/include.scss" as *;

// Define derived variables that depend on utilities
$cx-default-progressbar-color: $cx-default-color !default;
```

#### 8. Map Files Cannot Use Root Maps (Circular)

Map files that are `@forward`ed by `maps.scss` cannot `@use "../maps"` - this creates a circular dependency. Instead, they should use specific map files directly:

```scss
// form/Calendar.maps.scss - WRONG (circular)
@use "../variables" as *;
@use "../maps" as *;  // ❌ Creates loop - maps.scss forwards this file

// form/Calendar.maps.scss - CORRECT
@use "../variables" as *;
@use "./Field.maps.scss" as *;  // ✅ Use specific file
@use "../lists.scss" as *;      // ✅ Use specific file
```

#### 9. Component Files Use Root Entry Points

CSS-generating component files (not forwarded) should use root entry points:

```scss
// form/TextField.scss
@use "sass:math";
@use "sass:map";
@use "../variables" as *;  // Root entry point - gets configured values
@use "../maps" as *;       // Root entry point - gets configured values
@use "./Field.scss" as *;  // Local mixin file is OK
```

#### 10. System Variables in Forward Chain

Variables like `$cx-include-all` must be configured through the forward chain:

```scss
// theme/_variables.scss
@forward "cx/src/widgets/variables" with (
   $cx-include-all: true !default,  // ✅ Configure via forward
   $cx-default-button-background-color: red !default,
);

// theme/index.scss - WRONG
$cx-include-all: true;  // ❌ Creates "variable already defined" error
@use "./variables" as *;
```

### Why This Works

1. **@forward...with() configures on first load** - The app's forward runs first, configuring variables before anything else loads them.

2. **!default respects existing values** - Each layer uses `!default`, so earlier configurations take precedence.

3. **Linear dependency flow** - Variables → Maps → CSS generation. No circular dependencies.

4. **Root entry points** - Index files use root `_variables.scss` and `_maps.scss`, ensuring they receive configured values through the forward chain.

### Required CX Package Restructuring

To fully support this pattern, the cx package was restructured:

1. **Aggregator variables @forward utilities** - `widgets/variables.scss` now `@forward`s `defaults.scss` and `include.scss` so they're available to consumers

2. **Component files use root entry points** - Files like `Button.scss`, `TextField.scss` now use `../variables` and `../maps` instead of local `./Button.variables` files

3. **Map files use root variables** - Files like `Field.maps.scss` use `../variables` instead of local `./Field.variables.scss`

4. **Map files use specific maps (not root)** - Map files that inherit from other maps use specific files like `./Field.maps.scss` to avoid circular dependencies with `../maps`

### Files Modified in Restructuring

Key files updated to support `@forward...with()`:

**Aggregator:**
- `widgets/variables.scss` - Added `@forward` for utility files

**Component files (use `../variables` and `../maps`):**
- `widgets/Button.scss`
- `widgets/form/TextField.scss`, `NumberField.scss`, `LookupField.scss`
- `widgets/form/Calendar.scss`, `Checkbox.scss`, `Radio.scss`
- `widgets/form/ColorPicker.scss`, `ColorField.scss`, `Select.scss`
- `widgets/form/Slider.scss`, `Switch.scss`, `TextArea.scss`
- `widgets/form/Label.scss`, `DateTimePicker.scss`, `DateTimeField.scss`
- `widgets/form/MonthPicker.scss`, `MonthField.scss`, `Wheel.scss`
- `widgets/nav/Tab.scss`
- `widgets/overlay/Window.scss`

**Map files (use `../variables`):**
- `widgets/Button.maps.scss`
- `widgets/form/Field.maps.scss`, `LookupField.maps.scss`
- `widgets/form/Calendar.maps.scss`, `Checkbox.maps.scss`, `Radio.maps.scss`
- `widgets/form/ColorPicker.maps.scss`
- `widgets/nav/Tab.maps.scss`
- `widgets/overlay/Window.maps.scss`

---

## Migration Strategy

### For Theme Packages

The key challenge is that `@use` loads files only once and `!default` values are set at load time. This requires restructuring how themes define their variables.

#### Pattern A: Simple Themes (frost, dark)

For themes that only override variables and do simple map merges:

```scss
// variables.scss
@use "sass:map";

// 1. Define theme-specific base values
$cx-default-color: #373a3c !default;
$cx-default-border-radius: 5px !default;
// ... more variable overrides

// 2. Load utility functions needed for maps
@use "cx/src/util/scss/deep-merge.scss" as *;
@use "cx/src/util/scss/add-rules.scss" as *;

// 3. Load framework variables (will use our values due to !default)
@use "cx/src/variables" as *;

// 4. Load framework maps (now maps are available)
@use "cx/src/maps" as *;

// 5. Merge theme customizations into maps
$cx-button-state-style-map: cx-deep-map-merge(
   $cx-button-state-style-map,
   (...customizations...)
) !default;
```

```scss
// index.scss
@use "sass:map";
@use "./variables" as *;
@use "cx/src/index" as *;
@use "cx/src/util/scss/include.scss" as *;

// CSS overrides using BESM variables
$block: map.get($cx-besm, block);
$element: map.get($cx-besm, element);
$state: map.get($cx-besm, state);
$mod: map.get($cx-besm, mod);

@if (cx-included("cx/widgets/Button")) {
   .#{$block}button {
      // CSS overrides
   }
}
```

#### Pattern B: Complex Themes (packed-dark, material)

For themes with extensive customizations split across multiple files:

```scss
// variables.scss
@use "sass:map";

// Theme-specific variables
$cx-default-background-color: rgb(44, 44, 44) !default;
// ...

// Load component-specific variable files
@use "./Button.variables" as *;
@use "./Tab.variables" as *;
@use "./Window.variables" as *;

// Load framework utilities
@use "cx/src/util/scss/deep-merge.scss" as *;
@use "cx/src/util/scss/add-rules.scss" as *;

// Load framework variables
@use "cx/src/variables" as *;

// Load framework maps
@use "cx/src/maps" as *;

// Load component-specific map overrides
@use "./Button.maps" as button-maps;
@use "./Tab.maps" as tab-maps;

// Re-export modified maps
$cx-button-state-style-map: button-maps.$cx-button-state-style-map;
```

### For Gallery/Docs

Gallery `.useable.scss` files need updating:

```scss
// gallery/themes/dark.useable.scss
$cx-include-global-rules: true;

@use "cx-theme-dark/src/variables" as *;
@use "./util/divide.scss" as *;
@use "cx-theme-dark/src/index" as *;
@use "./util/customize-master" as *;

@include customize-master(
   $brand-background: #2281b1,
   // ...
);
```

---

## File Organization

### Variables Flow

```
                    ┌─────────────────────────────┐
                    │  Theme variables.scss       │
                    │  (defines overrides first)  │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  cx/src/util/variables      │
                    │  (core defaults)            │
                    └──────────────┬──────────────┘
                                   │
    ┌──────────────┬───────────────┼───────────────┬──────────────┐
    │              │               │               │              │
    ▼              ▼               ▼               ▼              ▼
┌────────┐   ┌─────────┐   ┌─────────────┐   ┌────────┐   ┌───────┐
│widgets/│   │  form/  │   │    nav/     │   │charts/ │   │  svg/ │
│variables│  │variables│   │  variables  │   │variables│  │variables│
└────────┘   └─────────┘   └─────────────┘   └────────┘   └───────┘
```

### Maps Flow

```
                    ┌─────────────────────────────┐
                    │  cx/src/maps.scss           │
                    │  (@forward all map files)   │
                    └──────────────┬──────────────┘
                                   │
    ┌──────────────┬───────────────┼───────────────┬──────────────┐
    │              │               │               │              │
    ▼              ▼               ▼               ▼              ▼
┌────────┐   ┌─────────┐   ┌─────────────┐   ┌────────┐   ┌───────┐
│widgets/│   │  form/  │   │    nav/     │   │charts/ │   │  svg/ │
│  maps  │   │  maps   │   │    maps     │   │  maps  │   │ maps  │
└────────┘   └─────────┘   └─────────────┘   └────────┘   └───────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  Theme maps.scss            │
                    │  (cx-deep-map-merge)        │
                    └─────────────────────────────┘
```

### Dependency Graph for a Widget

```
                         ┌──────────────────┐
                         │  Button.scss     │
                         └────────┬─────────┘
                                  │
           ┌──────────────────────┼──────────────────────┐
           │                      │                      │
           ▼                      ▼                      ▼
┌───────────────────┐  ┌──────────────────┐  ┌───────────────────┐
│Button.variables   │  │  Button.maps     │  │   box.scss        │
└─────────┬─────────┘  └────────┬─────────┘  └─────────┬─────────┘
          │                     │                      │
          ▼                     ▼                      │
┌───────────────────┐  ┌──────────────────┐            │
│ util/defaults     │  │Button.variables  │            │
└───────────────────┘  └──────────────────┘            │
                                                       ▼
                                            ┌───────────────────┐
                                            │  util/defaults    │
                                            └───────────────────┘
```

---

## Implementation Checklist

### Phase 1: Core Framework Syntax Conversion (✅ Complete)

- [x] Convert all `@import` to `@use`/`@forward` in `packages/cx/src/`
- [x] Update math operations to use `sass:math` module
- [x] Establish consistent import patterns
- [x] Update all widget files
- [x] Update all chart files
- [x] Update all utility files

### Phase 2: Build Verification (In Progress)

The build must be verified incrementally, starting with the simplest project and progressing to more complex ones.

#### Step 1: ts-minimal (No Theme) ✅
- [x] Fix compilation errors in core framework
- [x] Verify `cd ts-minimal && yarn build` succeeds
- [x] Verify `cd ts-minimal && yarn start` runs correctly
- [x] Test basic widget rendering (dev server starts, compiles successfully)

#### Step 2: homedocs ✅
- [x] Fix any homedocs-specific SCSS issues
- [x] Verify homedocs builds successfully
- [x] Verify homedocs runs correctly
- Note: `@import` is kept in `global.scss` for styles inside `@layer` blocks (Sass limitation)

#### Step 3: docs (uses cx-theme-aquamarine)
- [ ] Verify cx-theme-aquamarine compiles correctly
- [ ] Fix `docs/index.scss` and related files
- [ ] Verify `yarn docs` runs correctly
- [ ] Test all documentation pages render properly

#### Step 4: gallery (all themes)
- [ ] Verify gallery base builds
- [ ] Fix gallery theme files (`gallery/themes/*.useable.scss`)
- [ ] Test each theme individually:
  - [ ] core theme
  - [ ] aquamarine theme
  - [ ] dark theme
  - [ ] frost theme
  - [ ] material theme
  - [ ] material-dark theme
  - [ ] packed-dark theme
  - [ ] space-blue theme

### Phase 3: Theme Package Conversion

Theme packages will be converted as needed during Phase 2 (gallery step).

- [x] cx-theme-aquamarine
- [ ] cx-theme-dark
  - [ ] Convert `index.scss`
  - [ ] Convert `variables.scss`
  - [ ] Convert `widgets.scss`
- [ ] cx-theme-frost
  - [ ] Convert `index.scss`
  - [ ] Convert `variables.scss`
- [ ] cx-theme-material
  - [ ] Convert `index.scss`
  - [ ] Convert `variables.scss`
  - [ ] Convert `widgets.scss`
- [ ] cx-theme-material-dark
  - [ ] Convert `index.scss`
  - [ ] Convert `variables.scss`
  - [ ] Convert `widgets.scss`
- [ ] cx-theme-packed-dark (most complex)
  - [ ] Convert `index.scss`
  - [ ] Convert `variables.scss`
  - [ ] Convert `widgets.scss`
  - [ ] Convert all `*.variables.scss` files
  - [ ] Convert all `*.maps.scss` files
- [ ] cx-theme-space-blue
  - [ ] Convert `index.scss`
  - [ ] Convert `variables.scss`
  - [ ] Convert `widgets.scss`

### Phase 4: Cleanup

- [ ] Remove deprecated color functions (`darken()`, `lighten()`, `transparentize()`)
  - Replace with `color.adjust()`, `color.scale()`, `color.change()`
- [ ] Verify all division operations use `math.div()`
- [ ] Remove any remaining global variable usage
- [ ] Update documentation

---

## Breaking Changes

### For Theme Developers

1. **Import order matters more** - Variables must be defined before using `@use "cx/src/variables"`
2. **No more implicit globals** - All dependencies must be explicitly imported
3. **Module namespacing** - When not using `as *`, members must be accessed with namespace

### Migration Notes for External Themes

If you maintain a custom CxJS theme, update your import pattern:

**Before (deprecated):**
```scss
// Old pattern
$cx-default-button-background-color: #333;
@import "~cx/src/variables";
@import "~cx/src/index";
```

**After (modern):**
```scss
// New pattern
@use "sass:map";

// Define overrides first
$cx-default-button-background-color: #333 !default;

// Load utilities
@use "cx/src/util/scss/deep-merge" as *;

// Load framework (will use your values)
@use "cx/src/variables" as *;
@use "cx/src/maps" as *;

// Then merge any map customizations
$cx-button-state-style-map: cx-deep-map-merge(
   $cx-button-state-style-map,
   (...)
);
```

```scss
// index.scss
@use "./variables" as *;
@use "cx/src/index" as *;
```

---

## Technical Notes

### Why `as *` is Used

While explicit namespacing is generally preferred, CxJS uses `as *` extensively because:

1. **Variable chaining** - Many variables reference others (e.g., `$cx-default-button-color: $cx-default-color`)
2. **Map operations** - Maps reference variables that must be in scope
3. **Backwards compatibility** - Existing themes expect global-like access

### Avoiding Forward/Use Conflicts

When a file needs to both `@forward` a module (to make it available to consumers) AND `@use` it locally, using `as *` causes a variable collision error:

```scss
// WRONG - causes "both define a variable" error
@forward "../util/scss/include.scss";
@use "../util/scss/include.scss" as *;  // ❌ Conflict!
```

The solution is to use a **namespace** for the local `@use`:

```scss
// CORRECT - no conflict
@forward "../util/scss/include.scss";
@use "../util/scss/include.scss" as include;  // ✅ Namespace avoids conflict

// Access variables with the namespace
$cx-dependencies: map.merge(
   include.$cx-dependencies,
   (...)
);
```

This pattern is used in `widgets/variables.scss` where `include.scss` needs to be:
1. Forwarded so consumers can access `$cx-dependencies`, `$cx-include-all`, etc.
2. Used locally to read and extend `$cx-dependencies`

### The `!default` Mechanism

The `!default` flag is crucial for the override system:

```scss
// In theme (loaded first)
$cx-default-border-radius: 8px !default;  // Sets to 8px

// In framework (loaded second)
$cx-default-border-radius: 4px !default;  // Keeps 8px (already set)
```

### Deep Map Merge

`cx-deep-map-merge()` is essential for theme customization:

```scss
@function cx-deep-map-merge($parent-map, $child-map) {
   $result: $parent-map;
   @each $key, $value in $child-map {
      @if (not map.has-key($result, $key)) or
          (meta.type-of(map.get($result, $key)) != meta.type-of($value)) or
          (not (meta.type-of(map.get($result, $key)) == map and meta.type-of($value) == map)) {
         $result: map.merge($result, ($key: $value));
      } @else {
         $result: map.merge($result, ($key: cx-deep-map-merge(map.get($result, $key), $value)));
      }
   }
   @return $result;
}
```

This allows nested map properties to be updated without losing other properties:

```scss
// Original map
$cx-button-state-style-map: (
   default: (background-color: #eee, color: #333),
   hover: (background-color: #ddd)
);

// Theme merge (only changes hover background)
$cx-button-state-style-map: cx-deep-map-merge(
   $cx-button-state-style-map,
   (hover: (background-color: #ccc))
);

// Result: hover still has all original properties, just background changed
```

---

## Testing Strategy

After each theme migration:

1. Build the theme: `npm run build:theme:{name}`
2. Run gallery with theme: `yarn gallery` and switch to theme
3. Verify all widgets render correctly
4. Check console for Sass deprecation warnings
5. Compare visual output to pre-migration version

---

## References

- [Sass @use Documentation](https://sass-lang.com/documentation/at-rules/use)
- [Sass @forward Documentation](https://sass-lang.com/documentation/at-rules/forward)
- [Migrating from @import](https://sass-lang.com/documentation/at-rules/import)
- [Sass Modules](https://sass-lang.com/documentation/modules)

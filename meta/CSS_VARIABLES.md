# CxJS CSS Variables Design Document

This document defines the naming conventions and structure for CSS custom properties in CxJS theming.

## Implementation

The CSS variables theming system is implemented in the `cx-theme-variables` package (`packages/cx-theme-variables/`). This package provides a base theme that can be customized at runtime by overriding CSS variables.

## CSS Custom Properties Limitation

**Important:** CSS custom properties have a fundamental limitation that affects sub-theming. When you define a derived variable on `:root` that references another variable:

```scss
:root {
   --cx-theme-primary-color: blue;
   --cx-primary-button-hover-background-color: color-mix(in srgb, var(--cx-theme-primary-color), white 20%);
}
```

And then override the base variable in a container:

```scss
.my-container {
   --cx-theme-primary-color: red;
}
```

The derived variable (`--cx-primary-button-hover-background-color`) **does NOT recalculate** inside `.my-container`. It still uses the `:root` computed value.

**Consequence:** We cannot use intermediate component-level CSS variables for derived values. Instead, `color-mix()` calculations must be placed directly in the SCSS map overrides so they reference theme variables directly and recalculate properly in sub-themed containers.

## Layers

| Layer | Prefix | Purpose |
|-------|--------|---------|
| Theme | `--cx-theme-*` | High-level design tokens (colors, sizing, effects) |
| Theme Defaults | `--cx-theme-default-*` | Base values for components (optional, for simple references) |

**Note:** Component-level variables (`--cx-{component}-*`) are intentionally avoided for derived values due to the limitation above. Use `color-mix()` directly in SCSS maps instead.

## Layer 1: Theme (`--cx-theme-*`)

Minimal set of design tokens that define the theme's identity.

```scss
:root {
   // Primary colors
   --cx-theme-primary-color: #1976d2;

   // Status colors
   --cx-theme-accent-color: #ffc107;
   --cx-theme-danger-color: #d32f2f;

   // Text colors
   --cx-theme-color: rgba(0, 0, 0, 0.87);

   // Surface colors
   --cx-theme-background-color: white;
   --cx-theme-surface-color: white;

   // Border
   --cx-theme-border-color: lightgray;

   // Active state colors (black for light themes, white for dark themes)
   --cx-theme-active-state-color: black;
   --cx-theme-active-state-hover-amount: 8%;
   --cx-theme-active-state-pressed-amount: 12%;

   // Effects
   --cx-theme-box-shadow: ...;
   --cx-theme-focus-box-shadow: ...;
   --cx-theme-transition: all 0.2s ease;

   // Sizing
   --cx-theme-border-radius: 4px;
   --cx-theme-box-padding: 5px;
   --cx-theme-box-line-height: 24px;
}
```

## Layer 2: Theme Defaults (`--cx-theme-default-*`)

Simple default values for components. Only use for direct references, not for values that will be used in further calculations.

```scss
:root {
   --cx-theme-default-button-background-color: color-mix(in srgb, var(--cx-theme-surface-color), var(--cx-theme-active-state-color) 4%);
   --cx-theme-default-button-border-color: var(--cx-theme-border-color);
}
```

## Using color-mix() in SCSS Maps

Since we cannot use intermediate CSS variables for derived values, place `color-mix()` calculations directly in the SCSS map overrides:

```scss
$cx-button-state-style-map: cx-deep-map-merge(
   $cx-button-state-style-map,
   (
      default: (
         background-color: var(--cx-theme-default-button-background-color),
         border-color: var(--cx-theme-default-button-border-color),
      ),
      hover: (
         // Calculate directly - references theme variable, will recalculate in sub-themed containers
         background-color: color-mix(in srgb, var(--cx-theme-default-button-background-color), var(--cx-theme-active-state-color) var(--cx-theme-active-state-hover-amount)),
      ),
      active: (
         background-color: color-mix(in srgb, var(--cx-theme-default-button-background-color), var(--cx-theme-active-state-color) var(--cx-theme-active-state-pressed-amount)),
      ),
   )
);

$cx-button-mods: cx-deep-map-merge(
   $cx-button-mods,
   (
      primary: (
         default: (
            background-color: var(--cx-theme-primary-color),
            color: var(--cx-theme-background-color),
            border-color: color-mix(in srgb, var(--cx-theme-primary-color), var(--cx-theme-active-state-color) 20%),
         ),
         hover: (
            background-color: color-mix(in srgb, var(--cx-theme-primary-color), var(--cx-theme-background-color) 20%),
         ),
         active: (
            background-color: color-mix(in srgb, var(--cx-theme-primary-color), var(--cx-theme-active-state-color) 20%),
         ),
      ),
   )
);
```

## File Structure

```
packages/cx-theme-variables/src/
├── index.scss              # Main entry
├── variables.scss          # Theme variables, @forward cx
├── maps.scss               # @use component files, map overrides
├── widgets/
│   ├── Button.scss         # Button map overrides with color-mix()
│   ├── form/
│   │   └── ...
│   ├── grid/
│   │   └── ...
│   └── ...
```

## Sub-theming

Override theme variables in containers. Because `color-mix()` is in the SCSS maps (not intermediate CSS variables), derived colors recalculate correctly.

**Toolbar with primary-colored buttons:**
```scss
.toolbar {
   --cx-theme-default-button-background-color: var(--cx-theme-primary-color);
   --cx-theme-default-button-border-color: transparent;
}
```

**Dark mode:**
```scss
.dark-mode {
   --cx-theme-primary-color: #90caf9;
   --cx-theme-surface-color: #1e1e1e;
   --cx-theme-background-color: #121212;
   --cx-theme-color: rgba(255, 255, 255, 0.87);
   --cx-theme-border-color: #424242;
   --cx-theme-active-state-color: white;  // Lighten on hover instead of darken
}
```

## SCSS Variable Overrides

Set SCSS `$cx-default-*` variables to `null` in the `@forward` block when they are controlled via CSS variables and maps:

```scss
@forward "cx/src/variables" with (
   $cx-default-button-background-color: null !default,
   $cx-default-button-border-color: null !default,
   ...
);
```

## Guidelines

1. **Minimize variables** - Only expose theme-level design tokens
2. **No intermediate derived variables** - Use `color-mix()` directly in SCSS maps
3. **Use active-state-color** - Avoid hardcoding `black` or `white` for state changes
4. **Reference theme variables** - Always reference `--cx-theme-*` variables so sub-theming works
5. **Test sub-theming** - Verify that overriding theme variables in containers produces expected results

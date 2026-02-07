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
   --cx-theme-text-color: rgba(0, 0, 0, 0.87);

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
   --cx-box-padding: 5px;
   --cx-box-line-height: 24px;
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
├── index.scss              # Main entry, component-specific CSS overrides
├── variables.scss          # Theme variables, @forward cx/src/variables
├── maps.scss               # @use component files, map overrides for lists, sections, menus, windows, toasts, calendar wheel, globals
├── functions.scss           # Theme functions
├── widgets/
│   ├── Button.scss         # Button state map + mods (primary, danger, hollow)
│   ├── form/
│   │   ├── Field.scss      # Input, checkbox, radio, textarea, slider, switch, clear icon state maps
│   │   └── Calendar.scss   # Calendar + calendar day state maps
│   ├── grid/
│   │   ├── Grid.scss       # Grid header, data row, cell cursor state maps
│   │   └── Pagination.scss # Pagination state map (button-like styling)
│   └── nav/
│       └── Tab.scss        # Tab state maps
├── presets/
│   ├── default.ts          # Base light theme preset
│   ├── darkBlue.ts         # Dark blue preset (extends default)
│   ├── darkGray.ts         # Dark gray preset (extends default)
│   └── ocean.ts            # Ocean preset (extends default)
├── tweaks/                 # Rounding, density, font tweaks
├── ThemeVariables.ts       # TypeScript interface + variableMap + CSS generation utilities
└── ThemeVarsDiv.tsx        # React component for applying theme variables
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
   --cx-theme-text-color: rgba(255, 255, 255, 0.87);
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

## Completed

### Dark Theme Fix
All hardcoded `rgba(0, 0, 0, ...)` values replaced with `color-mix()` using
`var(--cx-button-active-state-mix-color)` which is `black` for light themes and `white`
for dark themes. Applies to list items, grid rows, and calendar days.

### Color Variables
- `--cx-theme-primary-text-color` / `--cx-theme-primary-border-color` - Primary button text/border
- `--cx-theme-accent-color` / `--cx-theme-accent-text-color` - Accent color for selections
- `--cx-theme-danger-text-color` / `--cx-theme-danger-border-color` - Danger button text/border

### List Item States
Reworked to use accent color for selection and inset box-shadow for cursor:
- Hover: `color-mix()` with active state color at 4%
- Cursor: inset 1px box-shadow with primary color
- Selected: accent color background with accent text color
- Selected-cursor: accent background + inset primary ring

### Grid Variables
- `--cx-grid-background` - Grid background (applied only to bordered grids)
- `--cx-grid-border-radius` - Grid border radius (separate from theme radius)
- `--cx-grid-font-size` / `--cx-grid-header-font-size` - Font sizes
- `--cx-grid-header-padding-x` / `--cx-grid-header-padding-y` - Header cell padding
- `--cx-grid-data-padding-x` / `--cx-grid-data-padding-y` - Data cell padding
- `--cx-grid-header-background-color` / `--cx-grid-header-font-weight` - Header styling
- `--cx-grid-data-background-color` / `--cx-grid-data-border-color` - Data row styling
- Grid data rows: same selection pattern as list items (accent + primary ring)
- Grid cell cursor: inset 2px primary color box-shadow (no green)
- Grid headers: reduced `--cx-input-padding-x/y` by 1px for snug fit
- Grid data checkboxes: reduced `--cx-input-padding-x/y` by 1px
- Last data row: `border-bottom-left-radius` matches grid border radius
- `$cx-default-grid-scroll-wrapper-padding-top`: core SCSS variable (default 0), overridden to 1px

### Pagination
Styled as buttons instead of list items:
- Default: hollow button (transparent background, visible border)
- Hover: fills with button background
- Selected: primary button styling
- Uses `--cx-button-padding-x/y` and `--cx-button-border-radius`

### Calendar Variables
- `--cx-calendar-background-color` - Calendar background
- `--cx-calendar-padding` - Calendar padding (defaults to input padding Y)
- `--cx-calendar-header-font-weight` - Header font weight
- `--cx-calendar-header-background-color` - Header background
- `--cx-calendar-day-padding-x` / `--cx-calendar-day-padding-y` - Day cell padding
- `--cx-calendar-day-line-height` - Day cell line height
- `--cx-calendar-day-font-size` - Day font size
- Calendar width moved from hardcoded `18em` to state map (overridable)
- No box shadow on calendar component
- Day selection: primary color background with primary text color
- Day hover: inset 1px primary ring

### Button Variables
Full set of button variables exposed:
- `--cx-button-background-color` / `--cx-button-border-color` / `--cx-button-border-width`
- `--cx-button-font-size` / `--cx-button-font-weight` / `--cx-button-line-height`
- `--cx-button-padding-x` / `--cx-button-padding-y` / `--cx-button-border-radius`
- `--cx-button-box-shadow` / `--cx-button-hover-box-shadow`
- `--cx-button-hover-state-mix-color` / `--cx-button-hover-state-mix-amount`
- `--cx-button-active-state-mix-color` / `--cx-button-active-state-mix-amount`
- Button mods: primary, danger, hollow with `color-mix()` for hover/active states

### Input Variables
- `--cx-input-width` / `--cx-input-color` / `--cx-input-background-color`
- `--cx-input-border-color` / `--cx-input-font-size` / `--cx-input-line-height`
- `--cx-input-padding-x` / `--cx-input-padding-y`
- `--cx-checkbox-size` / `--cx-switch-*` variables

### Icons
Lucide icons registered for: `forward` (ChevronsRight), `drop-down` (ChevronDown)

## TODO: Remaining

Features not yet covered by `ThemeVariables`. The homedocs theme works around these via
direct CSS overrides in `homedocs/src/styles/theme/index.scss`.

1. **Popover/dropdown background** - No `popoverBackgroundColor` variable
2. **Dropdown box shadow** - No `dropdownBoxShadow` variable
3. **Label/placeholder color** - No `labelColor` or `placeholderColor` variables
4. **Tooltip styling** - No tooltip background, color, or border-radius variables
5. **Slider track/range/handle colors** - No runtime CSS variables for slider
6. **Progress bar indicator color** - No `progressBarColor` variable
7. **Input tag background** (LookupField) - No `inputTagBackgroundColor`
8. **Toast mod colors** - No variables for toast variants
9. **Section header font weight** - No variable
10. **Window body/footer padding** - Basic window variables exist but not comprehensive

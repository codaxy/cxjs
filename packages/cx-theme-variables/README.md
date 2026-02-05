# cx-theme-variables

A CSS Variables-based theme for CxJS applications with fully customizable colors at runtime.

## Features

- All colors and visual properties defined as CSS custom properties
- Default neutral color scheme (black, white, lightgray)
- Easy runtime customization without rebuilding
- Compatible with dark mode and theme switching
- Automatic text contrast calculation using `oklch`

## Installation

```bash
npm install cx-theme-variables
```

or

```bash
yarn add cx-theme-variables
```

## Usage

### Import the theme in your application

```javascript
import "cx-theme-variables";
```

### Import the CSS files

```scss
@import "cx-theme-variables/dist/reset.css";
@import "cx-theme-variables/dist/widgets.css";
@import "cx-theme-variables/dist/charts.css";
@import "cx-theme-variables/dist/svg.css";
```

Or import in JavaScript:

```javascript
import "cx-theme-variables/dist/reset.css";
import "cx-theme-variables/dist/widgets.css";
import "cx-theme-variables/dist/charts.css";
import "cx-theme-variables/dist/svg.css";
```

## Customization

### CSS Variables

You can customize the theme by overriding CSS variables on `:root` or any container element:

```css
:root {
   /* Primary colors */
   --cx-theme-primary-color: #1976d2;

   /* Accent and danger colors */
   --cx-theme-accent-color: #ffc107;
   --cx-theme-danger-color: #d32f2f;

   /* Text colors */
   --cx-theme-text-color: rgba(0, 0, 0, 0.87);

   /* Background colors */
   --cx-theme-background-color: white;
   --cx-theme-surface-color: white;

   /* Border colors */
   --cx-theme-border-color: lightgray;

   /* Active state overlay (use black for light themes, white for dark themes) */
   --cx-theme-active-state-color: black;
   --cx-theme-active-state-hover-amount: 8%;
   --cx-theme-active-state-pressed-amount: 12%;

   /* Shadows */
   --cx-theme-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
   --cx-theme-box-shadow-elevated: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
   --cx-theme-focus-box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.3);

   /* Sizing */
   --cx-theme-border-radius: 4px;
   --cx-theme-base-font-size: 14px;
   --cx-input-padding-x: 8px;
   --cx-input-padding-y: 5px;
   --cx-box-line-height: 24px;
   --cx-theme-icon-size: 16px;

   /* Component-specific */
   --cx-input-background-color: white;
   --cx-input-border-color: lightgray;
   --cx-grid-header-background-color: #fafafa;
   --cx-grid-header-border-color: lightgray;
   --cx-grid-data-background-color: white;
   --cx-grid-data-border-color: #e0e0e0;
   --cx-calendar-background-color: white;

   /* Transitions */
   --cx-theme-transition: all 0.2s ease;
}
```

### Dark Mode Example

```css
@media (prefers-color-scheme: dark) {
   :root {
      --cx-theme-primary-color: #90caf9;
      --cx-theme-text-color: rgba(255, 255, 255, 0.87);
      --cx-theme-background-color: #121212;
      --cx-theme-surface-color: #1e1e1e;
      --cx-theme-border-color: #424242;
      --cx-theme-active-state-color: white; /* Lighten on hover instead of darken */
      --cx-input-background-color: #2c2c2c;
      --cx-input-border-color: #424242;
      --cx-grid-header-background-color: #2c2c2c;
      --cx-grid-header-border-color: #424242;
      --cx-grid-data-background-color: #1e1e1e;
      --cx-grid-data-border-color: #303030;
      --cx-calendar-background-color: #1e1e1e;
   }
}
```

### Runtime Theme Switching

```javascript
function setThemeColor(color) {
   document.documentElement.style.setProperty('--cx-theme-primary-color', color);
}

// Example: Switch to blue theme
setThemeColor('#1976d2');
```

## Available CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--cx-theme-primary-color` | `black` | Primary brand color |
| `--cx-theme-accent-color` | `lightgray` | Accent color for highlights |
| `--cx-theme-danger-color` | `#d32f2f` | Error/danger color |
| `--cx-theme-text-color` | `rgba(0,0,0,0.87)` | Default text color |
| `--cx-theme-background-color` | `white` | Page background |
| `--cx-theme-surface-color` | `white` | Card/surface background |
| `--cx-theme-border-color` | `lightgray` | Default border color |
| `--cx-theme-active-state-color` | `black` | Overlay color for hover/pressed states |
| `--cx-theme-active-state-hover-amount` | `8%` | Hover overlay opacity |
| `--cx-theme-active-state-pressed-amount` | `12%` | Pressed overlay opacity |
| `--cx-theme-border-radius` | `4px` | Default border radius |
| `--cx-theme-box-shadow` | Material shadow | Standard elevation shadow |
| `--cx-theme-box-shadow-elevated` | Material shadow | Higher elevation shadow |
| `--cx-theme-focus-box-shadow` | Focus ring | Focus indicator shadow |
| `--cx-theme-transition` | `all 0.2s ease` | Default transition |

## License

See LICENSE.md

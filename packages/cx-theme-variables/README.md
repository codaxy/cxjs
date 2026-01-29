# cx-theme-variables

A CSS Variables-based theme for CxJS applications with fully customizable colors at runtime.

## Features

- All colors and visual properties defined as CSS custom properties
- Default neutral color scheme (black, white, lightgray)
- Easy runtime customization without rebuilding
- Compatible with dark mode and theme switching

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
   --cx-theme-primary-color-light: #42a5f5;
   --cx-theme-primary-color-dark: #1565c0;
   --cx-theme-primary-text-color: #1976d2;

   /* Accent and danger colors */
   --cx-theme-accent-color: #ffc107;
   --cx-theme-danger-color: #d32f2f;
   --cx-theme-danger-color-dark: #b71c1c;

   /* Text colors */
   --cx-theme-color: rgba(0, 0, 0, 0.87);
   --cx-theme-color-light: rgba(0, 0, 0, 0.6);
   --cx-theme-secondary-text-color: #757575;

   /* Background colors */
   --cx-theme-background-color: white;
   --cx-theme-surface-color: white;

   /* Border colors */
   --cx-theme-border-color: #e0e0e0;
   --cx-theme-border-color-light: #eeeeee;

   /* Shadows */
   --cx-theme-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
   --cx-theme-box-shadow-elevated: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
   --cx-theme-focus-box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.3);

   /* Sizing */
   --cx-theme-border-radius: 4px;

   /* Component-specific */
   --cx-theme-button-background-color: #f5f5f5;
   --cx-theme-button-border-color: #e0e0e0;
   --cx-theme-input-background-color: white;
   --cx-theme-input-border-color: #e0e0e0;
   --cx-theme-grid-header-background-color: #fafafa;
   --cx-theme-grid-header-border-color: #e0e0e0;
   --cx-theme-grid-data-background-color: white;
   --cx-theme-grid-data-border-color: #eeeeee;
   --cx-theme-calendar-background-color: white;

   /* Transitions */
   --cx-theme-transition: all 0.2s ease;
}
```

### Dark Mode Example

```css
@media (prefers-color-scheme: dark) {
   :root {
      --cx-theme-primary-color: #90caf9;
      --cx-theme-primary-color-light: #e3f2fd;
      --cx-theme-primary-color-dark: #42a5f5;
      --cx-theme-primary-text-color: #90caf9;

      --cx-theme-color: rgba(255, 255, 255, 0.87);
      --cx-theme-color-light: rgba(255, 255, 255, 0.6);
      --cx-theme-secondary-text-color: #b0b0b0;

      --cx-theme-background-color: #121212;
      --cx-theme-surface-color: #1e1e1e;

      --cx-theme-border-color: #424242;
      --cx-theme-border-color-light: #303030;

      --cx-theme-button-background-color: #333333;
      --cx-theme-button-border-color: #424242;
      --cx-theme-input-background-color: #2c2c2c;
      --cx-theme-input-border-color: #424242;
      --cx-theme-grid-header-background-color: #2c2c2c;
      --cx-theme-grid-header-border-color: #424242;
      --cx-theme-grid-data-background-color: #1e1e1e;
      --cx-theme-grid-data-border-color: #303030;
      --cx-theme-calendar-background-color: #1e1e1e;
   }
}
```

### Runtime Theme Switching

```javascript
function setThemeColor(color) {
   document.documentElement.style.setProperty('--cx-theme-primary-color', color);
   document.documentElement.style.setProperty('--cx-theme-primary-text-color', color);
}

// Example: Switch to blue theme
setThemeColor('#1976d2');
```

## Available CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--cx-theme-primary-color` | `black` | Primary brand color |
| `--cx-theme-primary-color-light` | `#333` | Lighter variant of primary |
| `--cx-theme-primary-color-dark` | `#000` | Darker variant of primary |
| `--cx-theme-primary-text-color` | `black` | Primary text/link color |
| `--cx-theme-accent-color` | `lightgray` | Accent color for highlights |
| `--cx-theme-danger-color` | `#d32f2f` | Error/danger color |
| `--cx-theme-color` | `rgba(0,0,0,0.87)` | Default text color |
| `--cx-theme-background-color` | `white` | Page background |
| `--cx-theme-surface-color` | `white` | Card/surface background |
| `--cx-theme-border-color` | `lightgray` | Default border color |
| `--cx-theme-border-radius` | `4px` | Default border radius |
| `--cx-theme-box-shadow` | Material shadow | Standard elevation shadow |
| `--cx-theme-box-shadow-elevated` | Material shadow | Higher elevation shadow |
| `--cx-theme-focus-box-shadow` | Focus ring | Focus indicator shadow |
| `--cx-theme-transition` | `all 0.2s ease` | Default transition |

## License

See LICENSE.md

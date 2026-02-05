/**
 * Theme variables that can be customized at runtime via CSS custom properties.
 */
export interface ThemeVariables {
   // Primary colors
   primaryColor: string;
   accentColor: string;
   dangerColor: string;

   // Text colors
   textColor: string;

   // Background colors
   backgroundColor: string;
   surfaceColor: string;

   // Border colors
   borderColor: string;

   // Active state overlay colors (use black for light themes, white for dark themes)
   activeStateColor: string;
   activeStateHoverAmount: string;
   activeStatePressedAmount: string;

   // Shadows
   boxShadow: string;
   boxShadowElevated: string;
   focusBoxShadow: string;

   // Sizing
   borderRadius: string;
   baseFontSize: string;
   iconSize: string;

   // Typography
   fontFamily: string;
   fontWeight: string;

   // Input
   inputColor: string;
   inputBackgroundColor: string;
   inputBorderColor: string;
   inputFontSize: string;
   inputLineHeight: string;
   inputPaddingX: string;
   inputPaddingY: string;
   checkboxSize: string;

   // Button
   buttonBackgroundColor: string;
   buttonBorderColor: string;
   buttonFontSize: string;
   buttonFontWeight: string;
   buttonLineHeight: string;
   buttonPaddingX: string;
   buttonPaddingY: string;
   buttonBorderWidth: string;
   buttonBoxShadow: string;

   // Grid
   gridHeaderBackgroundColor: string;
   gridHeaderFontWeight: string;
   gridDataBackgroundColor: string;
   gridDataBorderColor: string;

   // Calendar
   calendarBackgroundColor: string;

   // Transitions
   transition: string;
}

/**
 * Maps ThemeVariables object keys to CSS custom property names
 */
export const variableMap: Record<keyof ThemeVariables, string> = {
   // Primary colors
   primaryColor: "--cx-theme-primary-color",
   accentColor: "--cx-theme-accent-color",
   dangerColor: "--cx-theme-danger-color",

   // Text colors
   textColor: "--cx-theme-text-color",

   // Background colors
   backgroundColor: "--cx-theme-background-color",
   surfaceColor: "--cx-theme-surface-color",

   // Border colors
   borderColor: "--cx-theme-border-color",

   // Active state
   activeStateColor: "--cx-theme-active-state-color",
   activeStateHoverAmount: "--cx-theme-active-state-hover-amount",
   activeStatePressedAmount: "--cx-theme-active-state-pressed-amount",

   // Shadows
   boxShadow: "--cx-theme-box-shadow",
   boxShadowElevated: "--cx-theme-box-shadow-elevated",
   focusBoxShadow: "--cx-theme-focus-box-shadow",

   // Sizing
   borderRadius: "--cx-theme-border-radius",
   baseFontSize: "--cx-theme-base-font-size",
   iconSize: "--cx-theme-icon-size",

   // Typography
   fontFamily: "--cx-theme-font-family",
   fontWeight: "--cx-theme-font-weight",

   // Input
   inputColor: "--cx-input-color",
   inputBackgroundColor: "--cx-input-background-color",
   inputBorderColor: "--cx-input-border-color",
   inputFontSize: "--cx-input-font-size",
   inputLineHeight: "--cx-input-line-height",
   inputPaddingX: "--cx-input-padding-x",
   inputPaddingY: "--cx-input-padding-y",
   checkboxSize: "--cx-checkbox-size",

   // Button
   buttonBackgroundColor: "--cx-button-background-color",
   buttonBorderColor: "--cx-button-border-color",
   buttonFontSize: "--cx-button-font-size",
   buttonFontWeight: "--cx-button-font-weight",
   buttonLineHeight: "--cx-button-line-height",
   buttonPaddingX: "--cx-button-padding-x",
   buttonPaddingY: "--cx-button-padding-y",
   buttonBorderWidth: "--cx-button-border-width",
   buttonBoxShadow: "--cx-button-box-shadow",

   // Grid
   gridHeaderBackgroundColor: "--cx-grid-header-background-color",
   gridHeaderFontWeight: "--cx-grid-header-font-weight",
   gridDataBackgroundColor: "--cx-grid-data-background-color",
   gridDataBorderColor: "--cx-grid-data-border-color",

   // Calendar
   calendarBackgroundColor: "--cx-calendar-background-color",

   // Transitions
   transition: "--cx-theme-transition",
};

/**
 * Converts a ThemeVariables object to a CSS style object with custom properties
 */
export function themeVariablesToStyle(theme: Partial<ThemeVariables>): Record<string, string> {
   const style: Record<string, string> = {};
   for (const key in theme) {
      const value = theme[key as keyof ThemeVariables];
      if (value !== undefined) {
         const cssVar = variableMap[key as keyof ThemeVariables];
         if (cssVar) {
            style[cssVar] = value;
         }
      }
   }
   return style;
}

/**
 * Generates CSS text for :root with the given theme variables
 */
export function themeVariablesToCSS(theme: Partial<ThemeVariables>): string {
   const style = themeVariablesToStyle(theme);
   const declarations = Object.entries(style)
      .map(([key, value]) => `   ${key}: ${value};`)
      .join("\n");
   return `:root {\n${declarations}\n}`;
}

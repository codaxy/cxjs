/**
 * Theme variables that can be customized at runtime via CSS custom properties.
 */
export interface ThemeVariables {
   primaryColor: string;
   accentColor: string;
   dangerColor: string;
   textColor: string;
   backgroundColor: string;
   surfaceColor: string;
   borderColor: string;
   boxShadow: string;
   boxShadowElevated: string;
   focusBoxShadow: string;
   borderRadius: string;
   baseFontSize: string;
   iconSize: string;
   fontFamily: string;
   fontWeight: string;
   transition: string;

   primaryTextColor: string;
   primaryBorderColor: string;
   accentTextColor: string;
   warningColor: string;
   warningTextColor: string;
   warningBorderColor: string;
   successColor: string;
   successTextColor: string;
   successBorderColor: string;
   dangerTextColor: string;
   dangerBorderColor: string;

   labelPaddingX: string;
   labelPaddingY: string;
   labelFontSize: string;
   labelFontFamily: string;
   labelFontWeight: string;
   labelLineHeight: string;
   labelColor: string;
   placeholderColor: string;

   inputWidth: string;
   inputColor: string;
   inputBackgroundColor: string;
   inputBorderColor: string;
   inputFontSize: string;
   inputLineHeight: string;
   inputPaddingX: string;
   inputPaddingY: string;
   checkboxSize: string;

   buttonBackgroundColor: string;
   buttonBorderColor: string;
   buttonFontSize: string;
   buttonFontWeight: string;
   buttonLineHeight: string;
   buttonPaddingX: string;
   buttonPaddingY: string;
   buttonBorderWidth: string;
   buttonBoxShadow: string;
   buttonBorderRadius: string;
   buttonHoverBoxShadow: string;
   buttonHoverStateMixColor: string;
   buttonHoverStateMixAmount: string;
   buttonActiveStateMixColor: string;
   buttonActiveStateMixAmount: string;

   switchAxisSize: string;
   switchHandleSize: string;
   switchWidth: string;

   gridBackground: string;
   gridBorderRadius: string;
   gridFontSize: string;
   gridHeaderFontSize: string;
   gridHeaderPaddingX: string;
   gridHeaderPaddingY: string;
   gridHeaderBackgroundColor: string;
   gridHeaderFontWeight: string;
   gridDataPaddingX: string;
   gridDataPaddingY: string;
   gridDataBackgroundColor: string;
   gridDataBorderColor: string;

   sectionBoxShadow: string;
   sectionBorderWidth: string;
   sectionBorderRadius: string;
   sectionHeaderPadding: string;
   sectionHeaderMargin: string;
   sectionHeaderBorderWidth: string;
   sectionHeaderFontWeight: string;
   sectionBodyPadding: string;
   sectionFooterPadding: string;
   sectionFooterMargin: string;
   sectionFooterBorderWidth: string;

   calendarBackgroundColor: string;
   calendarPadding: string;
   calendarHeaderFontWeight: string;
   calendarHeaderBackgroundColor: string;
   calendarDayPaddingX: string;
   calendarDayPaddingY: string;
   calendarDayLineHeight: string;
   calendarDayFontSize: string;
}

/**
 * Maps ThemeVariables object keys to CSS custom property names
 */
export const variableMap: Record<keyof ThemeVariables, string> = {
   primaryColor: "--cx-theme-primary-color",
   accentColor: "--cx-theme-accent-color",
   dangerColor: "--cx-theme-danger-color",
   textColor: "--cx-theme-text-color",
   backgroundColor: "--cx-theme-background-color",
   surfaceColor: "--cx-theme-surface-color",
   borderColor: "--cx-theme-border-color",
   boxShadow: "--cx-theme-box-shadow",
   boxShadowElevated: "--cx-theme-box-shadow-elevated",
   focusBoxShadow: "--cx-theme-focus-box-shadow",
   borderRadius: "--cx-theme-border-radius",
   baseFontSize: "--cx-theme-base-font-size",
   iconSize: "--cx-theme-icon-size",
   fontFamily: "--cx-theme-font-family",
   fontWeight: "--cx-theme-font-weight",
   transition: "--cx-theme-transition",

   primaryTextColor: "--cx-theme-primary-text-color",
   primaryBorderColor: "--cx-theme-primary-border-color",
   accentTextColor: "--cx-theme-accent-text-color",
   warningColor: "--cx-theme-warning-color",
   warningTextColor: "--cx-theme-warning-text-color",
   warningBorderColor: "--cx-theme-warning-border-color",
   successColor: "--cx-theme-success-color",
   successTextColor: "--cx-theme-success-text-color",
   successBorderColor: "--cx-theme-success-border-color",
   dangerTextColor: "--cx-theme-danger-text-color",
   dangerBorderColor: "--cx-theme-danger-border-color",

   labelPaddingX: "--cx-label-padding-x",
   labelPaddingY: "--cx-label-padding-y",
   labelFontSize: "--cx-label-font-size",
   labelFontFamily: "--cx-label-font-family",
   labelFontWeight: "--cx-label-font-weight",
   labelLineHeight: "--cx-label-line-height",
   labelColor: "--cx-label-color",
   placeholderColor: "--cx-placeholder-color",

   inputWidth: "--cx-input-width",
   inputColor: "--cx-input-color",
   inputBackgroundColor: "--cx-input-background-color",
   inputBorderColor: "--cx-input-border-color",
   inputFontSize: "--cx-input-font-size",
   inputLineHeight: "--cx-input-line-height",
   inputPaddingX: "--cx-input-padding-x",
   inputPaddingY: "--cx-input-padding-y",
   checkboxSize: "--cx-checkbox-size",

   buttonBackgroundColor: "--cx-button-background-color",
   buttonBorderColor: "--cx-button-border-color",
   buttonFontSize: "--cx-button-font-size",
   buttonFontWeight: "--cx-button-font-weight",
   buttonLineHeight: "--cx-button-line-height",
   buttonPaddingX: "--cx-button-padding-x",
   buttonPaddingY: "--cx-button-padding-y",
   buttonBorderWidth: "--cx-button-border-width",
   buttonBoxShadow: "--cx-button-box-shadow",
   buttonBorderRadius: "--cx-button-border-radius",
   buttonHoverBoxShadow: "--cx-button-hover-box-shadow",
   buttonHoverStateMixColor: "--cx-button-hover-state-mix-color",
   buttonHoverStateMixAmount: "--cx-button-hover-state-mix-amount",
   buttonActiveStateMixColor: "--cx-button-active-state-mix-color",
   buttonActiveStateMixAmount: "--cx-button-active-state-mix-amount",

   switchAxisSize: "--cx-switch-axis-size",
   switchHandleSize: "--cx-switch-handle-size",
   switchWidth: "--cx-switch-width",

   gridBackground: "--cx-grid-background",
   gridBorderRadius: "--cx-grid-border-radius",
   gridFontSize: "--cx-grid-font-size",
   gridHeaderFontSize: "--cx-grid-header-font-size",
   gridHeaderPaddingX: "--cx-grid-header-padding-x",
   gridHeaderPaddingY: "--cx-grid-header-padding-y",
   gridHeaderBackgroundColor: "--cx-grid-header-background-color",
   gridHeaderFontWeight: "--cx-grid-header-font-weight",
   gridDataPaddingX: "--cx-grid-data-padding-x",
   gridDataPaddingY: "--cx-grid-data-padding-y",
   gridDataBackgroundColor: "--cx-grid-data-background-color",
   gridDataBorderColor: "--cx-grid-data-border-color",

   sectionBoxShadow: "--cx-section-box-shadow",
   sectionBorderWidth: "--cx-section-border-width",
   sectionBorderRadius: "--cx-section-border-radius",
   sectionHeaderPadding: "--cx-section-header-padding",
   sectionHeaderMargin: "--cx-section-header-margin",
   sectionHeaderBorderWidth: "--cx-section-header-border-width",
   sectionHeaderFontWeight: "--cx-section-header-font-weight",
   sectionBodyPadding: "--cx-section-body-padding",
   sectionFooterPadding: "--cx-section-footer-padding",
   sectionFooterMargin: "--cx-section-footer-margin",
   sectionFooterBorderWidth: "--cx-section-footer-border-width",

   calendarBackgroundColor: "--cx-calendar-background-color",
   calendarPadding: "--cx-calendar-padding",
   calendarHeaderFontWeight: "--cx-calendar-header-font-weight",
   calendarHeaderBackgroundColor: "--cx-calendar-header-background-color",
   calendarDayPaddingX: "--cx-calendar-day-padding-x",
   calendarDayPaddingY: "--cx-calendar-day-padding-y",
   calendarDayLineHeight: "--cx-calendar-day-line-height",
   calendarDayFontSize: "--cx-calendar-day-font-size",
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
 * Generates CSS text with the given theme variables.
 * @param theme - Theme variables to render
 * @param selector - CSS selector (default: ":root")
 * @param wrapper - Optional wrapper like "@media (prefers-color-scheme: dark)"
 */
export function themeVariablesToCSS(
   theme: Partial<ThemeVariables>,
   selector: string = ":root",
   wrapper?: string,
): string {
   const style = themeVariablesToStyle(theme);
   const indent = wrapper ? "      " : "   ";
   const declarations = Object.entries(style)
      .map(([key, value]) => `${indent}${key}: ${value};`)
      .join("\n");
   const block = `${selector} {\n${declarations}\n${wrapper ? "   " : ""}}`;
   if (wrapper) {
      return `${wrapper} {\n   ${block}\n}`;
   }
   return block;
}

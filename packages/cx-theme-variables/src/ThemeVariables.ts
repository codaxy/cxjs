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
   overlayBoxShadow: string;
   focusBoxShadow: string;
   borderRadius: string;
   fontSize: string;
   iconSize: string;
   fontFamily: string;
   fontWeight: string;
   transition: string;

   scrollbarThumbColor: string;
   scrollbarTrackColor: string;
   scrollbarWidth: string;

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
   inputBorderWidth: string;
   inputTagBackgroundColor: string;
   inputTagFontSize: string;
   inputTagSpacing: string;
   inputTagBorderRadius: string;
   inputTagBorderWidth: string;
   inputTagPadding: string;
   checkboxSize: string;
   checkboxCheckedBackgroundColor: string;
   checkboxCheckedBorderColor: string;
   checkboxCheckedColor: string;
   radioCheckedColor: string;
   radioCheckedBorderColor: string;

   buttonBackgroundColor: string;
   buttonColor: string;
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
   gridHeaderColor: string;
   gridHeaderBackgroundColor: string;
   gridHeaderBorderColor: string;
   gridHeaderFontWeight: string;
   gridDataPaddingX: string;
   gridDataPaddingY: string;
   gridDataBackgroundColor: string;
   gridDataBorderColor: string;
   gridDataAlternateBackgroundColor: string;

   cursorColor: string;
   cursorBorderWidth: string;
   cursorBorderRadius: string;
   cursorBoxShadow: string;

   listItemPaddingX: string;
   listItemPaddingY: string;

   menuItemPaddingX: string;
   menuItemPaddingY: string;
   dropdownPadding: string;
   dropdownBorderWidth: string;
   dropdownArrowSize: string;
   dropdownArrowOffset: string;
   dropdownArrowShadowColor: string;
   dropdownArrowShadowSize: string;
   dropdownArrowShadowOffset: string;

   toastBackgroundColor: string;
   toastBorderWidth: string;
   toastBorderColor: string;
   toastBoxShadow: string;
   toastBorderRadius: string;
   toastPadding: string;

   windowBackgroundColor: string;
   windowBorderColor: string;
   windowBorderWidth: string;
   windowColor: string;
   windowFontSize: string;
   windowHeaderColor: string;
   windowHeaderBackgroundColor: string;
   windowHeaderPadding: string;
   windowHeaderMargin: string;
   windowHeaderFontSize: string;
   windowHeaderFontWeight: string;
   windowHeaderBorderWidth: string;
   windowBodyPadding: string;
   windowBodyBackgroundColor: string;
   windowFooterBackgroundColor: string;
   windowFooterPadding: string;
   windowFooterMargin: string;
   windowFooterBorderWidth: string;

   sectionBackgroundColor: string;
   sectionBorderColor: string;
   sectionColor: string;
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

   tooltipBackgroundColor: string;
   tooltipBorderColor: string;
   tooltipBorderWidth: string;
   tooltipBorderRadius: string;
   tooltipArrowSize: string;
   tooltipColor: string;
   tooltipFontSize: string;
   tooltipPadding: string;
   tooltipBoxShadow: string;
   tooltipErrorBackgroundColor: string;
   tooltipErrorBorderColor: string;
   tooltipErrorColor: string;

   sliderAxisColor: string;
   sliderAxisSize: string;
   sliderRangeColor: string;
   sliderHandleColor: string;
   sliderHandleBorderColor: string;
   sliderHandleBorderWidth: string;
   sliderHandleSize: string;
   sliderHandleBoxShadow: string;
   sliderHandleHoverBoxShadow: string;

   progressBarHeight: string;
   progressBarBackgroundColor: string;
   progressBarIndicatorColor: string;
   progressBarColor: string;
   progressBarBorderRadius: string;

   monthPickerBackgroundColor: string;
   monthPickerBorderWidth: string;
   monthPickerWidth: string;
   monthPickerPadding: string;
   monthPickerCellPadding: string;
   monthPickerCellLineHeight: string;
   monthPickerFontSize: string;
   monthPickerCellFontSize: string;
   monthPickerQuarterColor: string;
   monthPickerYearFontSize: string;
   monthPickerYearFontWeight: string;
   monthPickerYearColor: string;

   chartAxisLineColor: string;
   chartAxisTickColor: string;
   chartAxisLabelColor: string;
   chartAxisLabelFontSize: string;
   chartGridlineColor: string;
   chartShapeFillColor: string;
   chartShapeStrokeColor: string;
   chartShapeStrokeWidth: string;
   chartSelectedStrokeWidth: string;
   chartLineStrokeColor: string;
   chartLineStrokeWidth: string;
   chartAreaOpacity: string;
   chartMarkerColor: string;
   chartMarkerStrokeWidth: string;
   chartMarkerLineStrokeWidth: string;
   chartRangeFillColor: string;
   chartRangeOpacity: string;
   chartRangeMarkerColor: string;
   chartSwimlaneLaneColor: string;
   chartLegendFontSize: string;
   chartLegendPadding: string;
   chartLegendGap: string;
   chartLegendEntryGap: string;
   chartLegendShapeColor: string;
   chartLegendShapeStrokeWidth: string;

   paletteColor0: string;
   paletteColor1: string;
   paletteColor2: string;
   paletteColor3: string;
   paletteColor4: string;
   paletteColor5: string;
   paletteColor6: string;
   paletteColor7: string;
   paletteColor8: string;
   paletteColor9: string;
   paletteColor10: string;
   paletteColor11: string;
   paletteColor12: string;
   paletteColor13: string;
   paletteColor14: string;
   paletteColor15: string;
   paletteFillWhiten: string;
   paletteFillHoverWhiten: string;
   paletteFillSelectedWhiten: string;
   paletteFillDisabledWhiten: string;
   paletteFillBlacken: string;
   paletteFillHoverBlacken: string;
   paletteFillSelectedBlacken: string;
   paletteFillDisabledBlacken: string;
   paletteStrokeWhiten: string;
   paletteStrokeBlacken: string;

   colorPickerBorderWidth: string;

   calendarBorderWidth: string;
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
   overlayBoxShadow: "--cx-overlay-box-shadow",
   focusBoxShadow: "--cx-theme-focus-box-shadow",
   borderRadius: "--cx-theme-border-radius",
   fontSize: "--cx-theme-font-size",
   iconSize: "--cx-theme-icon-size",
   fontFamily: "--cx-theme-font-family",
   fontWeight: "--cx-theme-font-weight",
   transition: "--cx-theme-transition",

   scrollbarThumbColor: "--cx-scrollbar-thumb-color",
   scrollbarTrackColor: "--cx-scrollbar-track-color",
   scrollbarWidth: "--cx-scrollbar-width",

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
   inputBorderWidth: "--cx-input-border-width",
   inputTagBackgroundColor: "--cx-input-tag-background-color",
   inputTagFontSize: "--cx-input-tag-font-size",
   inputTagSpacing: "--cx-input-tag-spacing",
   inputTagBorderRadius: "--cx-input-tag-border-radius",
   inputTagBorderWidth: "--cx-input-tag-border-width",
   inputTagPadding: "--cx-input-tag-padding",
   checkboxSize: "--cx-checkbox-size",
   checkboxCheckedBackgroundColor: "--cx-checkbox-checked-background-color",
   checkboxCheckedBorderColor: "--cx-checkbox-checked-border-color",
   checkboxCheckedColor: "--cx-checkbox-checked-color",
   radioCheckedColor: "--cx-radio-checked-color",
   radioCheckedBorderColor: "--cx-radio-checked-border-color",

   buttonBackgroundColor: "--cx-button-background-color",
   buttonColor: "--cx-button-color",
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
   gridHeaderColor: "--cx-grid-header-color",
   gridHeaderBackgroundColor: "--cx-grid-header-background-color",
   gridHeaderBorderColor: "--cx-grid-header-border-color",
   gridHeaderFontWeight: "--cx-grid-header-font-weight",
   gridDataPaddingX: "--cx-grid-data-padding-x",
   gridDataPaddingY: "--cx-grid-data-padding-y",
   gridDataBackgroundColor: "--cx-grid-data-background-color",
   gridDataBorderColor: "--cx-grid-data-border-color",
   gridDataAlternateBackgroundColor: "--cx-grid-data-alternate-background-color",

   cursorColor: "--cx-cursor-color",
   cursorBorderWidth: "--cx-cursor-border-width",
   cursorBorderRadius: "--cx-cursor-border-radius",
   cursorBoxShadow: "--cx-cursor-box-shadow",

   listItemPaddingX: "--cx-list-item-padding-x",
   listItemPaddingY: "--cx-list-item-padding-y",

   menuItemPaddingX: "--cx-menu-item-padding-x",
   menuItemPaddingY: "--cx-menu-item-padding-y",
   dropdownPadding: "--cx-dropdown-padding",
   dropdownBorderWidth: "--cx-dropdown-border-width",
   dropdownArrowSize: "--cx-dropdown-arrow-size",
   dropdownArrowOffset: "--cx-dropdown-arrow-offset",
   dropdownArrowShadowColor: "--cx-dropdown-arrow-shadow-color",
   dropdownArrowShadowSize: "--cx-dropdown-arrow-shadow-size",
   dropdownArrowShadowOffset: "--cx-dropdown-arrow-shadow-offset",

   toastBackgroundColor: "--cx-toast-background-color",
   toastBorderWidth: "--cx-toast-border-width",
   toastBorderColor: "--cx-toast-border-color",
   toastBoxShadow: "--cx-toast-box-shadow",
   toastBorderRadius: "--cx-toast-border-radius",
   toastPadding: "--cx-toast-padding",

   windowBackgroundColor: "--cx-window-background-color",
   windowBorderColor: "--cx-window-border-color",
   windowBorderWidth: "--cx-window-border-width",
   windowColor: "--cx-window-color",
   windowFontSize: "--cx-window-font-size",
   windowHeaderColor: "--cx-window-header-color",
   windowHeaderBackgroundColor: "--cx-window-header-background-color",
   windowHeaderPadding: "--cx-window-header-padding",
   windowHeaderMargin: "--cx-window-header-margin",
   windowHeaderFontSize: "--cx-window-header-font-size",
   windowHeaderFontWeight: "--cx-window-header-font-weight",
   windowHeaderBorderWidth: "--cx-window-header-border-width",
   windowBodyPadding: "--cx-window-body-padding",
   windowBodyBackgroundColor: "--cx-window-body-background-color",
   windowFooterBackgroundColor: "--cx-window-footer-background-color",
   windowFooterPadding: "--cx-window-footer-padding",
   windowFooterMargin: "--cx-window-footer-margin",
   windowFooterBorderWidth: "--cx-window-footer-border-width",

   sectionBackgroundColor: "--cx-section-background-color",
   sectionBorderColor: "--cx-section-border-color",
   sectionColor: "--cx-section-color",
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

   tooltipBackgroundColor: "--cx-tooltip-background-color",
   tooltipBorderColor: "--cx-tooltip-border-color",
   tooltipBorderWidth: "--cx-tooltip-border-width",
   tooltipBorderRadius: "--cx-tooltip-border-radius",
   tooltipArrowSize: "--cx-tooltip-arrow-size",
   tooltipColor: "--cx-tooltip-color",
   tooltipFontSize: "--cx-tooltip-font-size",
   tooltipPadding: "--cx-tooltip-padding",
   tooltipBoxShadow: "--cx-tooltip-box-shadow",
   tooltipErrorBackgroundColor: "--cx-tooltip-error-background-color",
   tooltipErrorBorderColor: "--cx-tooltip-error-border-color",
   tooltipErrorColor: "--cx-tooltip-error-color",

   sliderAxisColor: "--cx-slider-axis-color",
   sliderAxisSize: "--cx-slider-axis-size",
   sliderRangeColor: "--cx-slider-range-color",
   sliderHandleColor: "--cx-slider-handle-color",
   sliderHandleBorderColor: "--cx-slider-handle-border-color",
   sliderHandleBorderWidth: "--cx-slider-handle-border-width",
   sliderHandleSize: "--cx-slider-handle-size",
   sliderHandleBoxShadow: "--cx-slider-handle-box-shadow",
   sliderHandleHoverBoxShadow: "--cx-slider-handle-hover-box-shadow",

   progressBarHeight: "--cx-progressbar-height",
   progressBarBackgroundColor: "--cx-progressbar-background-color",
   progressBarIndicatorColor: "--cx-progressbar-indicator-color",
   progressBarColor: "--cx-progressbar-color",
   progressBarBorderRadius: "--cx-progressbar-border-radius",

   monthPickerBackgroundColor: "--cx-monthpicker-background-color",
   monthPickerBorderWidth: "--cx-monthpicker-border-width",
   monthPickerWidth: "--cx-monthpicker-width",
   monthPickerPadding: "--cx-monthpicker-padding",
   monthPickerCellPadding: "--cx-monthpicker-cell-padding",
   monthPickerCellLineHeight: "--cx-monthpicker-cell-line-height",
   monthPickerFontSize: "--cx-monthpicker-font-size",
   monthPickerCellFontSize: "--cx-monthpicker-cell-font-size",
   monthPickerQuarterColor: "--cx-monthpicker-quarter-color",
   monthPickerYearFontSize: "--cx-monthpicker-year-font-size",
   monthPickerYearFontWeight: "--cx-monthpicker-year-font-weight",
   monthPickerYearColor: "--cx-monthpicker-year-color",

   chartAxisLineColor: "--cx-chart-axis-line-color",
   chartAxisTickColor: "--cx-chart-axis-tick-color",
   chartAxisLabelColor: "--cx-chart-axis-label-color",
   chartAxisLabelFontSize: "--cx-chart-axis-label-font-size",
   chartGridlineColor: "--cx-chart-gridline-color",
   chartShapeFillColor: "--cx-chart-shape-fill-color",
   chartShapeStrokeColor: "--cx-chart-shape-stroke-color",
   chartShapeStrokeWidth: "--cx-chart-shape-stroke-width",
   chartSelectedStrokeWidth: "--cx-chart-selected-stroke-width",
   chartLineStrokeColor: "--cx-chart-line-stroke-color",
   chartLineStrokeWidth: "--cx-chart-line-stroke-width",
   chartAreaOpacity: "--cx-chart-area-opacity",
   chartMarkerColor: "--cx-chart-marker-color",
   chartMarkerStrokeWidth: "--cx-chart-marker-stroke-width",
   chartMarkerLineStrokeWidth: "--cx-chart-markerline-stroke-width",
   chartRangeFillColor: "--cx-chart-range-fill-color",
   chartRangeOpacity: "--cx-chart-range-opacity",
   chartRangeMarkerColor: "--cx-chart-range-marker-color",
   chartSwimlaneLaneColor: "--cx-chart-swimlane-lane-color",
   chartLegendFontSize: "--cx-chart-legend-font-size",
   chartLegendPadding: "--cx-chart-legend-padding",
   chartLegendGap: "--cx-chart-legend-gap",
   chartLegendEntryGap: "--cx-chart-legend-entry-gap",
   chartLegendShapeColor: "--cx-chart-legend-shape-color",
   chartLegendShapeStrokeWidth: "--cx-chart-legend-shape-stroke-width",

   paletteColor0: "--cx-palette-color-0",
   paletteColor1: "--cx-palette-color-1",
   paletteColor2: "--cx-palette-color-2",
   paletteColor3: "--cx-palette-color-3",
   paletteColor4: "--cx-palette-color-4",
   paletteColor5: "--cx-palette-color-5",
   paletteColor6: "--cx-palette-color-6",
   paletteColor7: "--cx-palette-color-7",
   paletteColor8: "--cx-palette-color-8",
   paletteColor9: "--cx-palette-color-9",
   paletteColor10: "--cx-palette-color-10",
   paletteColor11: "--cx-palette-color-11",
   paletteColor12: "--cx-palette-color-12",
   paletteColor13: "--cx-palette-color-13",
   paletteColor14: "--cx-palette-color-14",
   paletteColor15: "--cx-palette-color-15",
   paletteFillWhiten: "--cx-palette-fill-whiten",
   paletteFillHoverWhiten: "--cx-palette-fill-hover-whiten",
   paletteFillSelectedWhiten: "--cx-palette-fill-selected-whiten",
   paletteFillDisabledWhiten: "--cx-palette-fill-disabled-whiten",
   paletteFillBlacken: "--cx-palette-fill-blacken",
   paletteFillHoverBlacken: "--cx-palette-fill-hover-blacken",
   paletteFillSelectedBlacken: "--cx-palette-fill-selected-blacken",
   paletteFillDisabledBlacken: "--cx-palette-fill-disabled-blacken",
   paletteStrokeWhiten: "--cx-palette-stroke-whiten",
   paletteStrokeBlacken: "--cx-palette-stroke-blacken",

   colorPickerBorderWidth: "--cx-colorpicker-border-width",

   calendarBorderWidth: "--cx-calendar-border-width",
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

/**
 * Renders theme variables by appending a <style> tag to document.head.
 * @param theme - Theme variables to render
 * @param selector - CSS selector (default: ":root")
 * @param cssWrapper - Optional wrapper like "@media (prefers-color-scheme: dark)"
 */
export function renderThemeVariables(
   theme: Partial<ThemeVariables>,
   selector: string = ":root",
   cssWrapper?: string,
): void {
   const css = themeVariablesToCSS(theme, selector, cssWrapper);
   const style = document.createElement("style");
   style.textContent = css;
   document.head.appendChild(style);
}

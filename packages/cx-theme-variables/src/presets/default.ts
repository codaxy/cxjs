import { ThemeVariables } from "../ThemeVariables";

/**
 * Default light theme - base for all other presets
 */
const defaultPreset: ThemeVariables = {
   primaryColor: "#1976d2",
   accentColor: "#ffc107",
   dangerColor: "#d32f2f",
   textColor: "rgba(0, 0, 0, 0.87)",
   backgroundColor: "white",
   surfaceColor: "white",
   borderColor: "lightgray",
   boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
   boxShadowElevated: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
   focusBoxShadow: "0 0 0 2px rgba(25, 118, 210, 0.4)",
   borderRadius: "4px",
   baseFontSize: "14px",
   iconSize: "16px",
   fontFamily: "'Inter', sans-serif",
   fontWeight: "400",
   transition: "all 0.2s ease",

   primaryTextColor: "white",
   primaryBorderColor: "color-mix(in srgb, var(--cx-theme-primary-color), var(--cx-button-active-state-mix-color) 20%)",
   dangerTextColor: "white",
   dangerBorderColor: "color-mix(in srgb, var(--cx-theme-danger-color), var(--cx-button-active-state-mix-color) 20%)",

   inputWidth: "200px",
   inputColor: "inherit",
   inputBackgroundColor: "white",
   inputBorderColor: "lightgray",
   inputFontSize: "var(--cx-theme-base-font-size)",
   inputLineHeight: "22px",
   inputPaddingX: "6px",
   inputPaddingY: "6px",
   checkboxSize: "16px",

   buttonBackgroundColor: "#f5f5f5",
   buttonBorderColor: "var(--cx-theme-border-color)",
   buttonFontSize: "var(--cx-theme-base-font-size)",
   buttonFontWeight: "var(--cx-theme-font-weight)",
   buttonLineHeight: "22px",
   buttonPaddingX: "16px",
   buttonPaddingY: "6px",
   buttonBorderWidth: "1px",
   buttonBoxShadow: "inset 0 -2px rgba(128, 128, 128, 0.1)",
   buttonBorderRadius: "var(--cx-theme-border-radius)",
   buttonHoverBoxShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
   buttonHoverStateMixColor: "var(--cx-theme-background-color)",
   buttonHoverStateMixAmount: "8%",
   buttonActiveStateMixColor: "black",
   buttonActiveStateMixAmount: "12%",

   switchAxisSize: "calc(var(--cx-checkbox-size) + 4px)",
   switchHandleSize: "var(--cx-checkbox-size)",
   switchWidth: "calc(var(--cx-checkbox-size) * 2 + 4px)",

   gridHeaderBackgroundColor: "var(--cx-button-background-color)",
   gridHeaderFontWeight: "600",
   gridDataBackgroundColor: "white",
   gridDataBorderColor: "#e0e0e0",

   calendarBackgroundColor: "white",
};

export default defaultPreset;

import { ThemeVariables } from "../ThemeVariables";

/**
 * Default light theme - base for all other presets
 */
const defaultPreset: ThemeVariables = {
   // Primary colors
   primaryColor: "#1976d2",
   accentColor: "#ffc107",
   dangerColor: "#d32f2f",

   // Text colors
   textColor: "rgba(0, 0, 0, 0.87)",

   // Background colors
   backgroundColor: "white",
   surfaceColor: "white",

   // Border colors
   borderColor: "lightgray",

   // Active state
   activeStateColor: "black",
   activeStateHoverAmount: "8%",
   activeStatePressedAmount: "12%",

   // Shadows
   boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
   boxShadowElevated: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
   focusBoxShadow: "0 0 0 2px rgba(25, 118, 210, 0.4)",

   // Sizing
   borderRadius: "4px",
   baseFontSize: "14px",
   iconSize: "16px",

   // Typography
   fontFamily: "'Inter', sans-serif",
   fontWeight: "400",

   // Input
   inputBackgroundColor: "white",
   inputBorderColor: "lightgray",
   inputFontSize: "var(--cx-theme-base-font-size)",
   inputLineHeight: "22px",
   inputPaddingX: "6px",
   inputPaddingY: "6px",
   checkboxSize: "16px",

   // Button
   buttonBackgroundColor: "#f5f5f5",
   buttonBorderColor: "var(--cx-theme-border-color)",
   buttonFontSize: "var(--cx-theme-base-font-size)",
   buttonFontWeight: "var(--cx-theme-font-weight)",
   buttonLineHeight: "22px",
   buttonPaddingX: "16px",
   buttonPaddingY: "6px",
   buttonBorderWidth: "1px",
   buttonBoxShadow: "inset 0 -2px rgba(128, 128, 128, 0.1)",

   // Grid
   gridHeaderBackgroundColor: "var(--cx-button-background-color)",
   gridHeaderFontWeight: "600",
   gridDataBackgroundColor: "white",
   gridDataBorderColor: "#e0e0e0",

   // Calendar
   calendarBackgroundColor: "white",

   // Transitions
   transition: "all 0.2s ease",
};

export default defaultPreset;

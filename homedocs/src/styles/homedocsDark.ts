import { ThemeVariables } from "cx-theme-variables";
import homedocsLightPreset from "./homedocsLight";

/**
 * Homedocs dark theme - matches the CxJS documentation site dark mode
 */
const homedocsDarkPreset: ThemeVariables = {
   ...homedocsLightPreset,

   // Primary colors
   primaryColor: "hsl(var(--primary))",
   accentColor: "hsl(var(--accent))",
   accentTextColor: "hsl(0, 0%, 98%)",
   dangerColor: "#ef4444",

   // Text
   textColor: "#fafafa",

   // Backgrounds
   backgroundColor: "#171717",
   surfaceColor: "#1f1f1f",

   // Borders
   borderColor: "#383838",

   buttonActiveStateMixColor: "white",

   // Shadows - heavier for dark backgrounds
   boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)",
   overlayBoxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
   focusBoxShadow:
      "0 0 0 2px color-mix(in srgb, var(--cx-theme-primary-color) 40%, transparent)",

   // Input
   inputBackgroundColor: "#171717",
   inputBorderColor: "#383838",

   // Button
   buttonBackgroundColor: "#2e2e2e",
   buttonBorderColor: "#383838",

   // Grid
   gridBackground: "#1f1f1f",
   gridHeaderBackgroundColor: "#2e2e2e",
   gridDataBackgroundColor: "none",
   gridDataBorderColor: "#383838",

   // Calendar
   calendarBackgroundColor: "#1f1f1f",

   // Cursor
   cursorColor: "hsl(var(--primary))",

   // Tooltip
   tooltipBackgroundColor: "#1f1f1f",

};

export default homedocsDarkPreset;

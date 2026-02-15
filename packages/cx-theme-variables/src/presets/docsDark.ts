import { ThemeVariables } from "../ThemeVariables";
import { docsLightPreset } from "./docsLight";

/**
 * Docs dark theme - dark theme inspired by the CxJS documentation site
 */
export const docsDarkPreset: ThemeVariables = {
   ...docsLightPreset,

   // Primary colors
   primaryColor: "#5bbac7",
   accentColor: "hsl(210, 15%, 22%)",
   accentTextColor: "hsl(0, 0%, 98%)",
   dangerColor: "#ef4444",

   // Text
   textColor: "#fafafa",
   labelColor: "hsl(0, 0%, 64%)",
   placeholderColor: "hsl(0, 0%, 64%)",

   // Backgrounds
   backgroundColor: "#171717",
   surfaceColor: "#1f1f1f",

   // Borders
   borderColor: "#383838",

   buttonActiveStateMixColor: "white",

   // Shadows
   boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)",
   overlayBoxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
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

   // Tooltip
   tooltipBackgroundColor: "#1f1f1f",
};

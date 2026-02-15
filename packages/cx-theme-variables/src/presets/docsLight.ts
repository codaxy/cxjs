import { ThemeVariables } from "../ThemeVariables";
import { defaultPreset } from "./default";

/**
 * Docs light theme - clean light theme inspired by the CxJS documentation site
 */
export const docsLightPreset: ThemeVariables = {
   ...defaultPreset,

   // Primary colors
   primaryColor: "#27aae1",
   primaryTextColor: "white",
   primaryBorderColor: "transparent",
   accentColor: "hsl(197, 78%, 92%)",
   accentTextColor: "hsl(197, 78%, 35%)",
   dangerColor: "hsl(0, 72%, 50%)",
   dangerTextColor: "white",
   dangerBorderColor: "transparent",

   // Text
   textColor: "hsl(220, 13%, 18%)",
   labelColor: "hsl(220, 9%, 46%)",
   labelFontWeight: "500",
   placeholderColor: "hsl(220, 9%, 46%)",

   // Backgrounds
   backgroundColor: "white",
   surfaceColor: "hsl(220, 14%, 98%)",

   // Borders
   borderColor: "hsl(220, 13%, 91%)",

   buttonActiveStateMixColor: "black",
   buttonHoverStateMixAmount: "2%",
   buttonActiveStateMixAmount: "6%",

   // Shadows
   boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",

   // Sizing
   borderRadius: "6px",
   fontSize: "14px",
   iconSize: "16px",

   // Typography
   fontFamily: "'Inter', system-ui, sans-serif",
   fontWeight: "400",

   // Input
   inputWidth: "210px",
   inputColor: "inherit",
   inputBackgroundColor: "white",
   inputBorderColor: "hsl(220, 13%, 91%)",
   inputFontSize: "var(--cx-theme-font-size)",
   inputLineHeight: "20px",
   inputPaddingX: "10px",
   inputPaddingY: "8px",
   checkboxSize: "18px",

   // Button
   buttonBackgroundColor: "hsl(220, 14%, 96%)",
   buttonBorderColor: "hsl(220, 13%, 91%)",
   buttonFontSize: "var(--cx-theme-font-size)",
   buttonFontWeight: "inherit",
   buttonLineHeight: "20px",
   buttonPaddingX: "16px",
   buttonPaddingY: "8px",
   buttonBorderWidth: "1px",

   // Grid
   gridBackground: "white",
   gridHeaderBackgroundColor: "hsl(220, 14%, 96%)",
   gridHeaderFontWeight: "700",
   gridDataBackgroundColor: "none",
   gridDataBorderColor: "hsl(220, 13%, 91%)",

   // Calendar
   calendarBackgroundColor: "white",

   // Transitions
   transition: "all 0.15s ease",
};

import { ThemeVariables } from "../ThemeVariables";
import { defaultPreset } from "./default";

/**
 * Packed dark theme - compact, dense dark theme with small font size
 */
export const packedDarkPreset: ThemeVariables = {
   ...defaultPreset,

   primaryColor: "#0284c7",
   primaryTextColor: "white",
   primaryBorderColor: "transparent",
   dangerColor: "#860000",
   dangerTextColor: "white",
   dangerBorderColor: "transparent",

   textColor: "rgb(226, 227, 229)",
   backgroundColor: "rgb(15, 16, 17)",
   surfaceColor: "rgb(22, 23, 26)",
   borderColor: "rgb(40, 42, 49)",

   buttonActiveStateMixColor: "white",

   boxShadow: "0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.5)",
   overlayBoxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
   focusBoxShadow:
      "0 0 0 2px color-mix(in srgb, var(--cx-theme-primary-color) 50%, transparent)",

   fontSize: "12px",
   borderRadius: "5px",
   fontFamily: "'Inter', sans-serif",
   fontWeight: "500",

   labelColor: "rgba(226, 227, 229, 0.6)",
   placeholderColor: "rgba(226, 227, 229, 0.4)",

   inputBackgroundColor: "rgb(15, 16, 17)",
   inputBorderColor: "rgb(40, 42, 49)",
   inputLineHeight: "22px",
   inputPaddingX: "6px",
   inputPaddingY: "2px",

   buttonBackgroundColor: "rgb(26, 28, 31)",
   buttonBorderColor: "rgb(40, 42, 49)",
   buttonLineHeight: "22px",
   buttonPaddingX: "9px",
   buttonPaddingY: "2px",

   gridBackground: "rgb(22, 23, 26)",
   gridHeaderBackgroundColor: "rgb(26, 28, 31)",
   gridDataBorderColor: "transparent",
   gridDataAlternateBackgroundColor: "rgba(255, 255, 255, 0.01)",

   calendarBackgroundColor: "rgb(22, 23, 26)",
   tooltipBackgroundColor: "rgb(22, 23, 26)",

   windowBackgroundColor: "rgb(22, 23, 26)",
   windowBorderColor: "rgb(40, 42, 49)",
};

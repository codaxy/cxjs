import { ThemeVariables } from "../ThemeVariables";
import { defaultPreset } from "./default";

/**
 * Dark theme with blue accent
 */
export const darkBluePreset: ThemeVariables = {
   ...defaultPreset,
   primaryColor: "#2196f3",
   dangerColor: "#f44336",
   textColor: "rgba(255, 255, 255, 0.87)",
   backgroundColor: "#1e1e1e",
   surfaceColor: "#2d2d2d",
   borderColor: "#444444",
   buttonActiveStateMixColor: "white",
   inputBackgroundColor: "#2d2d2d",
   inputBorderColor: "#444444",
   buttonBackgroundColor: "#3d3d3d",
   gridBackground: "#2d2d2d",
   gridDataBorderColor: "#444444",
   calendarBackgroundColor: "#2d2d2d",
   focusBoxShadow: "0 0 0 2px rgba(33, 150, 243, 0.4)",
   tooltipBackgroundColor: "#2d2d2d",
};


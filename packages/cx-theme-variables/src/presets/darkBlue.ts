import { ThemeVariables } from "../ThemeVariables";
import { defaultPreset } from "./default";

/**
 * Dark theme with blue accent
 */
export const darkBluePreset: ThemeVariables = {
   ...defaultPreset,
   primaryColor: "#2196f3",
   accentColor: "#1a3a5c",
   accentTextColor: "rgba(255, 255, 255, 0.87)",
   dangerColor: "#f44336",
   textColor: "rgba(255, 255, 255, 0.87)",
   labelColor: "rgba(255, 255, 255, 0.5)",
   placeholderColor: "rgba(255, 255, 255, 0.4)",
   backgroundColor: "#1e1e1e",
   surfaceColor: "#2d2d2d",
   borderColor: "#444444",
   buttonActiveStateMixColor: "white",
   boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)",
   overlayBoxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
   inputBackgroundColor: "#1e1e1e",
   inputBorderColor: "#444444",
   buttonBackgroundColor: "#3d3d3d",
   buttonBorderColor: "#444444",
   gridBackground: "#2d2d2d",
   gridHeaderBackgroundColor: "#3d3d3d",
   gridDataBorderColor: "#444444",
   calendarBackgroundColor: "#2d2d2d",
   tooltipBackgroundColor: "#2d2d2d",
   windowBackgroundColor: "#2d2d2d",
   windowBorderColor: "#444444",
};


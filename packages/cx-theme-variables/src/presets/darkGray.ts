import { ThemeVariables } from "../ThemeVariables";
import { defaultPreset } from "./default";

/**
 * Dark gray theme
 */
export const darkGrayPreset: ThemeVariables = {
   ...defaultPreset,
   primaryColor: "#78909c",
   accentColor: "#ffab40",
   accentTextColor: "rgba(0, 0, 0, 0.87)",
   dangerColor: "#ef5350",
   textColor: "rgba(255, 255, 255, 0.87)",
   labelColor: "rgba(255, 255, 255, 0.5)",
   placeholderColor: "rgba(255, 255, 255, 0.4)",
   backgroundColor: "#212121",
   surfaceColor: "#303030",
   borderColor: "#505050",
   buttonActiveStateMixColor: "white",
   boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)",
   overlayBoxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
   inputBackgroundColor: "#212121",
   inputBorderColor: "#505050",
   buttonBackgroundColor: "#424242",
   buttonBorderColor: "#505050",
   gridBackground: "#303030",
   gridHeaderBackgroundColor: "#424242",
   gridDataBorderColor: "#505050",
   calendarBackgroundColor: "#303030",
   tooltipBackgroundColor: "#303030",
   windowBackgroundColor: "#303030",
   windowBorderColor: "#505050",
};


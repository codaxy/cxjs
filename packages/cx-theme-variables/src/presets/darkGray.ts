import { ThemeVariables } from "../ThemeVariables";
import defaultPreset from "./default";

/**
 * Dark gray theme
 */
const darkGrayPreset: ThemeVariables = {
   ...defaultPreset,
   primaryColor: "#78909c",
   accentColor: "#ffab40",
   dangerColor: "#ef5350",
   textColor: "rgba(255, 255, 255, 0.87)",
   backgroundColor: "#212121",
   surfaceColor: "#303030",
   borderColor: "#505050",
   buttonActiveStateMixColor: "white",
   inputBackgroundColor: "#303030",
   inputBorderColor: "#505050",
   buttonBackgroundColor: "#424242",
   gridDataBackgroundColor: "#303030",
   gridDataBorderColor: "#505050",
   calendarBackgroundColor: "#303030",
   focusBoxShadow: "0 0 0 2px rgba(120, 144, 156, 0.4)",
};

export default darkGrayPreset;

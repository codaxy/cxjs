import { ThemeVariables } from "../ThemeVariables";
import { defaultPreset } from "./default";

/**
 * Black and white theme - minimal monochrome design with black as the primary color
 */
export const blackAndWhitePreset: ThemeVariables = {
   ...defaultPreset,

   primaryColor: "black",
   primaryTextColor: "white",
   primaryBorderColor: "transparent",
   accentColor: "#e0e0e0",
   accentTextColor: "black",
   dangerColor: "#d32f2f",
   dangerTextColor: "white",
   dangerBorderColor: "transparent",
};

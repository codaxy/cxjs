import { ThemeVariables } from "../ThemeVariables";
import { defaultPreset } from "./default";

/**
 * Classic preset - checkboxes use input colors, sliders use button colors
 */
export const classicPreset: ThemeVariables = {
   ...defaultPreset,

   // Checkboxes/radios use input colors instead of primary
   checkboxCheckedBackgroundColor: "var(--cx-input-background-color)",
   checkboxCheckedBorderColor: "var(--cx-input-border-color)",
   checkboxCheckedColor: "var(--cx-theme-text-color)",
   radioCheckedColor: "var(--cx-theme-text-color)",
   radioCheckedBorderColor: "var(--cx-input-border-color)",

   // Slider uses button colors instead of primary
   sliderHandleColor: "var(--cx-button-background-color)",
   sliderHandleBorderColor: "var(--cx-button-border-color)",
};

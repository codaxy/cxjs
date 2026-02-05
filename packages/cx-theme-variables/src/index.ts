import { Localization } from "cx/ui";

export * from "./ThemeVariables";
export * from "./ThemeVarsRoot";
export * from "./ThemeVarsDiv";
export * from "./presets";

export function applyThemeOverrides() {
   Localization.override("cx/widgets/Window", {
      animate: true,
      destroyDelay: 200,
   });

   Localization.override("cx/widgets/MenuItem", {
      dropdownOptions: {
         pad: false,
      },
   });

   // Set all MsgBox buttons to flat-primary
   Localization.override("cx/widgets/MsgBox", {
      buttonMod: "flat-primary",
      footerDirection: "row-reverse",
      footerJustify: "start",
   });
}

applyThemeOverrides();

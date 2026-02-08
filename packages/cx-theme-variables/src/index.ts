import { Localization } from "cx/ui";
import { OverlayBase } from "cx/widgets";
import { configureOverlayContainer } from "./configureOverlayContainer";

export * from "./ThemeVariables";
export * from "./ThemeVarsRoot";
export * from "./ThemeVarsDiv";
export * from "./presets";

export function applyThemeOverrides() {
   OverlayBase.configureOverlayContainer = configureOverlayContainer;

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

   Localization.override("cx/widgets/ContextMenu", {
      arrow: true,
      offset: 5,
   });
}

applyThemeOverrides();

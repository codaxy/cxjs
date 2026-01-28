import { Localization } from "cx/ui";

export function applyThemeOverrides() {
   Localization.override("cx/widgets/Dropdown", {});

   Localization.override("cx/widgets/MenuItem", {
      dropdownOptions: {
         pad: true,
         arrow: true,
         offset: 2,
         elementExplode: 4,
      },
   });
}

applyThemeOverrides();

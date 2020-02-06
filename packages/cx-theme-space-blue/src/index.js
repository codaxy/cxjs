import {Localization} from 'cx/ui';

export function applyThemeOverrides() {
   Localization.override('cx/widgets/Dropdown', {
      arrow: true,
      offset: 5,
      elementExplode: 7
   });
   Localization.override('cx/widgets/MenuItem', {
      dropdownOptions: {
         pad: true
      }
   });
   // set all MsgBox buttons to hollow
   Localization.override('cx/widgets/MsgBox', {
      buttonMod: "hollow",
      footerDirection: "row-reverse",
      footerJustify: "start"
   });
}

applyThemeOverrides();

import {Localization} from 'cx/ui';

export function applyThemeOverrides() {

   Localization.override('cx/widgets/Dropdown', {
      arrow: false,
      offset: 0,
      elementExplode: 0
   });

   Localization.override('cx/widgets/Window', {
      animate: true,
      destroyDelay: 200
   });

   Localization.override('cx/widgets/MenuItem', {
      dropdownOptions: {
         pad: false
      }
   });

   // enable wrapper focus tracking so appropriate css class can be applied to it
   Localization.override('cx/widgets/Field', {
      trackFocus: true
   });

   // set all MsgBox buttons to flat-primary
   Localization.override('cx/widgets/MsgBox', {
      buttonMod: "flat-primary",
      footerDirection: "row-reverse",
      footerJustify: "start"
   });

   // show all borders on all grids
   Localization.override('cx/widgets/Grid', {
      showBorder: true
   });

   Localization.override('cx/widgets/LookupField', {
      dropdownOptions: {
         cover: true
      }
   });

   Localization.override('cx/widgets/DateTimeField', {
      dropdownOptions: {
         cover: true
      }
   });



   Localization.override('cx/widgets/ColorField', {
      dropdownOptions: {
         cover: true
      }
   });

   Localization.override('cx/widgets/MonthField', {
      dropdownOptions: {
         cover: true
      }
   });
}

applyThemeOverrides();
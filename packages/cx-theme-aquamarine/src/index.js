import {Localization} from 'cx/ui';
import {Icon} from 'cx/widgets';
import {VDOM} from 'cx/ui';

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


  //  // material icons added
  //  Icon.registerFactory((name, props) => {
  //     props = { ...props };
  //     props.className = `fa fa-${name} ${props.className || ''}`;
  //     return <i {...props} />
  // });
  //
  //  Icon.unregister('close');
  //  Icon.unregister('folder');
  //  Icon.unregister('forward');
  //  Icon.unregister('search');
  //
  //  Icon.register('calendar', props => Icon.render('calendar-o', props));
  //  Icon.register('drop-down', props => Icon.render('angle-down', props));
  //  Icon.register('folder-open', props => Icon.render('folder-open-o', props));
  //  Icon.register('folder', props => Icon.render('folder-o', props));
  //  Icon.register('file', props => Icon.render('file-o', props));
  //  Icon.register('forward', props => Icon.render('angle-double-right', props));
}

applyThemeOverrides();

// export function enableMaterialLabelPlacement() {
//    Localization.override('cx/widgets/Field', {
//       labelPlacement: "material"
//    });
//    Localization.override('cx/widgets/LabeledContainer', {
//       labelPlacement: "material"
//    });
// }
//
// export function enableMaterialHelpPlacement() {
//    Localization.override('cx/widgets/Field', {
//       helpPlacement: "material",
//       validationMode: "help"
//    });
// }
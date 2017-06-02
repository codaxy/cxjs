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


   // material icons added
   Icon.registerFactory((name, props) => {
      return VDOM.createElement('i', {
         ...props,
         className: 'material-icons ' + (props.className || '')
      }, name)
   });

   Icon.unregister('close');
   Icon.unregister('folder');

   Icon.register('calendar', props => Icon.render('date_range', props));
   Icon.register('drop-down', props => Icon.render('keyboard_arrow_down', props));
   Icon.register('sort-asc', props => Icon.render('arrow_upward', props));
   Icon.register('folder-open', props => Icon.render('folder_open', props));
   Icon.register('file', props => Icon.render('insert_drive_file', props));

   Icon.register('forward', props => {
      return <svg
         {...props}
         viewBox="0 0 24 24">
         <path fill="currentColor"
               strokeWidth="0"
               stroke="currentColor"
               d="M11.59 16.34l4.58-4.59-4.58-4.59L13 5.75l6 6-6 6z"/>

         <path fill="currentColor"
               strokeWidth="0"
               stroke="currentColor"
               d="M4.59 16.34l4.58-4.59-4.58-4.59L6 5.75l6 6-6 6z"/>
      </svg>
   });
}

applyThemeOverrides();

export function enableMaterialLabelPlacement() {
   Localization.override('cx/widgets/Field', {
      labelPlacement: "material"
   });
   Localization.override('cx/widgets/LabeledContainer', {
      labelPlacement: "material"
   });
}

export function enableMaterialHelpPlacement() {
   Localization.override('cx/widgets/Field', {
      helpPlacement: "material",
      validationMode: "help"
   });
}
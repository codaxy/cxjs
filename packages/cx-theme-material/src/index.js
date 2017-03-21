import {Localization} from 'cx/ui';
import {Icon} from 'cx/widgets';
import {VDOM} from 'cx/ui';

Localization.override('cx/widgets/Dropdown', {
   arrow: false,
   offset: 0,
   elementExplode: 0
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

// set buttonMmod to MsgBox buttons
Localization.override('cx/widgets/MsgBox', {
   buttonMod: "flat-primary",
   footerDirection: "row-reverse",
   footerJustify: "start"
});

Icon.registerFactory((name, props) => {
   props = { ...props };
   props.className = 'material-icons ' + (props.className || '');
   return <i {...props}>{name}</i>;
});

Icon.unregister('close');
Icon.unregister('folder');

Icon.register('calendar', props => Icon.render('date_range', props));
Icon.register('drop-down', props => Icon.render('keyboard_arrow_down', props));
Icon.register('sort-asc', props => Icon.render('arrow_upward', props));
Icon.register('folder-open', props => Icon.render('folder_open', props));
Icon.register('file', props => Icon.render('insert_drive_file', props));
Icon.register('forward', props => Icon.render('arrow_forward', props));

Icon.register('forward', props => {
  props = { ...props };
  props.className = 'material-icons ' + (props.className || '');
  return <span style={{ display: 'inline-block' }}>
     <i {...props} style={{ transform: 'translate(3px, 12px) rotate(180deg)' }} >navigate_next</i>
     <i {...props} style={{ transform: 'translate(-3px, -12px) rotate(180deg)' }}>navigate_next</i>
  </span>;
});

//Icon.register('forward', props => {
//  props = { ...props };
//  props.className = 'material-icons ' + (props.className || '');
//  return <span style={{ display: 'inline-block', position: 'relative' }}>
//     <i {...props} style={{ position: 'absolute', top: '-6px', right: '3px'}} >navigate_next</i>
//     <i {...props} style={{ position: 'absolute', bottom: '-6px', left: '3px' }}>navigate_next</i>
//  </span>;
//});

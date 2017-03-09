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
      pad: true
   }
});

// enable wrapper focus tracking so appropriate css class can be applied to it
Localization.override('cx/widgets/Field', {
   trackFocus: true
});

// set buttonMmod to MsgBox buttons
Localization.override('cx/widgets/MsgBox', {
   buttonMod: "flat-color",
   footerDirection: "row-reverse",
   footerJustify: "start"
});

Icon.registerFactory((name, props) => {
   props = { ...props };
   props.className = 'material-icons ' + (props.className || '');
   return <i {...props}>{name}</i>;
});

Icon.register('calendar', props => Icon.render('date_range', props));
//Icon.register('clear', props => Icon.render('close', props));
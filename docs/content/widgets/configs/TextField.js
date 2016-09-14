import {Md} from '../../../components/Md';
import field from './Field';

export default {
   ...field,
   value: {
      key: true,
      type: 'string',
      description: <cx><Md>
         Textual value of the input.
      </Md></cx>
   },
   reactOn: {
      key: true,
      type: 'string',
      description: <cx><Md>
         Event used to report a new value. Defaults to `input`, which means that entered value will be written to the store on each keystroke.
         Other permitted values are `enter` (Enter key pressed) and `blur` (field looses focus). Multiple values should be separated by space,
         e.g. `enter blur`.
      </Md></cx>
   },
   inputType: {
      key: true,
      type: 'string/array',
      description: <cx><Md>
         Defaults to `text`. Other permitted value is `password`.
      </Md></cx>
   },
   baseClass: {
      type: 'string',
      description: <cx><Md>
         Base CSS class to be applied on the field. Defaults to `textfield`.
      </Md></cx>
   },
   validationRegExp: {
      type: 'RegExp',
      description: <cx><Md>
         Regular expression used to validate the user's input.
      </Md></cx>
   },
   validationErrorText: {
      type: 'RegExp',
      description: <cx><Md>
         Message to be shown to the user if validation fails.
      </Md></cx>
   }
};
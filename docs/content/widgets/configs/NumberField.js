import {Md} from '../../../components/Md';
import field from './Field';

export default {
   ...field,
   format: {
      key: true,
      type: 'string',
      description: <cx><Md>
         Template used to format the value. Examples: percentage - `p;`; two decimals - `n;2`.
         By default, no formatting is applied.
      </Md></cx>
   },
   value: {
      key: true,
      type: 'string',
      description: <cx><Md>
         Textual value of the input.
      </Md></cx>
   },
   reactOn: {
      type: 'string',
      description: <cx><Md>
         Defaults to `input`. Other permitted values are `enter` and `blur`. Multiple values should be separated by space,
         .e.g. 'enter blur'.
      </Md></cx>
   },
   baseClass: {
      type: 'string',
      description: <cx><Md>
         Base CSS class to be applied on the field. Defaults to `numberfield`.
      </Md></cx>
   },
};
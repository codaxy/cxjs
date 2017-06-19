import {Md} from '../../../components/Md';
import widget from './Widget';

export default {
   ...widget,
   layout: {
      type: 'string/object',
      description: <cx><Md>
         Define an [inner layout](~/concepts/inner-layouts).
      </Md></cx>
   },
   trimWhitespace: {
      type: 'boolean',
      description: <cx><Md>
         Remove all whitespace in text based children. Default is `true`. See also `preserveWhitespace`.
      </Md></cx>
   },
   preserveWhitespace: {
      type: 'boolean',
      alias: 'ws',
      description: <cx><Md>
         Keep whitespace in text based children. Default is `false`. See also `trimWhitespace`.
      </Md></cx>
   },
   plainText: {
      type: 'boolean',
      description: <cx><Md>
         Set to `true` to avoid converting inner strings to templates. Default `false`.
      </Md></cx>
   },
   items: {
      type: 'array',
      alias: 'children',
      description: <cx><Md>
         List of child elements.
      </Md></cx>
   }
};

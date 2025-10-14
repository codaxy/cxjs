import {BoundedObject, BoundedObjectProps} from './BoundedObject';
import {Text} from './Text';
import {innerTextTrim} from '../util/innerTextTrim';

// no new props, but exporting for easier inheritance
export interface TextualBoundedObjectProps extends BoundedObjectProps {}

export class TextualBoundedObject extends BoundedObject {
   add(widget) {
      if (typeof widget != 'string')
         return super.add(...arguments);

      if (this.trimWhitespace)
         widget = innerTextTrim(widget);

      if (!widget)
         return;

      return this.add({
         type: Text,
         value: widget,
         textAnchor: 'middle',
         dy: '0.4em'
      });
   }
}






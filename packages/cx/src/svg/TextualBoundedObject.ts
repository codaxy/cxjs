import {BoundedObject, BoundedObjectConfig} from './BoundedObject';
import {Text} from './Text';
import {innerTextTrim} from '../util/innerTextTrim';

// no new props, but exporting for easier inheritance
export interface TextualBoundedObjectConfig extends BoundedObjectConfig {}

export class TextualBoundedObject extends BoundedObject {
   constructor(config?: TextualBoundedObjectConfig) {
      super(config);
   }

   add(widget: any): any {
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






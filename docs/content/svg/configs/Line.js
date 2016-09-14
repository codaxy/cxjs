import {Md} from 'docs/components/Md';

import boundedObject from './BoundedObject';

export default {
   ...boundedObject,
   stroke: {
      key: true,
      type: 'string',
      description: <cx><Md>
         A color used to paint the outline of the box.
      </Md></cx>
   },
   colorIndex: {
      key: false,
      type: 'number',
      description: <cx><Md>
         Index of the color in the default color palette. Setting this property will set both fill and stroke on the
         object.
         Use `style` or CSS class to remove stroke or fill if they are not necessary.
      </Md></cx>
   }
};

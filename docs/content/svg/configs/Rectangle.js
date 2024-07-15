import {Md} from 'docs/components/Md';

import boundedObject from './BoundedObject';

export default {
   ...boundedObject,
   fill: {
      key: true,
      type: 'string',
      description: <cx><Md>
         A color used to paint the box.
      </Md></cx>
   },
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
   },
   rx: {
      key: true,
      type: 'string/number',
      description: <cx><Md>
         The horizontal corner radius of the rect. Defaults to `ry` if `ry` is specified.
      </Md></cx>
   },
   ry: {
      key: true,
      type: 'string/number',
      description: <cx><Md>
         The vertical corner radius of the rect. Defaults to `rx` if `rx` is specified.
      </Md></cx>
   },
};

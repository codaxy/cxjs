import {Md} from 'docs/components/Md';

import boundedObject from './BoundedObject';

export default {
   ...boundedObject,
   text: {
      key: true,
      type: 'string',
      description: <cx><Md>
         Text to be displayed.
      </Md></cx>
   },
   textAnchor: {
      key: true,
      alias: 'ta',
      type: 'string',
      description: <cx><Md>
         Used to horizontally align the text. One of `start`, `middle` or `end`.
      </Md></cx>
   },
   dx: {
      type: 'string',
      description: <cx><Md>
         Offset along the x-axis.
      </Md></cx>
   },
   dy: {
      key: true,
      type: 'string',
      description: <cx><Md>
         Offset along the y-axis. This property is commonly used to vertically align the text.
         Set `dy="0.8em"` to align with the top edge and `dy="0.4em"` to vertically center the text.
      </Md></cx>
   },

   fill: {
      key: true,
      type: 'string',
      description: <cx><Md>
         A color used to paint the text.
      </Md></cx>
   },

   stroke: {
      key: false,
      type: 'string',
      description: <cx><Md>
         A color used to paint the outline of the text.
      </Md></cx>
   }
};

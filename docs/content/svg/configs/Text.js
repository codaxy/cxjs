import {Md} from 'docs/components/Md';

import boundedObject from './BoundedObject';

export default {
   ...boundedObject,
   value: {
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
         Used for horizontal text alignment. Accepted values are `start`, `middle` and `end`.
      </Md></cx>
   },
   dx: {
      key: true,
      type: 'string',
      description: <cx><Md>
         Offset along the x-axis.
      </Md></cx>
   },
   dy: {
      key: true,
      type: 'string',
      description: <cx><Md>
         Offset along the y-axis. This property is commonly used for vertical text alignment.
         Set `dy="0.8em"` to align the text with the top and `dy="0.4em"` to center it vertically.
      </Md></cx>
   },

   fill: {
      key: true,
      type: 'string',
      description: <cx><Md>
         Sets text-body color.
      </Md></cx>
   },

   stroke: {
      key: false,
      type: 'string',
      description: <cx><Md>
         Sets text-outline color.
      </Md></cx>
   },

   autoTextAnchor: {
        key: false,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` for the text to set the text anchor based on the direction of the parent element. See PieLabels example.
        </Md></cx>
    }
};

import {Md} from 'docs/components/Md';

import classAndStyle from '../../widgets/configs/classAndStyle';
import legendary from './legendary';
import stackable from './stackable';
import xyAxis from './xyAxis';

export default {
   ...classAndStyle,
   ...legendary,
   ...stackable,
   ...xyAxis,

   data: {
      key: true,
      type: 'array',
      description: <cx><Md>
         Data for the graph. Each entry should be an object with at least two properties whose names should match the `xField` and `yField` values.
      </Md></cx>
   },

   xField: {
      key: true,
      type: 'string',
      description: <cx><Md>
         Name of the property which holds the x value. Default value is `x`.
      </Md></cx>
   },

   yField: {
      key: true,
      type: 'string',
      description: <cx><Md>
         Name of the property which holds the y value. Default value is `y`.
      </Md></cx>
   },

   size: {
      key: true,
      type: 'number',
      description: <cx><Md>
         Size (width) of the column in axis units.
      </Md></cx>
   },

   offset: {
      key: true,
      type: 'number',
      description: <cx><Md>
         Of center offset of the column. Use this in combination with `size` to align multiple series on the same chart.
      </Md></cx>
   },

   autoSize: {
      key: true,
      type: 'boolean',
      description: <cx><Md>
         Set to true to auto calculate size and offset. Available only if the x axis is a category axis.
      </Md></cx>
   }
};

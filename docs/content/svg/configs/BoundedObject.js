import {Md} from 'docs/components/Md';

import container from '../../widgets/configs/PureContainer';
import classAndStyle from '../../widgets/configs/classAndStyle';

export default {
   ...container,
   ...classAndStyle,

   anchors: {
      type: 'string/number/rect',
      description: <cx><Md>
         Anchor defines how child bounds are tied to the parent. Zero aligns with the top/left edge. One aligns with the bottom/right edge.
         See [Svg](~/svg/svgs) for more information.
      </Md></cx>
   },
   offset: {
      type: 'string/number/rect',
      description: <cx><Md>
         Move boundaries specified by the offset. See [Svg](~/svg/svgs) for more information.
      </Md></cx>
   },
   margin: {
      type: 'string/number/rect',
      description: <cx><Md>
         Apply margin to the given boundaries. See [Svg](~/svg/svgs) for more information.
      </Md></cx>
   },
   padding: {
      type: 'string/number/rect',
      description: <cx><Md>
         Padding to be applied to the boundaries rectangle before passing to the children.
      </Md></cx>
   },
   layout: false
};

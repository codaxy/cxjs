import * as Cx from '../core';
import {PureContainer} from '../ui/PureContainer';

export interface BoundedObjectProps extends Cx.StyledContainerProps {
   anchors?: Cx.NumberProp,
   offset?: Cx.NumberProp,
   margin?: Cx.NumberProp,
   padding?: Cx.NumberProp,
   offset?: number,
   pure?: boolean
}

export class BoundedObject extends Cx.Widget<BoundedObjectProps> {}
import * as Cx from '../../core';
import {IDragSource} from './ops';

interface DragSourceProps extends IDragSource, Cx.StyledContainerProps {
   baseClass?: string,
}

export class DragSource extends Cx.Widget<DragSourceProps> {}

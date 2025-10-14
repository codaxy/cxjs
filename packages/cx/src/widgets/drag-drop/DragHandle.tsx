/** @jsxImportSource react */
import { Widget, VDOM } from '../../ui/Widget';
import { Container } from '../../ui/Container';
import { ddHandle } from '../drag-drop/ops';
import { isArray } from '../../util/isArray';
import { RenderingContext } from '../../ui/RenderingContext';
import { Instance } from '../../ui/Instance';
import * as Cx from '../../core';

export interface DragHandleProps extends Cx.StyledContainerProps {
   /** Base CSS class to be applied to the element. Defaults to 'draghandle'. */
   baseClass?: string;
}

export class DragHandle extends Container {
   explore(context: RenderingContext, instance: Instance) {
      if (isArray(context.dragHandles)) context.dragHandles.push(instance);
      super.explore(context, instance);
   }

   render(context: RenderingContext, instance: Instance, key: string) {
      const { data } = instance;
      return (
         <div
            key={key}
            className={data.classNames}
            style={data.style}
            onTouchStart={ddHandle}
            onMouseDown={ddHandle}
            onTouchMove={ddHandle}
            onMouseMove={ddHandle}
            onTouchEnd={ddHandle}
            onMouseUp={ddHandle}
         >
            {this.renderChildren(context, instance)}
         </div>
      );
   }
}

DragHandle.prototype.styled = true;
DragHandle.prototype.baseClass = 'draghandle';

Widget.alias('draghandle', DragHandle);

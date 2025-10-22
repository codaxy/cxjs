/** @jsxImportSource react */
import { BoundedObject, BoundedObjectProps } from './BoundedObject';
import { RenderingContext } from '../ui/RenderingContext';
import { Instance } from '../ui/Instance';

export interface ClipRectProps extends BoundedObjectProps {}

export class ClipRect extends BoundedObject {
   prepareBounds(context: RenderingContext, instance: Instance) {
      super.prepareBounds(context, instance);
      const { data } = instance;
      data.clipId = context.addClipRect(data.bounds);
   }

   render(context: RenderingContext, instance: Instance, key: string) {
      const { data } = instance;
      return (
         <g key={key} clipPath={`url(#${data.clipId})`}>
            {this.renderChildren(context, instance)}
         </g>
      );
   }
}

ClipRect.prototype.anchors = '0 1 1 0';



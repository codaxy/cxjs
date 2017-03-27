import {Widget, VDOM} from '../ui/Widget';
import {BoundedObject} from './BoundedObject';
import {Rect} from './util/Rect';

export class ClipRect extends BoundedObject {

   prepareBounds(context, instance) {
      super.prepareBounds(context, instance);
      var {data} = instance;
      data.clipId = context.addClipRect(data.bounds);
   }

   render(context, instance, key) {
      var {data} = instance;
      return <g key={key} clipPath={`url(#${data.clipId})`}>
         {this.renderChildren(context, instance)}
      </g>
   }
}

ClipRect.prototype.anchors = '0 1 1 0';



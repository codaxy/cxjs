import { Widget, VDOM } from '../../ui/Widget';
import { PureContainer } from '../../ui/PureContainer';
import { DragDropManager } from './DragDropManager';

export class DropZone extends PureContainer {
   render(context, instance, key) {
      return <DropZoneComponent key={key} instance={instance}>
         {this.renderChildren(context, instance)}
      </DropZoneComponent>
   }
}

DropZone.prototype.styled = true;
DropZone.prototype.nearDistance = false;
DropZone.prototype.baseClass = 'dropzone';

class DropZoneComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {};
   }

   render() {
      let {instance, children} = this.props;
      let {data, widget} = instance;
      let {CSS} = widget;

      return (
         <div
            className={CSS.expand(data.classNames, CSS.state(this.state.state))}
            style={data.style}
            ref={el=>{this.el = el;}}
         >
            {children}
         </div>
      )
   }

   componentDidMount() {
      this.unregister = DragDropManager.registerDropZone(this);
   }

   componentWillUnmount() {
      this.unregister();
   }

   onDragStart(e) {
      this.setState({
         state: 'far'
      });
   }

   onDragNear(e) {
      this.setState({
         state: 'near'
      });
   }

   onDragAway(e) {
      this.setState({
         state: 'far'
      })
   }

   onDragLeave(e) {
      let {nearDistance} = this.props.instance.widget;
      this.setState({
         state: nearDistance ? 'near' : 'far'
      })
   }

   onDragTest(e) {
      let rect = this.el.getBoundingClientRect();
      let { nearDistance } = this.props.instance.widget;

      let xOverlap = getOverlapSize(rect.left, rect.right, e.itemBounds.left, e.itemBounds.right);
      let yOverlap = getOverlapSize(rect.top, rect.bottom, e.itemBounds.top, e.itemBounds.bottom);

      if (xOverlap > 0 && yOverlap > 0)
         return {
            over: xOverlap * yOverlap,
            near: !!nearDistance
         };

      if (!nearDistance)
         return false;

      let cx = (rect.left + rect.right) / 2;
      let cy = (rect.top + rect.bottom) / 2;
      let d = Math.sqrt(Math.pow(e.cursor.clientX - cx, 2) + Math.pow(e.cursor.clientY - cy, 2));
      if (d > nearDistance)
         return false;

      return { near:  -d }
   }

   onDragOver(e) {
      this.setState({
         state: 'over'
      });
   }

   onDragDrop(e) {
      let {instance} = this.props;
      let {widget} = instance;

      if (this.state.state == 'over' && typeof widget.onDragDrop == 'function') {
         widget.onDragDrop(e, instance);
      }
   }

   onDragEnd(e) {
      this.setState({
         state: false
      });
   }
}

function getOverlapSize(a1, a2, b1, b2) {
   return Math.max(0, Math.min(a2, b2) - Math.max(a1, b1));
}

function getRectOverlapArea(r2, r1) {
   let xd = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left));
   let yd = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));
   return xd * yd;
}

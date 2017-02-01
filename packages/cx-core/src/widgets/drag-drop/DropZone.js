import { Widget, VDOM } from '../../ui/Widget';
import { PureContainer } from '../../ui/PureContainer';
import { getRangeOverlap } from '../../util/getRangeOverlap';
import { registerDropZone } from './DragDropManager';

export class DropZone extends PureContainer {

   declareData() {
      return super.declareData(...arguments, {
         overClass: {structured: true}
      })
   }

   render(context, instance, key) {
      return <DropZoneComponent key={key} instance={instance}>
         {this.renderChildren(context, instance)}
      </DropZoneComponent>
   }
}

DropZone.prototype.styled = true;
DropZone.prototype.nearDistance = false;
DropZone.prototype.inflate = 0;
DropZone.prototype.baseClass = 'dropzone';

Widget.alias('dropzone', DropZone);

class DropZoneComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {};
   }

   render() {
      let {instance, children} = this.props;
      let {data, widget} = instance;
      let {CSS} = widget;

      let classes = [
         data.classNames,
         CSS.state(this.state.state)
      ];

      if (this.state.state == 'over')
         classes.push(data.overClass);

      return (
         <div
            className={CSS.expand(classes)}
            style={{...data.style, ...this.state.style}}
            ref={el=>{this.el = el;}}
         >
            {children}
         </div>
      )
   }

   componentDidMount() {
      this.unregister = registerDropZone(this);
   }

   componentWillUnmount() {
      this.unregister();
   }

   onDragTest(e) {
      let {widget} = this.props.instance;
      return !widget.onDragTest || widget.onDragTest(e);
   }

   onDragStart(e) {
      this.initialWidth = this.el.offsetWidth;
      this.initialHeight = this.el.offsetHeight;
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
         state: nearDistance ? 'near' : 'far',
         style: null
      })
   }

   onDragMeasure(e) {
      let r = this.el.getBoundingClientRect();
      let rect = {
         left: r.left,
         right: r.right,
         top: r.top,
         bottom: r.bottom
      };

      let {instance} = this.props;
      let {widget} = instance;

      if (widget.inflate > 0) {
         rect.left -= widget.inflate;
         rect.top -= widget.inflate;
         rect.bottom += widget.inflate;
         rect.right += widget.inflate;
      }

      let { nearDistance } = this.props.instance.widget;

      let maxXOverlap = this.initialWidth + 2 * widget.inflate;
      let maxYOverlap = this.initialHeight + 2 * widget.inflate;

      let xOverlap = Math.min(getRangeOverlap(rect.left, rect.right, e.itemBounds.left, e.itemBounds.right), maxXOverlap);
      let yOverlap = Math.min(getRangeOverlap(rect.top, rect.bottom, e.itemBounds.top, e.itemBounds.bottom), maxYOverlap);

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

      let {instance} = this.props;
      let {widget} = instance;
      let style = {};

      if (widget.matchWidth)
         style.width = `${e.source.width}px`;

      if (widget.matchHeight)
         style.height = `${e.source.height}px`;

      if (widget.matchMargin)
         style.margin = e.source.margin.join(' ');

      this.setState({
         state: 'over',
         style
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
         state: false,
         style: null
      });
   }
}

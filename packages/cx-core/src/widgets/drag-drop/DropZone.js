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
      this.setState({
         state: 'near'
      })
   }

   onDragTest(e) {
      let rect = this.el.getBoundingClientRect();
      let cx = (rect.left + rect.right) / 2;
      let cy = (rect.top + rect.bottom) / 2;
      let d = Math.sqrt(Math.pow(e.cursor.clientX - cx, 2) + Math.pow(e.cursor.clientY - cy, 2));
      if (d > 200)
         return false;
      return [d < 100 ? 'over' : 'near', -d];
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

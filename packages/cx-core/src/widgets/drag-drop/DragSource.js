import { Widget, VDOM } from '../../ui/Widget';
import { PureContainer } from '../../ui/PureContainer';
import { captureMouseOrTouch, getCursorPos } from '../overlay/captureMouse';
import { DragDropManager } from './DragDropManager';

export class DragSource extends PureContainer {

   declareData() {
      super.declareData(...arguments, {
         data: { structured: true }
      })
   }

   explore(context, instance) {
      let dragHandles = context.dragHandles;
      context.dragHandles = [];
      super.explore(context, instance);
      instance.dragHandles = context.dragHandles;
      context.dragHandles = dragHandles;
   }

   render(context, instance, key) {
      return <DragSourceComponent key={key} instance={instance}>
         {this.renderChildren(context, instance)}
      </DragSourceComponent>
   }
}

DragSource.prototype.styled = true;
DragSource.prototype.baseClass = 'dragsource';
DragSource.prototype.hideOnDrag = false;
DragSource.prototype.handled = false;

class DragSourceComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {dragged: false};
      this.onDragStart = ::this.onDragStart;
      this.onMouseDown = ::this.onMouseDown;
      this.onMouseUp = ::this.onMouseUp;
      this.onMouseMove = ::this.onMouseMove;
   }

   shouldComponentUpdate(nextProps, nextState) {
      return nextProps.instance.shouldUpdate || nextState != this.state;
   }

   render() {
      let {instance, children} = this.props;
      let {data, widget} = instance;
      let {CSS} = widget;

      //console.log('DS:Render', this.state.dragged, data.data);

      if (this.state.dragged && widget.hideOnDrag)
         return null;

      let down = !widget.handled ? this.onMouseDown : null;
      let move = !widget.handled ? this.onMouseMove : null;
      let up = !widget.handled ? this.onMouseUp : null;

      let classes = [
         data.classNames,
         CSS.state({
            dragged: this.state.dragged
         })
      ];

      return (
         <div
            className={CSS.expand(classes)}
            style={data.style}
            onTouchStart={down}
            onMouseDown={down}
            onTouchMove={move}
            onMouseMove={move}
            onTouchEnd={up}
            onMouseUp={up}
            ref={el => {
               this.el = el
            }}
         >
            {children}
         </div>
      )
   }

   componentDidMount() {
      this.componentDidUpdate();
   }

   componentDidUpdate() {
      let {instance} = this.props;
      instance.dragHandles.forEach(h => {
         h.beginDragDropSequence = this.onDragStart;
      });
   }

   onMouseDown(e) {
      this.start = { ...getCursorPos(e) };
      e.preventDefault();
   }

   onMouseUp() {
      delete this.start;
   }

   onMouseMove(e) {
      let cursor = getCursorPos(e);
      if (this.start && Math.abs(cursor.clientX - this.start.clientX) + Math.abs(cursor.clientY - this.start.clientY) >= 2)
         this.onDragStart(e);
   }

   onDragStart(e) {
      let captureData = {};
      captureMouseOrTouch(e, ::this.onDragMove, ::this.onDragEnd, captureData);

      let {instance} = this.props;
      let {widget, store, data} = instance;
      DragDropManager.notifyDragStart(e, {
         sourceEl: this.el,
         source: {
            widget,
            store,
            data: data.data
         }
      });
      this.setState({
         dragged: true
      })
   }

   onDragMove(e) {
      DragDropManager.notifyDragMove(e);
   }

   onDragEnd(e) {
      delete this.start;
      this.setState({
         dragged: false
      });
      DragDropManager.notifyDragDrop(e);
   }
}


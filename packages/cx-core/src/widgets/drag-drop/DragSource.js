import { Widget, VDOM } from '../../ui/Widget';
import { PureContainer } from '../../ui/PureContainer';
import { ddMouseDown, ddDetect, ddMouseUp, initiateDragDrop, isDragHandleEvent } from './ops';

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
      return <DragSourceComponent key={key} instance={instance} handled={this.handled || instance.dragHandles.length > 0}>
         {this.renderChildren(context, instance)}
      </DragSourceComponent>
   }
}

DragSource.prototype.styled = true;
DragSource.prototype.baseClass = 'dragsource';
DragSource.prototype.hideOnDrag = false;
DragSource.prototype.handled = false;

Widget.alias('dragsource', DragSource);

class DragSourceComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {dragged: false};

      this.beginDragDrop = ::this.beginDragDrop;
      this.onMouseMove = ::this.onMouseMove;
      this.onMouseDown = ::this.onMouseDown;
      this.setRef = el => {
         this.el = el
      };
   }

   shouldComponentUpdate(nextProps, nextState) {
      return nextProps.instance.shouldUpdate || nextState != this.state;
   }

   render() {
      let {instance, children, handled} = this.props;
      let {data, widget} = instance;
      let {CSS} = widget;

      if (this.state.dragged && widget.hideOnDrag)
         return null;

      let classes = [
         data.classNames,
         CSS.state({
            dragged: this.state.dragged,
            draggable: !handled
         })
      ];

      return (
         <div
            className={CSS.expand(classes)}
            style={data.style}
            onTouchStart={this.onMouseDown}
            onMouseDown={this.onMouseDown}
            onTouchMove={this.onMouseMove}
            onMouseMove={this.onMouseMove}
            onTouchEnd={ddMouseUp}
            onMouseUp={ddMouseUp}
            ref={this.setRef}
         >
            {children}
         </div>
      )
   }

   onMouseDown(e) {
      ddMouseDown(e);
      if (isDragHandleEvent(e) || !this.props.handled)
         e.preventDefault();
   }

   onMouseMove(e) {
      if (ddDetect(e)) {
         if (isDragHandleEvent(e) || !this.props.handled) {
            this.beginDragDrop(e);
         }
      }
   }

   beginDragDrop(e) {
      let {instance} = this.props;
      let {data, widget, store} = instance;

      initiateDragDrop(e, {
         sourceEl: this.el,
         source: {
            store: store,
            data: data.data
         },
         clone: {
            widget,
            store
         }
      }, () => {
         this.setState({
            dragged: false
         })
      });

      this.setState({
         dragged: true
      })
   }
}


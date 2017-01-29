import { Widget, VDOM } from '../../ui/Widget';
import { PureContainer } from '../../ui/PureContainer';
import { captureMouseOrTouch, getCursorPos } from '../overlay/captureMouse';
import { DragDropManager } from './DragDropManager';

export class DragSource extends PureContainer {

   declareData() {
      super.declareData(...arguments, {
         data: {structured: true}
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
      this.boundMouseDown = ::this.onMouseDown;
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

      let handler = !widget.handled ? this.boundMouseDown : null;

      return (
         <div
            className={CSS.expand(data.classNames, CSS.state({
               dragged: this.state.dragged
            }))}
            style={data.style}
            onTouchStart={handler}
            onMouseDown={handler}
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
         h.beginDragDropSequence = this.boundMouseDown;
      });
   }

   onMouseDown(e) {
      let captureData = {};
      captureMouseOrTouch(e, ::this.onDragMove, ::this.onDragEnd, captureData);
      this.onDragStart(e, captureData)
   }

   onDragStart(e) {
      let {instance} = this.props;
      let {widget, store, data} = instance;
      DragDropManager.notifyDragStart(e, {
         source: {
            widget,
            store,
            data: data.data
         },
         puppetMargin: widget.puppetMargin
      });
      this.setState({
         dragged: true
      })
   }

   onDragMove(e) {
      DragDropManager.notifyDragMove(e);
   }

   onDragEnd(e) {
      this.setState({
         dragged: false
      });
      DragDropManager.notifyDragDrop(e);
   }
}


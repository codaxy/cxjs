import { Widget, VDOM } from '../../ui/Widget';
import { PureContainer } from '../../ui/PureContainer';
import { getCursorPos } from '../overlay/captureMouse';

export class DragHandle extends PureContainer {

   explore(context, instance) {
      if (Array.isArray(context.dragHandles))
         context.dragHandles.push(instance);
      super.explore(context, instance);
   }

   render(context, instance, key) {
      return <DragHandleComponent key={key} instance={instance}>
         {this.renderChildren(context, instance)}
      </DragHandleComponent>
   }
}

DragHandle.prototype.styled = true;

class DragHandleComponent extends VDOM.Component {

   constructor(props) {
      super(props);

      this.onMouseDown = ::this.onMouseDown;
      this.onMouseUp = ::this.onMouseUp;
      this.onMouseMove = ::this.onMouseMove;
   }

   shouldComponentUpdate(nextProps, nextState) {
      return nextProps.instance.shouldUpdate || nextState != this.state;
   }

   render() {
      let {instance, children} = this.props;
      let {data} = instance;

      return (
         <div
            className={data.classNames}
            style={data.style}
            onTouchStart={this.onMouseDown}
            onMouseDown={this.onMouseDown}
            onTouchMove={this.onMouseMove}
            onMouseMove={this.onMouseMove}
            onTouchEnd={this.onMouseUp}
            onMouseUp={this.onMouseUp}
         >
            {children}
         </div>
      )
   }

   onMouseDown(e) {
      this.start = { ...getCursorPos(e) };
      e.preventDefault();
   }

   onMouseUp() {
      delete this.start;
   }

   onMouseMove(e) {
      let {instance} = this.props;
      let cursor = getCursorPos(e);
      if (this.start && Math.abs(cursor.clientX - this.start.clientX) + Math.abs(cursor.clientY - this.start.clientY) >= 2)
         if (instance.beginDragDropSequence)
            instance.beginDragDropSequence(e)
   }
}
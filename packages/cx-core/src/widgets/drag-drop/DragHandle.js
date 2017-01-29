import { Widget, VDOM } from '../../ui/Widget';
import { PureContainer } from '../../ui/PureContainer';

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
            onTouchStart={::this.onMouseDown}
            onMouseDown={::this.onMouseDown}
         >
            {children}
         </div>
      )
   }

   onMouseDown(e) {
      let {instance} = this.props;
      if (instance.beginDragDropSequence)
         instance.beginDragDropSequence(e)
   }
}
import { Widget, VDOM } from '../../ui/Widget';
import { PureContainer } from '../../ui/PureContainer';
import { captureMouseOrTouch, getCursorPos } from '../overlay/captureMouse';
import { DragDropManager } from './DragDropManager';

export class DragSource extends PureContainer {

   render(context, instance, key) {
      return <DragSourceComponent key={key} instance={instance}>
         {this.renderChildren(context, instance)}
      </DragSourceComponent>
   }
}

DragSource.prototype.styled = true;
DragSource.prototype.baseClass = 'dragsource';

class DragSourceComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {dragged: false}
   }

   render() {
      let {instance, children} = this.props;
      let {data, widget} = instance;
      let {CSS} = widget;

      return (
         <div
            className={CSS.expand(data.classNames, CSS.state({
               dragged: this.state.dragged
            }))}
            style={data.style}
            onMouseDown={::this.onMouseDown}
            ref={el => {
               this.el = el
            }}
         >
            {children}
         </div>
      )
   }

   onMouseDown(e) {
      let captureData = {};
      captureMouseOrTouch(e, ::this.onDragMove, ::this.onDragEnd, captureData);
      this.onDragStart(e, captureData)
   }

   onDragStart(e, captureData) {
      DragDropManager.notifyDragStart(e, {});
      this.setState({
         dragged: true
      })
   }

   onDragMove(e, captureData) {
      DragDropManager.notifyDragMove(e);
   }

   onDragEnd(e, captureData) {
      DragDropManager.notifyDragDrop(e);
      this.setState({
         dragged: false
      })
   }
}


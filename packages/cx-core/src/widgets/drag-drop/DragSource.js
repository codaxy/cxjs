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

   render(context, instance, key) {
      return <DragSourceComponent key={key} instance={instance}>
         {this.renderChildren(context, instance)}
      </DragSourceComponent>
   }
}

DragSource.prototype.styled = true;
DragSource.prototype.baseClass = 'dragsource';
DragSource.prototype.hideOnDrag = false;

class DragSourceComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {dragged: false}
   }

   shouldComponentUpdate(nextProps, nextState) {
      return nextProps.instance.shouldUpdate || nextState != this.state;
   }

   render() {
      let {instance, children} = this.props;
      let {data, widget} = instance;
      let {CSS} = widget;

      console.log('DS:Render', this.state.dragged, data.data);

      if (this.state.dragged && widget.hideOnDrag)
         return null;

      return (
         <div
            className={CSS.expand(data.classNames, CSS.state({
               dragged: this.state.dragged
            }))}
            style={data.style}
            onTouchStart={::this.onMouseDown}
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
      DragDropManager.notifyDragDrop(e);

      this.setState({
         dragged: false
      });
   }
}


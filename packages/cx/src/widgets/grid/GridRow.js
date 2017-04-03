import {PureContainer} from '../../ui/PureContainer';
import {VDOM} from '../../ui/Widget';
import {
   ddMouseDown,
   ddMouseUp,
   ddDetect,
   isDragHandleEvent
} from '../drag-drop/ops';
import {isTouchEvent} from '../../util/isTouchEvent';
import {preventMouseFocusOnTouch} from '../../ui/FocusManager';

export class GridRow extends PureContainer {
   render(context, instance, key) {
      return <tr key={key}>
         {this.renderChildren(context, instance)}
      </tr>
   }
}

GridRow.prototype.styled = true;

export class GridRowComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.onMouseMove = ::this.onMouseMove;
      this.onMouseDown = ::this.onMouseDown;
      this.onClick = ::this.onClick;

      if (props.grid.widget.onRowDoubleClick)
         this.onDoubleClick = e => {
            this.props.grid.widget.onRowDoubleClick(e, this.props.instance);
         }
   }

   render() {

      let {className, dragSource, instance, onMouseEnter} = this.props;
      let {data} = instance;
      let move, up;

      if (dragSource) {
         move = this.onMouseMove;
         up = ddMouseUp;
      }

      return (
         <tbody
            className={className}
            style={data.style}
            onClick={this.onClick}
            onDoubleClick={this.onDoubleClick}
            onMouseEnter={onMouseEnter}
            onTouchStart={this.onMouseDown}
            onMouseDown={this.onMouseDown}
            onTouchMove={move}
            onMouseMove={move}
            onTouchEnd={up}
            onMouseUp={up}
         >
            {this.props.children}
         </tbody>
      )
   }

   onMouseDown(e) {
      let {grid, record, instance} = this.props;

      if (this.props.dragSource) {
         ddMouseDown(e);
         if (isDragHandleEvent(e) || instance.dragHandles.length == 0)
            e.preventDefault();
      }

      let {store, widget} = grid;

      if (widget.selectable)
         preventMouseFocusOnTouch(e);

      if (!isTouchEvent()) {
         if (e.ctrlKey || !widget.selection.isSelected(store, record.data, record.index)) {
            widget.selection.select(store, record.data, record.index, {
               toggle: e.ctrlKey
            });
         }
      }
   }

   onMouseMove(e) {
      if (ddDetect(e) && (isDragHandleEvent(e) || this.props.instance.dragHandles.length == 0))
         this.props.parent.beginDragDrop(e, this.props.record);
   }

   onClick(e) {
      let {grid, record, instance} = this.props;
      let {store, widget} = grid;

      if (grid.widget.onRowClick) {
         if (grid.widget.onRowClick(e, instance) === false)
            return;
      }

      e.stopPropagation();

      if (isTouchEvent() || (widget.selection.isSelected(store, record.data, record.index) && !e.ctrlKey))
         widget.selection.select(store, record.data, record.index);
   }

   shouldComponentUpdate(props) {
      return props.shouldUpdate !== false
         || props.cursor != this.props.cursor
         || props.selected != this.props.selected;
   }
}
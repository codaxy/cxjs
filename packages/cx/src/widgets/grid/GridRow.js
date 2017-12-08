import {ValidationGroup} from '../../widgets/form/ValidationGroup';
import {VDOM} from '../../ui/Widget';
import {
   ddMouseDown,
   ddMouseUp,
   ddDetect,
   isDragHandleEvent
} from '../drag-drop/ops';
import {isTouchEvent} from '../../util/isTouchEvent';
import {preventFocusOnTouch} from '../../ui/FocusManager';
import {KeyCode} from "../../util/KeyCode";

export class GridRow extends ValidationGroup {
   render(context, instance, key) {
      return <tr key={key}>
         {this.renderChildren(context, instance)}
      </tr>
   }

   explore(context, instance) {
      context.push('dragHandles', instance.dragHandles = []);
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      super.exploreCleanup(context, instance);
      context.pop('dragHandles');
   }
}

GridRow.prototype.styled = true;
GridRow.prototype.isPureContainer = false;

export class GridRowComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.onMouseMove = ::this.onMouseMove;
      this.onMouseDown = ::this.onMouseDown;
      this.onMouseEnter = ::this.onMouseEnter;
      this.onKeyDown = ::this.onKeyDown;
      this.onClick = ::this.onClick;

      let {grid, instance} = props;

      if (grid.widget.onRowDoubleClick)
         this.onDoubleClick = e => {
            grid.invoke("onRowDoubleClick", e, instance);
         };


      if (grid.widget.onRowContextMenu)
         this.onRowContextMenu = e => {
            grid.invoke("onRowContextMenu", e, instance);
         }
   }

   render() {

      let {className, dragSource, instance} = this.props;
      let {data, widget} = instance;
      let {CSS} = widget;
      let move, up;

      if (dragSource) {
         move = this.onMouseMove;
         up = ddMouseUp;
      }

      return (
         <tbody
            className={CSS.expand(data.classNames, className)}
            style={data.style}
            onClick={this.onClick}
            onDoubleClick={this.onDoubleClick}
            onMouseEnter={this.onMouseEnter}
            onTouchStart={this.onMouseDown}
            onMouseDown={this.onMouseDown}
            onKeyDown={this.onKeyDown}
            onTouchMove={move}
            onMouseMove={move}
            onTouchEnd={up}
            onMouseUp={up}
            onContextMenu={this.onRowContextMenu}
         >
         {this.props.children}
         </tbody>
      )
   }

   onMouseEnter(e) {
      let {parent, cursorIndex} = this.props;
      parent.moveCursor(cursorIndex);
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
         preventFocusOnTouch(e);

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

   onKeyDown(e) {
      switch (e.keyCode) {
         case KeyCode.enter:
            this.onClick(e);
            break;
      }
   }

   onClick(e) {
      let {grid, record, instance} = this.props;
      let {store, widget} = grid;

      if (grid.widget.onRowClick) {
         if (grid.invoke("onRowClick", e, instance) === false)
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
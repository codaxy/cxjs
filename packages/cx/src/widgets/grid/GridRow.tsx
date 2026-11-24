/** @jsxImportSource react */
import { preventFocusOnTouch, unfocusElement } from "../../ui/FocusManager";
import type { RenderingContext } from "../../ui/RenderingContext";
import { VDOM } from "../../ui/Widget";
import { closest } from "../../util/DOM";
import { isTouchEvent } from "../../util/isTouchEvent";
import { KeyCode } from "../../util/KeyCode";
import { ValidationGroup, ValidationGroupConfig, ValidationGroupInstance } from "../../widgets/form/ValidationGroup";
import { ddDetect, ddMouseDown, ddMouseUp, isDragHandleEvent } from "../drag-drop/ops";
import { GridRowLine, GridRowLineConfig, GridRowLineRenderResult } from "./GridRowLine";
import type { GridInstance } from "./Grid";
import { BooleanProp, StringProp, Prop, StructuredProp } from "../../ui/Prop";
import { WidgetStyleConfig } from "../../ui/Widget";

export interface GridRowInstance extends ValidationGroupInstance {
   dragHandles: any[];
}

export interface GridRowConfig extends ValidationGroupConfig, WidgetStyleConfig {
   hoverId?: any;
   line0?: GridRowLineConfig;
   line1?: GridRowLineConfig;
   line2?: GridRowLineConfig;
   line3?: GridRowLineConfig;
   line4?: GridRowLineConfig;
   line5?: GridRowLineConfig;
   line6?: GridRowLineConfig;
   line7?: GridRowLineConfig;
   line8?: GridRowLineConfig;
   line9?: GridRowLineConfig;
   recordName?: string;
   invalid?: BooleanProp;
   valid?: BooleanProp;
   mod?: StringProp | Prop<string[]> | StructuredProp;
}

export class GridRow extends ValidationGroup<GridRowConfig> {
   declare recordName?: string;
   declare line0?: GridRowLineConfig;
   declare line1?: GridRowLineConfig;
   declare line2?: GridRowLineConfig;
   declare line3?: GridRowLineConfig;
   declare line4?: GridRowLineConfig;
   declare line5?: GridRowLineConfig;
   declare line6?: GridRowLineConfig;
   declare line7?: GridRowLineConfig;
   declare line8?: GridRowLineConfig;
   declare line9?: GridRowLineConfig;

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(...args, {
         hoverId: undefined,
      });
   }

   init(): void {
      this.items = [];
      for (let i = 0; i < 10; i++) {
         const lineKey = ("line" + i) as keyof GridRow;
         if (this[lineKey])
            this.items.push(
               GridRowLine.create(this[lineKey] as GridRowLineConfig, {
                  recordName: this.recordName,
               }),
            );
      }
      super.init();
   }

   explore(context: RenderingContext, instance: GridRowInstance): void {
      context.push("dragHandles", (instance.dragHandles = []));
      super.explore(context, instance);
   }

   exploreCleanup(context: RenderingContext, instance: GridRowInstance): void {
      super.exploreCleanup(context, instance);
      context.pop("dragHandles");
   }
}

GridRow.prototype.styled = true; //styles used on the wrapper component

export interface GridRowComponentProps {
   key?: string;
   className?: string;
   store?: any;
   dragSource?: any;
   instance: GridRowInstance;
   grid: GridInstance;
   record: any;
   parent: any;
   cursorIndex?: number;
   selected?: boolean;
   isBeingDragged?: any;
   isDraggedOver?: boolean;
   cursor?: boolean;
   cursorCellIndex?: number | false;
   cellEdit?: any;
   onMouseLeave?: any;
   useTrTag?: boolean;
   shouldUpdate?: boolean;
   dimensionsVersion?: number;
   fixed?: boolean;
   children?: React.ReactNode;

   /** The rendered lines of the row. If set, the row renders its cells from them, instead of rendering `children`. */
   lines?: GridRowLineRenderResult[];
   /** The index of the cell with the cursor, if the cursor is in this row; otherwise null. */
   cellCursorIndex?: number | null;
   /** Wraps the content of each cell. */
   cellWrap?: ((content: any) => any) | false;
   /** The widths of the columns, as a string, so that rows render again when they change. */
   colWidths?: string;
}

interface GridRowComponentState {
   hover?: boolean;
}

export class GridRowComponent extends VDOM.Component<GridRowComponentProps, GridRowComponentState> {
   onDoubleClick?: (e: React.MouseEvent) => void;
   onRowContextMenu?: (e: React.MouseEvent) => void;
   unsubscribeHoverSync?: () => void;

   constructor(props: GridRowComponentProps) {
      super(props);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);
      this.onClick = this.onClick.bind(this);
      this.onKeyDown = this.onKeyDown.bind(this);

      let { grid, instance } = props;

      if (grid.widget.onRowDoubleClick)
         this.onDoubleClick = (e) => {
            grid.invoke("onRowDoubleClick", e, instance);
         };

      if (grid.widget.cellEditable)
         this.onDoubleClick = (e) => {
            this.props.parent.moveCursor(this.props.cursorIndex, {
               cellEdit: true,
            });
            e.preventDefault(); //prevent text selection
         };

      if (grid.widget.onRowContextMenu)
         this.onRowContextMenu = (e) => {
            grid.invoke("onRowContextMenu", e, instance);
         };
   }

   render(): React.ReactNode {
      let { className, dragSource, instance, record, useTrTag, children } = this.props;
      let { data, widget } = instance;
      let { CSS } = widget;
      let move: ((e: React.MouseEvent | React.TouchEvent) => void) | undefined,
         up: ((e: React.MouseEvent | React.TouchEvent) => void) | undefined,
         keyDown: ((e: React.KeyboardEvent) => void) | undefined,
         leave: ((e: React.MouseEvent) => void) | undefined;

      if (dragSource || data.hoverId != null) {
         move = this.onMouseMove;
         up = ddMouseUp;
      }

      if (data.hoverId != null) {
         leave = this.onMouseLeave;
      }

      if (this.props.grid.widget.onRowClick) keyDown = this.onKeyDown;

      return VDOM.createElement(
         useTrTag ? "tr" : "tbody",
         {
            className: CSS.expand(data.classNames, className, this.state && this.state.hover && CSS.state("hover")),
            style: data.style,
            onClick: this.onClick,
            onDoubleClick: this.onDoubleClick,
            onTouchStart: this.onMouseDown,
            onMouseDown: this.onMouseDown,
            onTouchMove: move,
            onMouseMove: move,
            onMouseLeave: leave,
            onTouchEnd: up,
            onMouseUp: up,
            onKeyDown: keyDown,
            onContextMenu: this.onRowContextMenu,
            "data-record-key": record.key,
         },
         this.props.lines ? this.renderLines(this.props.lines) : children,
      );
   }

   renderLines(lines: GridRowLineRenderResult[]): React.ReactNode {
      let { grid, parent, instance, fixed, useTrTag, cellCursorIndex, cellEdit, cellWrap } = this.props;
      let { widget, visibleColumns } = grid;
      let { CSS, baseClass } = widget;
      let { colWidth } = grid.state;
      let skipCells: Record<string, boolean> = {};

      return lines.map(({ key, data, content }, line) => {
         let cells = content.map(({ key, data, content, uniqueColumnId, merged, mergeRowSpan }, cellIndex) => {
            if (Boolean(data.fixed) !== fixed) return null;
            if (merged) return null;
            let cellected = cellCursorIndex != null && cellIndex == cellCursorIndex && widget.cellEditable && line == 0;
            let className = cellected ? CSS.expand(data.classNames, CSS.state("cellected")) : data.classNames;
            if (cellected && cellEdit) {
               let column = visibleColumns[cellCursorIndex!];
               if (column && column.editor && data.editable)
                  return parent.renderCellEditor(key, CSS, baseClass, instance, column);
            }
            let width = colWidth[uniqueColumnId!];
            let style = data.style;
            if (width) {
               style = {
                  ...style,
                  maxWidth: `${width}px`,
               };
            }

            if (skipCells[`${line}-${cellIndex}`]) return null;

            if ((data.colSpan ?? 0) > 1 || (data.rowSpan ?? 0) > 1) {
               for (let r = line; r < line + (data.rowSpan ?? 1); r++)
                  for (let c = cellIndex; c < cellIndex + (data.colSpan ?? 1); c++) skipCells[`${r}-${c}`] = true;
            }

            if (cellWrap) content = cellWrap(content);

            return (
               <td
                  key={key}
                  className={className}
                  style={style}
                  colSpan={data.colSpan}
                  rowSpan={mergeRowSpan ?? data.rowSpan}
               >
                  {content}
               </td>
            );
         });
         if (useTrTag) return cells;
         return (
            <tr key={key} className={data.classNames} style={data.style}>
               {cells}
            </tr>
         );
      });
   }

   onMouseDown(e: React.MouseEvent | React.TouchEvent): void {
      let { grid, record, instance, parent, cursorIndex } = this.props;

      if (this.props.dragSource) {
         ddMouseDown(e);
         if (isDragHandleEvent(e) || instance.dragHandles.length == 0) {
            e.preventDefault();
            e.stopPropagation();

            //close context menu
            unfocusElement(e.target as Element, false);
         }
      }

      let { store, widget } = grid;

      if (widget.selectable) preventFocusOnTouch(e);

      parent.moveCursor(cursorIndex, {
         select:
            !isTouchEvent() &&
            (e.shiftKey || e.ctrlKey || !widget.selection.isSelected(store, record.data, record.index)),
         selectRange: e.shiftKey,
         selectOptions: {
            toggle: e.ctrlKey && !e.shiftKey,
            add: e.ctrlKey && e.shiftKey,
         },
         cellIndex: this.getCellIndex(e),
      });

      if (e.shiftKey && !isTouchEvent()) e.preventDefault();
   }

   onMouseMove(e: React.MouseEvent | React.TouchEvent): void {
      let { grid, instance, parent, record } = this.props;
      if (ddDetect(e) && (isDragHandleEvent(e) || instance.dragHandles.length == 0)) parent.beginDragDrop(e, record);
      if (grid.hoverSync && instance.data.hoverId != null)
         grid.hoverSync.report(grid.widget.hoverChannel, instance.data.hoverId, true);
   }

   onMouseLeave(e: React.MouseEvent): void {
      let { grid, instance } = this.props;
      if (grid.hoverSync && instance.data.hoverId != null)
         grid.hoverSync.report(grid.widget.hoverChannel, instance.data.hoverId, false);
   }

   getCellIndex(e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent): number {
      let td = closest(e.target as Element, (node) => (node as Element).tagName == "TD") as HTMLTableCellElement | null;
      if (td)
         return (
            (this.props.fixed ? 0 : this.props.grid.fixedColumnCount) +
            Array.from(td.parentElement!.children).indexOf(td)
         );
      return -1;
   }

   onKeyDown(e: React.KeyboardEvent): void {
      let { grid, instance } = this.props;

      if (e.keyCode == KeyCode.enter && grid.invoke("onRowClick", e, instance) === false) {
         e.stopPropagation();
      }
   }

   onClick(e: React.MouseEvent): void {
      let { grid, record, instance, parent, cursorIndex } = this.props;
      let { store, widget } = grid;

      if (grid.widget.onRowClick) {
         if (grid.invoke("onRowClick", e, instance) === false) return;
      }

      e.stopPropagation();

      parent.moveCursor(cursorIndex, {
         select:
            isTouchEvent() ||
            (!e.shiftKey && !e.ctrlKey && widget.selection.isSelected(store, record.data, record.index)),
         selectRange: e.shiftKey,
         selectOptions: {
            toggle: e.ctrlKey && !e.shiftKey,
            add: e.ctrlKey && e.shiftKey,
         },
         cellIndex: this.getCellIndex(e),
      });
   }

   shouldComponentUpdate(props: GridRowComponentProps, state: GridRowComponentState): boolean {
      if (props.lines) {
         let { record } = props;
         return (
            props.shouldUpdate !== false ||
            props.lines !== this.props.lines ||
            // merged cells change when the rows around them change, and the cursor row may show a cell editor
            !!props.useTrTag ||
            props.cellCursorIndex != null ||
            props.cellCursorIndex !== this.props.cellCursorIndex ||
            props.className !== this.props.className ||
            record.key !== this.props.record.key ||
            record.data !== this.props.record.data ||
            record.index !== this.props.record.index ||
            props.store !== this.props.store ||
            props.instance !== this.props.instance ||
            props.dragSource !== this.props.dragSource ||
            props.fixed !== this.props.fixed ||
            props.colWidths !== this.props.colWidths ||
            !!props.cellWrap !== !!this.props.cellWrap ||
            props.cursor != this.props.cursor ||
            props.selected != this.props.selected ||
            props.isBeingDragged != this.props.isBeingDragged ||
            props.cursorIndex !== this.props.cursorIndex ||
            props.cursorCellIndex !== this.props.cursorCellIndex ||
            props.cellEdit !== this.props.cellEdit ||
            props.dimensionsVersion !== this.props.dimensionsVersion ||
            props.isDraggedOver !== this.props.isDraggedOver ||
            state !== this.state
         );
      }

      return (
         props.shouldUpdate !== false ||
         props.record != this.props.record ||
         props.cursor != this.props.cursor ||
         props.selected != this.props.selected ||
         props.isBeingDragged != this.props.isBeingDragged ||
         props.cursorIndex !== this.props.cursorIndex ||
         props.cursorCellIndex !== this.props.cursorCellIndex ||
         props.cellEdit !== this.props.cellEdit ||
         props.dimensionsVersion !== this.props.dimensionsVersion ||
         props.isDraggedOver !== this.props.isDraggedOver ||
         state !== this.state
      );
   }

   componentWillUnmount(): void {
      this.unsubscribeHoverSync && this.unsubscribeHoverSync();
   }

   componentDidMount(): void {
      let { grid } = this.props;
      if (grid.hoverSync) {
         this.unsubscribeHoverSync = grid.hoverSync.subscribe(grid.widget.hoverChannel, (hoverId: any) => {
            let hover = hoverId === this.props.instance.data.hoverId;
            if (!this.state || hover !== this.state.hover) this.setState({ hover });
         });
      }
   }
}

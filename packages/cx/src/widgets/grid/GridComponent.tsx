/** @jsxImportSource react */
// The React component of Grid: renders the tables of a grid and handles everything that happens in the DOM, such as
// scrolling and buffering, keeping the fixed header, footer and column tables in sync, keyboard navigation and the
// cursor, cell editing, and drag and drop.
import { View } from "../../data";
import { batchUpdates } from "../../ui/batchUpdates";
import { Cx } from "../../ui/Cx";
import { offFocusOut, unfocusElement, FocusManager, oneFocusOut } from "../../ui/FocusManager";
import { InstanceCache } from "../../ui/Instance";
import { RenderingContext } from "../../ui/RenderingContext";
import { ResizeManager } from "../../ui/ResizeManager";
import { StaticText } from "../../ui/StaticText";
import { VDOM } from "../../ui/Widget";
import { closest } from "../../util/DOM";
import { findScrollableParent } from "../../util/findScrollableParent";
import { getActiveElement } from "../../util/getActiveElement";
import { getParentFrameBoundingClientRect } from "../../util/getParentFrameBoundingClientRect";
import { getTopLevelBoundingClientRect } from "../../util/getTopLevelBoundingClientRect";
import { isArray } from "../../util/isArray";
import { isNonEmptyArray } from "../../util/isNonEmptyArray";
import { isTextInputElement } from "../../util/isTextInputElement";
import { KeyCode } from "../../util/KeyCode";
import { scrollElementIntoView } from "../../util/scrollElementIntoView";
import { shallowEquals } from "../../util/shallowEquals";
import { registerDropZone, DragEvent, DragEndEvent, initiateDragDrop } from "../drag-drop/ops";
import { HtmlElement } from "../HtmlElement";
import { getCursorPos } from "../overlay/captureMouse";
import { createGridCellEditor } from "./createGridCellEditor";
import type { GridInstance } from "./Grid";
import type {
   GridDom,
   MappedGridRecord,
   GridDragEvent,
   GridRowDragEvent,
   GridColumnDropEvent,
   GridDropOperationContext,
   GridMoveCursorOptions,
} from "./Grid.types";
import { GridRowComponent, GridRowInstance } from "./GridRow";
import { GridPageLoader } from "./GridPageLoader";
import { GridRowHeights } from "./GridRowHeights";
import { lockColumnWidths, syncFixedFooters, syncFixedHeaders } from "./syncTableSizes";

export interface GridComponentProps {
   instance: GridInstance;
   data: any;
   shouldUpdate: boolean | undefined;
   header?: any;
   fixedColumnsHeader?: any;
   fixedColumnsFixedHeader?: any;
   fixedHeader?: any;
   fixedFooter?: any;
   fixedColumnsFixedFooter?: any;
   children?: any;
}

export interface GridComponentState {
   cursor: number;
   cursorCellIndex: number;
   focused: boolean;
   dropInsertionIndex: number | null;
   dropNextToTheRowAbove: boolean | null;
   start: number;
   end: number;
   dragged?: any;
   cellEdit?: any;
   dropTarget?: any;
   dropItemHeight?: number;
   colDropInsertionLeft?: number;
   colDropInsertionIndex?: number;
   selectionStart?: number;
}

export class GridComponent extends VDOM.Component<GridComponentProps, GridComponentState> {
   dom: GridDom;
   syncBuffering: boolean = false;
   declare start?: number;
   declare end?: number;
   declare pageLoader: GridPageLoader;
   declare measuredHeights: GridRowHeights;
   declare rowHeight?: number;
   scrollerRef: (el: HTMLElement | null) => void;
   fixedScrollerRef: (el: HTMLElement | null) => void;
   gridRef: (el: HTMLElement | null) => void;
   declare cellEditorValid?: boolean;
   declare scrollWidth: number;
   declare pending?: any;
   offResize?: () => void;
   unregisterDropZone?: () => void;
   declare lastSorters?: any;
   declare lastScrollFilterParams?: any;
   declare lastScrollResetParams?: any;
   declare selectedEl?: Element | null;
   declare cellEditUndoData?: any;
   /** Set while moveCursor ends a cell edit, so that the focus returning to the grid does not end it again. */
   declare endingCellEdit?: boolean;

   constructor(props: GridComponentProps) {
      super(props);
      this.dom = {};
      this.measuredHeights = new GridRowHeights();
      this.pageLoader = new GridPageLoader(this);
      let { widget } = props.instance;

      let end = Math.min(widget.bufferSize, props.data.totalRecordCount);

      this.state = {
         cursor: widget.focused && widget.selectable ? 0 : -1,
         cursorCellIndex: 0,
         focused: widget.focused,
         dropInsertionIndex: null,
         dropNextToTheRowAbove: null,
         start: 0,
         end: end,
      };

      this.syncBuffering = false;

      if (widget.infinite) {
         this.start = 0;
         this.end = end;
         this.pageLoader.loadingStartPage = 0;
         this.pageLoader.loadingEndPage = 0;
         this.lastSorters = props.data.sorters;
      }

      this.scrollerRef = (el) => {
         this.dom.scroller = el;
      };

      this.fixedScrollerRef = (el) => {
         this.dom.fixedScroller = el;
      };

      this.gridRef = (el) => {
         this.dom.el = el;
      };
   }

   getBufferStartEnd(): { start: number; end: number } {
      return this.syncBuffering ? { start: this.start!, end: this.end! } : this.state;
   }

   renderCellEditor(key: any, CSS: any, baseClass: any, instance: any, column: any) {
      //add an inner div with fixed height in order to help IE absolutely position the contents inside
      let editor = createGridCellEditor(
         CSS.element(baseClass, "cell-editor-wrap"),
         this.rowHeight != null && this.rowHeight > 0
            ? {
                 height: this.rowHeight + 1,
              }
            : null,
         {
            get: () => this.cellEditorValid ?? false,
            set: (value: any) => {
               this.cellEditorValid = value;
               return true;
            },
         },
         column.editor,
      );
      return (
         <td key={key} className={CSS.element(baseClass, "cell-editor")}>
            <Cx parentInstance={instance} subscribe widget={editor}></Cx>
         </td>
      );
   }

   createRowRenderer(cellWrap: any) {
      let { instance, data } = this.props;
      let { widget, isRecordSelectable, isRecordDraggable, row } = instance;
      let { CSS } = widget;
      let { dragSource } = data;
      let { dragged, cursor, cursorCellIndex, cellEdit, dropInsertionIndex, dropTarget } = this.state;
      let { colWidth, dimensionsVersion } = instance.state;
      let { hasMergedCells } = row;
      // column widths are partly updated in place, so rows compare their values to know when to render again
      let colWidths = Object.keys(colWidth)
         .map((id) => id + ":" + colWidth[id])
         .join(";");

      return (record: MappedGridRecord, index: number, standalone: any, fixed: any) => {
         let { store, key, row } = record;
         let isDragged = dragged && (row?.selected || record == dragged);
         let mod: Record<string, any> = {
            selected: row?.selected,
            dragged: isDragged,
            cursor: widget.selectable && index == cursor,
            over: dropTarget == "row" && dropInsertionIndex === index,
            alternate: index % 2 == 1,
         };

         if (isRecordSelectable) {
            let selectable = isRecordSelectable(record.data, {});
            mod["selectable"] = selectable;
            mod["non-selectable"] = !selectable;
         }

         let draggable =
            dragSource &&
            !isNonEmptyArray((row as any).dragHandles) &&
            (!isRecordDraggable || isRecordDraggable(record.data));
         mod["draggable"] = draggable;
         mod["non-draggable"] = !draggable;

         let wrap = (children: any) => (
            <GridRowComponent
               key={key}
               className={CSS.state(mod)}
               store={store}
               dragSource={dragSource}
               instance={row!}
               grid={instance}
               record={record}
               parent={this}
               cursorIndex={index}
               selected={row?.selected}
               isBeingDragged={dragged}
               isDraggedOver={mod.over}
               cursor={mod.cursor}
               cursorCellIndex={index == cursor && cursorCellIndex}
               cellEdit={index == cursor && cursorCellIndex != null && cellEdit}
               shouldUpdate={row?.shouldUpdate}
               dimensionsVersion={dimensionsVersion}
               fixed={fixed}
               useTrTag={hasMergedCells}
               lines={children.content}
               cellCursorIndex={index == cursor ? cursorCellIndex : null}
               cellWrap={cellWrap}
               colWidths={colWidths}
            />
         );

         if (!standalone) return wrap(record.vdom);

         return (
            <Cx
               key={key}
               instance={record.row}
               parentInstance={instance}
               options={{ name: "grid-row" }}
               contentFactory={(x) =>
                  wrap({
                     content: Array.isArray(x.children) ? x.children : x.children != null ? [x.children] : [],
                     data: {},
                  })
               }
               params={{
                  ...mod,
                  dimensionsVersion: dimensionsVersion,
                  cursorIndex: index,
                  data: record.data,
                  cursorCellIndex: index == cursor && cursorCellIndex,
                  cellEdit: index == cursor && cursorCellIndex != null && cellEdit,
               }}
            />
         );
      };
   }

   groupLooseRows(items: any[]): any[] {
      let { CSS, baseClass } = this.props.instance.widget;
      let result: any[] = [];
      for (let i = 0; i < items.length; i++) {
         if (!items[i]?.props?.useTrTag) {
            result.push(items[i]);
            continue;
         }
         let start = i;
         while (i + 1 < items.length && items[i + 1]?.props?.useTrTag) i++;
         result.push(
            <tbody key={`rows-${items[start].key}`} className={CSS.element(baseClass, "row-group")}>
               {items.slice(start, i + 1)}
            </tbody>,
         );
      }
      return result;
   }

   render() {
      let { instance, data, fixedFooter, fixedColumnsFixedFooter } = this.props;
      let { widget, hasFixedColumns } = instance;
      let { CSS, baseClass } = widget;
      let { start, end } = this.getBufferStartEnd();

      let cellWrap: any = false;

      if (widget.cellEditable && (widget.hasResizableColumns || hasFixedColumns)) {
         cellWrap = (children: any) => <div className="cxe-grid-cell-clip">{children}</div>;
      }

      let children: any[] = [],
         fixedChildren: any[] = [];

      let renderRow = this.createRowRenderer(cellWrap);

      let addRow = (record: any, index: number, standalone?: boolean) => {
         children.push(renderRow(record, index, standalone, false));
         if (hasFixedColumns) fixedChildren.push(renderRow(record, index, standalone, true));

         //avoid re-rendering on cursor change
         record.row.shouldUpdate = false;
      };

      if (widget.buffered) this.renderBufferedRows(start, end, addRow, children, fixedChildren);
      else {
         if (instance.row.hasMergedCells) this.mergeCells();

         instance.records!.forEach((record, i) => {
            if (record.type == "data") addRow(record, i, false);
            else {
               children.push(record.vdom);
               if (hasFixedColumns) fixedChildren.push(record.fixedVdom);
            }
         });
      }

      if (this.state.dropTarget == "grid" && this.state.dropInsertionIndex != null) this.insertDropZoneRow(children);

      let content = [],
         fixedColumnsContent = [];

      //instance.records holds the record count after filtering
      if (data.emptyText && data.empty) {
         children = [
            <tbody key="empty" className={CSS.element(baseClass, "empty-text")}>
               <tr>
                  <td colSpan={1000}>{data.emptyText}</td>
               </tr>
            </tbody>,
         ];
      } else if (widget.fixedFooter && (widget.buffered || !instance.fixedFooterIsGroupFooter)) {
         //add fixed footer content for buffered grids
         if (fixedFooter || fixedColumnsFixedFooter) {
            children.push(fixedFooter);
            if (hasFixedColumns) fixedChildren.push(fixedColumnsFixedFooter);
         }
      }

      //grids with merged cells render rows as tr elements, as rowspan cannot cross row group
      //boundaries, so consecutive rows have to share a tbody instead of getting one each
      if (instance.row.hasMergedCells) {
         children = this.groupLooseRows(children);
         if (hasFixedColumns) fixedChildren = this.groupLooseRows(fixedChildren);
      }

      let shouldRenderFixedFooter = widget.scrollable && (fixedFooter || fixedColumnsFixedFooter);

      if (hasFixedColumns) {
         fixedColumnsContent.push(
            <div
               key="fixedscroller"
               ref={this.fixedScrollerRef}
               className={CSS.element(baseClass, "fixed-scroll-area", {
                  "fixed-header": !!this.props.fixedHeader,
                  "fixed-footer": shouldRenderFixedFooter,
               })}
            >
               <div className={CSS.element(baseClass, "fixed-table-wrapper")}>
                  <table
                     ref={(el) => {
                        this.dom.fixedTable = el;
                     }}
                  >
                     {this.props.fixedColumnsHeader}
                     {fixedChildren}
                  </table>
               </div>
            </div>,
         );
      }

      content.push(
         <div
            key="scroller"
            ref={this.scrollerRef}
            onScroll={this.onScroll.bind(this)}
            className={CSS.element(baseClass, "scroll-area", {
               "fixed-header": !!this.props.fixedHeader,
               "fixed-footer": shouldRenderFixedFooter,
            })}
         >
            <div className={CSS.element(baseClass, "table-wrapper")}>
               <table
                  ref={(el) => {
                     this.dom.table = el;
                     if (this.props.instance.widget.onRef) this.props.instance.invoke("onRef", el, this.props.instance);
                  }}
               >
                  {this.props.header}
                  {children}
               </table>
            </div>
         </div>,
      );

      if (this.props.fixedHeader)
         content.push(
            <div
               key="fh"
               ref={(el) => {
                  this.dom.fixedHeader = el;
               }}
               className={CSS.element(baseClass, "fixed-header")}
               style={{
                  display: this.scrollWidth > 0 ? "block" : "none",
               }}
            >
               <table>{this.props.fixedHeader}</table>
            </div>,
         );

      if (this.props.fixedColumnsFixedHeader)
         fixedColumnsContent.push(
            <div
               key="fcfh"
               ref={(el) => {
                  this.dom.fixedColumnsFixedHeader = el;
               }}
               className={CSS.element(baseClass, "fixed-fixed-header")}
               style={{
                  display: this.scrollWidth > 0 ? "block" : "none",
               }}
            >
               <table>{this.props.fixedColumnsFixedHeader}</table>
            </div>,
         );

      if (shouldRenderFixedFooter) {
         content.push(
            <div
               key="ff"
               ref={(el) => {
                  this.dom.fixedFooter = el;
               }}
               className={CSS.element(baseClass, "fixed-footer")}
            >
               <table>{fixedFooter}</table>
            </div>,
         );

         if (hasFixedColumns)
            fixedColumnsContent.push(
               <div
                  key="fcff"
                  ref={(el) => {
                     this.dom.fixedColumnsFixedFooter = el;
                  }}
                  className={CSS.element(baseClass, "fixed-fixed-footer")}
               >
                  <table>{fixedColumnsFixedFooter}</table>
               </div>,
            );
      }

      let columnInsertionMarker = null;
      if (this.state.dropTarget == "column") {
         columnInsertionMarker = (
            <div
               className={CSS.element(baseClass, "col-insertion-marker")}
               style={{
                  left: this.state.colDropInsertionLeft,
               }}
            />
         );
      }

      return (
         <div
            className={data.classNames}
            style={{ ...data.style, counterReset: `cx-row-number ${start}` }}
            tabIndex={widget.focusable ? data.tabIndex || 0 : null}
            ref={this.gridRef}
            onKeyDown={this.handleKeyDown.bind(this)}
            onFocus={this.onFocus.bind(this)}
            onBlur={this.onBlur.bind(this)}
            onDragEnter={this.onFileDragEnter.bind(this)}
            onDragOver={this.onFileDragOver.bind(this)}
            onDragLeave={this.onFileDragLeave.bind(this)}
            onDrop={this.onFileDrop.bind(this)}
         >
            {fixedColumnsContent}
            {content}
            {columnInsertionMarker}
            {this.props.children}
         </div>
      );
   }

   // adds the rows in the visible range of a buffered grid; records that are not loaded yet get placeholder rows
   renderBufferedRows(
      start: number,
      end: number,
      addRow: (record: any, index: number, standalone?: boolean) => void,
      children: any[],
      fixedChildren: any[],
   ) {
      let { instance, data } = this.props;
      let { widget, hasFixedColumns } = instance;
      let { CSS, baseClass } = widget;

      let context = new RenderingContext();
      let dummyDataClass = CSS.element(baseClass, "data", { dummy: true });
      if (!instance.recordInstanceCache) instance.recordInstanceCache = new InstanceCache(instance);
      instance.recordInstanceCache.mark();
      this.getRecordsSlice(start, end).forEach((r: any, i: any) => {
         if (r == null) {
            addRow(
               {
                  key: "dummy-" + start + i,
                  row: {
                     data: { classNames: dummyDataClass },
                     widget: instance.row,
                  },
                  vdom: {
                     content: [
                        {
                           key: 0,
                           data: {},
                           content: [
                              {
                                 key: 0,
                                 data: {
                                    colSpan: 1000,
                                    style: {
                                       height: `${this.rowHeight}px`,
                                    },
                                 },
                              },
                           ],
                        },
                     ],
                  },
               },
               start + i,
            );
         } else {
            let record = instance.records
               ? r
               : widget.mapRecord(context, instance, r, widget.infinite ? start + i - data.offset : start + i);
            let row = (record.row = instance.recordInstanceCache.getChild(instance.row, record.store, record.key));
            instance.recordInstanceCache.addChild(row);
            row.detached = true;
            row.selected = instance.isSelected(record.data, record.index);

            if (record.type == "data") {
               addRow(record, start + i, true);
            } else if (record.type == "group-header") {
               let g = record.grouping;
               if (g.caption || g.showCaption) {
                  children.push(
                     widget.renderGroupHeader(
                        null,
                        instance,
                        g,
                        record.level,
                        record.group,
                        record.key + "-caption",
                        record.store,
                        false,
                     ),
                  );

                  if (hasFixedColumns)
                     fixedChildren.push(
                        widget.renderGroupHeader(
                           null,
                           instance,
                           g,
                           record.level,
                           record.group,
                           record.key + "-caption",
                           record.store,
                           true,
                        ),
                     );
               }
            } else if (record.type == "group-footer") {
               let g = record.grouping;
               if (g.showFooter && (!widget.fixedFooter || start + i != instance.records!.length - 1)) {
                  children.push(
                     widget.renderGroupFooter(
                        null,
                        instance,
                        g,
                        record.level,
                        record.group,
                        record.key + "-footer",
                        record.store,
                        false,
                        false,
                     ),
                  );

                  if (hasFixedColumns)
                     fixedChildren.push(
                        widget.renderGroupFooter(
                           null,
                           instance,
                           g,
                           record.level,
                           record.group,
                           record.key + "-footer",
                           record.store,
                           false,
                           true,
                        ),
                     );
               }
            }
         }
      });
      instance.recordInstanceCache.sweep();
   }

   mergeCells() {
      let { instance } = this.props;
      let { mergedColumns } = instance.row;
      // merge adjacent cells with the same value in columns that are marked as merged
      let rowSpan: Record<string, any> = {};
      let getCellRenderInfo = (vdom: any, cellIndex: number) => vdom.content[0]?.content[cellIndex];
      for (let index = instance.records!.length - 1; index >= 0; index--) {
         let row = instance.records![index];
         let prevRow = instance.records![index - 1];
         if (row.type == "data") {
            let stopMerge = false;
            for (let mi = 0; mi < mergedColumns.length; mi++) {
               let mergedCol = mergedColumns[mi];
               let cellInfo = getCellRenderInfo(row.vdom, mergedCol.index);
               cellInfo.merged = false;
               delete cellInfo.mergeRowSpan;
               if (prevRow?.type == "data") {
                  let shouldMerge = false;
                  switch (mergedCol.mode) {
                     case "always":
                        shouldMerge = true;
                        break;
                     case "same-value":
                        let prevCellInfo = getCellRenderInfo(prevRow.vdom, mergedCol.index);
                        shouldMerge = !stopMerge && cellInfo.data.value === prevCellInfo.data.value;
                        break;
                  }

                  if (shouldMerge) {
                     cellInfo.merged = true;
                     rowSpan[mergedCol.uniqueColumnId] = (rowSpan[mergedCol.uniqueColumnId] ?? 1) + 1;
                  } else {
                     if (mergedCol.mode == "same-value") stopMerge = true;
                  }
               }
               if (!cellInfo.merged && rowSpan[mergedCol.uniqueColumnId] > 1) {
                  cellInfo.mergeRowSpan = rowSpan[mergedCol.uniqueColumnId];
                  rowSpan[mergedCol.uniqueColumnId] = 1;
               }
            }
         } else rowSpan = {};
      }
   }

   // inserts the row that shows where the dragged rows will be dropped
   insertDropZoneRow(children: any[]) {
      let { instance, data } = this.props;
      let { widget } = instance;
      let { CSS, baseClass } = widget;

      let dragInsertionRow = (
         <tbody key="dropzone">
            <tr>
               <td
                  className={CSS.element(baseClass, "dropzone")}
                  colSpan={1000}
                  style={{
                     height: data.dropMode == "insertion" ? 0 : this.state.dropItemHeight,
                  }}
               />
            </tr>
         </tbody>
      );

      let dataRecordClass = CSS.element(baseClass, "data");

      let isDataRecord = widget.buffered
         ? (item: any) => item?.props?.instance?.data?.class == dataRecordClass
         : (item: any) => item?.props?.record?.type;

      let index = 0;
      while (index < children.length && !isDataRecord(children[index])) index++;

      let count = 0;
      while (index < children.length && count < this.state.dropInsertionIndex!) {
         if (isDataRecord(children[index])) count++;
         index++;
      }

      let savedIndexPos = index;

      if (!this.state.dropNextToTheRowAbove) while (index < children.length && !isDataRecord(children[index])) index++;

      // do not allow insertion after the last group footer
      if (savedIndexPos < index && index == children.length) index = savedIndexPos;

      children.splice(index, 0, dragInsertionRow);
   }

   getRecordsSlice(start: number, end: number): MappedGridRecord<any>[] {
      let { data, instance } = this.props;
      let { widget } = instance;
      if (!widget.infinite) {
         let source = instance.records || data.records;
         return source.slice(start, end);
      }

      let { offset, records } = data;
      let result = [];
      for (let i = start; i < Math.min(end, data.totalRecordCount); i++) {
         if (i >= offset && i < offset + records.length) result.push(records[i - offset]);
         else result.push(null);
      }

      return result;
   }

   onScroll() {
      //check if unmounted
      if (!this.dom.scroller!) return;

      if (this.dom.fixedHeader!) {
         this.dom.fixedHeader!.scrollLeft = this.dom.scroller!.scrollLeft;
      }

      if (this.dom.fixedFooter!) {
         this.dom.fixedFooter!.scrollLeft = this.dom.scroller!.scrollLeft;
      }

      if (this.dom.fixedScroller!) {
         this.dom.fixedScroller!.scrollTop = this.dom.scroller!.scrollTop;
      }

      let { instance, data } = this.props;
      let { widget } = instance;
      if (widget.buffered && !this.pending) {
         let start = 0;
         if (widget.measureRowHeights && instance.records)
            start = Math.max(
               0,
               this.measuredHeights.estimateStart(instance.records, this.dom.scroller!.scrollTop) - widget.bufferStep,
            );
         else if (this.rowHeight! > 0)
            start = Math.round(this.dom.scroller!.scrollTop / this.rowHeight! - widget.bufferStep);

         start = Math.round(start / widget.bufferStep) * widget.bufferStep;
         start = Math.max(0, Math.min(start, data.totalRecordCount - widget.bufferSize));
         let end = Math.min(data.totalRecordCount, start + widget.bufferSize);

         if (widget.infinite) {
            this.pageLoader.ensureData(start, end);
         }

         if (this.syncBuffering) {
            this.start = start;
            this.end = end;
         } else if (this.state.end != end) {
            this.pending = true;
            this.setState({ start, end }, () => {
               this.pending = false;
            });
         }
      }
   }

   onFixedColumnsWheel(e: WheelEvent) {
      this.dom.scroller!.scrollTop += e.deltaY;
      e.preventDefault();
   }

   shouldComponentUpdate(props: GridComponentProps, state: GridComponentState) {
      return props.shouldUpdate !== false || state !== this.state;
   }

   componentDidMount() {
      this.componentDidUpdate();
      let { instance } = this.props;
      let { widget } = instance;
      if (widget.scrollable) {
         //update fixed header/footer on resize
         this.offResize = ResizeManager.trackElement(this.dom.scroller!, () => {
            requestAnimationFrame(() => {
               //ignore changes if the element is not visible on the page
               if (!this.dom.scroller?.offsetWidth) return;
               this.componentDidUpdate();
               instance.setState({
                  dimensionsVersion: instance.state.dimensionsVersion + 1,
                  lockedColWidth: {},
               });
            });
         });
      }
      if (widget.pipeKeyDown) instance.invoke("pipeKeyDown", this.handleKeyDown.bind(this), instance);
      this.unregisterDropZone = registerDropZone(this);
      if (widget.infinite) this.pageLoader.ensureData(0, 0);
      if (this.dom.fixedScroller!) {
         this.onFixedColumnsWheel = this.onFixedColumnsWheel.bind(this);
         this.dom.fixedScroller!.addEventListener("wheel", this.onFixedColumnsWheel, { passive: false });
      }
   }

   onDragStart(e: DragEvent) {
      let { instance } = this.props;
      let { widget } = instance;
      if (widget.onDragStart) instance.invoke("onDragStart", e, instance);
   }

   onDrop(e: DragEvent) {
      try {
         let { instance } = this.props;
         let { widget } = instance;
         let { start } = this.getBufferStartEnd();
         let { dropInsertionIndex, dropTarget, dropNextToTheRowAbove } = this.state;
         if (dropTarget == "grid" && widget.onDrop && dropInsertionIndex != null) {
            let gridEvent = e as GridDragEvent<any>;
            gridEvent.target = {
               insertionIndex: start + dropInsertionIndex,
               recordBefore: this.getDataRecordAt(start + dropInsertionIndex - 1),
               recordAfter: this.getDataRecordAt(start + dropInsertionIndex),
               totalRecordCount: instance.records!.length,
               dropNextToTheRowAbove,
            };
            instance.invoke("onDrop", gridEvent, instance);
         } else if (dropTarget == "row") {
            let rowEvent = e as GridRowDragEvent<any>;
            rowEvent.target = {
               index: start + dropInsertionIndex!,
               record: this.getDataRecordAt(start + dropInsertionIndex!)!,
            };
            instance.invoke("onRowDrop", rowEvent, instance);
         } else if (dropTarget == "column" && widget.onColumnDrop) {
            let colEvent = e as GridColumnDropEvent;
            colEvent.target = {
               index: this.state.colDropInsertionIndex!,
               grid: widget,
               instance,
            };
            instance.invoke("onColumnDrop", colEvent, instance);
         }
      } catch (err) {
         console.error("Grid drop operation failed. Please fix this error:", err);
      }

      //in some cases drop operation is not followed by leave
      this.onDragLeave(e);
   }

   onDropTest(e: DragEvent) {
      let { instance } = this.props;
      let { widget } = instance;
      let grid = widget.onDropTest && instance.invoke("onDropTest", e, instance);
      let row = widget.onRowDropTest && instance.invoke("onRowDropTest", e, instance);
      let column = widget.onColumnDropTest && instance.invoke("onColumnDropTest", e, instance);
      return (grid || row || column) && { grid, row, column };
   }

   onDragEnd(e: DragEndEvent) {
      this.setState({
         dropTarget: null,
         dropInsertionIndex: null,
         colDropInsertionIndex: undefined,
         colDropInsertionLeft: undefined,
      });
      let { instance } = this.props;
      let { widget } = instance;
      if (widget.onDragEnd) instance.invoke("onDragEnd", e, instance);
   }

   onDragMeasure(e: DragEvent, { test: { grid, row, column } }: any) {
      //columns can be dropped anywhere, while rows only in the scrollable area
      let r = getTopLevelBoundingClientRect(column ? this.dom.el! : this.dom.scroller!);
      let { clientX, clientY } = e.cursor;

      if (clientX < r.left || clientX >= r.right || clientY < r.top || clientY >= r.bottom) return false;

      return {
         over: 1000,
         near: false,
      };
   }

   onColumnDragOver(ev: DragEvent) {
      let headerTBody = this.dom.table!.firstChild as HTMLElement;
      let positions: number[] = [];
      let bounds: DOMRect;

      let exists: Record<string, boolean> = {};

      for (let r = 0; r < headerTBody!.children.length; r++) {
         let cells = headerTBody!.children[r].children;
         for (let c = 0; c < cells.length; c++) {
            bounds = cells[c].getBoundingClientRect();
            let key = bounds.left.toFixed(0);
            if (exists[key]) continue;
            positions.push(bounds.left);
            exists[key] = true;
         }
         if (r == 0) positions.push(bounds!.right);
      }

      //due to the order of enumeration it's possible that positions are out of order
      positions.sort((a, b) => a - b);
      let index = 0;
      while (index + 1 < positions.length && ev.cursor.clientX > positions[index + 1]) index++;

      let { fixedColumnCount } = this.props.instance;

      this.setState({
         colDropInsertionIndex: fixedColumnCount + index,
         colDropInsertionLeft:
            positions[index] - positions[0] - this.dom.scroller!.scrollLeft + this.dom.scroller!.offsetLeft,
         dropTarget: "column",
      });
   }

   onDragOver(ev: DragEvent, { test: { grid, row, column } }: GridDropOperationContext) {
      if (column) this.onColumnDragOver(ev);

      if (!grid && !row) return;

      let { instance } = this.props;
      let { widget, data } = instance;
      let { CSS, baseClass } = widget;
      let rowClass = CSS.element(baseClass, "data");
      let nodes = Array.from(this.dom.table!.children).filter(
         (node) => node.className && node.className.indexOf(rowClass) != -1,
      );
      let { start } = this.getBufferStartEnd();

      let s = 0,
         e = nodes.length,
         m,
         b;
      let parentOffset = getParentFrameBoundingClientRect(this.dom.scroller!);
      let cy = ev.cursor.clientY - parentOffset.top;

      let rowOverIndex = null;
      let nextToTheRowAbove = false;

      while (s < e) {
         m = Math.floor((s + e) / 2);
         b = nodes[m].getBoundingClientRect();

         //dragged items might be invisible and have no client bounds
         if (b.top == 0 && b.bottom == 0) {
            //it's important to go all the way in one direction otherwise infinite loop might occur
            while (m > s && b.top == 0 && b.bottom == 0) {
               m--;
               b = nodes[m].getBoundingClientRect();
            }
            while (m + 1 < e && b.top == 0 && b.bottom == 0) {
               m = m + 1;
               b = nodes[m].getBoundingClientRect();
            }
            if (b.top == 0 && b.bottom == 0) {
               s = e = m;
               break;
            }
         }

         if (cy < b.top) e = m;
         else if (cy > b.bottom) s = m + 1;
         else {
            //hovering over a row here
            if (row) {
               let confirmed = !grid;
               if (!confirmed) {
                  let insertionZone = (b.bottom - b.top) / 4;
                  confirmed = cy > b.top + insertionZone && cy < b.bottom - insertionZone;
               }
               if (confirmed) {
                  rowOverIndex = m;
                  break;
               }
            }

            if (cy > (b.bottom + b.top) / 2) {
               s = e = m + 1;
               nextToTheRowAbove = true;
            } else s = e = m;
         }
      }

      let cancel = false;

      if (rowOverIndex != null) {
         let evt = {
            ...ev,
            target: {
               record: this.getRecordAt(rowOverIndex),
               index: start + rowOverIndex,
            },
         };
         if (widget.onRowDragOver && instance.invoke("onRowDragOver", evt, instance) === false) cancel = true;
         else if (rowOverIndex != this.state.dropInsertionIndex || this.state.dropTarget != "row") {
            this.setState({
               dropInsertionIndex: rowOverIndex,
               dropNextToTheRowAbove: false,
               dropItemHeight: ev.source.height - 1,
               dropTarget: "row",
            });
         }
      } else if (grid) {
         let evt = {
            ...ev,
            target: {
               recordBefore: this.getRecordAt(s - 1),
               recordAfter: this.getRecordAt(s),
               insertionIndex: start + s,
               totalRecordCount: data.totalRecordCount,
            },
         };
         if (widget.onDragOver && instance.invoke("onDragOver", evt, instance) === false) cancel = true;
         else if (s != this.state.dropInsertionIndex || this.state.dropTarget != "grid") {
            this.setState({
               dropInsertionIndex: s,
               dropNextToTheRowAbove: nextToTheRowAbove,
               dropItemHeight: ev.source.height - 1,
               dropTarget: "grid",
            });
         }
      }
      if (cancel) {
         this.setState({
            dropInsertionIndex: null,
            dropNextToTheRowAbove: null,
            dropTarget: null,
         });
      }
   }

   onDragLeave(e: DragEvent) {
      this.setState({
         dropInsertionIndex: null,
         dropNextToTheRowAbove: null,
         dropTarget: null,
      });
   }

   onGetHScrollParent() {
      let { widget } = this.props.instance;
      if (widget.scrollable) return this.dom.scroller!;
      return findScrollableParent(this.dom.table!, true);
   }

   onGetVScrollParent({ test: { grid, row, column } }: GridDropOperationContext) {
      if (column && !grid && !row) return null;
      let { widget } = this.props.instance;
      if (widget.scrollable) return this.dom.scroller!;
      return findScrollableParent(this.dom.table!);
   }

   UNSAFE_componentWillReceiveProps(props: GridComponentProps) {
      let { data, widget } = props.instance;
      if (this.state.cursor >= data.totalRecordCount)
         this.setState({
            cursor: data.totalRecordCount - 1,
         });
      else if (widget.selectable && this.state.focused && this.state.cursor < 0)
         this.setState({
            cursor: 0,
         });
   }

   componentWillUnmount() {
      let { instance } = this.props;
      let { widget } = instance;
      if (this.offResize) this.offResize();

      offFocusOut(this);

      if (this.unregisterDropZone) this.unregisterDropZone();

      if (widget.pipeKeyDown) instance.invoke("pipeKeyDown", null, instance);

      if (this.dom.fixedScroller!) {
         this.dom.fixedScroller!.removeEventListener("wheel", this.onFixedColumnsWheel);
      }
   }

   componentDidUpdate() {
      let { instance, data } = this.props;
      let { widget } = instance;

      if (
         widget.lockColumnWidths &&
         isArray(data.records) &&
         data.records.length >= widget.lockColumnWidthsRequiredRowCount
      )
         lockColumnWidths(this.dom, instance.state.lockedColWidth);

      if (widget.scrollable) {
         this.scrollWidth = this.dom.scroller!.offsetWidth - this.dom.scroller!.clientWidth;

         let { resized, headerHeight } = syncFixedHeaders(this.dom, this.scrollWidth, widget.preciseMeasurements);
         let footerHeight = syncFixedFooters(this.dom, this.scrollWidth, instance.fixedFooterOverlap);
         this.updateTableMargins(headerHeight, footerHeight);
         this.resetScrollPosition();

         if (widget.scrollSelectionIntoView && !widget.buffered) this.scrollSelectionIntoView();

         setTimeout(this.onScroll.bind(this), 0);

         if (resized) instance.fixedHeaderResizeEvent.notify();
      }
   }

   // makes room for the fixed header and footer and, in buffered grids, for the rows that are not rendered
   updateTableMargins(headerHeight: number, footerHeight: number) {
      let { instance, data } = this.props;
      let { widget, fixedFooterOverlap } = instance;
      let rowHeight = 0;

      let scrollOverlap = fixedFooterOverlap ? footerHeight : 0;

      if (widget.buffered) {
         let { start, end } = this.getBufferStartEnd();
         let remaining = 0,
            count = Math.min(data.totalRecordCount, end! - start!);

         if (widget.measureRowHeights) this.measuredHeights.record(this.dom.table!);

         if (count > 0) {
            //do not change row height while a drag-drop operation is in place
            rowHeight = this.state.dragged
               ? this.rowHeight!
               : Math.round((this.dom.table!.offsetHeight - headerHeight) / count);
            // if (this.rowHeight && this.rowHeight != rowHeight) {
            //    console.warn("ROW-HEIGHT-CHANGE", this.rowHeight, rowHeight);
            // }
            remaining = Math.max(0, data.totalRecordCount - end);
         }

         let upperMargin = 0,
            lowerMargin = 0;
         if (widget.measureRowHeights && instance.records) {
            upperMargin = this.measuredHeights.estimateHeight(instance.records, 0, start);
            lowerMargin = this.measuredHeights.estimateHeight(instance.records, end, instance.records.length);
         } else {
            upperMargin = start * rowHeight;
            lowerMargin = remaining * rowHeight;
         }

         this.dom.table!.style.marginTop = `${(-headerHeight + upperMargin).toFixed(0)}px`;
         this.dom.table!.style.marginBottom = `${(lowerMargin - scrollOverlap).toFixed(0)}px`;
      } else {
         this.dom.table!.style.marginTop = `${-headerHeight}px`;
         this.dom.table!.style.marginBottom = `${-scrollOverlap}px`;
      }

      if (this.dom.fixedTable!) {
         this.dom.fixedTable!.style.marginTop = this.dom.table!.style.marginTop;
         this.dom.fixedTable!.style.marginBottom = this.dom.table!.style.marginBottom;
      }

      this.rowHeight = rowHeight;
   }

   // scrolls to the top when the grid is empty or its sorting, filtering or scrollResetParams change
   resetScrollPosition() {
      let { instance, data } = this.props;
      let { widget } = instance;

      let sortersChanged = widget.infinite && !shallowEquals(data.sorters, this.lastSorters);

      if (data.empty && !widget.infinite) {
         this.dom.scroller!.scrollTop = 0;
      }

      if (
         sortersChanged ||
         data.filterParams !== this.lastScrollFilterParams ||
         data.scrollResetParams !== this.lastScrollResetParams
      ) {
         this.dom.scroller!.scrollTop = 0;
         this.lastScrollFilterParams = data.filterParams;
         this.lastScrollResetParams = data.scrollResetParams;
         this.lastSorters = data.sorters;
         if (widget.infinite) this.pageLoader.reset();
      }
   }

   scrollSelectionIntoView() {
      let { widget } = this.props.instance;
      let { CSS, baseClass } = widget;
      let selectedRowSelector = `.${CSS.element(baseClass, "data")}.${CSS.state("selected")}`;
      let firstSelectedRow = this.dom.table!.querySelector(selectedRowSelector);
      if (firstSelectedRow != this.selectedEl) {
         firstSelectedRow && scrollElementIntoView(firstSelectedRow);
         this.selectedEl = firstSelectedRow;
      }
   }

   moveCursor(
      index: number,
      {
         focused,
         hover,
         scrollIntoView,
         select,
         selectRange,
         selectOptions,
         cellIndex,
         cellEdit,
         cancelEdit,
      }: GridMoveCursorOptions = {},
   ) {
      let { widget, visibleColumns } = this.props.instance;
      if (!widget.selectable && !widget.cellEditable) return;

      let newState: Partial<GridComponentState> = {};

      if (cellEdit != null && cellEdit != this.state.cellEdit) {
         newState.cellEdit = cellEdit;
         if (
            cellEdit &&
            (!visibleColumns[this.state.cursorCellIndex] || !visibleColumns[this.state.cursorCellIndex].editor)
         )
            newState.cellEdit = false;
      }

      if (cellIndex != null && cellIndex != this.state.cursorCellIndex) {
         newState.cursorCellIndex = cellIndex;
         newState.cellEdit = false;
      }

      if (widget.focused) focused = true;

      if (focused != null && this.state.focused != focused) {
         newState.focused = focused;
         newState.cellEdit = false;
      }

      if (index != this.state.cursor) {
         newState.cursor = index;
         newState.cellEdit = false;
      }

      batchUpdates(() => {
         if (select) {
            let start =
               selectRange && this.state.selectionStart != null && this.state.selectionStart >= 0
                  ? this.state.selectionStart
                  : index;
            if (start < 0) start = index;
            this.selectRange(start!, index, selectOptions);
            if (!selectRange) newState.selectionStart = index;
         }

         if (Object.keys(newState).length > 0) {
            let prevState = this.state;
            let wasCellEditing = prevState.focused && prevState.cellEdit;
            let futureState = { ...this.state, ...newState };

            if (!futureState.cellEdit && wasCellEditing) {
               // If cell editing is in progress, moving the cursor may cause that the cell editor to unmount before
               // the blur event which may cause data loss for components which do not have reactOn=change set, e.g. NumberField.
               this.endingCellEdit = true;
               try {
                  unfocusElement(null, false);
               } finally {
                  this.endingCellEdit = false;
               }
               let record = this.getRecordAt(prevState.cursor)!;
               if ((!this.cellEditorValid || cancelEdit) && this.cellEditUndoData)
                  record.store.set(widget.recordName, this.cellEditUndoData);
               else {
                  let newData = record.store.get(widget.recordName); //record.data might be stale at this point
                  if (widget.onCellEdited && newData != this.cellEditUndoData) {
                     this.props.instance.invoke(
                        "onCellEdited",
                        {
                           column: visibleColumns[prevState.cursorCellIndex],
                           newData,
                           oldData: this.cellEditUndoData,
                           field: visibleColumns[prevState.cursorCellIndex].field,
                        },
                        record,
                     );
                     this.cellEditUndoData = newData;
                  }
               }
            }

            if (futureState.cellEdit && !wasCellEditing) {
               let record = this.getRecordAt(futureState.cursor)!;
               let cellEditUndoData = record.data;

               if (
                  widget.onBeforeCellEdit &&
                  this.props.instance.invoke(
                     "onBeforeCellEdit",
                     {
                        column: visibleColumns[futureState.cursorCellIndex],
                        data: cellEditUndoData,
                        field: visibleColumns[futureState.cursorCellIndex].field,
                     },
                     record,
                  ) === false
               )
                  return;

               this.cellEditUndoData = cellEditUndoData;
            }

            this.setState(newState as any, () => {
               if (this.state.focused && !this.state.cellEdit && wasCellEditing) FocusManager.focus(this.dom.el!);

               if (scrollIntoView) {
                  let record = this.getRecordAt(index)!;

                  //rows are tbody elements, except in grids with merged cells, where they are tr
                  let cellsOf = (rowEl: Element) =>
                     (rowEl.tagName == "TR" ? rowEl : (rowEl.firstChild as HTMLElement)).children;

                  let item = record && this.dom.table!.querySelector(`[data-record-key="${record.key}"]`);

                  let hscroll = false;
                  if (item) {
                     if (widget.cellEditable)
                        if (this.state.cursorCellIndex >= this.props.instance.fixedColumnCount) {
                           hscroll = true;
                           item = cellsOf(item)[
                              this.state.cursorCellIndex - this.props.instance.fixedColumnCount
                           ] as Element;
                        } else {
                           let fixedItem = this.dom.fixedTable!.querySelector(`[data-record-key="${record.key}"]`);
                           let cell = fixedItem && cellsOf(fixedItem)[this.state.cursorCellIndex];
                           if (cell) scrollElementIntoView(cell, false, true, 10);
                        }

                     scrollElementIntoView(item!, true, hscroll, widget.cellEditable ? 10 : 0);
                  }
               }
            });
         }
      });
   }

   showCursor(focused?: boolean) {
      let { records, isSelected } = this.props.instance;
      let cursor = this.state.cursor;
      if (cursor == -1) {
         if (records) {
            cursor = records.findIndex((x) => isSelected(x.data, x.index));
            //if there are no selected records, find the first data record (skip group header)
            if (cursor == -1) cursor = records.findIndex((x) => x.type == "data");
         } else cursor = 0;
      }
      this.moveCursor(cursor, { focused: true, scrollIntoView: false });
   }

   onFocus() {
      FocusManager.nudge();

      //focus moved within the grid
      if (this.state.focused) {
         if (this.state.cellEdit && !this.endingCellEdit && this.dom.el! == getActiveElement())
            this.moveCursor(this.state.cursor, {
               cellEdit: false,
            });
         return;
      }

      let { widget } = this.props.instance;

      //the cursor will be set if focus in originating from a mouse event
      setTimeout(() => {
         this.showCursor(true);
      }, 0);

      if (!widget.focused) {
         if (this.dom.el!) {
            //if an inner element is focused first (autoFocus), this.dom.el! might be undefined
            oneFocusOut(this, this.dom.el!, () => {
               this.moveCursor(-1, { focused: false });
            });
         }
      }

      this.setState({
         focused: true,
      });
   }

   onBlur() {
      FocusManager.nudge();
   }

   selectRange(from: number, to: number, options?: any) {
      let { instance, data } = this.props;
      let { records, widget } = instance;

      if (from > to) {
         let tmp = from;
         from = to;
         to = tmp;
      }

      options = {
         ...options,
         range: from < to,
      };

      let selection = [],
         indexes = [];

      for (let cursor = from; cursor <= to; cursor++) {
         let record;
         if (records) record = records[cursor];
         else {
            let offset = widget.infinite ? data.offset : 0;
            let r = data.records[cursor - offset];
            if (r) record = widget.mapRecord(null!, instance, r, cursor - offset);
         }
         if (record && record.type == "data") {
            if (instance.isRecordSelectable && !instance.isRecordSelectable(record.data, options)) continue;
            selection.push(record.data);
            indexes.push(record.index);
         }
      }

      widget.selection.selectMultiple(instance.store, selection, indexes, options);
   }

   getDataRecordAt(index: number): MappedGridRecord | undefined {
      let { records } = this.props.instance;
      if (!records) return this.getRecordAt(index);
      let dataRecords = records.filter((r) => r.type == "data");
      return dataRecords[index];
   }

   getRecordAt(cursor: number): MappedGridRecord | undefined {
      let { instance, data } = this.props;
      let { records, widget } = instance;

      if (records) return records[cursor];

      let offset = widget.infinite ? data.offset : 0;
      let r = data.records[cursor - offset];
      if (r) return widget.mapRecord(null!, instance, r, cursor - offset);

      return undefined;
   }

   getRecordInstanceAt(cursor: number) {
      let record = this.getRecordAt(cursor);
      if (!record) return null;
      let { instance } = this.props;
      if (instance.recordInstanceCache)
         return instance.recordInstanceCache.getChild(instance.row, record.store, record.key);

      //different signature
      return instance.getChild(null, instance.row, record.key, record.store);
   }

   handleKeyDown(e: React.KeyboardEvent) {
      let { instance, data } = this.props;
      let { widget } = instance;

      if (widget.onKeyDown && instance.invoke("onKeyDown", e, instance) === false) return;

      let recordInstance = this.getRecordInstanceAt(this.state.cursor);
      if (recordInstance && widget.onRowKeyDown && instance.invoke("onRowKeyDown", e, recordInstance) === false) return;

      if (widget.onCellKeyDown && widget.cellEditable && this.state.cursorCellIndex != -1) {
         if (
            instance.invoke("onCellKeyDown", e, instance, {
               cellIndex: this.state.cursorCellIndex,
               record: recordInstance,
            }) === false
         )
            return;
      }

      switch (e.keyCode) {
         case KeyCode.enter:
            this.moveCursor(this.state.cursor, {
               select: true,
               selectOptions: {
                  toggle: e.ctrlKey && !e.shiftKey,
                  add: e.ctrlKey && e.shiftKey,
               },
               selectRange: e.shiftKey,
               cellEdit: widget.cellEditable && !this.state.cellEdit,
               focused: true,
            });
            e.stopPropagation();
            e.preventDefault();
            break;

         case KeyCode.esc:
            if (this.state.cellEdit) {
               this.moveCursor(this.state.cursor, {
                  cellEdit: false,
                  focused: true,
                  cancelEdit: true,
               });
               e.stopPropagation();
               e.preventDefault();
            }
            break;

         case KeyCode.tab:
            if (widget.cellEditable) {
               e.stopPropagation();
               e.preventDefault();
               let direction = e.shiftKey ? -1 : +1;
               let cursor = this.state.cursor;
               let cellIndex = (this.state.cursorCellIndex + direction) % instance.row.line1.columns.length;
               if (cellIndex == -1) {
                  cellIndex += instance.row.line1.columns.length;
                  cursor--;
               } else if (cellIndex == 0 && direction > 0) cursor++;
               for (; ; cursor += direction) {
                  let record = this.getRecordAt(cursor);
                  if (!record) break;
                  if (record.type != "data") continue;
                  this.moveCursor(cursor, {
                     focused: true,
                     cellIndex,
                     scrollIntoView: true,
                     cellEdit: false,
                  });
                  break;
               }
            }
            break;

         case KeyCode.down:
            for (let cursor = this.state.cursor + 1; ; cursor++) {
               let record = this.getRecordAt(cursor);
               if (!record) break;
               if (record.type != "data") continue;
               this.moveCursor(cursor, {
                  focused: true,
                  scrollIntoView: true,
                  select: e.shiftKey,
                  selectRange: e.shiftKey,
               });
               break;
            }
            e.stopPropagation();
            e.preventDefault();
            break;

         case KeyCode.up:
            for (let cursor = this.state.cursor - 1; cursor >= 0; cursor--) {
               let record = this.getRecordAt(cursor);
               if (!record) break;
               if (record.type != "data") continue;
               this.moveCursor(cursor, {
                  focused: true,
                  scrollIntoView: true,
                  select: e.shiftKey,
                  selectRange: e.shiftKey,
               });
               break;
            }
            e.stopPropagation();
            e.preventDefault();
            break;

         case KeyCode.right:
            if (widget.cellEditable) {
               if (this.state.cursorCellIndex + 1 < instance.row.line1.columns.length) {
                  this.moveCursor(this.state.cursor, {
                     focused: true,
                     cellIndex: this.state.cursorCellIndex + 1,
                     scrollIntoView: true,
                  });
               }
               e.stopPropagation();
               e.preventDefault();
            }
            break;

         case KeyCode.left:
            if (widget.cellEditable) {
               if (this.state.cursorCellIndex > 0) {
                  this.moveCursor(this.state.cursor, {
                     focused: true,
                     cellIndex: this.state.cursorCellIndex - 1,
                     scrollIntoView: true,
                  });
               }
               e.stopPropagation();
               e.preventDefault();
            }
            break;

         case KeyCode.a:
            if (!e.ctrlKey || !widget.selection.multiple) return;

            if (isTextInputElement(e.target as Element)) return;

            this.selectRange(0, data.totalRecordCount);

            e.stopPropagation();
            e.preventDefault();
            break;
      }
   }

   beginDragDrop(e: React.MouseEvent, record: MappedGridRecord) {
      let { instance, data } = this.props;
      let { widget, store } = instance;
      let { isRecordDraggable } = instance;

      if (isRecordDraggable && !isRecordDraggable(record.data)) return;

      //get a fresh isSelected delegate
      let isSelected = widget.selection.getIsSelectedDelegate(store);

      let selected: MappedGridRecord[] = [];

      let add = (rec: MappedGridRecord | null, data: any, index: number, force?: boolean) => {
         if (!data || !(force || isSelected(data, index)) || (isRecordDraggable && !isRecordDraggable(data))) return;
         let mappedRecord = rec ? { ...rec } : (widget.mapRecord(null!, instance, data, index) as MappedGridRecord);
         let row = (mappedRecord.row = instance.getDetachedChild(
            instance.row,
            "DD:" + mappedRecord.key,
            mappedRecord.store,
         ) as GridRowInstance);
         row.selected = true;
         selected.push(mappedRecord);
      };

      // dragging a selected row drags the whole selection; dragging any other row drags only that row
      if (isSelected(record.data, record.index!)) {
         if (instance.records) instance.records.forEach((r) => add(r, r.data, r.index!));
         else this.getRecordsSlice(0, data.totalRecordCount).forEach((r, index) => add(null, r, index));
      }

      if (selected.length == 0) add(record, record.data, record.index!, true);

      let renderRow = this.createRowRenderer(false);

      let contents = selected.map((record, i) => ({
         type: StaticText,
         text: renderRow(record, i, true, false),
      }));

      initiateDragDrop(
         e,
         {
            sourceEl: closest(e.currentTarget, (a) => a.tagName == "TBODY"),
            source: {
               data: data.dragSource.data,
               store: store,
               record: record,
               records: selected,
            },
            clone: {
               store: record.store,
               matchCursorOffset: true,
               matchWidth: true,
               widget: {
                  type: HtmlElement,
                  tag: "div",
                  className: data.classNames,
                  children: [
                     {
                        type: HtmlElement,
                        tag: "table",
                        children: contents,
                     },
                  ],
               },
            },
         },
         () => {
            this.setState({
               dragged: false,
            });
         },
      );

      this.setState({
         dragged: record,
      });
   }

   onFileDragEnter(ev: React.DragEvent) {
      if (!this.props.instance.widget.allowsFileDrops) return;
      let event = getDragDropEvent(ev, this.props.instance.store, "dragmove");
      var test = this.onDropTest(event);
      if (test) {
         ev.preventDefault();
         ev.stopPropagation();
         this.onDragStart(event);
      }
   }
   onFileDragOver(ev: React.DragEvent) {
      if (!this.props.instance.widget.allowsFileDrops) return;
      let event = getDragDropEvent(ev, this.props.instance.store, "dragmove");
      var test = this.onDropTest(event);
      if (test) {
         ev.preventDefault();
         ev.stopPropagation();
         this.onDragOver(event, { test });
      }
   }
   onFileDragLeave(ev: React.DragEvent) {
      if (!this.props.instance.widget.allowsFileDrops) return;
      if (ev.target != this.dom.el!) {
         //The dragleave event fires when the cursor leave any of the child elements.
         //We need to be sure that the cursor left the top element too.
         let el = document.elementFromPoint(ev.clientX, ev.clientY);
         if (el == this.dom.el! || this.dom.el!.contains(el)) return;
      }
      let event = getDragDropEvent(ev, this.props.instance.store, "dragmove");
      var test = this.onDropTest(event);
      if (test) {
         this.onDragLeave(event);
      }
   }
   onFileDrop(ev: React.DragEvent) {
      if (!this.props.instance.widget.allowsFileDrops) return;
      let event = getDragDropEvent(ev, this.props.instance.store, "dragdrop");
      var test = this.onDropTest(event);
      if (test) {
         ev.preventDefault();
         ev.stopPropagation();
         this.onDrop(event);
      }
   }
}

export function getDragDropEvent(
   ev: React.DragEvent,
   store: View,
   type: "dragstart" | "dragmove" | "dragdrop",
): DragEvent {
   return {
      type,
      event: ev,
      cursor: getCursorPos(ev),
      dataTransfer: ev.dataTransfer,
      source: {
         width: 32,
         height: 32,
         margin: [],
         store,
      },
   };
}

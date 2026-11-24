/** @jsxImportSource react */
import { View } from "../../data";
import { getAccessor } from "../../data/getAccessor";
import { getSelector } from "../../data/getSelector";
import { ArrayAdapter } from "../../ui/adapter/ArrayAdapter";
import { DataAdapter } from "../../ui/adapter/DataAdapter";
import { GroupAdapter } from "../../ui/adapter/GroupAdapter";
import { ContainerBase } from "../../ui/Container";
import { Cx } from "../../ui/Cx";
import { Format } from "../../ui/Format";
import { Instance } from "../../ui/Instance";
import { Localization } from "../../ui/Localization";
import { PureContainer } from "../../ui/PureContainer";
import { RenderingContext } from "../../ui/RenderingContext";
import { Selection } from "../../ui/selection/Selection";
import { getContent, VDOM, Widget } from "../../ui/Widget";
import { Console } from "../../util/Console";
import { findFirstChild } from "../../util/DOM";
import { isArray } from "../../util/isArray";
import { isDefined } from "../../util/isDefined";
import { isNonEmptyArray } from "../../util/isNonEmptyArray";
import { isNumber } from "../../util/isNumber";
import { isObject } from "../../util/isObject";
import { isString } from "../../util/isString";
import { parseStyle } from "../../util/parseStyle";
import { SubscriberList } from "../../util/SubscriberList";
import { ddDetect, ddMouseDown, initiateDragDrop } from "../drag-drop/ops";
import DropDownIcon from "../icons/sort-asc";
import { captureMouse2, getCursorPos } from "../overlay/captureMouse";
import { tooltipMouseLeave, tooltipMouseMove } from "../overlay/tooltip-ops";
import { GridRow, GridRowInstance } from "./GridRow";
import type { GridRowConfig } from "./GridRow";
import type { MappedGridRecord, GridGroupingConfig, GridConfig } from "./Grid.types";
import { GridColumnHeaderLine } from "./GridColumnHeader";
import { GridComponent } from "./GridComponent";
export type { GridColumnHeaderLineConfig, GridColumnHeaderCellConfig } from "./GridColumnHeader";
export type {
   GridFetchRecordsResult,
   MappedGridRecord,
   GridDragEvent,
   GridRowDragEvent,
   GridColumnDropEvent,
   GridGroupingKey,
   GridColumnAlignment,
   GridGroupingConfig,
   GridColumnHeaderConfig,
   GridColumnFooterConfig,
   GridColumnCaptionConfig,
   GridColumnConfig,
   GridConfig,
   GridCellInfo,
   GridCellBeforeEditInfo,
   GridCellEditInfo,
} from "./Grid.types";
export type { GridRowConfig };

export class GridInstance<T = any> extends Instance<Grid<T>> {
   declare isRecordSelectable?: (record: any, options?: any) => boolean;
   declare visibleColumns: any[];
   declare isRecordDraggable?: (record: any) => boolean;
   declare row?: any;
   declare fixedFooterVDOM?: any;
   declare fixedColumnsFixedFooterVDOM?: any;
   declare hasFixedColumns?: boolean;
   declare recordInstanceCache?: any;
   declare records?: MappedGridRecord<T>[];
   declare isSelected: (record: any, index?: number) => boolean;
   declare v: number;
   declare buffer?: any;
   declare dataAdapter: ArrayAdapter<T>;
   declare fixedFooterIsGroupFooter?: boolean;

   declare fixedColumnCount: number;
   declare fixedHeaderResizeEvent?: any;
   declare hoverSync?: any;
   declare header?: any;
   declare fixedFooterOverlap?: boolean;
   declare state: any;

   resetColumnWidths() {
      this.setState({ colWidth: {} });
   }
}

export class Grid<T = unknown> extends ContainerBase<GridConfig<T>, GridInstance<T>> {
   constructor(config?: GridConfig<T>) {
      super(config);
   }

   declare records?: any;
   declare scrollable?: boolean;
   declare sorters?: any;
   declare preSorters?: any;
   declare sortField?: any;
   declare sortDirection?: any;
   declare defaultSortField?: string;
   declare defaultSortDirection?: "ASC" | "DESC";
   declare vlines?: boolean;
   declare emptyText?: any;
   declare dragSource?: any;
   declare dropZone?: any;
   declare row?: any;
   declare columns?: any[];
   declare columnParams?: any;
   declare selection: any;
   declare grouping?: string | GridGroupingConfig<any> | (string | GridGroupingConfig<any>)[];
   declare groupingParams?: any;
   declare headerMode?: any;
   declare border?: any;
   declare baseClass: string;
   declare keyField?: string;
   declare showHeader: boolean;
   declare showFooter: boolean;
   declare recordName: string;
   declare recordAlias?: string;
   declare indexName: string;
   declare indexAlias?: string;
   declare remoteSort: boolean;
   declare cached: boolean;
   declare buffered: boolean;
   declare bufferSize: number;
   declare bufferStep: number;
   declare pageSize: number;
   declare measureRowHeights?: boolean;
   declare scrollSelectionIntoView: boolean;
   declare lockColumnWidths: boolean;
   declare lockColumnWidthsRequiredRowCount: number;
   declare focused: boolean;
   declare showBorder: boolean;
   declare dataAdapter?: DataAdapter;
   declare rowClass?: any;
   declare rowStyle?: any;
   declare onDrop?: any;
   declare onDropTest?: any;
   declare onDragStart?: any;
   declare onDragEnd?: any;
   declare onDragOver?: any;
   declare onRowDropTest?: any;
   declare onRowDragOver?: any;
   declare onRowDrop?: any;
   declare onColumnDrop?: any;
   declare onColumnDropTest?: any;
   declare filterParams?: any;
   declare onRowContextMenu?: any;
   declare onColumnContextMenu?: any;
   declare onCreateFilter?: any;
   declare infinite: boolean;
   declare clearableSort: boolean;
   declare onFetchRecords?: any;
   declare onRowDoubleClick?: any;
   declare onRowKeyDown?: any;
   declare onKeyDown?: any;
   declare onCellKeyDown?: any;
   declare onRowClick?: any;
   declare fixedFooter?: boolean;
   declare cellEditable: boolean;
   declare onBeforeCellEdit?: any;
   declare onCellEdited?: any;
   declare onColumnResize?: any;
   declare sortOptions?: any;
   declare onCreateIsRecordSelectable?: any;
   declare scrollResetParams?: any;
   declare preciseMeasurements: boolean;
   declare hoverChannel: string;
   declare rowHoverId?: any;
   declare focusable: boolean | null;
   declare onGetGrouping?: any;
   declare onGetColumns?: any;
   declare allowsFileDrops: boolean;
   declare onTrackMappedRecords?: any;
   declare onCreateIsRecordDraggable?: any;
   declare onRef?: any;
   declare preserveGroupOrder: boolean;
   declare sortGroups: boolean;
   declare styled: boolean;
   declare selectable?: boolean;
   declare recordsAccessor: any;
   declare hasResizableColumns?: boolean;
   declare pipeKeyDown?: any;
   declare onLoadingError?: any;

   declareData(...args: any[]) {
      let selection = this.selection.configureWidget(this);

      super.declareData(
         ...args,
         {
            records: undefined,
            sorters: undefined,
            preSorters: undefined,
            scrollable: undefined,
            sortField: undefined,
            sortDirection: undefined,
            emptyText: undefined,
            dragSource: { structured: true },
            dropZone: { structured: true },
            filterParams: { structured: true },
            groupingParams: { structured: true },
            scrollResetParams: { structured: true },
            page: undefined,
            totalRecordCount: undefined,
            tabIndex: undefined,
            columnParams: { structured: true },
         },
         selection,
      );
   }

   init() {
      if (this.recordAlias) this.recordName = this.recordAlias;

      if (this.indexAlias) this.indexName = this.indexAlias;

      if (this.infinite) {
         this.buffered = true;
         this.remoteSort = true;
      }

      if (this.buffered) this.scrollable = true;

      this.recordsAccessor = getAccessor(this.records);

      this.selection = Selection.create(this.selection, {
         records: this.records,
      });

      if (!this.selection.isDummy || this.onRowClick || this.onRowDoubleClick) this.selectable = true;
      if (this.focusable == null) this.focusable = !this.selection.isDummy || this.cellEditable;

      super.init();
   }

   createInstance(key: string, parent: Instance, parentStore?: View): GridInstance<T> {
      return new GridInstance(this, key, parent, parentStore);
   }

   initState(context: RenderingContext, instance: GridInstance) {
      instance.state = {
         colWidth: {},
         lockedColWidth: {},
         dimensionsVersion: 0,
         disableDefaultSort: false,
      };
      instance.v = 0;
      if (this.infinite)
         instance.buffer = {
            records: [],
            totalRecordCount: 0,
            page: 1,
         };
   }

   applyParentStore(instance: GridInstance) {
      super.applyParentStore(instance);

      // force prepareData to execute again and propagate the store change to the records
      if (instance.cached) delete instance.cached.rawData;
   }

   createRowTemplate(context: RenderingContext, columnParams: any, instance: GridInstance, groupingData: any) {
      // Clone row to avoid mutating the original config
      var row = { ...this.row };
      let columns = this.columns;
      if (this.onGetColumns) {
         let result = instance.invoke("onGetColumns", columnParams, instance);
         if (isArray(result)) columns = result;
         else row = result;
      }

      if (columns)
         row.line1 = {
            columns,
         };

      row.hasSortableColumns = false;
      row.hasResizableColumns = false;
      row.hasMergedCells = false;
      row.mergedColumns = [];

      let aggregates: Record<string, { value: any; weight: any; type: any }> = {};
      let showFooter = false;
      let lines = [];
      for (let i = 0; i < 10; i++) {
         let l = row["line" + i];
         if (l) {
            if (isArray(l.columns)) {
               // Clone columns to avoid mutating the original config
               l.columns = l.columns.map((col: any, c: number) => ({
                  ...col,
                  uniqueColumnId: `l${i}-${col.key || c}`,
               }));
            }
            lines.push(l);
         }
      }

      row.header = PureContainer.create({
         items: GridColumnHeaderLine.create(lines),
      });

      row.header.items.forEach((line: any) => {
         line.items.forEach((c: any, index: number) => {
            if (c.sortable) row.hasSortableColumns = true;

            if (c.mergeCells) {
               if (row.header.items.length > 1)
                  Console.warn("Merged columns are only supported in grids in which rows have only one line of cells.");
               else {
                  row.hasMergedCells = true;
                  row.mergedColumns.push({
                     uniqueColumnId: c.uniqueColumnId,
                     index,
                     mode: c.mergeCells,
                  });
               }
            }

            if (
               c.resizable ||
               (c.header && c.header.resizable) ||
               (c.header1 && c.header1.resizable) ||
               (c.header2 && c.header2.resizable) ||
               (c.header3 && c.header3.resizable)
            )
               row.hasResizableColumns = true;

            if (c.aggregate && c.aggregateAlias && (c.aggregateField || isDefined(c.aggregateValue))) {
               aggregates[c.aggregateAlias] = {
                  value: isDefined(c.aggregateValue)
                     ? c.aggregateValue
                     : isDefined(c.value)
                       ? c.value
                       : c.aggregateField
                         ? { bind: this.recordName + "." + c.aggregateField }
                         : null,
                  weight:
                     c.weight != null
                        ? c.weight
                        : c.weightField && {
                             bind: this.recordName + "." + c.weightField,
                          },
                  type: c.aggregate,
               };
            } else if (c.footer && !showFooter) {
               showFooter = true;
            }
         });
      });

      //add default footer if some columns have aggregates and grouping is not defined
      if (!groupingData && (Object.keys(aggregates).length > 0 || this.fixedFooter || showFooter))
         groupingData = [
            {
               key: {},
               showFooter: true,
            },
         ];

      let { grouping, showHeader } = this.resolveGrouping(groupingData);

      this.showHeader = showHeader;

      if (this.fixedFooter && isNonEmptyArray(grouping)) {
         grouping[0].showFooter = true;
         if (grouping[0].key && Object.keys(grouping[0].key).length > 0)
            Console.warn(
               "First grouping level in grids with a fixed footer must group all data. The key field should be omitted.",
            );
      }

      instance.dataAdapter =
         this.dataAdapter instanceof ArrayAdapter
            ? this.dataAdapter
            : GroupAdapter.create(
                 {
                    recordsAccessor: this.recordsAccessor,
                    keyField: this.keyField,
                    aggregates: aggregates,
                    recordName: this.recordName,
                    indexName: this.indexName,
                    sortOptions: this.sortOptions,
                    groupings: grouping,
                    preserveOrder: this.preserveGroupOrder,
                    sortGroupsBySorters: this.sortGroups,
                 },
                 this.dataAdapter,
              );

      instance.dataAdapter.initInstance(context, instance);

      return Widget.create(GridRow, {
         class: this.CSS.element(this.baseClass, "data"),
         className: this.rowClass,
         style: this.rowStyle,
         recordName: this.recordName,
         hoverId: this.rowHoverId,
         ...row,
      });
   }

   prepareData(context: RenderingContext, instance: GridInstance) {
      let { data, state, cached, row } = instance;

      let grouping = this.grouping;

      if (this.onGetGrouping) {
         if (!cached.data || cached.data.groupingParams !== data.groupingParams)
            grouping = instance.invoke("onGetGrouping", data.groupingParams, instance);
         else grouping = cached.grouping;
      }

      let groupingChanged = instance.cache("grouping", grouping);

      if (instance.cache("columnParams", data.columnParams) || groupingChanged || !row) {
         row = instance.row = this.createRowTemplate(context, data.columnParams, instance, grouping);
      }

      data.version = instance.v++;

      if (!this.infinite) data.totalRecordCount = isArray(data.records) ? data.records.length : 0;
      else {
         if (isNumber(data.totalRecordCount)) instance.buffer.totalRecordCount = data.totalRecordCount;
         else data.totalRecordCount = instance.buffer.totalRecordCount;

         if (isDefined(data.records)) instance.buffer.records = data.records;
         else data.records = instance.buffer.records;

         if (isNumber(data.page)) instance.buffer.page = data.page;
         else data.page = instance.buffer.page;

         data.offset = (data.page - 1) * this.pageSize;
      }

      if (!isArray(data.records)) data.records = [];

      if (state.sorters && !isDefined(this.sorters)) data.sorters = state.sorters;

      let sortField = null;

      // rebuild sorters from the sortField/sortDirection bindings only if a sort field
      // is actually set; sorts identified by a value selector (columns without a field)
      // live in data.sorters/state.sorters and cannot round-trip through a field name
      if (isDefined(this.sortField) && isDefined(this.sortDirection) && data.sortField) {
         let sorter = {
            field: data.sortField,
            direction: data.sortDirection || "ASC",
         };
         sortField = data.sortField;
         data.sorters = [sorter];
      }

      let skipDefaultSorting = this.clearableSort && instance.state.disableDefaultSort;
      if (!skipDefaultSorting && !isNonEmptyArray(data.sorters) && this.defaultSortField) {
         let sorter = {
            field: this.defaultSortField,
            direction: this.defaultSortDirection || "ASC",
         };
         sortField = this.defaultSortField;
         data.sorters = [sorter];
      }

      if (sortField) {
         for (let l = 0; l < 10; l++) {
            let line = instance.row[`line${l}`];
            let sortColumn =
               line && line.columns && line.columns.find((c: any) => (c.sortField || c.field) == sortField);
            if (sortColumn) {
               // precedence: sortValue > sortField > value > field
               data.sorters[0].value = isDefined(sortColumn.sortValue)
                  ? sortColumn.sortValue
                  : sortColumn.sortField
                    ? undefined
                    : sortColumn.value;
               data.sorters[0].comparer = sortColumn.comparer;
               data.sorters[0].sortOptions = sortColumn.sortOptions;
               data.sorters[0].nullsFirst = sortColumn.nullsFirst;
               data.sorters[0].nullValue = sortColumn.nullSortValue;
               break;
            }
         }
      }

      let headerMode = this.headerMode;

      if (this.headerMode == null) {
         if (this.scrollable || row.hasSortableColumns || row.hasResizableColumns) headerMode = "default";
         else headerMode = "plain";
      }

      let border = this.border;

      if (this.showBorder || (border == null && this.scrollable)) border = true;

      let dragMode = false;
      if (data.dragSource) dragMode = data.dragSource.mode || "move";

      let dropMode = data.dropZone && data.dropZone.mode;

      if (this.onDrop && !dropMode) dropMode = "preview";

      data.dropMode = dropMode;

      data.stateMods = {
         selectable: this.selectable,
         "cell-editable": this.cellEditable,
         scrollable: data.scrollable,
         buffered: this.buffered,
         ["header-" + headerMode]: true,
         border: border,
         vlines: this.vlines,
         ["drag-" + dragMode]: dragMode,
         ["drop-" + dropMode]: dropMode,
         resizable: row.hasResizableColumns,
      };

      super.prepareData(context, instance);

      instance.records = this.mapRecords(context, instance);

      //tree adapters can have additional (child) records, filtering also affects actual record count
      if (instance.records && !this.infinite) {
         //apply record count after filtering
         data.totalRecordCount = instance.records.length;

         //recheck if there are any actual records
         //when grouping is enabled group header/footer are always in
         if (instance.records.length < 5) {
            data.empty = true;
            for (let i = 0; i < instance.records.length; i++)
               if (instance.records[i].type == "data") {
                  data.empty = false;
                  break;
               }
         } else data.empty = data.totalRecordCount == 0;
      } else data.empty = data.totalRecordCount == 0;

      if (this.onCreateIsRecordSelectable) {
         instance.isRecordSelectable = instance.invoke("onCreateIsRecordSelectable", null, instance);
      }

      if (this.onCreateIsRecordDraggable) {
         instance.isRecordDraggable = instance.invoke("onCreateIsRecordDraggable", null, instance);
      }

      if (this.onTrackMappedRecords) {
         instance.invoke("onTrackMappedRecords", instance.records, instance);
      }
   }

   initInstance(context: RenderingContext, instance: GridInstance) {
      instance.fixedHeaderResizeEvent = new SubscriberList();
      super.initInstance(context, instance);
   }

   explore(context: RenderingContext, instance: GridInstance) {
      context.push("parentPositionChangeEvent", instance.fixedHeaderResizeEvent);

      instance.hoverSync = context.hoverSync;

      super.explore(context, instance);

      instance.header = instance.getChild(context, instance.row.header, "header");
      instance.header.scheduleExploreIfVisible(context);

      let { store } = instance;
      instance.isSelected = this.selection.getIsSelectedDelegate(store);

      if (!this.buffered) {
         // Rows that are not explored in this cycle are marked as still in use (explored rows are marked when
         // their visibility is checked). Otherwise the instance cache drops them when the grid renders, which
         // destroys their content and creates it again on the next change.
         let instanceCache = instance.getInstanceCache();

         //in cached mode, do not process rows if nothing has changed
         if (!this.cached || instance.shouldUpdate) {
            for (let i = 0; i < instance.records!.length; i++) {
               let record = instance.records![i];
               if (record.type == "data") {
                  let row = (record.row = instance.getChild(
                     context,
                     instance.row,
                     record.key,
                     record.store,
                  ) as GridRowInstance);
                  row.selected = instance.isSelected(record.data, record.index);
                  let changed = false;
                  if (row.cache("selected", row.selected)) changed = true;
                  if (row.cache("recordData", record.data)) changed = true;
                  if (this.cached && !changed && !row.childStateDirty) {
                     row.shouldUpdate = false;
                     if (row.visible) instanceCache.addChild(row);
                  } else row.scheduleExploreIfVisible(context);
               }
            }
         } else if (instance.records) {
            // the rows are not visited, but the grid may still render (e.g. if the header changes)
            for (let i = 0; i < instance.records.length; i++) {
               let row = instance.records[i].row;
               if (row?.visible) instanceCache.addChild(row);
            }
         }
      }
   }

   exploreCleanup(context: RenderingContext, instance: GridInstance) {
      context.pop("parentPositionChangeEvent");
      let fixedColumnCount = 0,
         visibleColumns: any[] = [];
      instance.header.children.forEach((line: any) => {
         line.children.forEach((col: any) => {
            if (col.data.fixed) fixedColumnCount++;
            visibleColumns.push(col.widget);
         });
      });
      instance.visibleColumns = visibleColumns;
      instance.hasFixedColumns = fixedColumnCount > 0;
      instance.fixedColumnCount = fixedColumnCount;
      if (fixedColumnCount > 0) {
         instance.data.classNames += ` ${instance.widget.CSS.state("fixed-columns")}`;
      }
   }

   resolveGrouping(grouping: any) {
      if (grouping) {
         if (!isArray(grouping)) {
            if (isString(grouping) || isObject(grouping)) grouping = [grouping];
            else throw new Error("Dynamic grouping should be an array of grouping objects.");
         }

         grouping = grouping.map((g: any, i: any) => {
            let group;
            if (isString(g))
               group = {
                  key: {
                     [g]: {
                        bind: this.recordName + "." + g,
                     },
                  },
                  showHeader: !this.scrollable && i == grouping.length - 1,
                  showFooter: true,
                  caption: { bind: `$group.${g}` },
                  text: { bind: `${this.recordName}.${g}` },
               };
            else
               group = {
                  ...g,
               };
            if (group.caption) group.caption = getSelector(group.caption);
            return group;
         });
      }

      let showHeader = !isArray(grouping) || !grouping.some((g: any) => g.showHeader);

      return { showHeader, grouping };
   }

   groupBy(groupingData: any, options?: any) {
      let { grouping, showHeader } = this.resolveGrouping(groupingData);
      this.grouping = grouping;
      if (options?.autoConfigure) this.showHeader = showHeader;
      this.update();
   }

   render(context: RenderingContext, instance: GridInstance, key: string) {
      let { data, hasFixedColumns } = instance;

      let fixedHeader =
         data.scrollable && this.showHeader && this.renderHeader(context, instance, "header", true, false);

      let fixedColumnsFixedHeader =
         data.scrollable &&
         this.showHeader &&
         hasFixedColumns &&
         this.renderHeader(context, instance, "header", true, true);

      if (!this.buffered) this.renderRows(context, instance);

      if (this.fixedFooter) this.renderFixedFooter(context, instance);

      let header = this.showHeader && this.renderHeader(context, instance, "header", false, false);

      let fixedColumnsHeader =
         this.showHeader && hasFixedColumns && this.renderHeader(context, instance, "header", false, true);

      return (
         <GridComponent
            key={key}
            instance={instance}
            data={instance.data}
            shouldUpdate={instance.shouldUpdate}
            header={header}
            fixedColumnsHeader={fixedColumnsHeader}
            fixedColumnsFixedHeader={fixedColumnsFixedHeader}
            fixedHeader={fixedHeader}
            fixedFooter={instance.fixedFooterVDOM}
            fixedColumnsFixedFooter={instance.fixedColumnsFixedFooterVDOM}
         >
            {this.renderChildren(context, instance)}
         </GridComponent>
      );
   }

   renderResizer(instance: GridInstance, hdinst: any, header: any, colIndex: number, forPreviousColumn?: any) {
      let { widget } = instance;

      let { CSS, baseClass } = widget;

      let hdwidget = hdinst.widget;

      let resizerClassName = "col-resizer";
      if (forPreviousColumn) resizerClassName += "-prev-col";

      return (
         <div
            className={CSS.element(baseClass, resizerClassName)}
            onClick={(e) => {
               e.stopPropagation();
            }}
            data-unique-col-id={hdwidget.uniqueColumnId}
            onMouseDown={(e) => {
               if (e.buttons != 1) return;
               let resizeOverlayEl: HTMLDivElement | null = document.createElement("div");

               let gridEl = (e.target as HTMLElement).parentElement!.parentElement!.parentElement!.parentElement!
                  .parentElement!.parentElement!;
               let uniqueColId = (e.currentTarget as HTMLElement).dataset.uniqueColId;

               // if we use fixed columns, rhs resizer of the last fixed column is within regular columns header tbody
               let headerCell = findFirstChild(
                  gridEl,
                  (el) =>
                     el.tagName == "TH" &&
                     (el as HTMLElement).dataset &&
                     (el as HTMLElement).dataset.uniqueColId == uniqueColId,
               );

               let initialWidth = (headerCell as HTMLElement).offsetWidth;
               let initialPosition = getCursorPos(e);
               resizeOverlayEl.className = CSS.element(baseClass, "resize-overlay");
               resizeOverlayEl.style.width = `${initialWidth}px`;
               resizeOverlayEl.style.left = `${
                  (headerCell as HTMLElement).getBoundingClientRect().left - gridEl.getBoundingClientRect().left
               }px`;
               gridEl.appendChild(resizeOverlayEl);
               captureMouse2(e, {
                  onMouseMove: (e) => {
                     let cursor = getCursorPos(e);
                     let width = Math.max(30, Math.round(initialWidth + cursor.clientX - initialPosition.clientX));
                     resizeOverlayEl!.style.width = `${width}px`;
                  },
                  onMouseUp: (e) => {
                     if (!resizeOverlayEl) return; //dblclick
                     let width = resizeOverlayEl.offsetWidth;
                     hdinst.assignedWidth = width;
                     gridEl.removeChild(resizeOverlayEl);
                     resizeOverlayEl = null;
                     if (widget.onColumnResize) instance.invoke("onColumnResize", { width, column: hdwidget }, hdinst);
                     header.set("width", width);
                     instance.setState({
                        dimensionsVersion: instance.state.dimensionsVersion + 1,
                        colWidth: {
                           ...instance.state.colWidth,
                           [hdwidget.uniqueColumnId]: width,
                        },
                     });
                  },
                  onDblClick: () => {
                     let table = gridEl.querySelector("table")!;
                     let parentEl = table.parentElement!;
                     let tableClone: HTMLTableElement = table.cloneNode(true) as HTMLTableElement;
                     tableClone.childNodes.forEach((tbody: any) => {
                        tbody.childNodes.forEach((tr: any) => {
                           tr.childNodes.forEach((td: any, index: number) => {
                              if (index == colIndex) {
                                 td.style.maxWidth = null;
                                 td.style.minWidth = null;
                                 td.style.width = "auto";
                              } else {
                                 td.style.display = "none";
                              }
                           });
                        });
                     });
                     tableClone.style.position = "absolute";
                     tableClone.style.visibility = "hidden";
                     tableClone.style.top = "0";
                     tableClone.style.left = "0";
                     tableClone.style.width = "auto";
                     parentEl.appendChild(tableClone);
                     let width = tableClone.offsetWidth;
                     parentEl.removeChild(tableClone);
                     header.set("width", width);
                     instance.setState({
                        dimensionsVersion: instance.state.dimensionsVersion + 1,
                        colWidth: {
                           ...instance.state.colWidth,
                           [hdwidget.uniqueColumnId]: width,
                        },
                     });
                  },
               });
            }}
         />
      );
   }

   renderHeader(
      context: RenderingContext,
      instance: GridInstance,
      key: any,
      fixed: any,
      fixedColumns: any,
      repeated?: boolean,
   ) {
      let { data, widget, header } = instance;

      let { CSS, baseClass } = widget;

      let headerRows: any[] = [];

      if (!header) return null;

      let skip: any = {};
      let lineIndex = 0;

      header.children.forEach((line: any) => {
         let empty = [true, true, true];
         let result: any[] = [[], [], []];

         line.children.forEach((hdinst: any, colIndex: number) => {
            let hdwidget = hdinst.widget;
            for (let l = 0; l < 3; l++) {
               let colKey = `${lineIndex + l}-${colIndex}`;

               if (skip[colKey]) continue;

               if (Boolean(hdinst.data.fixed) != fixedColumns) continue;

               let header = hdinst.components[`header${l + 1}`];
               let colSpan,
                  rowSpan,
                  style,
                  cls,
                  mods = [],
                  content,
                  sortIcon,
                  tool;

               let resizer = null,
                  prevColumnResizer = null;

               if (header) {
                  empty[l] = false;

                  if (header.widget.align) mods.push("aligned-" + header.widget.align);
                  else if (hdwidget.align) mods.push("aligned-" + hdwidget.align);

                  if (hdwidget.sortable && header.widget.allowSorting) {
                     mods.push("sortable");
                     let sorter = data.sorters && data.sorters[0];
                     let sortColumnField = hdwidget.sortField || hdwidget.field;
                     let sortColumnValue = isDefined(hdwidget.sortValue)
                        ? hdwidget.sortValue
                        : hdwidget.sortField
                          ? undefined
                          : hdwidget.value;
                     // a sort is identified by its (field, value selector) pair, so columns
                     // sorting by the same field through different value selectors don't both match
                     let sorted =
                        sorter &&
                        !!sorter.direction &&
                        (sortColumnField
                           ? sorter.field == sortColumnField
                           : !sorter.field && isDefined(sortColumnValue)) &&
                        sorter.value === sortColumnValue;
                     if (sorted) {
                        mods.push("sorted-" + sorter.direction.toLowerCase());
                        sortIcon = <DropDownIcon className={CSS.element(baseClass, "column-sort-icon")} />;
                     }
                  }

                  let uniqueColumnId = header.data.colSpan > 1 ? null : hdwidget.uniqueColumnId;

                  style = header.data.style;
                  let customWidth =
                     header.data.width ||
                     instance.state.colWidth[uniqueColumnId] ||
                     header.data.defaultWidth ||
                     instance.state.lockedColWidth[uniqueColumnId];
                  if (customWidth) {
                     if (instance.state.colWidth[uniqueColumnId] != customWidth)
                        instance.state.colWidth[uniqueColumnId] = customWidth;
                     let s = `${customWidth}px`;
                     style = {
                        ...style,
                        width: s,
                        minWidth: s,
                        maxWidth: s,
                     };
                  }

                  if (header.data.classNames) cls = header.data.classNames;

                  content = header.render(context);

                  if (header.components && header.components.tool) {
                     tool = (
                        <div className={CSS.element(baseClass, "col-header-tool")}>
                           {getContent(header.components.tool.render(context))}
                        </div>
                     );
                     mods.push("tool");
                  }

                  if (header.data.colSpan > 1 || header.data.rowSpan > 1) {
                     colSpan = header.data.colSpan;
                     rowSpan = header.data.rowSpan;

                     for (let r = 0; r < header.data.rowSpan; r++)
                        for (let c = 0; c < header.data.colSpan; c++)
                           skip[`${lineIndex + l + r}-${colIndex + c}`] = true;
                  }

                  if ((hdwidget.resizable || header.data.resizable) && header.data.colSpan < 2) {
                     resizer = this.renderResizer(instance, hdinst, header, colIndex);
                  }

                  if (colIndex > 0) {
                     let hdinstPrev = line.children[colIndex - 1];
                     let prevLine = 3;
                     let headerPrev;
                     while (!headerPrev && prevLine >= 0) {
                        headerPrev = hdinstPrev.components[`header${prevLine + 1}`];
                        prevLine--;
                     }
                     if (
                        (hdinstPrev.widget.resizable || headerPrev?.data?.resizable) &&
                        headerPrev?.data?.colSpan < 2
                     ) {
                        prevColumnResizer = this.renderResizer(instance, hdinstPrev, headerPrev, colIndex - 1, true);
                     }
                  }
               }

               cls = CSS.element(baseClass, "col-header", mods) + (cls ? " " + cls : "");

               let onContextMenu;

               if (this.onColumnContextMenu)
                  onContextMenu = (e: any) => instance.invoke("onColumnContextMenu", e, hdinst);

               result[l].push(
                  <th
                     key={colIndex}
                     colSpan={colSpan}
                     rowSpan={rowSpan}
                     className={cls}
                     style={style}
                     onMouseDown={ddMouseDown}
                     onMouseMove={(e) => this.onHeaderMouseMove(e, hdwidget, hdinst, instance, l)}
                     onMouseLeave={(e) => this.onHeaderMouseLeave(e, hdinst, l)}
                     onClick={(e) => this.onHeaderClick(e, hdwidget, instance, l)}
                     onContextMenu={onContextMenu}
                     data-unique-col-id={colSpan > 1 ? null : hdwidget.uniqueColumnId}
                  >
                     {getContent(content)}
                     {sortIcon}
                     {tool}
                     {prevColumnResizer}
                     {resizer}
                  </th>,
               );
            }
         });

         result = result.filter((_, i) => !empty[i]);
         lineIndex += result.length;

         if (result[0]) {
            if (fixed && !fixedColumns) {
               result[0].push(
                  <th key="dummy" rowSpan={result.length} className={CSS.element(baseClass, "col-header")} />,
               );
            }

            headerRows.push(...result.map((h, i) => <tr key={`${lineIndex}-${i}`}>{h}</tr>));
         }
      });

      if (headerRows.length == 0) return null;

      //headers repeated for each group sit between the data rows, where a second thead
      //would not be allowed
      return VDOM.createElement(
         repeated ? "tbody" : "thead",
         { key: "h" + key, className: CSS.element(baseClass, "header") },
         headerRows,
      );
   }

   onHeaderMouseMove(e: any, column: any, columnInstance: any, gridInstance: any, headerLine: any) {
      let { baseClass, CSS } = gridInstance.widget;
      if (columnInstance.data.fixed) return;
      let headerInstance = columnInstance.components[`header${headerLine + 1}`];
      if (!headerInstance) return;
      let { store, data } = headerInstance;
      if (headerInstance.widget?.tooltip) {
         tooltipMouseMove(e, headerInstance, headerInstance.widget.tooltip);
      }
      if (data.draggable && !data.fixed && ddDetect(e) && e.buttons == 1) {
         initiateDragDrop(
            e,
            {
               sourceEl: e.currentTarget,
               source: {
                  type: "grid-column",
                  store,
                  column,
                  columnInstance,
                  headerInstance,
                  gridInstance,
                  headerLine,
               },
               clone: {
                  store: store,
                  matchCursorOffset: true,
                  matchWidth: true,
                  widget: () => <div className={CSS.element(baseClass, "col-header-drag-clone")}>{data.text}</div>,
               },
            },
            () => {},
         );
      }
   }

   onHeaderMouseLeave(e: any, columnInstance: any, headerLine: any) {
      let headerInstance = columnInstance.components[`header${headerLine + 1}`];
      if (!headerInstance) return;
      if (headerInstance.widget?.tooltip) {
         tooltipMouseLeave(e, headerInstance, headerInstance.widget.tooltip);
      }
   }

   onHeaderClick(e: any, column: any, instance: any, headerLine: any) {
      e.preventDefault();
      e.stopPropagation();

      let { data } = instance;
      let header = column.components[`header${headerLine + 1}`];

      let field = column.sortField || column.field;
      // precedence: sortValue > sortField > value > field; the comparer prefers value
      // over field, so value must not be attached when an explicit sortField is set
      let value = isDefined(column.sortValue) ? column.sortValue : column.sortField ? undefined : column.value;
      let comparer = column.comparer;
      let sortOptions = column.sortOptions;
      let nullsFirst = column.nullsFirst;
      let nullValue = column.nullSortValue;

      if (header && header.allowSorting && column.sortable && (field || isDefined(value))) {
         let direction = column.primarySortDirection ?? "ASC";
         // the column matches the active sorter only if both the field and the value
         // selector are the same; two columns may sort by the same field through
         // different value selectors and represent different sorts
         if (isNonEmptyArray(data.sorters) && data.sorters[0].field == field && data.sorters[0].value === value) {
            if (data.sorters[0].direction == "ASC" && (!this.clearableSort || direction == "ASC")) direction = "DESC";
            else if (data.sorters[0].direction == "DESC" && (!this.clearableSort || direction == "DESC"))
               direction = "ASC";
            else {
               direction = null;
               instance.state.disableDefaultSort = true;
            }
         }

         let sorters = direction
            ? [
                 {
                    field,
                    direction,
                    value,
                    comparer,
                    sortOptions,
                    nullsFirst,
                    nullValue,
                 },
              ]
            : null;

         if (sorters == null) field = null;

         instance.set("sorters", sorters);
         instance.set("sortField", field);
         instance.set("sortDirection", direction);

         if (!this.remoteSort || this.infinite) instance.setState({ sorters });
      }
   }

   renderGroupHeader(
      context: RenderingContext | null,
      instance: GridInstance,
      g: any,
      level: any,
      group: any,
      i: any,
      store: any,
      fixedColumns: any,
   ) {
      let { CSS, baseClass } = this;
      let data = store.getData();
      let resetRowNumbers = g.resetRowNumbers ? "reset-row-numbers" : null;
      if (g.caption) {
         let caption = g.caption(data);
         return (
            <tbody
               key={`g-${level}-${group.$key}`}
               className={CSS.element(baseClass, "group-caption", ["level-" + level, resetRowNumbers])}
               data-group-key={group.$key}
               data-group-element={`group-caption-${level}`}
            >
               <tr>
                  <td colSpan={1000} role="columnheader">
                     {caption}
                  </td>
               </tr>
            </tbody>
         );
      } else if (g.showCaption) {
         let skip = 0;

         let { header } = instance;

         let lines: any[] = [];
         header.children.forEach((line: any, lineIndex: number) => {
            let empty = true;

            let cells = line.children.map((ci: any, i: any) => {
               if (--skip >= 0) return null;

               if (Boolean(ci.data.fixed) != fixedColumns) return null;

               let v,
                  c = ci.widget,
                  colSpan,
                  pad,
                  cls = "",
                  style = null;
               if (c.caption) {
                  if (c.caption.children)
                     v = <Cx widget={c.caption.children} store={store} parentInstance={instance} subscribe />;
                  else {
                     v = c.caption.value(data);
                     let fmt = c.caption.format(data);
                     if (fmt) v = Format.value(v, fmt);
                  }
                  pad = c.caption.pad;
                  colSpan = c.caption.colSpan;
                  empty = false;
                  cls = CSS.expand(c.caption.class(data)) || "";
                  style = parseStyle(c.caption.style(data));
                  if (c.caption.expand) {
                     colSpan = 1;
                     for (
                        let ind = i + 1;
                        ind < line.children.length &&
                        !line.children[ind].widget.caption &&
                        !line.children[ind].widget.aggregate;
                        ind++
                     )
                        colSpan++;
                  }

                  if (colSpan > 1) skip = colSpan - 1;
               } else if (c.aggregate && c.aggregateAliasGetter && c.caption !== false) {
                  empty = false;
                  v = c.aggregateAliasGetter(group);
                  if (isString(ci.data.format)) v = Format.value(v, ci.data.format);
               }

               if (cls) cls += " ";
               if (c.align) cls += CSS.state("aligned-" + c.align);

               if (pad !== false) cls += (cls ? " " : "") + CSS.state("pad");

               return (
                  <td
                     key={i}
                     className={cls}
                     colSpan={colSpan}
                     role={c.caption ? "columnheader" : undefined}
                     style={style}
                  >
                     {v}
                  </td>
               );
            });

            if (empty) return;

            lines.push(<tr key={lineIndex}>{cells}</tr>);
         });

         if (lines.length == 0) return null;

         return (
            <tbody
               key={"c" + group.$key}
               className={CSS.element(baseClass, "group-caption", ["level-" + level, resetRowNumbers])}
               data-group-key={group.$key}
               data-group-element={`group-caption-${level}`}
            >
               {lines}
            </tbody>
         );
      }
   }

   renderGroupFooter(
      context: RenderingContext | null,
      instance: GridInstance,
      g: any,
      level: any,
      group: any,
      i: any,
      store: any,
      fixed: any,
      fixedColumns: any,
   ) {
      let { CSS, baseClass } = this;
      let data = store.getData();
      let skip = 0;

      let { header, state } = instance;
      let rowStyle = {};

      let lines: any[] = [];
      header.children.forEach((line: any, lineIndex: number) => {
         let empty = true;

         let cells = line.children.map((ci: any, i: any) => {
            if (--skip >= 0) return null;

            if (Boolean(ci.data.fixed) != fixedColumns) return null;

            let v,
               c = ci.widget,
               colSpan = 1,
               pad,
               cls = "",
               style = null;
            if (c.footer) {
               v = c.footer.value(data);
               let fmt = c.footer.format(data);
               if (fmt) v = Format.value(v, fmt);
               pad = c.footer.pad;
               colSpan = c.footer.colSpan;
               empty = false;
               cls = CSS.expand(c.footer.class(data)) || "";
               style = parseStyle(c.footer.style(data));
               if (c.footer.expand) {
                  colSpan = 1;
                  for (
                     let ind = i + 1;
                     ind < line.children.length &&
                     !line.children[ind].widget.footer &&
                     !line.children[ind].widget.aggregate;
                     ind++
                  )
                     colSpan++;
               }

               if (colSpan > 1) skip = colSpan - 1;
            } else if (c.aggregate && c.aggregateAliasGetter && c.footer !== false) {
               empty = false;
               v = c.aggregateAliasGetter(group);
               if (isString(ci.data.format)) v = Format.value(v, ci.data.format);
            }

            if (cls) cls += " ";
            if (c.align) cls += CSS.state("aligned-" + c.align);

            if (pad !== false) cls += (cls ? " " : "") + CSS.state("pad");

            // apply column width to footers too, but only if colSpan == 1,
            //  otherwise set 1px so that the footer is not participating in the layout

            let maxWidth = 1;
            if (colSpan == 1) maxWidth = state.colWidth[c.uniqueColumnId];
            style = {
               ...style,
               maxWidth,
            };

            return (
               <td key={i} className={cls} colSpan={colSpan} style={style}>
                  {v}
               </td>
            );
         });

         if (empty) return;

         if (fixed && !fixedColumns)
            cells.push(<td key="dummy" className={CSS.element(baseClass, "fixed-footer-corner")} />);

         lines.push(<tr key={lineIndex}>{cells}</tr>);
      });

      if (lines.length == 0) return null;

      return (
         <tbody
            key={"f" + i}
            style={rowStyle}
            className={CSS.element(baseClass, "group-footer", ["level-" + level])}
            data-group-key={group.$key}
            data-group-element={`group-footer-${level}`}
         >
            {lines}
         </tbody>
      );
   }

   renderRows(context: RenderingContext, instance: GridInstance) {
      let { records, hasFixedColumns } = instance;

      if (!isArray<any>(records)) return null;

      let record, g;

      for (let i = 0; i < records.length; i++) {
         record = records[i];
         if (record.type == "data") record.vdom = record.row!.render(context);

         if (record.type == "group-header") {
            record.vdom = [];
            record.fixedVdom = [];
            g = record.grouping;
            if (g.caption || g.showCaption)
               record.vdom.push(
                  this.renderGroupHeader(
                     context,
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
               record.fixedVdom.push(
                  this.renderGroupHeader(
                     context,
                     instance,
                     g,
                     record.level,
                     record.group,
                     record.key + "-caption",
                     record.store,
                     true,
                  ),
               );

            if (g.showHeader) {
               record.vdom.push(this.renderHeader(context, instance, record.key + "-header", false, false, true));
               if (hasFixedColumns)
                  record.fixedVdom.push(
                     this.renderHeader(context, instance, record.key + "-header", false, true, true),
                  );
            }
         }

         if (record.type == "group-footer") {
            g = record.grouping;
            if (g.showFooter) {
               record.vdom = this.renderGroupFooter(
                  context,
                  instance,
                  g,
                  record.level,
                  record.group,
                  record.key + "-footer",
                  record.store,
                  false,
                  false,
               );
               if (hasFixedColumns)
                  record.fixedVdom = this.renderGroupFooter(
                     context,
                     instance,
                     g,
                     record.level,
                     record.group,
                     record.key + "-footer",
                     record.store,
                     false,
                     true,
                  );
            }
         }
      }
   }

   renderFixedFooter(context: RenderingContext, instance: GridInstance) {
      let { records, hasFixedColumns, data } = instance;

      instance.fixedFooterVDOM = null;
      instance.fixedColumnsFixedFooterVDOM = null;

      if (data.empty || !isNonEmptyArray(records)) return;

      //all type of records are allowed here because the footer can be based on pre-computed data
      //it doesn't make sense to show the footer if the grid is empty though
      let record = records[records.length - 1];

      instance.fixedFooterOverlap = true;
      instance.fixedFooterIsGroupFooter = record.type == "group-footer";

      instance.fixedFooterVDOM = this.renderGroupFooter(
         context,
         instance,
         record.grouping,
         record.level || 1,
         record.group || { $key: "fixed-footer" },
         record.key + "-footer",
         record.store,
         true,
         false,
      );

      if (hasFixedColumns)
         instance.fixedColumnsFixedFooterVDOM = this.renderGroupFooter(
            context,
            instance,
            record.grouping,
            record.level,
            record.group || { $key: "fixed-footer" },
            record.key + "-footer",
            record.store,
            true,
            true,
         );
   }

   mapRecords(context: RenderingContext, instance: GridInstance) {
      let { data, store, dataAdapter } = instance;

      let filter = null;
      if (this.onCreateFilter) filter = instance.invoke("onCreateFilter", data.filterParams, instance);

      let sorters = !this.remoteSort && data.sorters;

      //apply pre-sorters only if some sorting is applied
      if (isNonEmptyArray(data.sorters) && isNonEmptyArray(data.preSorters)) {
         sorters = [...data.preSorters, ...data.sorters];
      }

      dataAdapter.setFilter(filter);
      dataAdapter.sort(sorters);

      //if no filtering or sorting applied, let the component maps records on demand
      if (
         this.buffered &&
         !this.fixedFooter &&
         !filter &&
         !isNonEmptyArray(sorters) &&
         !dataAdapter.isTreeAdapter &&
         !(instance.dataAdapter as any).groupings
      ) {
         dataAdapter.pruneCache(instance, data.records);
         return undefined;
      }

      return dataAdapter.getRecords(context, instance, data.records, store);
   }

   mapRecord(context: RenderingContext, instance: GridInstance, data: any, index: number) {
      return instance.dataAdapter.mapRecord(context, instance, data, instance.store, this.recordsAccessor, index);
   }
}

Grid.prototype.baseClass = "grid";
Grid.prototype.showHeader = true;
Grid.prototype.showFooter = false;
Grid.prototype.recordName = "$record";
Grid.prototype.indexName = "$index";
Grid.prototype.remoteSort = false;
Grid.prototype.lockColumnWidths = false;
Grid.prototype.lockColumnWidthsRequiredRowCount = 3;
Grid.prototype.focused = false;
Grid.prototype.emptyText = false;
Grid.prototype.showBorder = false; // show border override for material theme
Grid.prototype.cached = false;
Grid.prototype.buffered = false;
Grid.prototype.bufferStep = 15;
Grid.prototype.bufferSize = 60;
Grid.prototype.pageSize = 100;
Grid.prototype.infinite = false;
Grid.prototype.styled = true;
Grid.prototype.scrollSelectionIntoView = false;
Grid.prototype.clearableSort = false;
Grid.prototype.cellEditable = false;
Grid.prototype.preciseMeasurements = false;
Grid.prototype.hoverChannel = "default";
Grid.prototype.focusable = null; // automatically resolved
Grid.prototype.allowsFileDrops = false;
Grid.prototype.preserveGroupOrder = false;
Grid.prototype.sortGroups = false;

Widget.alias("grid", Grid);
Localization.registerPrototype("cx/widgets/Grid", Grid);

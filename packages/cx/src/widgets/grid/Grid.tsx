/** @jsxImportSource react */
import * as React from "react";
import { Widget, VDOM, getContent, WidgetConfig } from "../../ui/Widget";
import { PureContainer, PureContainerBase, PureContainerConfig } from "../../ui/PureContainer";
import { getSelector } from "../../data/getSelector";
import { isSelector } from "../../data/isSelector";
import { Format } from "../../ui/Format";
import { Selection } from "../../ui/selection/Selection";
import { DataAdapter } from "../../ui/adapter/DataAdapter";
import { GroupAdapter } from "../../ui/adapter/GroupAdapter";
import { ResizeManager } from "../../ui/ResizeManager";
import { KeyCode } from "../../util/KeyCode";
import { scrollElementIntoView } from "../../util/scrollElementIntoView";
import { findScrollableParent } from "../../util/findScrollableParent";
import { FocusManager, oneFocusOut, offFocusOut } from "../../ui/FocusManager";
import DropDownIcon from "../icons/sort-asc";
import {
   ddMouseDown,
   ddDetect,
   initiateDragDrop,
   registerDropZone,
   DragEvent,
   DragDropOperationContext,
} from "../drag-drop/ops";
import { GridRow, GridRowComponent } from "./GridRow";
import { Localization } from "../../ui/Localization";
import { SubscriberList } from "../../util/SubscriberList";
import { RenderingContext } from "../../ui/RenderingContext";
import { isNonEmptyArray } from "../../util/isNonEmptyArray";
import { isObject } from "../../util/isObject";
import { isString } from "../../util/isString";
import { isDefined } from "../../util/isDefined";
import { isArray } from "../../util/isArray";
import { isNumber } from "../../util/isNumber";
import { debounce } from "../../util/debounce";
import { shallowEquals } from "../../util/shallowEquals";
import { InstanceCache, Instance } from "../../ui/Instance";
import { Cx } from "../../ui/Cx";
import { Console } from "../../util/Console";
import { getTopLevelBoundingClientRect } from "../../util/getTopLevelBoundingClientRect";
import { getParentFrameBoundingClientRect } from "../../util/getParentFrameBoundingClientRect";
import { ValidationGroup } from "../form/ValidationGroup";
import { closest } from "../../util/DOM";
import { captureMouse2, getCursorPos } from "../overlay/captureMouse";
import { getAccessor } from "../../data/getAccessor";
import { getActiveElement } from "../../util/getActiveElement";
import { GridCellEditor } from "./GridCellEditor";
import { createGridCellEditor } from "./createGridCellEditor";
import { batchUpdates } from "../../ui/batchUpdates";
import { parseStyle } from "../../util/parseStyle";
import { StaticText } from "../../ui/StaticText";
import { unfocusElement } from "../../ui/FocusManager";
import { tooltipMouseMove, tooltipMouseLeave } from "../overlay/tooltip-ops";
import { Container, StyledContainerConfig } from "../../ui/Container";
import { findFirstChild } from "../../util/DOM";
import { Binding } from "../../data/Binding";
import { DataAdapterRecord } from "../../ui/adapter/DataAdapter";
import {
   BooleanProp,
   ClassProp,
   CollatorOptions,
   Config,
   DataRecord,
   NumberProp,
   Prop,
   RecordAlias,
   SortDirection,
   SortersProp,
   StringProp,
   StructuredProp,
   StyleProp,
   UnknownProp,
} from "../../ui/Prop";
import { ArrayAdapter } from "../../ui/adapter/ArrayAdapter";
import { isTextInputElement } from "../../util/isTextInputElement";
import { View } from "../../data";
import { HtmlElement } from "../HtmlElement";

type FetchRecordsResult<T> = T[] | { records: T[]; lastPage?: boolean; totalRecordCount?: number };

interface MappedGridRecord<T = any> extends DataAdapterRecord<T> {
   row?: Instance;
   vdom?: any;
   fixedVdom?: any;
   grouping?: any;
   level?: number;
   group?: any;
}

interface GridDragEvent<T> extends DragEvent {
   target: {
      recordBefore?: MappedGridRecord<T>;
      recordAfter?: MappedGridRecord<T>;
      insertionIndex: number;
      totalRecordCount: number;
      dropNextToTheRowAbove?: boolean | null;
   };
}

interface GridRowDragEvent<T> extends DragEvent {
   target: {
      record: MappedGridRecord<T>;
      index: number;
   };
}

interface GridColumnDropEvent extends DragEvent {
   target: {
      grid: any;
      instance: Instance;
      index: number;
   };
}

interface GridDropOperationContext extends DragDropOperationContext {
   test: {
      grid: any;
      row: any;
      column: any;
   };
}

interface GridMoveCursorOptions {
   focused?: boolean;
   hover?: any;
   scrollIntoView?: boolean;
   select?: boolean;
   selectRange?: boolean;
   selectOptions?: any;
   cellIndex?: number;
   cellEdit?: boolean;
   cancelEdit?: boolean;
}

interface GridGroupingKey {
   [key: string]:
      | Prop<any>
      | {
           value: Prop<any>;
           direction: SortDirection;
        };
}

interface GroupingResult<T> {
   key: any;
   aggregates: any;
   name: string;
   indexes: number[];
   records: MappedGridRecord<T>[];
}

type GridColumnAlignment = "left" | "right" | "center";

interface GridGroupingConfig<T> {
   key: GridGroupingKey;
   aggregates?: StructuredProp;
   showCaption?: boolean;
   showFooter?: boolean;
   showHeader?: boolean;
   caption?: StringProp;
   name?: StringProp;
   text?: StringProp;
   comparer?: (a: GroupingResult<T>, b: GroupingResult<T>) => number;
}

// TODO: Check Column config
// Props are in order based on docs

export interface GridColumnHeaderConfig {
   text?: StringProp;
   colSpan?: NumberProp;
   rowSpan?: NumberProp;
   align?: GridColumnAlignment;
   allowSorting?: boolean;
   items?: React.ReactNode;
   children?: React.ReactNode;
   tool?: React.ReactNode;
   style?: StyleProp;
   class?: ClassProp;
   className?: ClassProp;
   tooltip?: StringProp | StructuredProp;
   defaultWidth?: NumberProp;
   width?: NumberProp;
   resizable?: boolean;
}

export interface GridColumnFooterConfig {
   value?: Prop<any>;
   format?: StringProp;
   style?: StyleProp;
   class?: StyleProp;
   expand?: boolean;
}

export interface GridColumnCaptionConfig {
   value?: Prop<any>;
   format?: StringProp;
   style?: StyleProp;
   class?: StyleProp;
   children?: React.ReactNode;
   items?: React.ReactNode;
   expand?: boolean;
}

export interface GridColumnConfig {
   align?: GridColumnAlignment;
   field?: string;
   format?: StringProp;
   header?: StringProp | GridColumnHeaderConfig;
   header1?: StringProp | GridColumnHeaderConfig;
   header2?: StringProp | GridColumnHeaderConfig;
   header3?: StringProp | GridColumnHeaderConfig;
   fixed?: BooleanProp;
   sortable?: boolean;
   aggregate?: "min" | "max" | "count" | "sum" | "distinct" | "avg";
   aggregateAlias?: string;
   aggregateField?: string;
   aggregateValue?: UnknownProp;
   caption?: GridColumnCaptionConfig | StringProp | false;
   class?: ClassProp;
   className?: ClassProp;
   draggable?: boolean;
   editable?: boolean;
   editor?: React.ReactNode;
   footer?: GridColumnFooterConfig | StringProp | false;
   items?: React.ReactNode;
   children?: React.ReactNode;
   key?: string;
   pad?: boolean;
   sortField?: string;
   sortValue?: Prop<any>;
   style?: StyleProp;
   trimWhitespace?: boolean;
   visible?: BooleanProp;
   if?: BooleanProp;
   weightField?: string;

   // Not in docs
   value?: Prop<any>;
   defaultWidth?: NumberProp;
   width?: NumberProp;
   resizable?: boolean;
   comparer?: (a: any, b: any) => number;

   /** Options for data sorting. See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator */
   sortOptions?: CollatorOptions;
   colSpan?: NumberProp;

   mergeCells?: Prop<null | false | "same-value" | "always">;
   primarySortDirection?: "ASC" | "DESC";
}

export interface GridRowLineConfig {
   visible?: BooleanProp;
   columns: GridColumnConfig[];
}

export interface GridRowConfig {
   invalid?: BooleanProp;
   valid?: BooleanProp;
   style?: StyleProp;
   class?: ClassProp;
   className?: ClassProp;
   line1?: GridRowLineConfig;
   line2?: GridRowLineConfig;
   line3?: GridRowLineConfig;
   mod?: StringProp | Prop<string[]> | StructuredProp;
}

export interface GridConfig<T = any> extends StyledContainerConfig {
   /** An array of records to be displayed in the grid. */
   records?: Prop<T[]>;

   /** Set to true to add a vertical scroll and a fixed header to the grid. */
   scrollable?: boolean;

   /** A binding used to store the sorting order list. Commonly used for server-side sorting. */
   sorters?: SortersProp;

   /** A list of sorters to be prepended to the actual list of sorters. */
   preSorters?: SortersProp;

   /** A binding used to store the name of the field used for sorting grids. Available only if sorters are not used. */
   sortField?: StringProp;

   /** A binding used to store the sort direction. Available only if sorters are not used. Possible values are "ASC" and "DESC". Defaults to "ASC". */
   sortDirection?: StringProp;

   /** Default sort field. Used if neither sortField or sorters are set. */
   defaultSortField?: string;

   /** Default sort direction. */
   defaultSortDirection?: "ASC" | "DESC";

   /** Set to true to add vertical gridlines. */
   vlines?: boolean;

   /** Text to be displayed instead of an empty table. */
   emptyText?: StringProp;

   /** Drag source configuration. Define mode as 'move' or 'copy` and additional data. */
   dragSource?: StructuredProp;

   /** Drop zone configuration. Define mode as either preview or insertion. */
   dropZone?: StructuredProp;

   /** Row configuration. See grid examples. */
   row?: GridRowConfig;

   /**An array of columns. Check column configuration options in the section below. */
   columns?: GridColumnConfig[];

   /** Whenever columnParams change, columns are recalculated using the onGetColumn callback. */
   columnParams?: StructuredProp;

   /** Selection configuration. */
   selection?: DataRecord;

   /** An array of grouping level definitions. Check allowed grouping level properties in the section below. */
   grouping?: GridGroupingConfig<T>[];

   /** Params for grouping. Whenever params change grouping is recalculated using the onGetGrouping callback. */
   groupingParams?: StructuredProp;

   /**
    * Determines header appearance. Supported values are plain and default. Default mode is used if some of the columns are sortable.
    * Plain mode better suits reports and other scenarios in which users do not interact with the grid.
    */
   headerMode?: StringProp;

   /** Set to true to add default border around the table. Automatically set if grid is scrollable. */
   border?: BooleanProp;

   /** Base CSS class to be applied to the element. Default is 'grid'. */
   baseClass?: string;

   /** A field used to get the unique identifier of the record. Setting keyField improves grid performance on sort operations as the widget is able to identify row movement inside the grid.  */
   keyField?: string;

   /** Show grid header within the group. Useful for long report-like (printable) grids. Defaults to false. */
   showHeader?: boolean;

   /** Show grid footer. Defaults to false. */
   showFooter?: boolean;

   /** Record alias. Default is $record. */
   recordName?: RecordAlias;

   /** Record alias. Default is $record. */
   recordAlias?: RecordAlias;

   /** Set to true if sorting is done remotely, on the server-side. Default value is false. */
   remoteSort?: boolean;

   /** Set to true to enable row caching. This greatly improves grid performance
    on subsequent render operations, however, only changes on records
    are allowed. If grid rows display any data outside records, changes on that
    data will be ignored. */
   cached?: boolean;

   /** Render only rows visible on the screen. */
   buffered?: boolean;

   /** Specifies how many rows should be visible on the screen */
   bufferSize?: number;

   /** Specifies how many rows needs to be scrolled in order to recalculate buffer */
   bufferStep?: number;

   /** Used when rows have variable heights to improve buffered rendering by measuring and caching rendered row heights. Default value is false. */
   measureRowHeights?: boolean;

   /** Scrolls selection into the view. Default value is false. */
   scrollSelectionIntoView?: boolean;

   /**
    * Set to true to lock column widths after the first render.
    * This is helpful in pagination scenarios to maintain consistent looks across pages.
    */
   lockColumnWidths?: boolean;

   lockColumnWidthsRequiredRowCount?: number;
   focused?: boolean;
   showBorder?: boolean;

   /** Data adapter used to convert data in list of records. Used to enable grouping and tree operations. */
   dataAdapter?: DataAdapter;

   /** Additional CSS class to be added to each grid row. */
   rowClass?: ClassProp;

   /** Additional CSS styles to be added to each grid row. */
   rowStyle?: StyleProp;

   // drag-drop handlers
   onDrop?: string | ((e: GridDragEvent<T>, instance: Instance) => void);
   onDropTest?: string | ((e: DragEvent, instance: Instance) => boolean);
   onDragStart?: string | ((e: DragEvent, instance: Instance) => void);
   onDragEnd?: string | ((e: DragEvent, instance: Instance) => void);
   onDragOver?: string | ((e: GridDragEvent<T>, instance: Instance) => void | boolean);

   onRowDropTest?: string | ((e: DragEvent, instance: Instance) => boolean);
   onRowDragOver?: string | ((e: GridRowDragEvent<T>, instance: Instance) => void | boolean);
   onRowDrop?: string | ((e: GridRowDragEvent<T>, instance: Instance) => void | boolean);

   onColumnDrop?: string | ((e: GridColumnDropEvent, instance: Instance) => void);
   onColumnDropTest?: string | ((e: DragEvent, instance: Instance) => boolean);

   /** Parameters that affect filtering. */
   filterParams?: StructuredProp;

   /** Callback function to be executed when a row is right-clicked.  */
   onRowContextMenu?: string | ((e: React.SyntheticEvent<any>, instance: Instance) => void);

   /** Callback to create a filter function for given filter params. */
   onCreateFilter?: (filterParams: any, instance?: Instance) => (record: T) => boolean;

   /** Enable infinite scrolling */
   infinite?: boolean;

   /** If set, clicking on the column header will loop between ASC, DESC and no sorting order, instead of ASC and DESC only. */
   clearableSort?: boolean;

   /** A callback to fetch records during infinite loading */
   onFetchRecords?: (
      pageInfo: {
         page: number;
         pageSize: number;
         sorters?: DataRecord[];
         sortField?: string;
         sortDirection?: string;
      },
      instance?: Instance,
   ) => FetchRecordsResult<T> | Promise<FetchRecordsResult<T>>;

   /** Callback function to be executed when a row is double-clicked. */
   onRowDoubleClick?: string | ((e: React.SyntheticEvent<any>, instance: Instance) => void);

   /** Callback function to be executed on key down. Accepts instance of the currently focused record as the second argument. */
   onRowKeyDown?: string | ((e: React.SyntheticEvent<any>, instance: Instance) => void);

   /** Callback function to be executed when a row is clicked. */
   onRowClick?: string | ((e: React.SyntheticEvent<any>, instance: Instance) => void);

   /** Set to true to add a fixed footer at the bottom of the grid. */
   fixedFooter?: boolean;

   /** Set to true to enable cell editing. Please note that all editable columns should specify the editor field. */
   cellEditable?: boolean;

   /** A callback function which is executed before a cell editor is initialized. Return false from the callback to prevent the cell from going into the edit mode. */
   onBeforeCellEdit?: string | ((change: GridCellBeforeEditInfo, record: DataAdapterRecord<T>) => any);

   /** A callback function which is executed after a cell has been successfully edited. */
   onCellEdited?: string | ((change: GridCellEditInfo<T>, record: DataAdapterRecord<T>) => void);

   /** A callback function which is executed after a column has been resized. */
   onColumnResize?: (data: { width: number; column: Config }, instance: Instance) => void;

   /** Options for data sorting. See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator */
   sortOptions?: CollatorOptions;

   /** Callback to create a function that can be used to check whether a record is selectable. */
   onCreateIsRecordSelectable?: (
      params: any,
      instance: Instance,
   ) => (record: T, options?: { range?: boolean; toggle?: boolean }) => boolean;

   /** Parameters whose change will cause scroll to be reset. */
   scrollResetParams?: StructuredProp;

   /** Enable precise (sub-pixel) measurements. Useful for grids with many columns. Better behavior at small zoom factors. */
   preciseMeasurements?: boolean;

   /** A value used to identify the group of components participating in hover effect synchronization. */
   hoverChannel?: string;

   /** A value used to uniquely identify the record within the hover sync group. */
   rowHoverId?: Prop<string | number>;

   /** Set to true or false to explicitly define if grid is allowed to receive focus. */
   focusable?: boolean;

   /** Callback function to retrieve grouping data. */
   onGetGrouping?: (params: any, instance: Instance) => GridGroupingConfig<T>[];

   /** Callback function to dynamically calculate columns.  */
   onGetColumns?: (params: any, instance: Instance) => GridColumnConfig[] | GridRowConfig;

   /** Allow grid to receive drag and drop operations containing files. */
   allowsFileDrops?: boolean;

   /**
    * Callback function to track and retrieve displayed records.
    * Accepts new records as a first argument.
    * If onCreateFilter callback is defined, filtered records can be retrieved using this callback.
    */
   onTrackMappedRecords?: string | ((records: DataAdapterRecord<T>[], instance: Instance) => void);

   /** Callback to create a function that can be used to check whether a record is draggable. */
   onCreateIsRecordDraggable?: (params: any, instance: Instance) => (record: T) => boolean;

   /** Callback function to get grid component and instance references on component init. */
   onRef?: string | ((element: any, instance: Instance) => void);
}

export interface GridCellInfo {
   column: any;
   field: string;
}

export interface GridCellBeforeEditInfo extends GridCellInfo {
   data: any;
}

export interface GridCellEditInfo<T> extends GridCellInfo {
   oldData: T;
   newData: T;
}

export interface GridInstance<T = any> extends Instance<Grid<T>> {
   widget: Grid<T>;
   isRecordSelectable?: (record: any, options?: any) => boolean;
   visibleColumns: any[];
   isRecordDraggable?: (record: any) => boolean;
   row?: any;
   fixedFooterVDOM?: any;
   fixedColumnsFixedFooterVDOM?: any;
   hasFixedColumns?: boolean;
   recordInstanceCache?: any;
   records?: MappedGridRecord<T>[];
   isSelected: (record: any, index?: number) => boolean;
   v: number;
   buffer?: any;
   dataAdapter: ArrayAdapter<T>;
   fixedFooterIsGroupFooter?: boolean;
   state?: any;
   fixedColumnCount: number;
   fixedHeaderResizeEvent?: any;
   hoverSync?: any;
   header?: any;
   cached: any;
   fixedFooterOverlap?: boolean;
}

export class Grid<T = unknown> extends Container {
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
   declare grouping?: any[];
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
   declare dataAdapter?: Config;
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
      var row = this.row || {};
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
            if (isArray(l.columns))
               for (let c = 0; c < l.columns.length; c++)
                  l.columns[c].uniqueColumnId = `l${i}-${l.columns[c].key || c}`;
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
                  row.mergedColumns.push({ uniqueColumnId: c.uniqueColumnId, index, mode: c.mergeCells });
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

      instance.dataAdapter = DataAdapter.create(
         {
            type: (this.dataAdapter && this.dataAdapter.type) || GroupAdapter,
            recordsAccessor: this.recordsAccessor,
            keyField: this.keyField,
            aggregates: aggregates,
            recordName: this.recordName,
            indexName: this.indexName,
            sortOptions: this.sortOptions,
            groupings: grouping,
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

      if (isDefined(this.sortField) && isDefined(this.sortDirection)) {
         let sorter = {
            field: data.sortField,
            direction: data.sortDirection,
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
         for (let l = 1; l < 10; l++) {
            let line = instance.row[`line${l}`];
            let sortColumn = line && line.columns && line.columns.find((c: any) => c.field == sortField);
            if (sortColumn) {
               data.sorters[0].value = sortColumn.sortValue || sortColumn.value;
               data.sorters[0].comparer = sortColumn.comparer;
               data.sorters[0].sortOptions = sortColumn.sortOptions;
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

      //do not process rows in buffered mode or cached mode if nothing has changed;
      if (!this.buffered && (!this.cached || instance.shouldUpdate)) {
         for (let i = 0; i < instance.records!.length; i++) {
            let record = instance.records![i];
            if (record.type == "data") {
               let row = (record.row = instance.getChild(context, instance.row, record.key, record.store));
               row.selected = instance.isSelected(record.data, record.index);
               let changed = false;
               if (row.cache("selected", row.selected)) changed = true;
               if (row.cache("recordData", record.data)) changed = true;
               if (this.cached && !changed && !row.childStateDirty) row.shouldUpdate = false;
               else row.scheduleExploreIfVisible(context);
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

   renderHeader(context: RenderingContext, instance: GridInstance, key: any, fixed: any, fixedColumns: any) {
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
                     if (data.sorters && data.sorters[0].field == (hdwidget.sortField || hdwidget.field)) {
                        mods.push("sorted-" + data.sorters[0].direction.toLowerCase());
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

      return (
         <tbody key={"h" + key} className={CSS.element(baseClass, "header")}>
            {headerRows}
         </tbody>
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
      let value = column.sortValue || column.value;
      let comparer = column.comparer;
      let sortOptions = column.sortOptions;

      if (header && header.allowSorting && column.sortable && (field || value || data.sortField)) {
         let direction = column.primarySortDirection ?? "ASC";
         if (
            isNonEmptyArray(data.sorters) &&
            ((!!data.sorters[0].field && data.sorters[0].field == (field || data.sortField)) ||
               (!!value && data.sorters[0].value == value))
         ) {
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
      if (g.caption) {
         let caption = g.caption(data);
         return (
            <tbody
               key={`g-${level}-${group.$key}`}
               className={CSS.element(baseClass, "group-caption", ["level-" + level])}
               data-group-key={group.$key}
               data-group-element={`group-caption-${level}`}
            >
               <tr>
                  <td colSpan={1000}>{caption}</td>
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
                  <td key={i} className={cls} colSpan={colSpan} style={style}>
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
               className={CSS.element(baseClass, "group-caption", ["level-" + level])}
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
               record.vdom.push(this.renderHeader(context, instance, record.key + "-header", false, false));
               if (hasFixedColumns)
                  record.fixedVdom.push(this.renderHeader(context, instance, record.key + "-header", false, true));
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
      )
         return undefined;

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

Widget.alias("grid", Grid);
Localization.registerPrototype("cx/widgets/Grid", Grid);

interface GridComponentProps {
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

interface GridComponentState {
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

class GridComponent extends VDOM.Component<GridComponentProps, GridComponentState> {
   dom: {
      el?: HTMLElement | null;
      table?: HTMLElement | null;
      scroller?: HTMLElement | null;
      fixedScroller?: HTMLElement | null;
      fixedTable?: HTMLElement | null;
      fixedHeader?: HTMLElement | null;
      fixedColumnsFixedHeader?: HTMLElement | null;
      fixedFooter?: HTMLElement | null;
      fixedColumnsFixedFooter?: HTMLElement | null;
   };
   syncBuffering: boolean = false;
   start?: number;
   end?: number;
   loadingStartPage?: number;
   loadingEndPage?: number;
   heightStats?: AvgHeight;
   rowHeights?: Record<string, number>;
   rowHeight?: number;
   scrollerRef: (el: HTMLElement | null) => void;
   fixedScrollerRef: (el: HTMLElement | null) => void;
   gridRef: (el: HTMLElement | null) => void;
   cellEditorValid?: boolean;
   scrollWidth: number;
   loading?: boolean;
   loadPageRange?: any;
   prevFetchRecordsState?: any;
   pending?: any;
   offResize?: () => void;
   unregisterDropZone?: () => void;
   lastSorters?: any;
   lastScrollFilterParams?: any;
   lastScrollResetParams?: any;
   selectedEl?: Element | null;
   cellEditUndoData?: any;

   constructor(props: GridComponentProps) {
      super(props);
      this.dom = {};
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
         this.loadingStartPage = 0;
         this.loadingEndPage = 0;
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
      let { widget, isRecordSelectable, visibleColumns, isRecordDraggable, row } = instance;
      let { CSS, baseClass } = widget;
      let { dragSource } = data;
      let { dragged, cursor, cursorCellIndex, cellEdit, dropInsertionIndex, dropTarget } = this.state;
      let { colWidth, dimensionsVersion } = instance.state;
      let { hasMergedCells } = row;

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

         let wrap = (children: any) => {
            let skipCells: any = {};
            return (
               <GridRowComponent
                  key={key}
                  className={CSS.state(mod)}
                  store={store}
                  dragSource={dragSource}
                  instance={row}
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
               >
                  {children.content.map(({ key, data, content }: any, line: any) => {
                     let cells = content.map(
                        ({ key, data, content, uniqueColumnId, merged, mergeRowSpan }: any, cellIndex: number) => {
                           if (Boolean(data.fixed) !== fixed) return null;
                           if (merged) return null;
                           let cellected =
                              index == cursor && cellIndex == cursorCellIndex && widget.cellEditable && line == 0;
                           let className = cellected
                              ? CSS.expand(data.classNames, CSS.state("cellected"))
                              : data.classNames;
                           if (cellected && cellEdit) {
                              let column = visibleColumns[cursorCellIndex];
                              if (column && column.editor && data.editable)
                                 return this.renderCellEditor(key, CSS, baseClass, row, column);
                           }
                           let width = colWidth[uniqueColumnId];
                           let style = data.style;
                           if (width) {
                              style = {
                                 ...style,
                                 maxWidth: `${width}px`,
                              };
                           }

                           if (skipCells[`${line}-${cellIndex}`]) return null;

                           if (data.colSpan > 1 || data.rowSpan > 1) {
                              for (let r = line; r < line + (data.rowSpan ?? 1); r++)
                                 for (let c = cellIndex; c < cellIndex + (data.colSpan ?? 1); c++)
                                    skipCells[`${r}-${c}`] = true;
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
                        },
                     );
                     if (hasMergedCells) return cells;
                     return (
                        <tr key={key} className={data.classNames} style={data.style}>
                           {cells}
                        </tr>
                     );
                  })}
               </GridRowComponent>
            );
         };

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

      if (widget.buffered) {
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
      } else {
         let { row } = instance;
         let { hasMergedCells, mergedColumns } = row;
         if (hasMergedCells) {
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

         instance.records!.forEach((record, i) => {
            if (record.type == "data") addRow(record, i, false);
            else {
               children.push(record.vdom);
               if (hasFixedColumns) fixedChildren.push(record.fixedVdom);
            }
         });
      }

      if (this.state.dropTarget == "grid" && this.state.dropInsertionIndex != null) {
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
         while (index < children.length && count < this.state.dropInsertionIndex) {
            if (isDataRecord(children[index])) count++;
            index++;
         }

         let savedIndexPos = index;

         if (!this.state.dropNextToTheRowAbove)
            while (index < children.length && !isDataRecord(children[index])) index++;

         // do not allow insertion after the last group footer
         if (savedIndexPos < index && index == children.length) index = savedIndexPos;

         children.splice(index, 0, dragInsertionRow);
      }

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

      let shouldRenderFixedFooter = widget.scrollable && (fixedFooter || fixedColumnsFixedFooter);

      if (hasFixedColumns) {
         fixedColumnsContent.push(
            <div
               key="fixedscroller"
               ref={this.fixedScrollerRef}
               className={CSS.element(baseClass, "fixed-scroll-area", {
                  "fixed-header": !!this.props.header,
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
               "fixed-header": !!this.props.header,
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

   ensureData(visibleStart: number, visibleEnd: number) {
      if (this.loading) return;

      let { instance } = this.props;
      let { widget } = instance;
      let { pageSize } = widget;

      let startPage = Math.trunc(visibleStart / pageSize) + 1,
         endPage = Math.trunc((visibleEnd - 1) / pageSize) + 1;

      //debouncing restricts excessive page loading on fast scrolling as rendering data is
      //useless because visible region is scrolled away before data appears
      //the user should spent some time on the page before loading it

      if (!this.loadPageRange)
         this.loadPageRange = debounce((startPage, endPage) => {
            let { data } = this.props;
            let { records, offset } = data;
            let promises = [];

            for (let page = startPage; page <= endPage; page++) {
               let s = (page - 1) * pageSize,
                  e = s + pageSize;
               if (s >= offset && e <= offset + records.length) {
                  promises.push(Promise.resolve(records.slice(s - offset, e - offset)));
               } else {
                  let result = instance.invoke(
                     "onFetchRecords",
                     {
                        page,
                        pageSize,
                        sorters: data.sorters,
                        sortField: data.sortField,
                        sortDirection: data.sortDirection,
                        filterParams: data.filterParams,
                        state: this.prevFetchRecordsState,
                     },
                     instance,
                  );
                  promises.push(Promise.resolve(result));
               }
            }

            this.loading = true;

            Promise.all(promises)
               .then((pageRecords) => {
                  this.loading = false;
                  let records: any[] = [];
                  let totalRecordCount: number | undefined;
                  let lastPage: boolean | undefined;

                  pageRecords.forEach((page) => {
                     if (Array.isArray(page)) {
                        records.push(...page);
                     } else {
                        if (!Array.isArray(page.records))
                           throw new Error(
                              "onFetchRecords should return an array of records or an object with results inside records property.",
                           );
                        totalRecordCount = page.totalRecordCount;
                        lastPage = page.lastPage;
                        this.prevFetchRecordsState = page.state;
                        records.push(...page.records);
                     }
                  });

                  let { data } = this.props;

                  if (!isNumber(totalRecordCount)) {
                     totalRecordCount = (startPage - 1) * pageSize + records.length;
                     if (!lastPage && records.length == (endPage - startPage + 1) * pageSize) totalRecordCount++;
                     if (data.totalRecordCount > totalRecordCount) totalRecordCount = data.totalRecordCount;
                  }

                  instance.buffer.totalRecordCount = data.totalRecordCount = totalRecordCount;
                  instance.buffer.records = data.records = records;
                  instance.buffer.page = data.page = startPage;
                  data.offset = (startPage - 1) * pageSize;

                  instance.store.silently(() => {
                     instance.set("records", records);
                     instance.set("page", startPage);
                     instance.set("totalRecordCount", totalRecordCount);
                  });

                  let stateChanges: any = {
                     startPage,
                     endPage,
                  };

                  if (this.state.end == 0) stateChanges.end = Math.min(widget.bufferSize!, totalRecordCount!);

                  this.setState(stateChanges, () => {
                     this.loadingStartPage = startPage;
                     this.loadingEndPage = endPage;
                     this.onScroll();
                  });
               })
               .catch((error) => {
                  this.loading = false;
                  if (widget.onLoadingError) instance.invoke(error, "onLoadingError", instance);
               });
         }, 30);

      if (startPage < this.loadingStartPage! || endPage > this.loadingEndPage!) {
         this.loadingStartPage = startPage;
         this.loadingEndPage = endPage;
         this.loadPageRange(startPage, endPage);
      }
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
            start = Math.max(0, this.estimateStart(instance.records, this.dom.scroller!.scrollTop) - widget.bufferStep);
         else if (this.rowHeight! > 0)
            start = Math.round(this.dom.scroller!.scrollTop / this.rowHeight! - widget.bufferStep);

         start = Math.round(start / widget.bufferStep) * widget.bufferStep;
         start = Math.max(0, Math.min(start, data.totalRecordCount - widget.bufferSize));
         let end = Math.min(data.totalRecordCount, start + widget.bufferSize);

         if (widget.infinite) {
            this.ensureData(start, end);
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
      if (widget.infinite) this.ensureData(0, 0);
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

   onDragEnd(e: DragEvent) {
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

   estimateHeight(
      records: MappedGridRecord[],
      start: number,
      end: number,
      breakCondition?: (index: number, totalHeight: number) => boolean,
   ) {
      let avgDataRowHeight = this.heightStats!.estimate("data") ?? 0;
      let totalHeight = 0;
      for (let i = start; i < end; i++) {
         let record = records[i];
         switch (record.type) {
            case "data":
               if (record.key in this.rowHeights!) totalHeight += this.rowHeights![record.key];
               else totalHeight += avgDataRowHeight;
               break;

            case "group-header":
               if (record.grouping.showCaption) {
                  let captionKey = "group-caption-" + record.level;
                  if (`${captionKey}-${record.group.$key}` in this.rowHeights!)
                     totalHeight += this.rowHeights![`${captionKey}-${record.group.$key}`];
                  else totalHeight += this.heightStats!.estimate(captionKey) ?? avgDataRowHeight;
               }
               break;

            case "group-footer":
               if (record.grouping.showFooter) {
                  let captionKey = "group-footer-" + record.level;
                  if (`${captionKey}-${record.group.$key}` in this.rowHeights!)
                     totalHeight += this.rowHeights![`${captionKey}-${record.group.$key}`];
                  else totalHeight += this.heightStats!.estimate(captionKey) ?? avgDataRowHeight;
               }
               break;

            default:
               Console.warn("UNPROCESSED RECORD TYPE", record);
               break;
         }

         if (breakCondition && breakCondition(i, totalHeight) === false) break;
      }
      return totalHeight;
   }

   estimateStart(records: MappedGridRecord[], height: number) {
      let start = 0;
      if (height == 0) return 0;
      this.estimateHeight(records, 0, records.length, (index, h) => {
         start = index;
         return h < height;
      });
      return start;
   }

   componentDidUpdate() {
      let { instance, data } = this.props;
      let { widget, fixedFooterOverlap } = instance;

      if (
         widget.lockColumnWidths &&
         isArray(data.records) &&
         data.records.length >= widget.lockColumnWidthsRequiredRowCount
      ) {
         let headerTBody = this.dom.table!.firstChild! as HTMLElement;
         for (let r = 0; r < headerTBody.children.length; r++) {
            let sr = headerTBody.children[r];
            for (let c = 0; c < sr.children.length; c++) {
               let cell = sr.children[c] as HTMLElement;
               cell.style.width =
                  cell.style.minWidth =
                  cell.style.maxWidth =
                     `${(sr.children[c] as HTMLElement).offsetWidth}px`;
               cell.style.boxSizing = "border-box";
               if ((cell as HTMLElement).dataset.uniqueColId)
                  instance.state.lockedColWidth[(cell as HTMLElement).dataset.uniqueColId!] = (
                     sr.children[c] as HTMLElement
                  ).offsetWidth;
            }
         }
      }

      if (widget.scrollable) {
         this.scrollWidth = this.dom.scroller!.offsetWidth - this.dom.scroller!.clientWidth;

         let resized = false,
            headerHeight = 0,
            footerHeight = 0,
            rowHeight = 0;

         if (this.dom.fixedTable!)
            syncHeaderHeights(
               this.dom.table!.firstChild as HTMLTableSectionElement,
               this.dom.fixedTable!.firstChild as HTMLTableSectionElement,
            );

         if (this.dom.fixedHeader!) {
            let fixedHeaderTBody = this.dom.fixedHeader!.firstChild!.firstChild as HTMLTableSectionElement;

            resized = widget.preciseMeasurements
               ? copyCellSizePrecise(this.dom.table!.firstChild as HTMLTableSectionElement, fixedHeaderTBody)
               : copyCellSize(this.dom.table!.firstChild as HTMLTableSectionElement, fixedHeaderTBody);

            let scrollColumnEl = fixedHeaderTBody?.firstChild?.lastChild as HTMLElement | null;
            if (scrollColumnEl) scrollColumnEl.style.minWidth = scrollColumnEl.style.maxWidth = this.scrollWidth + "px";

            this.dom.fixedHeader!.style.display = "block";
            headerHeight = this.dom.fixedHeader!.offsetHeight;
            this.dom.scroller!.style.marginTop = `${headerHeight}px`;
            if (this.dom.fixedScroller!) this.dom.fixedScroller!.style.marginTop = `${headerHeight}px`;
            else if (this.dom.fixedHeader!.style.left != null) this.dom.fixedHeader!.style.removeProperty("left");
         } else {
            this.dom.scroller!.style.removeProperty("marginTop");
            if (this.dom.fixedScroller!) this.dom.fixedScroller!.style.removeProperty("marginTop");
         }

         if (this.dom.fixedColumnsFixedHeader!) {
            let fixedColumnsWidth = `${this.dom.fixedScroller!.offsetWidth}px`;
            this.dom.fixedColumnsFixedHeader!.style.right = "auto";
            this.dom.fixedColumnsFixedHeader!.style.width = fixedColumnsWidth;
            if (this.dom.fixedHeader!) this.dom.fixedHeader!.style.left = fixedColumnsWidth;

            this.dom.fixedColumnsFixedHeader!.style.display = "block";

            let fixedHeaderTBody = this.dom.fixedColumnsFixedHeader!.firstElementChild
               ?.firstElementChild as HTMLTableSectionElement;

            if (this.dom.fixedTable!.firstChild) {
               resized = copyCellSize(
                  this.dom.fixedTable!.firstElementChild as HTMLTableSectionElement,
                  fixedHeaderTBody,
               );
            }
         }

         if (this.dom.fixedFooter! || this.dom.fixedColumnsFixedFooter!) {
            if (this.dom.fixedColumnsFixedFooter!) {
               let fixedColumnsWidth = `${this.dom.fixedScroller!.offsetWidth}px`;
               this.dom.fixedColumnsFixedFooter!.style.right = "auto";
               this.dom.fixedColumnsFixedFooter!.style.width = fixedColumnsWidth;

               let dstTableBody = this.dom.fixedColumnsFixedFooter!.firstElementChild
                  ?.firstElementChild as HTMLTableSectionElement;
               if (dstTableBody) {
                  let srcTableBody = this.dom.fixedTable!.lastElementChild as HTMLTableSectionElement;
                  copyCellSize(srcTableBody, dstTableBody, fixedFooterOverlap);
                  this.dom.fixedColumnsFixedFooter!.style.display = "block";
                  footerHeight = this.dom.fixedFooter!.offsetHeight;
               }
            }

            if (this.dom.fixedFooter!) {
               let dstTableBody = this.dom.fixedFooter!.firstElementChild?.firstElementChild as HTMLTableSectionElement;

               if (dstTableBody) {
                  let srcTableBody = this.dom.table!.lastElementChild as HTMLTableSectionElement;

                  copyCellSize(srcTableBody, dstTableBody, fixedFooterOverlap);

                  let scrollColumnEl = dstTableBody.firstElementChild?.firstElementChild as HTMLElement;
                  if (scrollColumnEl)
                     scrollColumnEl.style.minWidth = scrollColumnEl.style.maxWidth = this.scrollWidth + "px";

                  this.dom.fixedFooter!.style.display = "block";
                  footerHeight = this.dom.fixedFooter!.offsetHeight;
               }

               if (this.dom.fixedScroller!)
                  this.dom.fixedFooter!.style.left = `${this.dom.fixedScroller!.offsetWidth}px`;
               else if (this.dom.fixedFooter!.style.left != null) this.dom.fixedFooter!.style.removeProperty("left");
            }

            this.dom.scroller!.style.marginBottom = `${footerHeight}px`;
            if (this.dom.fixedScroller!) this.dom.fixedScroller!.style.marginBottom = `${footerHeight}px`;
         } else {
            this.dom.scroller!.style.marginBottom = "0";
            if (this.dom.fixedScroller!) this.dom.fixedScroller!.style.marginBottom = "0";
         }

         let scrollOverlap = fixedFooterOverlap ? footerHeight : 0;

         if (widget.buffered) {
            let { start, end } = this.getBufferStartEnd();
            let remaining = 0,
               count = Math.min(data.totalRecordCount, end! - start!);

            if (widget.measureRowHeights) {
               if (!this.rowHeights) this.rowHeights = {};
               if (!this.heightStats) this.heightStats = new AvgHeight();
               for (let i = 0; i < this.dom.table!.children.length; i++) {
                  let body = this.dom.table!.children[i] as HTMLElement;
                  if (body.dataset.recordKey != null) {
                     if (!(body.dataset.recordKey in this.rowHeights)) this.heightStats.add("data", body.offsetHeight);
                     this.rowHeights[body.dataset.recordKey] = body.offsetHeight;
                  } else if (body.dataset.groupKey) {
                     let key = body.dataset.groupElement + "-" + body.dataset.groupKey;
                     this.rowHeights[key] = body.offsetHeight;
                     if (!(body.dataset.recordKey! in this.rowHeights))
                        this.heightStats.add(body.dataset.groupElement!, body.offsetHeight);
                  }
               }
            }

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
               upperMargin = this.estimateHeight(instance.records, 0, start);
               lowerMargin = this.estimateHeight(instance.records, end, instance.records.length);
            } else {
               upperMargin = start * rowHeight;
               lowerMargin = remaining * rowHeight;
            }

            //console.log(upperMargin, start * rowHeight, this.rowHeights, this.heightStats);

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
            if (widget.infinite) {
               this.loadingStartPage = 0;
               this.loadingEndPage = 0;
               instance.buffer.records = data.records = [];
               instance.buffer.totalRecordCount = 0;
               instance.buffer.page = 1;
               this.prevFetchRecordsState = null;
               this.loading = false;
            }
         }

         if (widget.scrollSelectionIntoView && !widget.buffered) {
            let { CSS, baseClass } = widget;
            let selectedRowSelector = `.${CSS.element(baseClass, "data")}.${CSS.state("selected")}`;
            let firstSelectedRow = this.dom.table!.querySelector(selectedRowSelector);
            if (firstSelectedRow != this.selectedEl) {
               firstSelectedRow && scrollElementIntoView(firstSelectedRow);
               this.selectedEl = firstSelectedRow;
            }
         }

         setTimeout(this.onScroll.bind(this), 0);

         if (resized) instance.fixedHeaderResizeEvent.notify();
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
               unfocusElement(null, false);
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

                  let item = record && this.dom.table!.querySelector(`tbody[data-record-key="${record.key}"]`);

                  let hscroll = false;
                  if (item) {
                     if (widget.cellEditable)
                        if (this.state.cursorCellIndex >= this.props.instance.fixedColumnCount) {
                           hscroll = true;
                           item = (item.firstChild as HTMLElement)!.children[
                              this.state.cursorCellIndex - this.props.instance.fixedColumnCount
                           ] as Element;
                        } else {
                           let fixedItem = this.dom.fixedTable!.querySelector(`tbody[data-record-key="${record.key}"]`);
                           let cell =
                              fixedItem && (fixedItem.firstChild as HTMLElement)!.children[this.state.cursorCellIndex];
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
         if (this.state.cellEdit && this.dom.el! == getActiveElement())
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
         ));
         row.selected = true;
         selected.push(mappedRecord);
      };

      if (!record.row?.selected) {
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

export interface GridColumnHeaderLineConfig extends PureContainerConfig {
   columns?: GridColumnConfig[];
   showHeader?: BooleanProp;
   headerStyle?: StyleProp;
   headerClass?: ClassProp;
}

class GridColumnHeaderLine extends PureContainerBase<GridColumnHeaderLineConfig> {
   declare columns?: GridColumnConfig[];
   declare showHeader: boolean;
   declare headerStyle?: any;
   declare headerClass?: any;
   declare visible?: any;
   declare className?: any;
   declare class?: any;
   declare isPureContainer: boolean;
   declare styled: boolean;

   declareData() {
      return super.declareData(...arguments, {
         showHeader: undefined,
      });
   }

   init() {
      this.items = Widget.create(GridColumnHeader, this.columns || []) as any;
      this.visible = this.showHeader;
      this.style = this.headerStyle;
      this.className = this.headerClass;
      this.class = null;
      super.init();
   }

   render(context: RenderingContext, instance: Instance, key: string) {
      let { data } = instance;
      return (
         <tr key={key} className={data.classNames} style={data.style}>
            {this.renderChildren(context, instance)}
         </tr>
      );
   }
}

GridColumnHeaderLine.prototype.isPureContainer = false;
GridColumnHeaderLine.prototype.styled = true;
GridColumnHeaderLine.prototype.showHeader = true;
GridColumnHeaderLine.autoInit = true;

export interface GridColumnHeaderConfig extends WidgetConfig {
   format?: StringProp;
   width?: NumberProp;
   defaultWidth?: NumberProp;
   fixed?: BooleanProp;
   field?: string;
   sortable?: boolean;
   resizable?: boolean;
   draggable?: boolean;
   header?: StringProp | GridColumnHeaderConfig;
   header1?: StringProp | GridColumnHeaderConfig;
   header2?: StringProp | GridColumnHeaderConfig;
   header3?: StringProp | GridColumnHeaderConfig;
   footer?: any;
   caption?: any;
   aggregateField?: string;
   aggregateAlias?: string;
   pad?: boolean;
   colSpan?: NumberProp;
}

class GridColumnHeader extends Widget<GridColumnHeaderConfig> {
   declare format?: any;
   declare width?: any;
   declare defaultWidth?: any;
   declare fixed?: any;
   declare field?: string;
   declare sortable?: boolean;
   declare resizable?: boolean;
   declare draggable?: boolean;
   declare header?: any;
   declare header1?: any;
   declare header2?: any;
   declare header3?: any;
   declare footer?: any;
   declare caption?: any;
   declare aggregateField?: string;
   declare aggregateAlias?: string;
   declare aggregateAliasGetter?: any;
   declare pad?: boolean;
   declare colSpan?: any;
   declare style?: any;
   declare className?: any;
   declare class?: any;
   declareData() {
      return super.declareData(...arguments, {
         format: undefined,
         width: undefined,
         defaultWidth: undefined,
         fixed: undefined,
      });
   }

   init() {
      delete this.style;
      delete this.className;
      delete this.class;

      if (this.header) this.header1 = this.header;

      if (this.header1 || this.resizable || this.width || this.defaultWidth || this.sortable || this.draggable) {
         if (!isObject(this.header1))
            this.header1 = {
               text: this.header1 || "",
            };

         if (this.resizable) this.header1.resizable = this.resizable;

         if (this.width) this.header1.width = this.width;

         if (this.defaultWidth) this.header1.defaultWidth = this.defaultWidth;

         if (this.draggable) this.header1.draggable = this.draggable;
      }

      if (this.header2 && isSelector(this.header2))
         this.header2 = {
            text: this.header2,
         };

      if (this.header3 && isSelector(this.header3))
         this.header3 = {
            text: this.header3,
         };

      if (!this.aggregateField && this.field) this.aggregateField = this.field;

      if (!this.aggregateAlias) this.aggregateAlias = this.aggregateField;
      if (this.aggregateAlias) this.aggregateAliasGetter = Binding.get(this.aggregateAlias).value;

      if (this.footer && isSelector(this.footer))
         this.footer = {
            value: this.footer,
            pad: this.pad,
            colSpan: this.colSpan,
         };

      if (this.footer) {
         this.footer.value = getSelector(this.footer.value);
         this.footer.class = getSelector(this.footer.class);
         this.footer.style = getSelector(this.footer.style);
         this.footer.format = getSelector(this.footer.format);
      }

      if (this.caption && isSelector(this.caption))
         this.caption = {
            value: this.caption,
            pad: this.pad,
            format: this.format,
         };

      if (this.caption) {
         let children = this.caption.children || this.caption.items;
         if (children) {
            delete this.caption.items;
            this.caption.children = Widget.create(children);
         } else {
            this.caption.value = getSelector(this.caption.value);
            this.caption.format = getSelector(this.caption.format);
         }
         this.caption.class = getSelector(this.caption.class);
         this.caption.style = getSelector(this.caption.style);
      }

      super.init();
   }

   initComponents() {
      return super.initComponents({
         header1: this.header1 && GridColumnHeaderCell.create(this.header1),
         header2: this.header2 && GridColumnHeaderCell.create(this.header2),
         header3: this.header3 && GridColumnHeaderCell.create(this.header3),
      });
   }

   render() {
      return null;
   }
}

GridColumnHeader.autoInit = true;

export interface GridColumnHeaderCellConfig extends PureContainerConfig {
   text?: StringProp;
   colSpan?: NumberProp;
   rowSpan?: NumberProp;
   width?: NumberProp;
   defaultWidth?: NumberProp;
   resizable?: BooleanProp;
   fixed?: BooleanProp;
   draggable?: BooleanProp;
   tool?: any;
   allowSorting?: boolean;
}

class GridColumnHeaderCell extends PureContainerBase<GridColumnHeaderCellConfig> {
   declare text?: any;
   declare colSpan?: any;
   declare rowSpan?: any;
   declare width?: any;
   declare defaultWidth?: any;
   declare resizable?: any;
   declare fixed?: any;
   declare draggable?: any;
   declare tool?: any;
   declare allowSorting?: boolean;
   declare styled?: boolean;
   declareData() {
      return super.declareData(...arguments, {
         text: undefined,
         colSpan: undefined,
         rowSpan: undefined,
         width: undefined,
         defaultWidth: undefined,
         resizable: undefined,
         fixed: undefined,
         draggable: undefined,
      });
   }

   initComponents() {
      return super.initComponents(...arguments, {
         tool: this.tool && Widget.create(this.tool),
      });
   }

   render(context: RenderingContext, instance: Instance, key: string) {
      let { data } = instance;
      return data.text || super.render(context, instance, key);
   }
}

GridColumnHeaderCell.prototype.colSpan = 1;
GridColumnHeaderCell.prototype.rowSpan = 1;
GridColumnHeaderCell.prototype.allowSorting = true;
GridColumnHeaderCell.prototype.styled = true;
GridColumnHeaderCell.prototype.fixed = false;

// function initGrouping(grouping) {
//    grouping.forEach((g) => {
//       if (g.caption) g.caption = getSelector(g.caption);
//    });
// }

function copyCellSize(
   srcTableBody: HTMLTableSectionElement,
   dstTableBody: HTMLTableSectionElement,
   applyHeight = true,
) {
   if (!srcTableBody || !dstTableBody) return false;

   let changed = false;
   for (let r = 0; r < dstTableBody.children.length && r < srcTableBody.children.length; r++) {
      let sr = srcTableBody.children[r];
      let dr = dstTableBody.children[r];
      for (let c = 0; c < dr.children.length && c < sr.children.length; c++) {
         let dc = dr.children[c] as HTMLElement;
         let sc = sr.children[c] as HTMLElement;
         let ws = `${sc.offsetWidth}px`;
         if (!changed && dc.style.width != ws) changed = true;
         dc.style.width = dc.style.minWidth = dc.style.maxWidth = ws;
         if (applyHeight) dc.style.height = `${sc.offsetHeight}px`;
      }
   }
   return changed;
}

function copyCellSizePrecise(
   srcTableBody: HTMLTableSectionElement,
   dstTableBody: HTMLTableSectionElement,
   applyHeight = true,
) {
   if (!srcTableBody || !dstTableBody) return false;
   let changed = false;
   for (let r = 0; r < dstTableBody.children.length && r < srcTableBody.children.length; r++) {
      let sr = srcTableBody.children[r];
      let dr = dstTableBody.children[r];
      for (let c = 0; c < dr.children.length && c < sr.children.length; c++) {
         let dc = dr.children[c] as HTMLElement;
         let sc = sr.children[c] as HTMLElement;
         let bounds = sc.getBoundingClientRect();
         let ws = `${bounds.width}px`;
         if (!changed && dc.style.width != ws) changed = true;
         dc.style.width = dc.style.minWidth = dc.style.maxWidth = ws;
         if (applyHeight) dc.style.height = `${bounds.height}px`;
      }
   }
   return changed;
}

function syncHeaderHeights(header1: HTMLElement, header2: HTMLElement) {
   /**
    * In the first pass measure all row heights.
    * In the second pass apply those heights.
    * Use getBoundingClientRect() for sub-pixel accuracy.
    */

   if (!header1 || !header2) return;
   const rowCount = Math.max(header1.children.length, header2.children.length);
   let rowHeight = [];
   for (let r = 0; r < rowCount; r++) {
      rowHeight.push(0);
      let tr1 = header1.children[r];
      let tr2 = header2.children[r];
      if (tr1) {
         for (let i = 0; i < tr1.children.length; i++) {
            let td = tr1.children[i] as HTMLTableCellElement;
            let h = td.getBoundingClientRect().height;
            if (td.rowSpan == 1 && h > rowHeight[r]) {
               rowHeight[r] = h;
               break;
            }
         }
      }
      if (tr2) {
         for (let i = 0; i < tr2.children.length; i++) {
            let td = tr2.children[i] as HTMLTableCellElement;
            let h = td.getBoundingClientRect().height;
            if (td.rowSpan == 1 && h > rowHeight[r]) {
               rowHeight[r] = h;
               break;
            }
         }
      }
   }

   for (let r = 0; r < rowCount; r++) {
      let tr1 = header1.children[r];
      let tr2 = header2.children[r];
      if (tr1) {
         for (let i = 0; i < tr1.children.length; i++) {
            let td = tr1.children[i] as HTMLTableCellElement;
            let h = 0;
            for (let x = 0; x < td.rowSpan; x++) h += rowHeight[r + x];
            td.style.height = `${h}px`;
         }
      }
      if (tr2) {
         for (let i = 0; i < tr2.children.length; i++) {
            let td = tr2.children[i] as HTMLTableCellElement;
            let h = 0;
            for (let x = 0; x < td.rowSpan; x++) h += rowHeight[r + x];
            td.style.height = `${h}px`;
         }
      }
   }
}

class AvgHeight {
   groups: Record<string, { sum: number; count: number }>;

   constructor() {
      this.groups = {};
   }

   add(group: string, height: number) {
      let g = this.groups[group];
      if (!g) g = this.groups[group] = { sum: 0, count: 0 };
      g.sum += height;
      g.count++;
   }

   estimate(group: string): number | null {
      let g = this.groups[group];
      if (!g || g.count == 0) return null;
      return Math.round(g.sum / g.count);
   }
}

function getDragDropEvent(ev: React.DragEvent, store: View, type: "dragstart" | "dragmove" | "dragdrop"): DragEvent {
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

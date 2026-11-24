// Configuration, record and event types of Grid. Grid.tsx re-exports the public ones.
import type { DataAdapterRecord, DataAdapter } from "../../ui/adapter/DataAdapter";
import type { GridRowInstance, GridRowConfig } from "./GridRow";
import type { DragEvent, DragDropOperationContext, DragEndEvent } from "../drag-drop/ops";
import type { Instance } from "../../ui/Instance";
import type {
   Prop,
   SortDirection,
   StructuredProp,
   StringProp,
   Sorter,
   NumberProp,
   StyleProp,
   ClassProp,
   BooleanProp,
   UnknownProp,
   CollatorOptions,
   SortersProp,
   RecordAlias,
   DataRecord,
   Config,
} from "../../ui/Prop";
import type { StyledContainerConfig } from "../../ui/Container";
import type { CreateConfig } from "../../util";
import type { Selection, SimpleSelection } from "../../ui/selection/Selection";
import type { KeySelection } from "../../ui/selection/KeySelection";
import type { PropertySelection } from "../../ui/selection/PropertySelection";
import type { ArrayAdapter } from "../../ui/adapter/ArrayAdapter";
import type { TreeAdapter } from "../../ui/adapter/TreeAdapter";
import type { GroupAdapter } from "../../ui/adapter/GroupAdapter";
import type { WidgetConfig } from "../../ui/Widget";
import type { GridInstance } from "./Grid";

export type GridFetchRecordsResult<T> = T[] | { records: T[]; lastPage?: boolean; totalRecordCount?: number };

export interface MappedGridRecord<T = any> extends DataAdapterRecord<T> {
   row?: GridRowInstance;
   vdom?: any;
   fixedVdom?: any;
   grouping?: any;
   level?: number;
   group?: any;
}

export interface GridDragEvent<T> extends DragEvent {
   target: {
      recordBefore?: MappedGridRecord<T>;
      recordAfter?: MappedGridRecord<T>;
      insertionIndex: number;
      totalRecordCount: number;
      dropNextToTheRowAbove?: boolean | null;
   };
}

export interface GridRowDragEvent<T> extends DragEvent {
   target: {
      record: MappedGridRecord<T>;
      index: number;
   };
}

export interface GridColumnDropEvent extends DragEvent {
   target: {
      grid: any;
      instance: Instance;
      index: number;
   };
}

export interface GridDropOperationContext extends DragDropOperationContext {
   test: {
      grid: any;
      row: any;
      column: any;
   };
}

export interface GridMoveCursorOptions {
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

export interface GridGroupingKey {
   [key: string]:
      | Prop<any>
      | {
           value: Prop<any>;
           direction: SortDirection;
        };
}

export interface GroupingResult<T> {
   key: any;
   aggregates: any;
   name: string;
   indexes: number[];
   records: MappedGridRecord<T>[];
}

export type GridColumnAlignment = "left" | "right" | "center";

export interface GridGroupingConfig<T> {
   key?: GridGroupingKey;
   aggregates?: StructuredProp;
   showCaption?: boolean;
   showFooter?: boolean;
   showHeader?: boolean;
   /**
    * Restart automatic row numbers (`cxe-grid-row-number`) from 1 at the beginning of each group
    * at this grouping level instead of counting continuously across the whole grid. Defaults to `false`.
    */
   resetRowNumbers?: boolean;
   caption?: StringProp;
   name?: StringProp;
   text?: StringProp;
   comparer?: (a: GroupingResult<T>, b: GroupingResult<T>) => number;
   /**
    * Sort groups by a single field resolved against the group's key, aggregates and name.
    * Use an aggregate alias to sort by an aggregate, or a key field to sort by key.
    */
   sortField?: string;
   /** Sort direction used together with `sortField`. Defaults to `"ASC"`. */
   sortDirection?: SortDirection;
   /** Multi-field group sorting. Each sorter's `field` is resolved against the group's key, aggregates and name. */
   sorters?: Sorter[];
}

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
   colSpan?: NumberProp;
}

export interface GridColumnCaptionConfig {
   value?: Prop<any>;
   format?: StringProp;
   style?: StyleProp;
   class?: StyleProp;
   children?: any;
   items?: any;
   expand?: boolean;
   colSpan?: NumberProp;
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
   caption?: GridColumnCaptionConfig | StringProp | NumberProp | false;
   class?: ClassProp;
   className?: ClassProp;
   draggable?: boolean;
   editable?: boolean;
   editor?: React.ReactNode;
   footer?: GridColumnFooterConfig | StringProp | NumberProp | false;
   items?: ChildNode | ChildNode[];
   children?: ChildNode | ChildNode[];
   key?: string;
   pad?: boolean;
   /**
    * Record field used for sorting instead of `field` or the displayed `value`.
    * Use it when the column displays a computed value but should sort by raw data.
    * Sort key precedence: `sortValue` > `sortField` > `value` > `field`.
    */
   sortField?: string;
   /**
    * Selector (binding, template, expression or computable) used for sorting instead
    * of `field`, `sortField` or the displayed `value`. Takes the highest precedence.
    */
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
   /** Sort null values before other values, in both directions. By default, null values are sorted last. */
   nullsFirst?: boolean;
   /** Value used in place of null values when sorting, which are then sorted like any other value. */
   nullSortValue?: any;
   colSpan?: NumberProp;

   mergeCells?: Prop<null | false | "same-value" | "always">;
   primarySortDirection?: "ASC" | "DESC";
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
   selection?:
      | CreateConfig<typeof Selection>
      | CreateConfig<typeof KeySelection>
      | CreateConfig<typeof PropertySelection>
      | CreateConfig<typeof SimpleSelection>;

   /** A grouping definition, field name, or an array of grouping level definitions. */
   grouping?: string | GridGroupingConfig<T> | (string | GridGroupingConfig<T>)[];

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
   dataAdapter?:
      | CreateConfig<typeof DataAdapter>
      | CreateConfig<typeof ArrayAdapter>
      | CreateConfig<typeof TreeAdapter>
      | CreateConfig<typeof GroupAdapter>;

   /** Additional CSS class to be added to each grid row. */
   rowClass?: ClassProp;

   /** Additional CSS styles to be added to each grid row. */
   rowStyle?: StyleProp;

   // drag-drop handlers
   onDrop?: string | ((e: GridDragEvent<T>, instance: Instance) => void);
   onDropTest?: string | ((e: DragEvent, instance: Instance) => boolean);
   onDragStart?: string | ((e: DragEvent, instance: Instance) => void);
   onDragEnd?: string | ((e: DragEndEvent, instance: Instance) => void);
   onDragOver?: string | ((e: GridDragEvent<T>, instance: Instance) => void | boolean);

   onRowDropTest?: string | ((e: DragEvent, instance: Instance) => boolean);
   onRowDragOver?: string | ((e: GridRowDragEvent<T>, instance: Instance) => void | boolean);
   onRowDrop?: string | ((e: GridRowDragEvent<T>, instance: Instance) => void | boolean);

   onColumnDrop?: string | ((e: GridColumnDropEvent, instance: Instance) => void);
   onColumnDropTest?: string | ((e: DragEvent, instance: Instance) => boolean);

   /** Parameters that affect filtering. */
   filterParams?: StructuredProp;

   /** Callback function to be executed when a row is right-clicked.  */
   onRowContextMenu?: string | ((e: React.MouseEvent<any>, instance: Instance) => void);

   /** Callback function to be executed when a column header is right-clicked.  */
   onColumnContextMenu?: string | ((e: React.MouseEvent<any>, columnInstance: Instance) => void);

   /** Callback to create a filter function for given filter params. */
   onCreateFilter?: (filterParams: any, instance?: Instance) => undefined | null | ((record: T) => boolean);

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
   ) => GridFetchRecordsResult<T> | Promise<GridFetchRecordsResult<T>>;

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
   onGetGrouping?: (params: any, instance: Instance) => (string | GridGroupingConfig<T>)[];

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
   onRef?: string | ((element: any, instance: GridInstance) => void);

   /** When enabled, groups are shown in the same order as the source records. */
   preserveGroupOrder?: boolean;

   /**
    * When enabled, sorting by a column header also reorders groups. The active sort field is resolved
    * against each group's key fields, aggregates and name, so it works for both grouping columns and
    * aggregate columns. Ignored when `preserveGroupOrder` is set.
    */
   sortGroups?: boolean;
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

// The configuration of the column header widget. It merges with the GridColumnHeaderConfig declared above (the
// `header` options of a column), and the merged interface is the one exported from Grid.
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

/** The DOM elements of a grid, kept by its React component. Not part of the public API. */
export interface GridDom {
   el?: HTMLElement | null;
   table?: HTMLElement | null;
   scroller?: HTMLElement | null;
   fixedScroller?: HTMLElement | null;
   fixedTable?: HTMLElement | null;
   fixedHeader?: HTMLElement | null;
   fixedColumnsFixedHeader?: HTMLElement | null;
   fixedFooter?: HTMLElement | null;
   fixedColumnsFixedFooter?: HTMLElement | null;
}

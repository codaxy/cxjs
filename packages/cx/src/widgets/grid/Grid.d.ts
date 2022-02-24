import * as Cx from "../../core";
import * as React from "react";
import { Instance } from "../../ui/Instance";
import { DragEvent } from "../drag-drop/ops";
import { View } from "../../data/View";

type FetchRecordsResult = Cx.Record[] | { records: Cx.Record[]; lastPage?: boolean; totalRecordCount?: number };

interface MappedGridRecord {
   data: Cx.Record;
   store: View;
}

interface GridDragEvent extends DragEvent {
   target: {
      recordBefore: MappedGridRecord;
      recordAfter: MappedGridRecord;
      insertionIndex: number;
      totalRecordCount: number;
   };
}

interface GridRowDragEvent extends DragEvent {
   target: {
      record: MappedGridRecord;
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

interface GridGroupingKey {
   [key: string]:
      | Cx.Prop<any>
      | {
           value: Cx.Prop<any>;
           direction: Cx.SortDirection;
        };
}

type GridColumnAlignment = "left" | "right" | "center";

interface GridGroupingConfig {
   key: GridGroupingKey;
   aggregates?: Cx.StructuredProp;
   showCaption?: boolean;
   showFooter?: boolean;
   showHeader?: boolean;
   caption?: Cx.StringProp;
   name?: Cx.StringProp;
   text?: Cx.StringProp;
}

// TODO: Check Column config
// Props are in order based on docs

interface GridColumnHeaderConfig {
   text?: Cx.StringProp;
   colSpan?: Cx.NumberProp;
   rowSpan?: Cx.NumberProp;
   align?: GridColumnAlignment;
   allowSorting?: boolean;
   items?: React.ReactNode;
   children?: React.ReactNode;
   tool?: React.ReactNode;
}

interface GridColumnConfig {
   align?: GridColumnAlignment;
   field?: string;
   format?: Cx.StringProp;
   header?: Cx.StringProp | GridColumnHeaderConfig;
   header1?: Cx.StringProp | GridColumnHeaderConfig;
   header2?: Cx.StringProp | GridColumnHeaderConfig;
   header3?: Cx.StringProp | GridColumnHeaderConfig;
   sortable?: boolean;
   aggregate?: "min" | "max" | "count" | "sum" | "distinct" | "avg";
   aggregateAlias?: string;
   aggregateField?: string;
   caption?: Cx.StringProp;
   class?: Cx.ClassProp;
   className?: Cx.ClassProp;
   draggable?: boolean;
   editable?: boolean;
   editor?: React.ReactNode;
   footer?: Cx.StringProp | false;
   items?: React.ReactNode;
   children?: React.ReactNode;
   layout?: Cx.StringProp;
   key?: string;
   pad?: boolean;
   sortField?: string;
   sortValue?: Cx.Prop<any>;
   style?: Cx.StyleProp;
   trimWhitespace?: boolean;
   visible?: Cx.BooleanProp;
   if?: Cx.BooleanProp;
   weightField?: string;

   // Not in docs
   value?: Cx.Prop<any>;
   defaultWidth?: Cx.NumberProp;
   width?: Cx.NumberProp;
   resizable?: boolean;
   comparer?: (a: any, b: any) => number;

   /** Options for data sorting. See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator */
   sortOptions?: Cx.CollatorOptions;
}

interface GridRowLineConfig {
   visible?: Cx.BooleanProp;
   columns: GridColumnConfig[];
}

interface GridRowConfig {
   invalid?: Cx.BooleanProp;
   valid?: Cx.BooleanProp;
   style?: Cx.StyleProp;
   class?: Cx.ClassProp;
   className?: Cx.ClassProp;
   line1?: GridRowLineConfig;
   line2?: GridRowLineConfig;
   line3?: GridRowLineConfig;
}

interface GridProps extends Cx.StyledContainerProps {
   /** An array of records to be displayed in the grid. */
   records?: Cx.Prop<Cx.Record[]>;

   /** Set to true to add a vertical scroll and a fixed header to the grid. */
   scrollable?: boolean;

   /** A binding used to store the sorting order list. Commonly used for server-side sorting. */
   sorters?: Cx.SortersProp;

   /** A list of sorters to be prepended to the actual list of sorters. */
   preSorters?: Cx.SortersProp;

   /** A binding used to store the name of the field used for sorting grids. Available only if sorters are not used. */
   sortField?: Cx.StringProp;

   /** A binding used to store the sort direction. Available only if sorters are not used. Possible values are "ASC" and "DESC". Deafults to "ASC". */
   sortDirection?: Cx.StringProp;

   /** Default sort field. Used if neither sortField or sorters are set. */
   defaultSortField?: string;

   /** Default sort direction. */
   defaultSortDirection?: "ASC" | "DESC";

   /** Set to true to add vertical gridlines. */
   vlines?: boolean;

   /** Text to be displayed instead of an empty table. */
   emptyText?: Cx.StringProp;

   /** Drag source configuration. Define mode as 'move' or 'copy` and additional data. */
   dragSource?: Cx.StructuredProp;

   /** Drop zone configuration. Define mode as either preview or insertion. */
   dropZone?: Cx.StructuredProp;

   /** Row configuration. See grid examples. */
   row?: GridRowConfig;

   /**An array of columns. Check column configuration options in the section below. */
   columns?: GridColumnConfig[];

   /** Whenever columnParams change, columns are recalculated using the onGetColumn callback. */
   columnParams?: Cx.Config;

   /** Selection configuration. */
   selection?: Cx.Config;

   /** An array of grouping level definitions. Check allowed grouping level properties in the section below. */
   grouping?: GridGroupingConfig[];

   /** Params for grouping. Whenever params change grouping is recalculated using the onGetGrouping callback. */
   groupingParams?: Cx.Config;

   /**
    * Determines header appearance. Supported values are plain and default. Default mode is used if some of the columns are sortable.
    * Plain mode better suits reports and other scenarios in which users do not interact with the grid.
    */
   headerMode?: Cx.StringProp;

   /** Set to true to add default border around the table. Automatically set if grid is scrollable. */
   border?: Cx.BooleanProp;

   /** Base CSS class to be applied to the element. Default is 'grid'. */
   baseClass?: string;

   /** A field used to get the unique identifier of the record. Setting keyField improves grid performance on sort operations as the widget is able to identify row movement inside the grid.  */
   keyField?: string;

   /** Show grid header within the group. Useful for long report-like (printable) grids. Defaults to false. */
   showHeader?: boolean;

   /** Show grid footer. Defaults to false. */
   showFooter?: boolean;

   /** Record alias. Default is $record. */
   recordName?: string;

   /** Record alias. Default is $record. */
   recordAlias?: string;

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
   dataAdapter?: any;

   /** Additional CSS class to be added to each grid row. */
   rowClass?: Cx.ClassProp;

   /** Additional CSS styles to be added to each grid row. */
   rowStyle?: Cx.StyleProp;

   // drag-drop handlers
   onDrop?: (e: GridDragEvent, instance: Instance) => void;
   onDropTest?: (e: DragEvent, instance: Instance) => boolean;
   onDragStart?: (e: DragEvent, instance: Instance) => void;
   onDragEnd?: (e: DragEvent, instance: Instance) => void;
   onDragOver?: (e: GridDragEvent, instance: Instance) => void | boolean;

   onRowDropTest?: (e: DragEvent, instance: Instance) => boolean;
   onRowDragOver?: (e: GridRowDragEvent, instance: Instance) => void | boolean;
   onRowDrop?: (e: GridRowDragEvent, instance: Instance) => void | boolean;

   onColumnDrop?: (e: GridColumnDropEvent, instance: Instance) => void;
   onColumnDropTest?: (e: DragEvent, instance: Instance) => boolean;

   /** Parameters that affect filtering. */
   filterParams?: Cx.StructuredProp;

   /** Callback to create a filter function for given filter params. */
   onCreateFilter?: (filterParams: any, instance?: Instance) => (record: Cx.Record) => boolean;

   /** Enable infinite scrolling */
   infinite?: boolean;

   /** If set, clicking on the column header will loop between ASC, DESC and no sorting order, instead of ASC and DESC only. */
   clearableSort?: boolean;

   /** A callback to fetch records during infinite loading */
   onFetchRecords?: (
      pageInfo: {
         page: number;
         pageSize: number;
         sorters?: Cx.Record[];
         sortField?: string;
         sortDirection?: string;
      },
      instance?: Instance
   ) => FetchRecordsResult | Promise<FetchRecordsResult>;

   /** Callback function to be executed when a row is double-clicked. */
   onRowDoubleClick?: string | ((e: React.SyntheticEvent<any>, instance: Instance) => void);

   /** Callback function to be executed when a row is clicked. */
   onRowClick?: string | ((e: React.SyntheticEvent<any>, instance: Instance) => void);

   /** Set to true to add a fixed footer at the bottom of the grid. */
   fixedFooter?: boolean;

   /** Set to true to enable cell editing. Please note that all editable columns should specify the editor field. */
   cellEditable?: boolean;

   /** A callback function which is executed before a cell editor is initalized. Return false from the callback to prevent the cell from going into the edit mode. */
   onBeforeCellEdit?: (change, record) => any;

   /** A callback function which is executed after a cell has been successfully edited. */
   onCellEdited?: (change, record) => void;

   /** A callback function which is executed after a column has been resized. */
   onColumnResize?: (data: { width: number; column: Cx.Record }, instance: Instance) => void;

   /** Options for data sorting. See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator */
   sortOptions?: Cx.CollatorOptions;

   onCreateIsRecordSelectable?: (
      params: any,
      instance: Instance
   ) => (record: Cx.Record, options?: { range?: boolean; toggle?: boolean }) => boolean;

   /** Parameters whose change will casuse scroll to be reset. */
   scrollResetParams?: Cx.StructuredProp;

   /** Enable precise (sub-pixel) measurements. Useful for grids with many columns. Better behavior at small zoom factors. */
   preciseMeasurements?: boolean;

   /** A value used to identify the group of components participating in hover effect synchronization. */
   hoverChannel?: string;

   /** A value used to uniquely identify the record within the hover sync group. */
   rowHoverId?: Cx.StringProp;

   /** Set to true or false to explicitly define if grid is allowed to receive focus.  */
   focusable?: boolean;

   /** Callback function to retrieve grouping data.  */
   onGetGrouping?: (params: any, instance: Instance) => GridGroupingConfig[];

   /** Callback function to dynamically calculate columns.  */
   onGetColumns?: (params: any, instance: Instance) => GridColumnConfig[] | GridRowConfig;

   /** Allow grid to receive drag and drop operations containing files. */
   allowsFileDrops?: boolean;
}

export class Grid extends Cx.Widget<GridProps> {}

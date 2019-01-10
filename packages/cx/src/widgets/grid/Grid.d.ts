import * as Cx from '../../core';
import * as React from 'react';
import {Instance} from "../../ui/Instance";
import {DragEvent} from '../drag-drop/ops';

type FetchRecordsResult = Cx.Record[] | { records: Cx.Record[], lastPage?: boolean, totalRecordCount?: number }

interface GridProps extends Cx.StyledContainerProps {

   /** An array of records to be displayed in the grid. */
   records?: Cx.Prop<Cx.Record[]>,

   /** Set to `true` to add a vertical scroll and a fixed header to the grid. */
   scrollable?: boolean
   
   /** A binding used to store the sorting order list. Commonly used for server-side sorting */
   sorters?: Cx.SortersProp,

   /** A binding used to store the name of the field used for sorting grids. Available only if `sorters` are not used. */
   sortField?: Cx.StringProp,
   
   /** A binding used to store the sort direction. Available only if `sorters` are not used. Possible values are `"ASC"` and `"DESC"`. Deafults to `"ASC"`. */
   sortDirection?: Cx.StringProp,

   /** Default sort field. Used if neither `sortField` or `sorters` are set. */
   defaultSortField?: string;

   /** Default sort direction. */
   defaultSortDirection?: "ASC" | "DESC";

   /** Set to `true` to add vertical gridlines. */
   vlines?: boolean;

   /** Text to be displayed instead of an empty table. */
   emptyText?: Cx.StringProp,

   /** Drag source configuration. Define `mode` as 'move' or 'copy` and additional `data`. */
   dragSource?: Cx.StructuredProp,

   /** Drop zone configuration. Define `mode` as either `preview` or `insertion`. */
   dropZone?: Cx.StructuredProp,

   /** Row configuration. See grid examples. */
   row?: Cx.Config,

   /**An array of columns. Check column configuration options in the section below. */
   columns?: Cx.Record[],

   /** Selection configuration. */
   selection?: Cx.Config,

   /** An array of grouping level definitions. Check allowed grouping level properties in the section below. */
   grouping?: Cx.Record[],

   /**
    * Determines header appearance. Supported values are `plain` and `default`. Default mode is used if some of the columns are sortable.
    * Plain mode better suits reports and other scenarios in which users do not interact with the grid.
    */
   headerMode?: Cx.StringProp,

   /** Set to `true` to add default border around the table. Automatically set if grid is `scrollable`. */
   border?: Cx.BooleanProp,

   /** Base CSS class to be applied to the element. Default is 'grid'. */
   baseClass?: string,

   /** A field used to get the unique identifier of the record. Setting `keyField` improves grid performance on sort operations as the widget is able to identify row movement inside the grid.  */
   keyField?: string;

   /** Show grid header within the group. Useful for long report-like (printable) grids. Defaults to `false`. */
   showHeader?: boolean,

   /** Show grid footer. Defaults to `false`. */
   showFooter?: boolean,

   /** Record alias. Default is `$record`. */
   recordName?: string,

   /** Record alias. Default is `$record`. */
   recordAlias?: string,

   /** Set to `true` if sorting is done remotely, on the server-side. Default value is `false`. */
   remoteSort?: boolean,

   /** Set to `true` to enable row caching. This greatly improves grid performance
    on subsequent render operations, however, only changes on `records`
    are allowed. If grid rows display any data outside `records`, changes on that
    data will be ignored. */
   cached?: boolean,

   /** Render only rows visible on the screen. */
   buffered?: boolean,

   /** Specifies how many rows should be visible on the screen */
   bufferSize?: number,

   /** Specifies how many rows needs to be scrolled in order to recalculate buffer */
   bufferStep?: number,

   /** Scrolls selection into the view. Default value is false. */
   scrollSelectionIntoView?: boolean,

   /**
    * Set to true to lock column widths after the first render.
    * This is helpful in pagination scenarios to maintain consistent looks across pages.
    */
   lockColumnWidths?: boolean,

   lockColumnWidthsRequiredRowCount?: number,
   focused?: boolean,
   showBorder?: boolean,

   /** Data adapter used to convert data in list of records. Used to enable grouping and tree operations. */
   dataAdapter?: any,

   /** Additional CSS class to be added to each grid row. */
   rowClass?: Cx.ClassProp,

   /** Additional CSS styles to be added to each grid row. */
   rowStyle?: Cx.StyleProp

   // drag-drop handlers
   onDrop?: (e: DragEvent, instance: Instance) => void;
   onDropTest?: (e: DragEvent, instance: Instance) => boolean;
   onDragStart?: (e: DragEvent, instance: Instance) => void;
   onDragEnd?: (e: DragEvent, instance: Instance) => void;

   /** Parameters that affect filtering. */
   filterParams?: Cx.StructuredProp,

   /** Callback to create a filter function for given filter params. */
   onCreateFilter?: (filterParams: any, instance?: Instance) => (record: Cx.Record) => boolean;

   /** Enable infinite scrolling */
   infinite?: boolean,

   /** If set, clicking on the column header will loop between ASC, DESC and no sorting order, instead of ASC and DESC only. */
   clearableSort?: boolean,

   /** A callback to fetch records during infinite loading */
   onFetchRecords?: (pageInfo: { page: number, pageSize: number, sorters?: Cx.Record[], sortField?: string, sortDirection?: string }, instance?: Instance) => FetchRecordsResult | Promise<FetchRecordsResult>;

   /** Callback function to be executed when a row is double-clicked. */
   onRowDoubleClick?: string | ((e: React.SyntheticEvent<any>, instance: Instance) => void);

   /** Callback function to be executed when a row is clicked. */
   onRowClick?: string | ((e: React.SyntheticEvent<any>, instance: Instance) => void);

   /** Set to true to add a fixed footer at the bottom of the grid. */
   fixedFooter?: boolean,

   /** Set to true to enable cell editing. Please note that all editable columns should specify the editor field. */
   cellEditable?: boolean,

   /** A callback function which is executed after a cell has been successfully edited. */
   onCellEdited?: (change, record) => void
}

export class Grid extends Cx.Widget<GridProps> {}

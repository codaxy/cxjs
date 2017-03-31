import * as Cx from '../../core';

interface GridProps extends Cx.WidgetProps{

   /** An array of records to be displayed in the grid. */ 
   records?: Cx.Record[],

   /** 
    * Additional CSS classes to be applied to the field. 
    * If an object is provided, all keys with a "truthy" value will be added to the CSS class list. 
    */
   class?: Cx.ClassProp,

   /** 
    * Additional CSS classes to be applied to the field. 
    * If an object is provided, all keys with a "truthy" value will be added to the CSS class list. 
    */
   className?: Cx.ClassProp,

   /** Style object applied to the wrapper div. Used for setting the dimensions of the field. */
   style?: Cx.StyleProp,

   /** A binding used to store the sorting order list. Commonly used for server-side sorting */
   sorters?: Cx.RecordsProp,

   /** Set to `true` to add a vertical scroll and a fixed header to the grid. */
   scrollable?: Cx.BooleanProp,

   /** 
    * A binding used to store the name of the field used for sorting grids. 
    * Available only if `sorters` are not used. 
    */
   sortField?: Cx.StringProp,

   /** 
    * A binding used to store the sort direction. 
    * Available only if `sorters` are not used. 
    */
   sortDirection?: Cx.StringProp,

   /** Text to be displayed instead of an empty table. */
   emptyText?: Cx.StringProp,

   dragSource?: Cx.Config,
   dropZone?: Cx.Config,

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
   
   baseClass?: string,
   showHeader?: boolean,
   showFooter?: boolean,
   recordName?: string,
   remoteSort?: boolean,

   /** 
    * Set to true to lock column widths after the first render. 
    * This is helpful in pagination scenarios to maintain consistent looks across pages. 
    */
   lockColumnWidths?: boolean,

   lockColumnWidthsRequiredRowCount?: number,
   focused?: boolean,
   showBorder?: boolean   

}

export class Grid extends Cx.Widget<GridProps> {}

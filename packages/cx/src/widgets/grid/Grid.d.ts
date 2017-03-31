import * as Cx from '../../core';

interface GridProps extends Cx.Widget{

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

   baseClass?: string,
   recordName?: string,

   /** 
    * Set to true to lock column widths after the first render. 
    * This is helpful in pagination scenarios to maintain consistent looks across pages. 
    */
   lockColumnWidths?: boolean,
   




}

export class Grid extends Cx.Widget<GridProps> {}

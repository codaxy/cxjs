import * as Cx from '../../core';
import { FieldProps } from './Field';

interface LookupFieldProps extends FieldProps {

   /** Defaults to `false`. Set to `true` to enable multiple selection. */
   multiple?: Cx.BooleanProp,

   /** Selected value. Used only if `multiple` is set to `false`. */
   value?: Cx.Prop<number | string>,

   /** A list of selected records. Used only if `multiple` is set to `true`. */
   records?: Cx.Record[],

   /** Text associated with the selection. Used only if `multiple` is set to `false`. */
   text?: Cx.StringProp,

   /** Defaults to `false`. Set to `true` to disable the field. */
   disabled?: Cx.BooleanProp,

   /** The opposite of `disabled`. */
   enabled?: Cx.BooleanProp,

   /** Default text displayed when the field is empty. */
   placeholder?: Cx.StringProp,

   /** Defaults to `false`. Used to make the field required. */
   required?: Cx.BooleanProp,

   /** A list of available options. */
   options?: Cx.Prop<Array<string>>,

   /** 
    * Set to `true` to hide the clear button. It can be used interchangeably with the `showClear` property. 
    * No effect if `multiple` is used. Default value is `false`. 
    */
   hideClear?: boolean,

   /** 
    * Set to `false` to hide the clear button. It can be used interchangeably with the `hideClear` property. 
    * No effect if `multiple` is used. Default value is `true`. 
    */
   showClear?: boolean,

   /** Base CSS class to be applied to the field. Defaults to `lookupfield`. */
   baseClass?: string,

   queryDelay?: number,
   minQueryLength?: number,

   /** Set to `true` to hide the search field. */
   hideSearchField?: boolean,

   /** 
    * Number of options required to show the search field. 
    * If there are only a few options, there is no need for search. Defaults to `7`. 
    */
   minOptionsForSearchField?: number,

   loadingText?: string,
   queryErrorText?: string,
   noResultsText?: string,

   /** Name of the field which holds the id of the option. Default value is `id`. */
   optionIdField?: string,

   /** Name of the field which holds the display text of the option. Default value is `text`. */
   optionTextField?: string,

   /**
    * Available only in `multiple` selection mode and without custom `bindings`. 
    * Name of the field to store id of the selected value. Default value is `id`. 
    */
   valueIdField?: string,

   /** 
    * Available only in `multiple` selection mode. 
    * Name of the field to store display text of the selected value. Default value is `text`. 
    */
   valueTextField?: string,

   suppressErrorTooltipsUntilVisited?: boolean,

   /** 
    * If `true` `onQuery` will be called only once to fetch all options. 
    * After that options are filtered client-side. 
    */
   fetchAll?: boolean,

   /** 
    * If this flag is set along with `fetchAll`, fetched options are cached for the lifetime of the widget. 
    * Otherwise, data is fetched whenever the dropdown is shown. 
    */
   cacheAll?: boolean,
   
   /** Close the dropdown after selection. Default is `true`. */
   closeOnSelect?: boolean,

   minQueryLengthMessageText?: string,

   /** Name of the icon to be put on the left side of the input. */
   icon?: string
}

export class LookupField extends Cx.Widget<LookupFieldProps> {}

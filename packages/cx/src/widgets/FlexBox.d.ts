import * as Cx from '../core';

interface FlexBoxProps extends Cx.PureContainerProps {
   
   /** Base CSS class. Default is `flexbox`. */
   baseClass?: string,
   
   /** Flex direction. Default is `row`.  */
   direction?: string,
   
   /** 
    * Add spacing between items by applying a margin to children. 
    * Allowed values are `xsmall`, `small`, `medium`, `large` and `xlarge`. 
    * Value `true` is equivalent to `medium`. 
    */
   spacing?: string | boolean,
   
   /** 
    * Add horizontal spacing between items by applying a margin to children. 
    * Allowed values are `xsmall`, `small`, `medium`, `large` and `xlarge`. 
    * Value `true` is equivalent to `medium`. \
    */
   hspacing?: string,
   
   /**
    * Add vertical spacing between items by applying a margin to children. 
    * Allowed values are xsmall, small, medium, large and xlarge. 
    * Value true is equivalent to medium.
    */
   vspacing?: boolean | string,

   styled?: boolean,

   /** 
    * Add padding to the box. Allowed values are `xsmall`, `small`, `medium`, `large` and `xlarge`.
    *  Value `true` is equivalent to `medium`. 
    */
   pad?: boolean | string,

   /** 
    * Add horizontal padding to the box. Allowed values are `xsmall`, `small`, `medium`, `large` and `xlarge`.
    *  Value `true` is equivalent to `medium`.
    */
   hpad?: boolean | string,

   /** 
    * Add vertical padding to the box. Allowed values are `xsmall`, `small`, `medium`, `large` and `xlarge`.
    *  Value `true` is equivalent to `medium`. 
    */
   vpad?: boolean | string,

   wrap?: boolean,
   align?: string,
   justify?: string,
   target?: string
   
}

export class FlexBox extends Cx.Widget<FlexBoxProps> {}

export class FlexRow extends FlexBox {}

export class FlexCol extends FlexBox {}

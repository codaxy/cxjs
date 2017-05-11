import {
   Widget,
   Prop,
   StyledContainerProps,
   BooleanProp,
   StringProp,
   StyleProp,
   ClassProp,
   Config
} from '../core';

interface SectionProps extends StyledContainerProps {

   id?: Prop<string | number>,

   /** Add default padding to the section body. Default is `true`. */
   pad?: BooleanProp,

   /** A custom style which will be applied to the header. */
   headerStyle?: StyleProp,

   /** Additional CSS class to be applied to the header. */
   headerClass?: ClassProp,

   /** A custom style which will be applied to the body. */
   bodyStyle?: StyleProp,

   /** Additional CSS class to be applied to the section body. */
   bodyClass?: ClassProp,

   /** A custom style which will be applied to the footer. */
   footerStyle?: StyleProp,

   /** Additional CSS class to be applied to the footer. */
   footerClass?: ClassProp,

   /** Section's title. */
   title?: StringProp,

   /** Contents that should go in the header. */
   header?: Config,

   /** Contents that should go in the footer. */
   footer?: Config,

   /** Title heading level (1-6) */
   hLevel?: number

}

export class Section extends Widget<SectionProps> {
}

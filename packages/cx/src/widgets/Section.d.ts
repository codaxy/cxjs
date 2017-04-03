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
   
   /** Base CSS class to be applied to the element. Default is 'section'. */
   baseClass?: string,

   styled?: boolean
}

export class Section extends Widget<SectionProps> {
}

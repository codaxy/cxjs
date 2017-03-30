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
   headerStyle?: StyleProp,
   headerClass?: ClassProp,
   bodyStyle?: StyleProp,
   bodyClass?: ClassProp,
   footerStyle?: StyleProp,
   footerClass?: ClassProp,
   title?: StringProp,
   header?: Config
}

export class Section extends Widget<SectionProps> {
}

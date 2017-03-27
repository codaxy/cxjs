import {
    Widget,
    StyledContainerProps,
    BooleanProp,
    StringProp,
    StyleProp,
    ClassProp
} from '../core';

interface SectionProps extends StyledContainerProps {
    id?: Cx.Prop<string | number>,
    pad?: BooleanProp,
    headerStyle?: StyleProp,
    headerClass?: ClassProp,
    bodyStyle?: StyleProp,
    bodyClass?: ClassProp,
    footerStyle?: StyleProp,
    footerClass?: ClassProp,
    title: StringProp
}

export class Section extends Widget<SectionProps> {}

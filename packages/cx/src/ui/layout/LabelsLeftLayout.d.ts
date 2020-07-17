import * as Cx from "../../core";

class LabelLeftLayoutProps extends Cx.StyledContainerProps {
   /** Additional CSS style to be passed to the label object. */
   labelStyle?: Cx.StyleProp;

   /** Additional CSS class to be passed to the label object. */
   labelClass?: Cx.ClassProp;
}

export class LabelsLeftLayout extends Cx.Widget<LabelLeftLayoutProps> {}

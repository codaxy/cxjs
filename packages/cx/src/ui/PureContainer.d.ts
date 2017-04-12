import * as Cx from '../core';

interface PureContainerProps extends Cx.WidgetProps {

   items?: any[],

   plainText?: boolean,
   styled?: boolean,

}

export class PureContainer extends Cx.Widget<Cx.PureContainerProps> {}

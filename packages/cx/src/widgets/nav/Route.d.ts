import * as Cx from '../../core';

export interface RouteProps extends Cx.PureContainerProps {

   path?: string,
   route?: string,

   // TODO: Check type
   matcher?: any
   
   recordName?: string

}

export class Route extends Cx.Widget<RouteProps> {}

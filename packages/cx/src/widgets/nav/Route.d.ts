import * as Cx from '../../core';

export interface RouteProps extends Cx.PureContainerProps {

   /** Url binding. Bind this to the global `url` variable. */
   url?: Cx.StringProp,

   /** Target route, e.g. `~/user/:userId`. All routes should start with `~/`. */
   path?: string,

   /** Target route, e.g. `~/user/:userId`. All routes should start with `~/`. */
   route?: string,
   
   /** Name used to expose local data. Defaults to `$route`. */
   recordName?: string,

   /** Match route even if given `route` is only a prefix of the current `url`. */
   prefix?: boolean
}

export class Route extends Cx.Widget<RouteProps> {}

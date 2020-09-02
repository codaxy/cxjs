import * as Cx from "../../core";
import { RouteProps } from "./Route";

interface RedirectRouteProps extends RouteProps {
   /** Redirection URL. */
   redirect?: Cx.StringProp;
}

export class RedirectRoute extends Cx.Widget<RedirectRouteProps> {}

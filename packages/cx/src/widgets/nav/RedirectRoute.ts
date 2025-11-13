import { Widget } from '../../ui/Widget';
import { RouteBase, RouteConfig } from './Route';
import { History } from '../../ui/app/History';
import { Url } from '../../ui/app/Url';
import { routeAppend } from "../../util/routeAppend";
import { StringProp } from "../../ui/Prop";
import { RenderingContext } from "../../ui/RenderingContext";
import { Instance } from "../../ui/Instance";

export interface RedirectRouteConfig extends RouteConfig {
   /** Redirection URL. */
   redirect?: StringProp;
}

export class RedirectRoute extends RouteBase<RedirectRouteConfig> {
   declare redirect?: StringProp;

   checkVisible(context: RenderingContext, instance: Instance, data: any) {

      if (!data.visible)
         return false;

      if (!data.url && !data.route)
         return true;

      return super.checkVisible(context, instance, data);
   }

   declareData() {
      super.declareData(...arguments, {
         redirect: undefined
      });
   }

   prepareData(context: RenderingContext, instance: Instance) {
      super.prepareData(context, instance);

      var {data} = instance;

      if (data.redirect && data.redirect[0] === '+')
         data.redirect = routeAppend(context.lastRoute.reverse(), data.redirect.substring(1));

      if (data.redirect && History.store)
         History.replaceState({}, null, Url.resolve(data.redirect));
      else
         instance.set('url', data.redirect);
   }
}

Widget.alias('redirect-route', RedirectRoute);
import { HtmlElement, List, Repeater, Menu, Text } from 'cx/widgets';
import { Controller, Url } from 'cx/ui';
import config from 'config';

class PickController extends Controller {
   init() {
      super.init();

      var state = String(Math.random() * 1000000);

      this.store.set('login.providers', Object.keys(config.login).map(id=> {
         var c = config.login[id];

         var {scope, client_id, url} = c;

         var redirect_uri = Url.absolute('~/?auth=1&provider='+id);

         var params = {
            scope,
            state,
            client_id,
            redirect_uri
         };

         var loginUrl = url;

         for (var key in params)
            loginUrl = loginUrl.replace('${' + key + '}', encodeURIComponent(String(params[key])));

         return {
            id: id,
            name: c.name,
            url: loginUrl
         }
      }));
   }
}

export const PickAuthProviderPage = <cx>
   <div class="cxb-app-message" style="width:300px;margin-left:auto;margin-right:auto;" controller={PickController}>
      <h1>Cx Fiddle</h1>
      <h3>Sign In</h3>

      <p>Please select one of the listed identification providers:</p>

      <Menu style="width: 200px;display:inline-block;">
         <Repeater records:bind="login.providers" recordName="$provider">
            <a class:tpl="cxb-loginbutton" href:bind="$provider.url">
               <img src:tpl="~/assets/signin/{$provider.id}.png" />
               Sign in with <Text bind="$provider.name" />
            </a>
         </Repeater>
      </Menu>
   </div>
</cx>;

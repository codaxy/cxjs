import {
   Route,
   HtmlElement,
   PureContainer,
   enableAllInternalDependencies
} from "cx/widgets";
import {FirstVisibleChildLayout} from "cx/ui";
import Default from "./default/";
import Preview from "./preview/";
import {WaitScreen} from "./login/";
import {PickAuthProviderPage} from "./login/PickAuthProviderPage";
import {MasterLayout} from "../../../misc/layout";

enableAllInternalDependencies();

export const App = (
   <cx>
      <PureContainer layout={FirstVisibleChildLayout}>
         <Route route="~/?login=1" url:bind="url">
            <PickAuthProviderPage/>
         </Route>
         <Route route="~/?auth(*splat)" url:bind="url">
            <WaitScreen/>
         </Route>
         <Route route="~/?p=:f" url:bind="url" params:bind="qs">
            <Preview/>
         </Route>
         <Route route="~/?f=:f" url:bind="url" params:bind="qs">
            <MasterLayout app="fiddle">
               <Default/>
            </MasterLayout>
         </Route>
         <Default/>
      </PureContainer>
   </cx>
);

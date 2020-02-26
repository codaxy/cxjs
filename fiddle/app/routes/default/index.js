import {FirstVisibleChildLayout, ContentResolver} from "cx/ui";
import {Header} from "./Header";
import Main from "./Main";
import Controller from "./Controller";
import {MasterLayout} from "../../../../misc/layout";


export default (
   <cx>
      <MasterLayout app="fiddle">
         <div
            class="cxb-app"
            controller={Controller}
            layout={FirstVisibleChildLayout}
         >
            <ContentResolver
               params={{
                  phone: () => window.innerWidth < 800
               }}
               onResolve={params => [Header(params.phone), Main(params.phone)]}
            />
         </div>
      </MasterLayout>
   </cx>
);

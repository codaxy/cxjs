import { FirstVisibleChildLayout, ContentResolver } from "cx/ui";
import { Header } from "./Header";
import Main from "./Main";
import Controller from "./Controller";

export default (
   <cx>
      <div
         class="cxb-app"
         controller={Controller}
         layout={FirstVisibleChildLayout}
      >
         <ContentResolver
            params={{
               phone: { expr: "window.innerWidth < 800" }
            }}
            onResolve={params => [Header(params.phone), Main(params.phone)]}
         />
      </div>
   </cx>
);

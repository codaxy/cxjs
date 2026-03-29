import {FirstVisibleChildLayout, ContentResolver, Text} from "cx/ui";
import {Header} from "./Header";
import Main from "./Main";
import Controller from "./Controller";
import {MasterLayout} from "../../../../misc/layout";
import {Menu, Submenu} from "cx/widgets";


export default (
   <cx>
      <MasterLayout app="fiddle">
         <div
            class="cxb-app"
            controller={Controller}
         >
            <div putInto="navtree">
               <div className="sidenav_group">File</div>
               <a baseClass="link" href="#" onClick="newFiddle">
                  New
               </a>
               <a href="#" baseClass="link" onClick="open">Open</a>
               <a
                  baseClass="link"
                  href="#"
                  onClick="save"
                  visible-expr="!{fiddle.fiddleId} || {fiddle.owned}"
               >
                  Save
               </a>
               <a
                  baseClass="link"
                  href="#"
                  onClick="save"
                  visible-expr="!{fiddle.owned}"
               >
                  Fork
               </a>
               <a baseClass="link" href="#" onClick="duplicate" visible-expr="{fiddle.owned}">
                  Duplicate
               </a>

               <div className="sidenav_group">Account</div>

               <a
                  href="#"
                  baseClass="link"
                  onClick="signInDialog"
                  visible-expr="!{user.email}"
               >
                  Sign In
               </a>
               <a href="#" baseClass="link" onClick="signOut" visible-expr="{user.email}">
                  Sign Out
               </a>

            </div>
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

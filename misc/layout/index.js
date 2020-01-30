import { ContentPlaceholder, Link } from "cx/widgets";
import { Animicon } from "../components/Animicon";
import { SideDrawer } from "../components/SideDrawer";

import Logo from "./cxjs.svg";
import CodeSandboxIcon from "./CodeSandbox.svg";
import GitHubIcon from "./github.svg";

export const MasterLayout = ({ app, children }) => (
   <cx>
      <div class="app">
         <header ws class="master_header">
            <div class="master_topbar">
               <div class="master_hamburger">
                  <Animicon
                     shape={{ bind: "master.drawer.icon", defaultValue: null }}
                     onClick={(e, { store }) => {
                        store.update("master.drawer.icon", shape => {
                           switch (shape) {
                              case "arrow":
                                 return "close";

                              case "close":
                                 return null;

                              default:
                                 return "arrow";
                           }
                        });
                     }}
                  />
               </div>
               <img class="master_logo" src={Logo} />
               <Link
                  href="https://cxjs.io"
                  url-bind="url"
                  active={app == "site"}
               >
                  Home
               </Link>
               <Link
                  href="https://docs.cxjs.io"
                  url-bind="url"
                  active={app == "docs"}
               >
                  Docs
               </Link>
               <Link
                  href="https://gallery.cxjs.io"
                  url-bind="url"
                  active={app == "gallery"}
               >
                  Gallery
               </Link>
               <Link
                  href="https://fiddle.cxjs.io"
                  url-bind="url"
                  active={app == "fiddle"}
               >
                  Fiddle
               </Link>
               <a style="margin-left: auto" class="master_iconlink" href="https://github.com/codaxy/cxjs">
                  <img src={GitHubIcon} alt="GitHub" />
               </a>
               <a class="master_iconlink" href="https://codesandbox.io/search?refinementList%5Btemplate%5D%5B0%5D=cxjs">
                  <img src={CodeSandboxIcon} alt="CodeSandbox" />
               </a>
            </div>
         </header>
         {children}
         <SideDrawer out-bind="master.drawer.icon">
            <div class="sidenav">
               {/* <NavTree tree={docsTree} url-bind="url" showCategory /> */}
               <div visible-expr="{master.drawer.icon} == 'close'">
                  <div class="sidenav_section">
                     <Link href="~/">Home</Link>
                  </div>
                  <div class="sidenav_section">
                     <Link href="~/docs">Docs</Link>

                     <Link
                        href="~/docs/overview"
                        url-bind="url"
                        match="subroute"
                        mod="subsystem"
                     >
                        Overview
                     </Link>
                     <Link
                        href="~/docs/concepts"
                        url-bind="url"
                        match="subroute"
                        mod="subsystem"
                     >
                        Concepts
                     </Link>
                     <Link
                        href="~/docs/widgets"
                        url-bind="url"
                        match="subroute"
                        mod="subsystem"
                     >
                        Widgets
                     </Link>
                     <Link
                        href="~/docs/charts"
                        url-bind="url"
                        match="subroute"
                        mod="subsystem"
                     >
                        Charts
                     </Link>
                     <Link
                        href="~/docs/examples"
                        url-bind="url"
                        match="subroute"
                        mod="subsystem"
                     >
                        Examples
                     </Link>
                  </div>
                  <div class="sidenav_section">
                     <Link href="~/gallery" match="subroute">
                        Gallery
                     </Link>
                  </div>
                  <div class="sidenav_section">
                     <Link href="~/fiddle" match="subroute">
                        Fiddle
                     </Link>
                  </div>
               </div>
            </div>
         </SideDrawer>
      </div>
   </cx>
);

import { PureContainer, Link } from "cx/widgets";
import { Animicon } from "../components/Animicon";
import { SideDrawer } from "../components/SideDrawer";
import { NavTree } from "../components/NavTree";

import Logo from "./cxjs.svg";
import CodeSandboxIcon from "./CodeSandbox.svg";
import { GitHubStarCount } from "../components/GitHubStarCount";

const TopLinks = ({ topLinks, mod }) => (
   <cx>
      <div>
         {Object.keys(topLinks || {}).map(url => (
            <cx>
               <Link
                  href={url}
                  text={topLinks[url]}
                  url-bind="url"
                  match="subroute"
                  mod={mod}
               />
            </cx>
         ))}
      </div>
   </cx>
);

export const MasterLayout = ({
   app,
   children,
   shadow,
   navTree,
   title,
   topLinks
}) => (
   <cx>
      <PureContainer>
         <header ws class={{ master_header: true, shadow }}>
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

               <div style="margin-left: auto" />

               <GitHubStarCount />

               <a
                  className="master_iconlink"
                  href="https://codesandbox.io/search?refinementList%5Btemplate%5D%5B0%5D=cxjs"
               >
                  <img src={CodeSandboxIcon} alt="CodeSandbox" />
               </a>
            </div>
         </header>
         <div class="sticky topbanner" visible={!!title}>
            <h3>{title}</h3>

            <div class="topbanner_tabs">
               <TopLinks topLinks={topLinks} />
            </div>
         </div>
         {children}
         <SideDrawer out-bind="master.drawer.icon">
            <div
               class="sidenav"
               style="height: 100%;"
               onClick={(e, { store }) => {
                  if (e.target.nodeName == "A")
                     store.delete("master.drawer.icon");
               }}
            >
               <NavTree
                  tree={navTree}
                  url-bind="url"
                  showCategory
                  visible-expr="{master.drawer.icon} == 'arrow'"
               />
               <div visible-expr="{master.drawer.icon} == 'close'">
                  <div class="sidenav_section">
                     <Link href="https://cxjs.io">Home</Link>
                  </div>
                  <div class="sidenav_section">
                     <Link href="https://docs.cxjs.io">Docs</Link>

                     <TopLinks
                        visible={app == "docs"}
                        topLinks={topLinks}
                        mod="subsystem"
                     />
                  </div>
                  <div class="sidenav_section">
                     <Link href="~/gallery" match="subroute">
                        Gallery
                     </Link>

                     <TopLinks
                        visible={app == "gallery"}
                        topLinks={topLinks}
                        mod="subsystem"
                     />
                  </div>
                  <div class="sidenav_section">
                     <Link href="~/fiddle" match="subroute">
                        Fiddle
                     </Link>
                  </div>
               </div>
            </div>
         </SideDrawer>
      </PureContainer>
   </cx>
);

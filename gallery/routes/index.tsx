import { cx, Route, RedirectRoute, Section, Link } from "cx/widgets";
import { FirstVisibleChildLayout, bind, tpl, computable } from "cx/ui";
import { SandboxedAsyncRoute } from "../components/asyncRoute";
import { MasterLayout } from "../../misc/layout";
import { NavTree } from "../../misc/components/NavTree";
import { ScrollReset } from "../../misc/components/ScrollReset";

import list from "./list";
import { ThemeLoader } from "../components/ThemeLoader";

export default (
  <cx>
    <MasterLayout app="gallery" shadow>
      <ScrollReset trigger={bind("url")} />
      <div class="sticky topbanner">
        <h3>Gallery</h3>
        <div class="topbanner_tabs">
          <Link href="~/aquamarine" url={bind("url")} match="subroute">
            Aquamarine
          </Link>
          <Link href="~/material" url={bind("url")} match="subroute">
            Material
          </Link>
          <Link href="~/frost" url={bind("url")} match="subroute">
            Frost
          </Link>
          <Link href="~/core" url={bind("url")} match="subroute">
            Core
          </Link>
          <Link href="~/material-dark" url={bind("url")} match="subroute">
            Material Dark
          </Link>
          <Link href="~/space-blue" url={bind("url")} match="subroute">
            Space Blue
          </Link>
          <Link href="~/dark" url={bind("url")} match="subroute">
            Dark
          </Link>
        </div>
      </div>
      <div class="layout">
        <RedirectRoute route="~/" url={bind("url")} redirect="~/aquamarine" />
        <Route route="~/:theme" url={bind("url")}>
          <RedirectRoute
            redirect={computable(
              "$themeRoute.remainder",
              "$route.theme",
              (remainder, theme) =>
                `~/${theme || "aquamarine"}${remainder || "/button/states"}`
            )}
          />
        </Route>
        <Route
          route="~/:theme"
          url={bind("url")}
          prefix
          recordName="$themeRoute"
        >
          <div
            class="gray sticky standalone sidenav"
            styles="top: 80px; max-height: calc(100vh - 152px); padding-top: 0"
          >
            <NavTree
              tree={computable("$themeRoute.theme", theme => [
                {
                  url: `~/${theme}`,
                  text: theme,
                  children: list.map(cat => ({
                    text: cat.name,
                    children: cat.items?.map(item => ({
                      url: item.route,
                      text: item.name
                    }))
                  }))
                }
              ])}
              url={bind("url")}
            />
          </div>
          <ThemeLoader theme={bind("$themeRoute.theme")}>
            <main class="main" layout={FirstVisibleChildLayout}>
              {list.map(cat =>
                cat.items?.map(item => (
                  <SandboxedAsyncRoute
                    route={item.route}
                    content={item.content}
                  />
                ))
              )}
              <Section title="Page Not Found" mod="card">
                This page doesn't exists. Please check your URL.
              </Section>
            </main>
          </ThemeLoader>
        </Route>
      </div>
    </MasterLayout>
  </cx>
);

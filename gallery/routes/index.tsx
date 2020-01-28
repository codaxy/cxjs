import {
  cx,
  Route,
  RedirectRoute,
  Section,
  PureContainer,
  Link
} from "cx/widgets";
import { FirstVisibleChildLayout, bind, tpl, computable } from "cx/ui";
import { routeAppend } from "cx/util";
import { AsyncRoute, SandboxedAsyncRoute } from "../components/asyncRoute";
import { MasterLayout } from "../../misc/layout/index";
import { NavTree } from "../../misc/components/NavTree";

import list, { sorted } from "./list";
import { ThemeLoader } from "../components/ThemeLoader";

const catLink = cat => (
  <cx>
    <dl className="major">
      <dt>
        <Link
          href={tpl("~/{$route.theme}" + cat.route.substring(1))}
          url={bind("url")}
          match="prefix"
        >
          {cat.name}
        </Link>
      </dt>
    </dl>
  </cx>
);

const catGroup = cat => (
  <cx>
    <dl>
      <dt>{cat.name}</dt>
      {cat.items &&
        cat.items.map(item => (
          <dd>
            <Link
              href={tpl(
                routeAppend("~/{$route.theme}", item.route.substring(1))
              )}
              url={bind("url")}
              match="prefix"
            >
              {item.name}
            </Link>
          </dd>
        ))}
    </dl>
  </cx>
);

export default (
  <cx>
    <MasterLayout app="gallery">
      <div class="sticky topbanner">
        <h3>Gallery</h3>
        <div class="topbanner_tabs">
          <Link href="~/aquamarine" url={bind("url")} match="subroute">
            Aquamarine
          </Link>
          <Link href="~/core" url={bind("url")} match="subroute">
            Core
          </Link>
          <Link href="~/material" url={bind("url")} match="subroute">
            Material
          </Link>
          <Link href="~/material-dark" url={bind("url")} match="subroute">
            Material Dark
          </Link>
          <Link href="~/space-blue" url={bind("url")} match="subroute">
            Space Blue
          </Link>
          <Link href="~/frost" url={bind("url")} match="subroute">
            Frost
          </Link>
          <Link href="~/dark" url={bind("url")} match="subroute">
            Dark
          </Link>
        </div>
      </div>
      <div class="layout">
        <RedirectRoute route="~/" url={bind("url")} redirect="~/aquamarine" />
        <Route route="~/:theme" url={bind("url")} prefix>
          <div class="gray sticky sidenav" styles="top: 80px">
            <NavTree
              tree={computable("$route.theme", theme => [
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
          <ThemeLoader theme={bind("$route.theme")}>
            <main class="main" layout={FirstVisibleChildLayout}>
              {list.map(
                cat =>
                  cat.items &&
                  cat.items.map(item => (
                    <SandboxedAsyncRoute
                      route={item.route}
                      content={item.content}
                      prefix
                    />
                  ))
              )}
              <RedirectRoute route="+" url={bind("url")} redirect="+/button" />
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

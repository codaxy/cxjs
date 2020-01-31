import {
    DocumentTitle,
    PureContainer,
    Content,
    Link,
    Button
} from "cx/widgets";
import { HtmlElement } from "cx/widgets";
import { Layout } from "./Layout";
import { Contents } from "../content/Contents";
import { ContentRouter } from "../content/ContentRouter";
import { Floater } from "../components/Floater";
import { MasterLayout } from "../../misc/layout";
import { NavTree } from "../../misc/components/NavTree";
import { docsNav, docsNavTree, DocsNav } from "./DocsNav";
import { SideNav } from "../components/SideNav";

export const Main = (
    <cx>
        <MasterLayout app="docs">
            <DocumentTitle text="CxJS Docs" />
            {/* <Content name="aside" items={Contents}/>
    <Floater if-expr="{layout.touch}"/> */}
            <div class="sticky topbanner">
                <h3>Documentation</h3>

                <div class="topbanner_tabs">
                    <Link href="~/intro" url-bind="url" match="subroute">
                        Intro
                    </Link>
                    <Link href="~/concepts" url-bind="url" match="subroute">
                        Concepts
                    </Link>
                    <Link href="~/widgets" url-bind="url" match="subroute">
                        Widgets
                    </Link>
                    <Link href="~/charts" url-bind="url" match="subroute">
                        Charts
                    </Link>
                    <Link href="~/examples" url-bind="url" match="subroute">
                        Examples
                    </Link>
                </div>
            </div>
            <div class="docsmain" style="display: flex">
                <div
                    class={{
                        gray: true,
                        sticky: true,
                        sidenav: true,
                        extended: () =>
                            document.scrollingElement.scrollHeight >
                            document.scrollingElement.clientHeight
                    }}
                >
                    <div class="navtree_container">
                        <NavTree tree={docsNavTree} url-bind="url" />
                    </div>
                </div>
                <div class="docscontent">
                    <ContentRouter />
                </div>
            </div>
        </MasterLayout>
    </cx>
);

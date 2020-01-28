import { DocumentTitle, PureContainer, Content, Link } from "cx/widgets";
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
                    <Link href="~/intro" url-bind="url">
                        Overview
                    </Link>
                    <Link href="~/concepts" url-bind="url">
                        Concepts
                    </Link>
                    <Link href="~/widgets" url-bind="url">
                        Widgets
                    </Link>
                    <Link href="~/charts" url-bind="url">
                        Charts
                    </Link>
                    <Link href="~/examples" url-bind="url">
                        Examples
                    </Link>
                </div>
            </div>
            <div class="docsmain" style="display: flex">
                <div class="gray sidenav">
                    <NavTree tree={docsNavTree} url-bind="url" />
                    {/* <Contents /> */}
                </div>
                {/* <SideNav  */}
                <div class="docscontent">
                    {/* <h1>Documentation</h1> */}
                    <ContentRouter />
                </div>
            </div>
        </MasterLayout>
    </cx>
);

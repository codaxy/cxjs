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
        <MasterLayout
            app="docs"
            topLinks={{
                "~/intro": "Intro",
                "~/concepts": "Concepts",
                "~/widgets": "Widgets",
                "~/charts": "Charts",
                "~/examples": "Examples"
            }}
            title="Documentation"
            navTree={docsNavTree}
        >
            <DocumentTitle text="CxJS Docs" />
            {/* <Content name="aside" items={Contents}/>
    <Floater if-expr="{layout.touch}"/> */}
            <div class="master_content">
                <div
                    class={{
                        gray: true,
                        sticky: true,
                        sidenav: true,
                        standalone: true,
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

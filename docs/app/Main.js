import { DocumentTitle } from "cx/widgets";
import { ContentRouter } from "../content/ContentRouter";
import { MasterLayout } from "../../misc/layout";
import { NavTree } from "../../misc/components/NavTree";
import { docsNavTree } from "./DocsNav";
import {ScrollIntoView} from "../../misc/components/ScrollIntoView";


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
            <div class="master_content">
                <ScrollIntoView
                    class={{
                        gray: true,
                        sticky: true,
                        sidenav: true,
                        standalone: true,
                        extended: () => {
                            let scrollingElement = document.scrollingElement || document.documentElement;
                            return scrollingElement.scrollHeight > scrollingElement.clientHeight;
                        }
                    }}
                    selector=".cxb-link.cxs-active"
                >
                    <div class="navtree_container">
                        <NavTree tree={docsNavTree} url-bind="url" />
                    </div>
                </ScrollIntoView>
                <div class="docscontent">
                    <ContentRouter />
                </div>
            </div>
        </MasterLayout>
    </cx>
);

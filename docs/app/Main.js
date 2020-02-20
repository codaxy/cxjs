import { DocumentTitle } from "cx/widgets";
import { ContentRouter } from "../content/ContentRouter";
import { MasterLayout } from "../../misc/layout";
import { NavTree } from "../../misc/components/NavTree";
import { docsNavTree } from "./DocsNav";


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
                <div
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

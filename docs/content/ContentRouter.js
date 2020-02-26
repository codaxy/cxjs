import { Route, RedirectRoute, Sandbox } from "cx/widgets";
import {
    FirstVisibleChildLayout,
    Controller,
    Url,
    ContentResolver
} from "cx/ui";
import { HtmlElement } from "cx/widgets";
import { PageNotFound } from "./PageNotFound";
import { Loading } from "./Loading";
import { CSS } from "../app/CSS";
//import {CSSTransitionGroup} from 'cx-react-css-transition-group/src/CSSTransitionGroup';
import { ScrollReset } from "docs/components/ScrollReset";
import { EditOnGitX } from "docs/components/EditOnGitX";
import { HashRestore } from "../components/HashRestore";
import { DocSearch } from "../components/DocSearch";

import { getVersion } from "./version";

function getPageName(name) {
    if (name.lastIndexOf("Page") == name.length - 4)
        name = name.substring(0, name.length - 4);

    return name
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()
        .substring(1);
}

let addRoutes = (path, pages, routes) => {
    Object.keys(pages).forEach(name => {
        if (name[0] == "_" || !pages.hasOwnProperty(name)) return;

        if (name[0] == name[0].toUpperCase()) {
            routes.push(
                <cx>
                    <Route url:bind="url" route={path + getPageName(name)}>
                        <Sandbox storage:bind="pages" key:bind="url">
                            <div class="dxe-article-tools">
                                <a href="https://github.com/codaxy/cxjs/issues/new">
                                    Report
                                </a>
                                <EditOnGitX url={path + name} />
                                <DocSearch />
                            </div>
                            {/*<CSSTransitionGroup transitionName="transition" transitionAppear transitionLeave firstChild>*/}
                            {pages[name]}
                            {/*</CSSTransitionGroup>*/}
                            <HashRestore />
                        </Sandbox>
                    </Route>
                </cx>
            );
        } else addRoutes(path + name + "/", pages[name], routes);
    });
};

let chapterExports = {};

const defaultChapterArticle = {
    intro: "~/intro/welcome",
    widgets: "~/widgets/buttons",
    charts: "~/charts/charts",
    concepts: "~/concepts/store",
    examples: "~/examples/form/validation-options"
};

class ContentController extends Controller {
    onInit() {
        this.store.set("loading", false);

        this.addComputable("chapter", ["url"], url => {
            let matches = url.match(/^~\/([^/]+)/);
            return matches && matches[1];
        });

        this.addTrigger("remember-last-route", ["url"], url => {
            let matches = url.match(/^~\/([^/]+)\/(.+)/);
            if (!matches) return;
            let chapter = matches[1];
            let remainder = matches[2];
            if (chapter && remainder)
                defaultChapterArticle[chapter] = `~/${chapter}/${remainder}`;
        });

        this.store.set("contentVersion", getVersion());

        // #if development

        setInterval(() => {
            this.store.set("contentVersion", getVersion());
        }, 20);

        // #end

        this.addTrigger(
            "fetch-module",
            ["chapter", "contentVersion"],
            chapter => {
                switch (chapter) {
                    case "intro":
                        this.loadChapter(
                            chapter,
                            import(
                                /* webpackChunkName: 'intro' */ "docs/content/intro"
                            )
                        );
                        break;

                    case "concepts":
                        this.loadChapter(
                            chapter,
                            import(
                                /* webpackChunkName: 'concepts' */ "docs/content/concepts"
                            )
                        );
                        break;

                    case "widgets":
                        this.loadChapter(
                            chapter,
                            import(
                                /* webpackChunkName: 'widgets' */ "docs/content/widgets"
                            )
                        );
                        break;

                    case "svg":
                        this.loadChapter(
                            chapter,
                            import(
                                /* webpackChunkName: 'svg' */ "docs/content/svg"
                            )
                        );
                        break;

                    case "charts":
                        this.loadChapter(
                            chapter,
                            import(
                                /* webpackChunkName: 'charts' */ "docs/content/charts"
                            )
                        );
                        break;

                    case "examples":
                        this.loadChapter(
                            chapter,
                            import(
                                /* webpackChunkName: 'examples' */ "docs/content/examples"
                            )
                        );
                        break;

                    case "util":
                        this.loadChapter(
                            chapter,
                            import(
                                /* webpackChunkName: 'util' */ "docs/content/util"
                            )
                        );
                        break;

                    case "meta":
                        this.loadChapter(
                            chapter,
                            import(
                                /* webpackChunkName: 'meta' */ "docs/content/meta"
                            )
                        );
                        break;
                }
            },
            true
        );
    }

    loadChapter(chapter, promise) {
        this.store.set("loading", true);

        promise
            .then(m => {
                chapterExports[chapter] = m;
                this.store.set("loading", false);
                this.store.set("error", false);
                this.store.set("activeVersion." + chapter, getVersion());
            })
            .catch(e => {
                this.store.set("loading", false);
                this.store.set("error", true);
                console.log(e);
            });
    }
}

const getChapterRoutes = chapter => {
    if (!chapterExports[chapter]) return null;
    let routes = [];
    addRoutes(`~/${chapter.toLowerCase()}/`, chapterExports[chapter], routes);
    return routes;
};

export const ContentRouter = (
    <cx>
        <div class={CSS.block("article")}>
            <ScrollReset
                class={CSS.element("article", "body")}
                trigger-bind="url"
                controller={ContentController}
            >
                <ContentResolver
                    params={{
                        chapter: { bind: "chapter" },
                        version: { bind: "activeVersion" }
                    }}
                    layout={FirstVisibleChildLayout}
                    onResolve={p => getChapterRoutes(p.chapter)}
                    mode="prepend"
                >
                    <RedirectRoute
                        url-bind="url"
                        route="~/"
                        redirect="~/intro"
                    />
                    <RedirectRoute
                        url-bind="url"
                        route="~/intro"
                        redirect={() => defaultChapterArticle.intro}
                    />
                    <RedirectRoute
                        url-bind="url"
                        route="~/widgets"
                        redirect={() => defaultChapterArticle.widgets}
                    />
                    <RedirectRoute
                        url-bind="url"
                        route="~/charts"
                        redirect={() => defaultChapterArticle.charts}
                    />
                    <RedirectRoute
                        url-bind="url"
                        route="~/concepts"
                        redirect={() => defaultChapterArticle.concepts}
                    />
                    <RedirectRoute
                        url-bind="url"
                        route="~/examples"
                        redirect={() => defaultChapterArticle.examples}
                    />

                    <Loading />
                    <PageNotFound />
                </ContentResolver>
            </ScrollReset>
        </div>
    </cx>
);

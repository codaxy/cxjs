import { DocumentTitle, Route, RedirectRoute, Sandbox } from 'cx/widgets';
import { FirstVisibleChildLayout, Controller, Url, ContentResolver } from 'cx/ui';
import { HtmlElement } from 'cx/widgets';
import {PageNotFound} from './PageNotFound';
import {Loading} from './Loading';
import {CSS} from '../app/CSS';
//import {CSSTransitionGroup} from 'cx-react-css-transition-group/src/CSSTransitionGroup';
import {trackPageView} from '../ga';

import {ScrollReset} from 'docs/components/ScrollReset';
import {EditOnGitX} from 'docs/components/EditOnGitX';

import { getVersion } from './version';

function getPageName(name) {

    if (name.lastIndexOf('Page') == name.length - 4)
        name = name.substring(0, name.length - 4);

    return name.replace(/([A-Z])/g, "-$1")
               .toLowerCase()
               .substring(1);
}

let addRoutes = (path, pages, routes) => {
    Object.keys(pages).forEach(name=> {
        if (name[0] == '_' || !pages.hasOwnProperty(name))
            return;

        if (name[0] == name[0].toUpperCase()) {
            routes.push(<cx>
                <Route url:bind="url"
                       route={path + getPageName(name)}>
                    <EditOnGitX url={path + name}/>
                    {/*<CSSTransitionGroup transitionName="transition" transitionAppear transitionLeave firstChild>*/}
                        {pages[name]}
                    {/*</CSSTransitionGroup>*/}
                </Route>
            </cx>);
        }
        else
            addRoutes(path + name + '/', pages[name], routes);
    });
};


let chapterExports = {};

class ContentController extends Controller {
    init() {
        super.init();

        this.store.set('loading', false);

        this.addComputable('chapter', ['url'], url => {
            var matches = url.match(/^~\/([^/]+)\//);
            return matches && matches[1];
        });

        // #if development

        this.store.set('contentVersion', getVersion());
        setInterval(() => {
            this.store.set('contentVersion', getVersion())
        }, 20);

        // #end


        var chapterLoaded = {};

        this.addTrigger('fetch-module', ['chapter', 'contentVersion'], chapter => {
            switch (chapter) {

                case 'intro':
                    this.loadChapter(chapter, System.import('docs/content/intro'));
                    break;

                case 'concepts':
                    this.loadChapter(chapter, System.import('docs/content/concepts'));
                    break;

                case 'widgets':
                    this.loadChapter(chapter, System.import('docs/content/widgets'));
                    break;

                case 'svg':
                    this.loadChapter(chapter, System.import('docs/content/svg'));
                    break;

                case 'charts':
                    this.loadChapter(chapter, System.import('docs/content/charts'));
                    break;

                case 'examples':
                    this.loadChapter(chapter, System.import('docs/content/examples'));
                    break;

                case 'meta':
                    this.loadChapter(chapter, System.import('docs/content/meta'));
                    break;
            }
        }, true);

        // #if production

        this.addTrigger('google-analytics', ['url'], url => {
            trackPageView(url);
        });

        // #end
    }

    loadChapter(chapter, promise) {
        this.store.set('loading', true);
        promise
            .then(m => {
                chapterExports[chapter] = m;
                this.store.set('loading', false);

                // #if development
                this.store.update('cv2', v => (v || 0) + 1);
                // #end

            })
            .catch(e => {
                this.store.set('loading', false);
                console.log(e);
            })
    }
}

const getChapterRoutes = chapter => {
    if (!chapterExports[chapter])
        return null;
    let routes = [];
    addRoutes(`~/${chapter.toLowerCase()}/`, chapterExports[chapter], routes);
    return routes;
}

export const ContentRouter = <cx>
    <div class={CSS.block("article")}>
        <ScrollReset class={CSS.element("article", "body")} trigger:bind="url">
            <DocumentTitle value=" - "/>
            <Sandbox storage:bind="pages" key:bind="url" controller={ContentController}>
                <ContentResolver
                    params={{
                        chapter: { bind: "chapter" },
                        version: { bind: "cv2" }
                    }}
                    layout={FirstVisibleChildLayout}
                    onResolve={p=>getChapterRoutes(p.chapter)}
                    mode="prepend"
                >
                    <RedirectRoute url:bind="url" route="~/" redirect="~/intro/about"/>
                    <Loading/>
                    <PageNotFound/>
                </ContentResolver>
            </Sandbox>
        </ScrollReset>
    </div>
</cx>;



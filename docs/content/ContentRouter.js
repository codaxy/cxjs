import {HtmlElement} from 'cx/ui/HtmlElement';
import {DocumentTitle} from 'cx/ui/DocumentTitle';
import {Route} from 'cx/ui/nav/Route';
import {RedirectRoute} from 'cx/ui/nav/RedirectRoute';
import {FirstVisibleChildLayout} from 'cx/ui/layout/FirstVisibleChildLayout';
import {PageNotFound} from './PageNotFound';
import {Loading} from './Loading';
import {Sandbox} from 'cx/ui/Sandbox';
import {Controller} from 'cx/ui/Controller';
import {Url} from 'cx/app/Url';
import {CSS} from '../app/CSS';
//import {CSSTransitionGroup} from 'cx-react-css-transition-group/src/CSSTransitionGroup';

import {ScrollReset} from 'docs/components/ScrollReset';
import {EditOnGitX} from 'docs/components/EditOnGitX';

function getPageName(name) {

    if (name.lastIndexOf('Page') == name.length - 4)
        name = name.substring(0, name.length - 4);

    return name.replace(/([A-Z])/g, "-$1")
               .toLowerCase()
               .substring(1);
}

var addRoutes = (path, pages, routes) => {
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

var routes = [
    <cx><RedirectRoute url:bind="url" route="~/" redirect="~/intro/about"/></cx>
];

// #if development

import * as intro from './intro/';
import * as widgets from './widgets/';
import * as concepts from './concepts/';
import * as examples from './examples/';
import * as debug from './debug/';
import * as charts from './charts/';
import * as meta from './meta/';
import * as svg from './svg/';

addRoutes('~/', {
    intro,
    widgets,
    concepts,
    examples,
    svg,
    charts,
    meta,
    debug
}, routes);

// #end

class ContentController extends Controller {
    init() {
        super.init();

        this.store.set('loading', false);

        // #if production

        var chapterLoaded = {};

        this.addTrigger('fetch-module', ['url'], url => {
            var matches = url.match(/^~\/([^/]+)\//);
            var chapter = matches && matches[1];
            if (!chapter || chapterLoaded[chapter])
                return;

            chapterLoaded[chapter] = true;

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

        this.addTrigger('google-analytics', ['url'], url => {
            if (window.ga) {
                ga('set', 'page', Url.resolve(url));
                ga('send', 'pageview');
            }
        });

        // #end
    }

    loadChapter(chapter, promise) {
        this.store.set('loading', true);
        promise.then(m=> {
            var localRoutes = [];
            addRoutes(`~/${chapter.toLowerCase()}/`, m, localRoutes);
            var r = Route.create(localRoutes);
            this.widget.items = [...r, ...this.widget.items];
            this.store.set('loading', false);
        }).catch(e=> {
            this.store.set('loading', false);
            console.log(e);
        })
    }
}

export const ContentRouter = <cx>
    <div class={CSS.block("article")}>
        <ScrollReset class={CSS.element("article", "body")} trigger:bind="url">
            <DocumentTitle value=" - "/>
            <Sandbox storage:bind="pages" key:bind="url" layout={FirstVisibleChildLayout} controller={ContentController}>
                {[...routes, Loading, PageNotFound]}
            </Sandbox>
        </ScrollReset>
    </div>
</cx>;



import {HtmlElement, Button, MsgBox, Link} from 'cx/widgets';
import {History} from "cx/ui";
import {Md} from '../../components/Md';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {CodeSplit} from '../../components/CodeSplit';
import {MethodTable} from '../../components/MethodTable';
import {ImportPath} from 'docs/components/ImportPath';


import routeConfigs from '../widgets/configs/Route';
import sandboxConfigs from '../widgets/configs/Sandbox';
import linkConfigs from '../widgets/configs/Link';

export const Router = <cx>
    <Md>
        # Router

        Cx features built-in routing functionality. This enables building complex single page applications and
        retain classic URL based navigation. There are a few classes used to implement routing and navigation:

        * Url
        * Route
        * Sandbox
        * History
        * Link

        Both hash-based and `pushState` based navigation modes are supported.

        ## Url

        <ImportPath path="import {Url} from 'cx/ui';"/>

        The `Url` helper class offers methods for working with url paths.

        It's crucial to initialize the base path before using other methods.
        Default base path is set to `/` which works only if the application is not
        hosted in a subdirectory. Otherwise, call `Url.setBase('/path-to-the-app/')`.

        <CodeSplit>
            <MethodTable methods={[{
                signature: 'Url.setBase(base)',
                key: true,
                description: <cx><Md>
                    Sets the base path of the application.
                </Md></cx>
            }, {
                signature: 'Url.setBaseFromScript(scriptPath)',
                description: <cx><Md>
                    Sets the base path of the application by examining DOM `script` elements.
                    If the `src` property matches the given path, the base is used as the application path base.
                </Md></cx>
            }, {
                signature: 'Url.resolve(path)',
                description: <cx><Md>
                    Resolves `~/` in the given path. If a match is found it is replaced with the application path.
                </Md></cx>
            }, {
                signature: 'Url.unresolve(path)',
                description: <cx><Md>
                    Takes a given relative or absolute path and returns tilde based path.
                </Md></cx>
            }, {
                signature: 'Url.isLocal(path)',
                description: <cx><Md>
                    Checks if the given path is local.
                </Md></cx>
            }]}/>
            <CodeSnippet putInto="code">{`
            Url.setBase('/docs/');
            Url.setBaseFromScript('~/app.js');
            Url.isLocal('/docs/'); //true
            Url.isLocal('/app/'); //false
            Url.resolve('~/page'); // /docs/page
            Url.unresolve('/docs/page'); // ~/page
            Url.unresolve('https://cxjs.io/docs/page'); // ~/page
         `}
            </CodeSnippet>
        </CodeSplit>

        ## Route

        <ImportPath path="import {Route} from 'cx/widgets';"/>

        The `Route` widget is a pure container element which renders only if current url matches the assigned route.

        <CodeSplit>
            <ConfigTable props={routeConfigs}/>
            <CodeSnippet putInto="code">{`
            <Route url-bind="url" route="~/about">
               About
            </Route>
            <Route url-bind="url" route="~/intro" prefix>
               Intro

               <Route url-bind="url" route="+/nested">
                    Nested (~/intro/nested)
               </Route>
            </Route>
         `}
            </CodeSnippet>
        </CodeSplit>

        Routes support parameters, splats and optional parts. For more details, check the
        [route-parser library](https://github.com/rcs/route-parser#what-can-i-use-in-my-routes).

        ### Redirect Routes

        <ImportPath path="import {RedirectRoute} from 'cx/widgets';"/>

        <CodeSplit>
            Redirect routes redirect to another page when matched.
            <CodeSnippet putInto="code">{`
            <RedirectRoute url-bind="url" route="~/" redirect="~/intro/about"/>
         `}</CodeSnippet>
        </CodeSplit>

        Redirect routes use the `replaceState` method of the `History` interface, so navigating back after redirection
        will not return to the redirected page.

        ## Sandbox

        <ImportPath path="import {Sandbox} from 'cx/widgets';"/>

        Sandbox component is used to isolate data between different pages. Page data is preserved on navigation
        and it can be restored if the user goes back to the same page.

        <CodeSplit>
            <ConfigTable props={sandboxConfigs}/>
            <CodeSnippet putInto="code">{`
            <Sandbox key-bind="url" storage-bind="pages">
               <Route url-bind="url" route="~/about">
                  <TextField value-bind="$page.text" />
               </Route>
            </Sandbox>
         `}
            </CodeSnippet>
        </CodeSplit>

        ## History

        <ImportPath path="import {History} from 'cx/ui';"/>

        The `History` class is used for working with HTML5 `pushState` navigation.

        <CodeSplit>
            <MethodTable methods={[{
                signature: 'History.connect(store, bind)',
                description: <cx><Md>
                    Initializes a link between browser's location and store variable pointed by the `bind` argument.
                </Md></cx>
            }, {
                signature: 'History.pushState(state, title, url)',
                description: <cx><Md>
                    Performs navigation to a new location pointed by the `url` parameter, without refreshing the page.
                </Md></cx>
            }, {
                signature: 'History.replaceState(state, title, url)',
                description: <cx><Md>
                    Performs navigation to a new location pointed by the `url` parameter.
                    Current location will not be saved in browser's history.
                </Md></cx>
            }, {
                signature: 'History.subscribe(callback)',
                description: <cx><Md>
                    Subscribe to location changes (navigation). Useful for setting up page tracking (e.g. Google
                    Analytics)
                    on CxJS apps. The function returns a function which can be used to unsubscribe.
                </Md></cx>
            }, {
                signature: 'History.reloadOnNextChange()',
                description: <cx><Md>
                    Instructs the router to reload the page on next navigation. This is commonly used with service
                    workers.
                </Md></cx>
            }, {
                signature: 'History.addNavigateConfirmation(callback, permanent)',
                description: <cx><Md>
                    Instructs the router to execute the given callback to confirm leaving the current page. Return value should
                    be a boolean value or a promise. The callback is executed only for the current page, unless `permanent`
                    argument is set to `true`. See the example below.
                </Md></cx>
            }]}/>
            <CodeSnippet putInto="code">{`
            History.connect(store, 'url');

            History.subscribe(url => {
                if (window.ga) {
                    ga('set', 'page', url);
                    ga('send', 'pageview');
                }
            });
         `}
            </CodeSnippet>
        </CodeSplit>

        <CodeSplit>
            > Please note that fallback mechanism for browsers which do not support `pushState` navigation is standard
            navigation (full page load).

            The following example illustrates the use of `History.addNavigateConfirmation` to ask the user for confirmation
            before leaving the page.

            <div class="widgets">
                <div>
                    <Button
                        onClick={(e, {store}) => {
                            History.addNavigateConfirmation(
                                url => MsgBox
                                    .yesNo('Are you sure that you want to leave this page?')
                                    .then(answer => answer == 'yes')
                            );
                            store.set('$page.confirmation', true);
                        }}
                    >
                        Add Confirmation
                    </Button>
                    <p ws visible-expr="!!{$page.confirmation}">
                        Good. Now try navigating to <a href="~/concepts/outer-layouts">some other page</a>.
                    </p>
                </div>
            </div>

            <CodeSnippet putInto="code" fiddle="Vb7zpMzq">{`
                <Button
                    onClick={(e, {store}) => {
                        History.addNavigateConfirmation(
                            url => MsgBox
                                .yesNo('Are you sure you want to leave this page?')
                                .then(result => result == 'yes')
                        );
                        store.set('$page.confirmation', true);
                    }}
                >
                    Add Confirmation
                </Button>
                <p ws visible-expr="!!{$page.confirmation}">
                    Good. Now try navigating to <a href="~/concepts/outer-layouts">some other page</a>.
                </p>
            `}</CodeSnippet>

        </CodeSplit>

        ## Link

        <ImportPath path="import {Link} from 'cx/widgets';"/>

        The `Link` widget is a replacement for anchor elements when `pushState` based navigation is used.

        <CodeSplit>
            <ConfigTable props={linkConfigs}/>
            <CodeSnippet putInto="code">{`
            <Link href="~/about">About<Link>
         `}
            </CodeSnippet>
        </CodeSplit>

    </Md>
</cx>;

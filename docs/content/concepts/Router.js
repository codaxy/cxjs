import { HtmlElement, TextField } from 'cx/widgets';
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

      <ImportPath path="import {Url} from 'cx/ui';" />

      The `Url` helper class offers methods for working with url paths.

      It's crucial to initialize base path before using other methods.
       Default base path is set to `/` which works only if the application is not
      hosted in a subdirectory. Otherwise, call `Url.setBase('/path-to-the-app/')`.

      <CodeSplit>
         <MethodTable methods={[{
            signature: 'Url.setBase(base)',
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
               Resolves `~/` in the given path.
            </Md></cx>
         }, {
            signature: 'Url.unresolve(path)',
            description: <cx><Md>
               Takes given relative and absolute path and returns tilde based path.
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
            Url.unresolve('http://cx.codaxy.com/docs/page'); // ~/page
         `}
         </CodeSnippet>
      </CodeSplit>

      ## Route

      <ImportPath path="import {Route} from 'cx/widgets';" />

      The `Route` widget is a pure container element which renders only if current url matches the assigned route.

      <CodeSplit>
         <ConfigTable props={routeConfigs} />
         <CodeSnippet putInto="code">{`
            <Route url:bind="url" route="~/about">
               About
            </Route>
            <Route url:bind="url" route="~/intro">
               Intro
            </Route>
         `}
         </CodeSnippet>
      </CodeSplit>

      Routes support parameters, splats and optional parts. For more details, check the
      [route-parser library](https://github.com/rcs/route-parser#what-can-i-use-in-my-routes).

      ### Redirect Routes

      <ImportPath path="import {RedirectRoute} from 'cx/widgets';" />

      <CodeSplit>
         Redirect routes redirect to another page when matched.
         <CodeSnippet putInto="code">{`
            <RedirectRoute url:bind="url" route="~/" redirect="~/intro/about"/>
         `}</CodeSnippet>
      </CodeSplit>

      Redirect routes use the `replaceState` method of the `History` interface, so navigating back after redirection
      will not return to the redirected page.

      ## Sandbox

      <ImportPath path="import {Sandbox} from 'cx/widgets';" />

      Sandbox component is used to isolate data between different pages. Page data is preserved on navigation
      and it can be restored if the user goes back to the same page.

      <CodeSplit>
         <ConfigTable props={sandboxConfigs} />
         <CodeSnippet putInto="code">{`
            <Sandbox key:bind="url" storage:bind="pages">
               <Route url:bind="url" route="~/about">
                  <TextField value:bind="$page.text" />
               </Route>
            </Sandbox>
         `}
         </CodeSnippet>
      </CodeSplit>

      ## History

      <ImportPath path="import {History} from 'cx/ui';" />

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
         }]}/>
         <CodeSnippet putInto="code">{`
            History.connect(store, 'url');
         `}
         </CodeSnippet>
      </CodeSplit>

      > Please note that fallback mechanism for browsers which do not support `pushState` navigation is standard navigation
      (full page load).

      ## Link

      <ImportPath path="import {Link} from 'cx/widgets';" />

      The `Link` widget is a replacement for anchor elements when `pushState` based navigation is used.

      <CodeSplit>
         <ConfigTable props={linkConfigs} />
         <CodeSnippet putInto="code">{`
            <Link href="~/about">About<Link>
         `}
         </CodeSnippet>
      </CodeSplit>

   </Md>
</cx>;

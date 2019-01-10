import {cx, Sandbox, Rescope, Route, ContentResolver} from 'cx/widgets';
import {bind, createFunctionalComponent} from 'cx/ui';

let cache = {};

function getCachedContent(route, version, callback) {
    let entry = cache[route];
    if (entry && entry.version === version)
        return entry.content;

    return callback()
        .then(x => x.default)
        .then(c => {
            cache[route] = {
                version: version,
                content: c
            };
            return c;
        });
}

export const asyncRoute = (route: string,
                           content: () => Promise<any>,
                           options: { prefix?: boolean } = {}) => <cx>
    <Route
        route={route}
        url={bind("$root.url")}
        prefix={options.prefix}
    >
        <ContentResolver
            params={bind("$root.version")}
            onResolve={(v) => getCachedContent(route, v, content)}
        />
    </Route>
</cx>;

interface AsyncRouteProps {
    route: string;
    content: () => Promise<any>,
    prefix?: boolean
}

export const AsyncRoute = createFunctionalComponent(({route, content, prefix} : AsyncRouteProps) => <cx>
    <Route
        route={route}
        url={bind("url")}
        prefix={prefix}
    >
        <ContentResolver
            params={bind("version")}
            onResolve={() => content().then(x => x.default)}
        />
    </Route>
</cx>);

interface SandboxedRouteProps {
    route: string;
    children: any,
    prefix?: boolean
}

export const SandboxedRoute = createFunctionalComponent(({route, children, prefix}: SandboxedRouteProps) => <cx>
    <Route
        route={route}
        url={bind("url")}
        prefix={prefix}
    >
        <Sandbox accessKey={bind("url")} storage={bind("pages")}>
            <Rescope bind="$page">
                {children}
            </Rescope>
        </Sandbox>
    </Route>
</cx>);

export const SandboxedAsyncRoute = createFunctionalComponent(({route, content, prefix}: AsyncRouteProps) => <cx>
    <SandboxedRoute route={route} prefix={prefix}>
        <ContentResolver
            params={bind("$root.version")}
            onResolve={() => content().then(x => x.default)}
        />
    </SandboxedRoute>
</cx>);
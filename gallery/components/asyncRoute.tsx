import {cx, Route, ContentResolver} from 'cx/widgets';
import {bind} from 'cx/ui'

export const asyncRoute = (
    route: string,
    content: () => Promise<any>,
    options: { prefix?: boolean } = {}
) => <cx>
    <Route
        route={route}
        url={bind("$root.url")}
        prefix={options.prefix}
    >
        <ContentResolver
            params={bind("$root.version")}
            onResolve={() => content().then(x=>x.default)}
        />
    </Route>
</cx>;
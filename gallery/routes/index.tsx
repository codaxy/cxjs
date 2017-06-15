import {cx, Route, RedirectRoute, Section, Sandbox, Rescope, Link} from 'cx/widgets';
import {FirstVisibleChildLayout, bind, tpl} from 'cx/ui'
import {asyncRoute} from "../components/asyncRoute";
import AppLayout from '../layout';

import list, {sorted} from './list';

const catLink = cat => <cx>
    <dl className="major">
        <dt>
            <Link href={tpl("~/{$route.theme}" + cat.route.substring(1))} url={bind("url")} match="prefix">
                {cat.name}
            </Link>
        </dt>
    </dl>
</cx>

const catGroup = cat =>
<cx>
    <dl>
        <dt>
            {cat.name}
        </dt>
        {cat.items && cat.items.map(item =>
            <dd>
                <Link href={tpl("~/{$route.theme}" + item.route.substring(1) + "/")} url={bind("url")} match="prefix">
                    {item.name}
                </Link>
            </dd>
        )}
    </dl>
</cx>


export default
<cx>
    <Route route="~/(:theme)" url={bind("url")} prefix>
        <RedirectRoute route="~/" url={bind("url")} redirect="~/material"/>

        <div putInto="nav">
            {sorted.map(cat => cat.route ? catLink(cat) : catGroup(cat))}
        </div>

        <Sandbox
            accessKey={bind("url")}
            storage={bind("pages")}
            outerLayout={AppLayout}
            visible={{expr: "!!{$route.theme}"}}
        >
            <Rescope bind="$page" layout={FirstVisibleChildLayout}>

                {list.map(cat => cat.route && asyncRoute(cat.route, cat.content, {prefix: true}))}
                {list.map(cat => cat.items && cat.items.map(item => asyncRoute(item.route, item.content, {prefix: true})))}

                <RedirectRoute route="+" url={bind("$root.url")} redirect="+/button"/>
                <Section title="Page Not Found" mod="card">
                    This page doesn't exists. Please check your URL.
                </Section>
            </Rescope>
        </Sandbox>
    </Route>
</cx>


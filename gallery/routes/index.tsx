import {cx, Route, RedirectRoute, Section, PureContainer, Link} from 'cx/widgets';
import {FirstVisibleChildLayout, bind, tpl} from 'cx/ui'
import {routeAppend} from "cx/util";
import {AsyncRoute} from "../components/asyncRoute";
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
                    <Link href={tpl(routeAppend("~/{$route.theme}", item.route.substring(1)))} url={bind("url")}
                        match="prefix">
                        {item.name}
                    </Link>
                </dd>
            )}
        </dl>
    </cx>


export default <cx>
    <PureContainer>
        <RedirectRoute route="~/" url={bind("url")} redirect="~/material"/>
        <Route route="~/:theme" url={bind("url")} prefix outerLayout={AppLayout}>
            <div putInto="nav">
                {sorted.map(cat => cat.route ? catLink(cat) : catGroup(cat))}
            </div>

            <PureContainer layout={FirstVisibleChildLayout}>
                {list.map(cat => cat.route && <AsyncRoute route={cat.route} content={cat.content} prefix/>)}
                {list.map(cat => cat.items && cat.items.map(item => <AsyncRoute route={item.route}
                    content={item.content} prefix/>))}

                <RedirectRoute route="+" url={bind("url")} redirect="+/grid"/>
                <Section title="Page Not Found" mod="card">
                    This page doesn't exists. Please check your URL.
                </Section>
            </PureContainer>
        </Route>
    </PureContainer>
</cx>


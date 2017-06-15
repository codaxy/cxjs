import {cx, Button, Section, FlexRow, Route, RedirectRoute, PureContainer} from 'cx/widgets';
import {bind, expr, FirstVisibleChildLayout} from 'cx/ui';

import {getHeader} from "../../../components/getHeader";
import {asyncRoute} from "../../../components/asyncRoute";

const header = getHeader({
    title: "Bar",
    tabs: {
        standard: 'Standard',
        combination: 'Combination',
        stacked: 'Stacked',
        bullets: 'Bullet Chart'
    },
    docsUrl: 'https://cxjs.io/docs/charts/bars'
});

import Default from './standard';

export default <cx>
    {header}
    <PureContainer layout={FirstVisibleChildLayout}>
        <Route url={{bind: '$root.url'}} route="+/standard">
            {Default}
        </Route>
        { asyncRoute("+/combination", () => System.import("./combination")) }
        { asyncRoute("+/stacked", () => System.import("./stacked")) }
        { asyncRoute("+/bullets", () => System.import("./bullets")) }
        <RedirectRoute redirect="+/standard" />
    </PureContainer>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);
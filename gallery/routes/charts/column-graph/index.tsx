import {cx, Button, Section, FlexRow, Route, RedirectRoute, PureContainer} from 'cx/widgets';
import {bind, expr, FirstVisibleChildLayout} from 'cx/ui';

import {getHeader} from "../../../components/getHeader";
import {asyncRoute} from "../../../components/asyncRoute";

const header = getHeader({
    title: "ColumnGraph",
    tabs: {
        standard: 'Standard',
        timeline: 'Timeline'
    },
    docsUrl: 'https://cxjs.io/docs/charts/column-graphs'
});

import Default from './standard';

export default <cx>
    {header}
    <PureContainer layout={FirstVisibleChildLayout}>
        <Route url={{bind: '$root.url'}} route="+/standard">
            {Default}
        </Route>
        { asyncRoute("+/timeline", () => System.import("./timeline")) }
        <RedirectRoute redirect="+/standard" />
    </PureContainer>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);
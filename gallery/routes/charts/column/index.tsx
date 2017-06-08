import {cx, Button, Section, FlexRow, Route, RedirectRoute, PureContainer} from 'cx/widgets';
import {bind, expr, FirstVisibleChildLayout} from 'cx/ui';

import {getHeader} from "../../../components/getHeader";
import {asyncRoute} from "../../../components/asyncRoute";

const header = getHeader({
    title: "Column",
    tabs: {
        customized: 'Custom columns',
        normalized: 'Normalized'
    },
    docsUrl: 'https://cxjs.io/docs/charts/columns'
});

import Default from './customized';

export default <cx>
    {header}
    <PureContainer layout={FirstVisibleChildLayout}>
        <Route url={{bind: '$root.url'}} route="+/customized">
            {Default}
        </Route>
        { asyncRoute("+/normalized", () => System.import("./normalized")) }
        <RedirectRoute redirect="+/customized" />
    </PureContainer>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);
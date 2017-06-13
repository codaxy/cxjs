import {cx, Button, Section, FlexRow, Route, RedirectRoute, PureContainer} from 'cx/widgets';
import {bind, expr, FirstVisibleChildLayout} from 'cx/ui';

import {getHeader} from "../../../components/getHeader";
import {asyncRoute} from "../../../components/asyncRoute";

const header = getHeader({
    title: "Range",
    docsUrl: 'https://cxjs.io/docs/charts/ranges'
});

import Default from './regular';

export default <cx>
    {header}
    <PureContainer layout={FirstVisibleChildLayout}>
        <Route url={{bind: '$root.url'}} route="+/regular">
            {Default}
        </Route>
        <RedirectRoute redirect="+/regular" />
    </PureContainer>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);
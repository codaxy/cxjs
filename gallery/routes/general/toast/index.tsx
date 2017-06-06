import {cx, Button, Section, FlexRow, Route, RedirectRoute, PureContainer} from 'cx/widgets';
import {bind, expr, FirstVisibleChildLayout} from 'cx/ui';

import {getHeader} from "../../../components/getHeader";
import {asyncRoute} from "../../../components/asyncRoute";

const header = getHeader({
    title: "Toast",
    tabs: {
        states: 'States'
    },
    docsUrl: 'https://cxjs.io/docs/widgets/toasts'
});

import Default from './states';

export default <cx>
    {header}
    <PureContainer layout={FirstVisibleChildLayout}>
        <Route url={{bind: '$root.url'}} route="+/states">
            {Default}
        </Route>
        <RedirectRoute redirect="+/states" />
    </PureContainer>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);
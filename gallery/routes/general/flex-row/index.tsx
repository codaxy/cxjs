import {cx, Button, Section, FlexRow, Route, RedirectRoute, PureContainer} from 'cx/widgets';
import {bind, expr, FirstVisibleChildLayout} from 'cx/ui';

import {getHeader} from "../../../components/getHeader";
import {asyncRoute} from "../../../components/asyncRoute";

const header = getHeader({
    title: "FlexRow",
    tabs: {
        options: 'Options'
    },
    docsUrl: 'https://cxjs.io/docs/widgets/FlexBox'
});

import Default from './options';

export default <cx>
    {header}
    <PureContainer layout={FirstVisibleChildLayout}>
        <Route url={{bind: '$root.url'}} route="+/options">
            {Default}
        </Route>
        {/*{ asyncRoute("+/baseline", ()=>System.import("../../../examples/baseline")) }*/}
        <RedirectRoute redirect="+/options" />
    </PureContainer>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);
import {cx, Button, Section, FlexRow, Route, RedirectRoute, PureContainer} from 'cx/widgets';
import {bind, expr, FirstVisibleChildLayout} from 'cx/ui';

import {getHeader} from "../../../components/getHeader";
import {SandboxedRoute, SandboxedAsyncRoute} from "../../../components/asyncRoute";

const header = getHeader({
    title: "Column",
    tabs: {
        customized: 'Custom columns',
        normalized: 'Normalized',
        stacked: 'Stacked',
        "auto-column-width": 'Auto-calculated Column Widths',
        combination: 'Combination'
    },
    docsUrl: 'https://cxjs.io/docs/charts/columns'
});

import Default from './customized';

export default <cx>
    {header}
    <PureContainer layout={FirstVisibleChildLayout}>
        <SandboxedRoute route="+/customized">
            {Default}
        </SandboxedRoute>
        <SandboxedAsyncRoute route="+/normalized" content={System.import("./normalized")} />
        <SandboxedAsyncRoute route="+/stacked" content={System.import("./stacked")} />
        <SandboxedAsyncRoute route="+/auto-column-width" content={System.import("./auto-column-width")} />
        <SandboxedAsyncRoute route="+/combination" content={System.import("./combination")} />
        <RedirectRoute redirect="+/customized" />
    </PureContainer>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);
import {cx, Button, Section, FlexRow, Route, RedirectRoute, PureContainer} from 'cx/widgets';
import {bind, expr, FirstVisibleChildLayout} from 'cx/ui';

import {getHeader} from "../../../components/getHeader";
import {SandboxedRoute, SandboxedAsyncRoute} from "../../../components/asyncRoute";

const header = getHeader({
    title: "FlexCol",
    tabs: {
        options: 'Options',
        "header-layout": "Header Layout"
    },
    docsUrl: 'https://cxjs.io/docs/widgets/FlexCol'
});

import Default from './options';

export default <cx>
    {header}
    <PureContainer layout={FirstVisibleChildLayout}>
        <SandboxedRoute route="+/options">
            {Default}
        </SandboxedRoute>
        <SandboxedAsyncRoute route="+/header-layout" content={()=>import("./header-layout")} />
        <RedirectRoute redirect="+/options" />
    </PureContainer>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);
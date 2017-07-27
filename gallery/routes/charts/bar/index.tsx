import {cx, RedirectRoute, PureContainer} from 'cx/widgets';
import {FirstVisibleChildLayout} from 'cx/ui';

import {getHeader} from "../../../components/getHeader";
import {SandboxedRoute, SandboxedAsyncRoute} from "../../../components/asyncRoute";

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
        <SandboxedRoute route="+/standard">
            {Default}
        </SandboxedRoute>
        <SandboxedAsyncRoute route="+/combination" content={() => System.import("./combination")} />
        <SandboxedAsyncRoute route="+/stacked" content={() => System.import("./stacked")} />
        <SandboxedAsyncRoute route="+/bullets" content={() => System.import("./bullets")} />
        <RedirectRoute redirect="+/standard" />
    </PureContainer>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);
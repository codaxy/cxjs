import {cx, RedirectRoute, PureContainer} from 'cx/widgets';
import {bind, expr, FirstVisibleChildLayout} from 'cx/ui';

import {getHeader} from "../../../components/getHeader";
import {SandboxedRoute} from "../../../components/asyncRoute";

const header = getHeader({
    title: "MarkerLine",
    tabs: {
        standard: 'Standard'
    },
    docsUrl: 'https://cxjs.io/docs/charts/marker-lines'
});

import Default from './standard';

export default <cx>
    {header}
    <PureContainer layout={FirstVisibleChildLayout}>
        <SandboxedRoute route="+/standard">
            {Default}
        </SandboxedRoute>
        <RedirectRoute redirect="+/standard" />
    </PureContainer>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);
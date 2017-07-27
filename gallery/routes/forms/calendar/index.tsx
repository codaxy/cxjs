import {cx, RedirectRoute, PureContainer} from 'cx/widgets';
import {bind, expr, FirstVisibleChildLayout} from 'cx/ui';

import {getHeader} from "../../../components/getHeader";
import {SandboxedRoute} from "../../../components/asyncRoute";

const header = getHeader({
    title: "Calendar",
    tabs: {
        states: 'States'
    },
    docsUrl: 'https://cxjs.io/docs/widgets/Calendars'
});

import Default from './states';

export default <cx>
    {header}
    <PureContainer layout={FirstVisibleChildLayout}>
        <SandboxedRoute route="+/states">
            {Default}
        </SandboxedRoute>
        <RedirectRoute redirect="+/states" />
    </PureContainer>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);
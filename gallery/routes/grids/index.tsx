import {cx, PureContainer, RedirectRoute, Route} from 'cx/widgets';
import {bind, expr, FirstVisibleChildLayout} from 'cx/ui';

import Plain from "./plain";

declare let System: any;

import {getHeader} from "../../components/getHeader";
import {asyncRoute} from "../../components/asyncRoute";

const header = getHeader({
    title: "Grid",
    tabs: {
        plain: 'Plain',
        "multi-select": "Multiple Selection"
    },
    docsUrl: 'https://cxjs.io/docs/widgets/grids'
});


export default <cx>
    { header }

    <PureContainer layout={FirstVisibleChildLayout}>
        <Route url={{bind: "$root.url"}} route="+/plain">
            {Plain}
        </Route>
        {
            asyncRoute("+/multi-select", () => System.import("./multi-select"))
        }
        <RedirectRoute redirect="+/plain" />
    </PureContainer>
</cx>

import {hmr} from '../hmr.js';
declare let module: any;
hmr(module);

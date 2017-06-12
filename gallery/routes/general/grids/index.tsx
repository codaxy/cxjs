import {cx, PureContainer, RedirectRoute, Route} from 'cx/widgets';
import {bind, expr, FirstVisibleChildLayout} from 'cx/ui';

import Default from "./basic";

declare let System: any;

import { getHeader } from "../../../components/getHeader";
import { asyncRoute } from "../../../components/asyncRoute";

const header = getHeader({
    title: "Grid",
    tabs: {
        "basic": "Basic",
        "multi-select": "Multiple Selection",       
        "grouping": "Grouping",
        "dynamic-grouping": "Dynamic Grouping",
        "filtering": "Filtering",
        "inline-editing": "Inline Editing",
        "form-editing": "Form Editing",
        "misc": "Misc"
    },
    docsUrl: 'https://cxjs.io/docs/widgets/grids'
});


export default <cx>
    { header }

    <PureContainer layout={FirstVisibleChildLayout}>
        <Route url={{bind: "$root.url"}} route="+/basic">
            {Default}
        </Route>
        { asyncRoute("+/multi-select", () => System.import("./multi-select")) }
        { asyncRoute("+/grouping", () => System.import("./grouping")) }
        { asyncRoute("+/dynamic-grouping", () => System.import("./dynamic-grouping")) }
        { asyncRoute("+/filtering", () => System.import("./filtering")) }
        { asyncRoute("+/inline-editing", () => System.import("./inline-editing")) }
        { asyncRoute("+/form-editing", () => System.import("./form-editing")) }
        { asyncRoute("+/misc", () => System.import("./misc")) }
        <RedirectRoute redirect="+/basic" />
    </PureContainer>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);

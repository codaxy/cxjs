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
        "drag-drop": "Row Drag & Drop",
        "filtering": "Filtering",
        "form-editing": "Form Editing",
        "tree-grid": "Tree Grid",       
        "header-menu": "Header Menu",  
        "complex-header": "Complex Header",
        "dashboard-grid": "Dashboard Grid",     
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
        { asyncRoute("+/drag-drop", () => System.import("./drag-drop")) }
        { asyncRoute("+/filtering", () => System.import("./filtering")) }
        { asyncRoute("+/form-editing", () => System.import("./form-editing")) }
        { asyncRoute("+/tree-grid", () => System.import("./tree-grid")) }
        { asyncRoute("+/complex-header", () => System.import("./complex-header")) }
        { asyncRoute("+/header-menu", () => System.import("./header-menu")) }
        { asyncRoute("+/dashboard-grid", () => System.import("./dashboard-grid")) }
        { asyncRoute("+/misc", () => System.import("./misc")) }
        <RedirectRoute redirect="+/basic" />
    </PureContainer>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);

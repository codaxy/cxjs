import {cx, PureContainer, RedirectRoute, Route} from 'cx/widgets';
import {bind, expr, FirstVisibleChildLayout} from 'cx/ui';

import Default from "./basic";

declare let System: any;

import {getHeader} from "../../../components/getHeader";
import {SandboxedRoute, SandboxedAsyncRoute} from "../../../components/asyncRoute";

const header = getHeader({
    title: "Grid",
    tabs: {
        "basic": "Basic",
        "multi-select": "Multiple Selection",
        "grouping": "Grouping",
        "dynamic-grouping": "Dynamic Grouping",
        "drag-drop": "Row Drag & Drop",
        "filtering": "Filtering",
        "row-editing": "Row Editing",
        "form-editing": "Form Editing",
        "row-expanding": "Row Expanding",
        "tree-grid": "Tree Grid",
        "header-menu": "Header Menu",
        "complex-header": "Complex Header",
        "buffering": "Buffering",
        "dashboard-grid": "Dashboard Grid",
        "misc": "Misc"
    },
    docsUrl: 'https://cxjs.io/docs/widgets/grids'
});

export default <cx>
    { header }
    <PureContainer layout={FirstVisibleChildLayout}>
        <SandboxedRoute route="+/basic">
            {Default}
        </SandboxedRoute>
        <SandboxedAsyncRoute route="+/multi-select" content={() => import("./multi-select")}/>
        <SandboxedAsyncRoute route="+/grouping" content={() => import("./grouping")}/>
        <SandboxedAsyncRoute route="+/dynamic-grouping" content={() => import("./dynamic-grouping")}/>
        <SandboxedAsyncRoute route="+/drag-drop" content={() => import("./drag-drop")}/>
        <SandboxedAsyncRoute route="+/filtering" content={() => import("./filtering")}/>
        <SandboxedAsyncRoute route="+/row-editing" content={() => import("./row-editing")}/>
        <SandboxedAsyncRoute route="+/form-editing" content={() => import("./form-editing")}/>
        <SandboxedAsyncRoute route="+/row-expanding" content={() => import("./row-expanding")}/>
        <SandboxedAsyncRoute route="+/tree-grid" content={() => import("./tree-grid")}/>
        <SandboxedAsyncRoute route="+/complex-header" content={() => import("./complex-header")}/>
        <SandboxedAsyncRoute route="+/header-menu" content={() => import("./header-menu")}/>
        <SandboxedAsyncRoute route="+/dashboard-grid" content={() => import("./dashboard-grid")}/>
        <SandboxedAsyncRoute route="+/buffering" content={() => import("./buffering")}/>
        <SandboxedAsyncRoute route="+/misc" content={() => import("./misc")}/>
        <RedirectRoute redirect="+/basic"/>
    </PureContainer>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);

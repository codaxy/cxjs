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
        "form-editing": "Form Editing",
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
        <SandboxedAsyncRoute route="+/multi-select" content={() => System.import("./multi-select")}/>
        <SandboxedAsyncRoute route="+/grouping" content={() => System.import("./grouping")}/>
        <SandboxedAsyncRoute route="+/dynamic-grouping" content={() => System.import("./dynamic-grouping")}/>
        <SandboxedAsyncRoute route="+/drag-drop" content={() => System.import("./drag-drop")}/>
        <SandboxedAsyncRoute route="+/filtering" content={() => System.import("./filtering")}/>
        <SandboxedAsyncRoute route="+/form-editing" content={() => System.import("./form-editing")}/>
        <SandboxedAsyncRoute route="+/tree-grid" content={() => System.import("./tree-grid")}/>
        <SandboxedAsyncRoute route="+/complex-header" content={() => System.import("./complex-header")}/>
        <SandboxedAsyncRoute route="+/header-menu" content={() => System.import("./header-menu")}/>
        <SandboxedAsyncRoute route="+/dashboard-grid" content={() => System.import("./dashboard-grid")}/>
        <SandboxedAsyncRoute route="+/buffering" content={() => System.import("./buffering")}/>
        <SandboxedAsyncRoute route="+/misc" content={() => System.import("./misc")}/>
        <RedirectRoute redirect="+/basic"/>
    </PureContainer>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);

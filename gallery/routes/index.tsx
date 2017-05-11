import {cx, Route, RedirectRoute, Section, Sandbox, Rescope} from 'cx/widgets';
import {FirstVisibleChildLayout, bind} from 'cx/ui'
import {asyncRoute} from "../components/asyncRoute";

import AppLayout from '../layout';
declare let System: any;

export default <cx>
    <Route route="~/(:theme)" url={bind("url")} prefix>
        <RedirectRoute route="~/" url={bind("url")} redirect="~/material"/>
        <Sandbox
            accessKey={bind("url")}
            storage={bind("pages")}
            outerLayout={AppLayout}
            visible={{expr: "!!{$route.theme}"}}
        >
            <Rescope bind="$page" layout={FirstVisibleChildLayout}>

                {asyncRoute("+/button", () => System.import("./buttons"), {prefix: true})}
                {asyncRoute("+/grid", () => System.import("./grids"), {prefix: true})}
                {asyncRoute("+/text-field", () => System.import("./text-field"), {prefix: true})}

                <RedirectRoute route="+" url={bind("$root.url")} redirect="+/button"/>
                <Section title="Page Not Found" mod="card">
                    This page doesn't exists. Please check your URL.
                </Section>
            </Rescope>
        </Sandbox>
    </Route>
</cx>


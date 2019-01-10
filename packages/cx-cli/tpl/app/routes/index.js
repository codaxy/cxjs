import {Route, Section, Sandbox} from "cx/widgets";
import {FirstVisibleChildLayout} from "cx/ui";

import AppLayout from "../layout";

import Default from "./default";
import About from "./about";
import Dashboard from "./dashboard";
import UserRoutes from "./users";

export default () => <cx>
    <Sandbox
        key-bind="url"
        storage-bind="pages"
        outerLayout={AppLayout}
        layout={FirstVisibleChildLayout}
    >
        <Route route="~/" url-bind="url">
            <Default/>
        </Route>
        <Route route="~/about" url-bind="url">
            <About/>
        </Route>
        <Route route="~/dashboard" url-bind="url">
            <Dashboard/>
        </Route>
        <UserRoutes/>
        <Section title="Page Not Found" mod="card">
            This page doesn't exists. Please check your URL.
        </Section>
    </Sandbox>
</cx>;

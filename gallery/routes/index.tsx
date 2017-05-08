import {cx, Route, PureContainer, Section, Sandbox, ContentResolver} from 'cx/widgets';
import {FirstVisibleChildLayout, bind} from 'cx/ui'

import AppLayout from '../layout';

import Default from './default';
import About from './about';

const asyncRoute = (route: string, content: () => Promise<any>) => <cx>
    <Route route={route} url={bind("url")}>
        <ContentResolver
            params={bind("version")}
            onResolve={() => content().then(x=>x.default)}
        />
    </Route>
</cx>;

declare let System: any;

export default <cx>
    <Sandbox
        accessKey={bind("url")}
        storage={bind("pages")}
        outerLayout={AppLayout}
        layout={FirstVisibleChildLayout}
    >
        <Route route="~/" url={bind("url")} items={Default}/>
        <Route route="~/about" url={bind("url")} items={About}/>
        {asyncRoute("~/buttons", ()=>System.import("./buttons"))}
        {asyncRoute("~/grids", ()=>System.import("./grids"))}

        <Section title="Page Not Found" mod="card">
            This page doesn't exists. Please check your URL.
        </Section>
    </Sandbox>
</cx>


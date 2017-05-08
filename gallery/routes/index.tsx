import {cx, Route, PureContainer, Section, Sandbox} from 'cx/widgets';
import {FirstVisibleChildLayout, bind} from 'cx/ui'

import AppLayout from '../layout';

import Default from './default';
import About from './about';
import Buttons from './buttons';
import Grids from './grids';


export default <cx>
    <Sandbox
        key={1}
        storage={bind("pages")}
        outerLayout={AppLayout}
        layout={FirstVisibleChildLayout}
    >
        <Route route="~/" url={bind("url")} items={Default}/>
        <Route route="~/about" url={bind("url")} items={About}/>
        <Route route="~/buttons" url={bind("url")} items={Buttons}/>
        <Route route="~/grids" url={bind("url")} items={Grids}/>

        <Section title="Page Not Found" mod="card">
            This page doesn't exists. Please check your URL.
        </Section>
    </Sandbox>
</cx>


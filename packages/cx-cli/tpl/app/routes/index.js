import {Route} from 'cx/ui/nav/Route';
import {PureContainer} from 'cx/ui/PureContainer';

import AppLayout from '../layout';

import Default from './default';
import About from './about';


export default <cx>
    <PureContainer outerLayout={AppLayout}>
        <Route route="~/" url:bind="url">
            <Default/>
        </Route>
        <Route route="~/about" url:bind="url">
            <About/>
        </Route>
    </PureContainer>
</cx>


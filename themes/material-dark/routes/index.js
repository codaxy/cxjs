import {HtmlElement, Route, PureContainer, Submenu, Menu, Text, ContentPlaceholder} from 'cx/widgets';


import createLayout from 'shared/layout';

import Widgets from './widgets';
import Grids from './grids';
import Charts from './charts';
import Global from './global';

const layout = createLayout("Material Dark");

export default <cx>
   <PureContainer outerLayout={layout}>
      <Route route="#" url:bind="hash">
         <Widgets />
      </Route>
      <Route route="#global" url:bind="hash">
         <Global />
      </Route>
      <Route route="#grids" url:bind="hash">
         <Grids />
      </Route>
      <Route route="#charts" url:bind="hash">
         <Charts />
      </Route>
   </PureContainer>
</cx>



import {HtmlElement, Route, PureContainer, Submenu, Menu, Text, ContentPlaceholder} from 'cx/widgets';


import createLayout from 'shared/layout';

import Widgets from 'shared/routes/widgets';
import Grids from 'shared/routes/grids';
import Charts from 'shared/routes/charts';
import Global from 'shared/routes/global';

const layout = createLayout("Frost");

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



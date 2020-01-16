import { HtmlElement, Button, Checkbox, Tab, Link, Menu, Icon, PureContainer } from 'cx/widgets';
import { FirstVisibleChildLayout, ContentResolver } from 'cx/ui';

import {CodeMirror} from 'app/components/CodeMirror';
import {Preview} from 'app/components/Preview';
import {Header} from './Header';
import Main from './Main';

import Controller from './Controller';
import {addImport} from 'app/core/addImports';

export default <cx>
   <div class="cxb-app" controller={Controller} layout={FirstVisibleChildLayout}>
      <ContentResolver
         params={{
            phone: { expr: 'window.innerWidth < 800' }
         }}
         onResolve={(params) => <cx>
            <PureContainer>
               { Header(params.phone) }
               { Main(params.phone) }
            </PureContainer>
         </cx>}
      />
   </div>
</cx>;

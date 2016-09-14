import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {ContentPlaceholder} from 'cx/ui/layout/ContentPlaceholder';

import {Controller} from 'cx/ui/Controller';
import {TextField} from 'cx/ui/form/TextField';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Select} from 'cx/ui/form/Select';
import {LabeledContainer} from 'cx/ui/form/LabeledContainer';

import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';
import {LabelsTopLayout} from 'cx/ui/layout/LabelsTopLayout';
import {FirstVisibleChildLayout} from 'cx/ui/layout/FirstVisibleChildLayout';

import {Debug} from 'cx/util/Debug';
//Debug.enable('prepare');
//Debug.enable('render');

class FetchController extends Controller {
   fetch() {
      this.store.set('$page.fetch.status', 'LOADING');
      setTimeout(() => {
         if (Math.random() > 0.5) {
            this.store.set('$page.fetch.status', 'SUCCESS');
            this.store.set('$page.fetch.result', Math.random() * 100);
         } else {
            this.store.set('$page.fetch.status', 'ERROR');
         }
      }, 1000);
   }
}

var AppLayout = <cx>
   <div style={{height: '200px', width: '300px', display: 'flex', flexDirection: 'column', border: '1px solid black'}}>
      <header style={{background: "lightblue", padding: '5px'}}>App Header</header>
      <div style={{flex: 1, display: 'flex', flexDirection: 'row'}}>
         <aside style={{width: '70px', background: 'white', padding: '5px'}}>
            <ContentPlaceholder name="sidebar" />
         </aside>
         <main style={{flex: 1, padding: '5px'}}>
            <ContentPlaceholder /* name="body" *//>
         </main>
      </div>
   </div>
</cx>;


export const LayoutIssue = <cx>

   <div class="widgets">
      <div outerLayout={AppLayout}>
         <Content name="sidebar">
            Nav 1
         </Content>
         Main 1
      </div>
   </div>

</cx>;


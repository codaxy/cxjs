import { HtmlElement, TextField, Checkbox, Select, LabeledContainer } from 'cx/widgets';
import { Content, ContentPlaceholder, Controller, LabelsLeftLayout, LabelsTopLayout, FirstVisibleChildLayout } from 'cx/ui';
import { Debug } from 'cx/util';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';




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


import {Text, List, HtmlElement} from 'cx/widgets';
import {Controller} from 'cx/ui';

class PageController extends Controller {
   init() {
      super.init();

      this.store.init('$page.records', Array.from({length: 5}).map((x, i)=>({
         text: `${i+1}`
      })));
   }
}

export const ListSection = <cx>
   <section controller={PageController}>
      <h3>List</h3>
         <List records:bind="$page.records"
               emptyText="Nothing results found.">
            <Text bind="$record.text" />
         </List>
      </section>
</cx>;

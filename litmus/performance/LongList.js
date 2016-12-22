import { TextField, HtmlElement, List } from 'cx/widgets';
import { LabelsLeftLayout, Controller } from 'cx/ui';
import { getSearchQueryPredicate } from 'cx/util';

class ListController extends Controller {
   init() {
      this.store.set('data', Array.from({length: 1000}, (_, i) => ({
         id: i,
         text: String(2000 + i)
      })))

      this.addComputable('$data', ['data', 'filter'], (data, filter) => {
         if (!filter || !filter.query)
            return data;

         let predicate = getSearchQueryPredicate(filter.query);

         return data.filter(el => predicate(el.text));
      });
   }
}

export default<cx>
   <section controller={ListController}>
      <h3>Long List</h3>
      <TextField value:bind="filter.query" />

      {/* Observe timing differences when typing in this field with cached set on/off */}
      <TextField value:bind="filter.dummy"  />
      <List
         records:bind="$data"
         style="height: 500px"
         cached={true}
         keyField="id"
      >
         <div>
            <span text:bind="$record.text" />
         </div>
      </List>
   </section>
</cx>;

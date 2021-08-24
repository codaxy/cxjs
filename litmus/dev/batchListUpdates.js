import { TextField, HtmlElement, List } from 'cx/widgets';
import { LabelsLeftLayout, Controller, KeySelection } from 'cx/ui';
import { getSearchQueryPredicate } from 'cx/util';

class ListController extends Controller {
   init() {
      this.store.set('data', Array.from({ length: 10 }, (_, i) => ({
         id: i,
         text: String(2000 + i)
      })))

      // this.addComputable('$data', ['data', 'filter'], (data, filter) => {
      //    if (!filter || !filter.query)
      //       return data;
      //
      //    let predicate = getSearchQueryPredicate(filter.query);
      //
      //    return data.filter(el => predicate(el.text));
      // });
   }
}

export default <cx>
   <div controller={ListController}>
      <List
         records-bind="data"
         style="height: 500px"
         cached={false}
         keyField="id"
         filterParams-bind="filter"
         onCreateFilter={(filter) => {
            if (!filter || !filter.query)
               return null;

            let predicate = getSearchQueryPredicate(filter.query);
            return el => predicate(el.text);
         }}
         selectMode
         selection={{
            type: KeySelection,
            bind: "sel"
         }}
      >
         <div>
            <span text-bind="$record.text" />
         </div>
      </List>
   </div>
</cx>;

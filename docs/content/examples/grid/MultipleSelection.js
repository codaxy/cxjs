import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {Controller} from 'cx/ui/Controller';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Grid} from 'cx/ui/grid/Grid';
import {PropertySelection} from 'cx/ui/selection/PropertySelection';
import {casual} from '../data/casual';

class PageController extends Controller {
   init() {
      super.init();

      this.store.set('$page.records', Array.from({length: 20}).map((v, i)=>({
         id: i+1,
         fullName: casual.full_name,
         phone: casual.phone,
         city: casual.city,
         selected: false
      })));

      this.addTrigger('select-all', ['$page.selectAll'], (value) => {
         this.store.set('$page.records', this.store.get('$page.records')
            .map(r=>Object.assign({}, r, {selected: value})));
      });
   }
}

export const MultipleSelection = <cx>
   <Md controller={PageController}>

      # Grid with Multiple Selection

      <CodeSplit>

         Grid supports multiple selection. Single select is the default. For additional rows use `Ctrl` key
         or checkboxes.

         To select all rows click the checkbox in the header.

         <Grid records:bind='$page.records'
               style={{width: "100%"}}
               columns={[{
                     header: { items: <cx><Checkbox value:bind="$page.selectAll" /></cx> },
                     field: 'selected',
                     items: <cx><Checkbox value:bind="$record.selected" /></cx>
                  },
                  { header: 'Name', field: 'fullName', sortable: true },
                  { header: 'Phone', field: 'phone' },
                  { header: 'City', field: 'city', sortable: true }
               ]}
               selection={{type: PropertySelection, bind:"$page.selection", multiple: true}}
               sorters:bind="$page.sorters"
         />

         See also:

         - [Selection](~/concepts/selections)

         <Content name="code">
            <CodeSnippet>{`
               class PageController extends Controller {
                  init() {
                     super.init();

                     this.store.set('$page.records', Array.from({length: 20}).map(()=>({
                        fullName: casual.full_name,
                        phone: casual.phone,
                        city: casual.city,
                        selected: false
                     })));

                     this.addTrigger('select-all', ['$page.selectAll'], (value, records) => {
                        this.store.set('$page.records', this.store.get('$page.records')
                           .map(r=>Object.assign({}, r, {selected: value})));
                     });
                  }
               }

               ...

               <Grid records:bind='$page.records' style={{width: "100%"}}
                     columns={[
                        { header: { items: <cx><Checkbox value:bind="$page.selectAll" /></cx> }, field: 'selected', items: <cx><Checkbox value:bind="$record.selected" /></cx> },
                        { header: 'Name', field: 'fullName', sortable: true },
                        { header: 'Phone', field: 'phone' },
                        { header: 'City', field: 'city', sortable: true }
                     ]}
                     selection={{type: PropertySelection, bind:"$page.selection", multiple: true}}
                     sorters:bind="$page.sorters"
               />`}
            </CodeSnippet>
         </Content>

      </CodeSplit>

   </Md>
</cx>
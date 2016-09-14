import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {Controller} from 'cx/ui/Controller';
import {TextField} from 'cx/ui/form/TextField';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Grid} from 'cx/ui/grid/Grid';
import {casual} from '../data/casual';

class PageController extends Controller {
   init() {
      super.init();

      this.store.set('$page.records', Array.from({length: 20}).map((v, i)=>({
         id: i+1,
         fullName: casual.full_name,
         phone: casual.phone,
         city: casual.city,
         notified: casual.coin_flip
      })));
   }
}

export const InlineEdit = <cx>
   <Md controller={PageController}>

      # Grid with Inline Editing

      <CodeSplit>

         Grid supports arbitrary content inside its cells. Any widget or even a chart can be put inside it.

         > TODO: Styling!

         <Grid records:bind='$page.records'
               style={{width: "100%"}}
               columns={[
                  { header: 'Name', field: 'fullName', sortable: true, pad: false, items: <cx>
                        <TextField value:bind="$record.fullName" style={{width: '100%'}} />
                     </cx>
                  }, { header: 'Phone', field: 'phone', pad: false, items: <cx>
                        <TextField value:bind="$record.phone" style={{width: '100%'}} />
                     </cx>
                  }, { header: 'City', field: 'city', pad: false, sortable: true, items: <cx>
                        <TextField value:bind="$record.city" style={{width: '100%'}} />
                     </cx>
                  }, { header: 'Notified', field: 'notified', sortable: true, align: 'center', pad: false, items: <cx>
                        <Checkbox value:bind="$record.notified" />
                     </cx>
                  }
               ]}
         />

         <Content name="code">
            <CodeSnippet>{`
               class PageController extends Controller {
                  init() {
                     super.init();

                     this.store.set('$page.records', Array.from({length: 20}).map((v, i)=>({
                        id: i+1,
                        fullName: casual.full_name,
                        phone: casual.phone,
                        city: casual.city,
                        notified: casual.coin_flip
                     })));
                  }
               }
               ...
               <Grid records:bind='$page.records'
                  style={{width: "100%"}}
                  columns={[
                     { header: 'Name', field: 'fullName', sortable: true, items: <cx>
                           <TextField value:bind="$record.fullName" style={{width: '100%'}} />
                        </cx>
                     }, { header: 'Phone', field: 'phone', items: <cx>
                           <TextField value:bind="$record.phone" style={{width: '100%'}} />
                        </cx>
                     }, { header: 'City', field: 'city', sortable: true, items: <cx>
                           <TextField value:bind="$record.city" style={{width: '100%'}} />
                        </cx>
                     }, { header: 'Notified', field: 'notified', sortable: true, align: 'center', items: <cx>
                           <Checkbox value:bind="$record.notified" />
                        </cx>
                      }
                  ]}
               />
            `}
            </CodeSnippet>
         </Content>

      </CodeSplit>

   </Md>
</cx>
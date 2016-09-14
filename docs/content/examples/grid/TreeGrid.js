import {Md} from '../../../components/Md';
import {CodeSplit} from '../../../components/CodeSplit';
import {CodeSnippet} from '../../../components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {Controller} from 'cx/ui/Controller';
import {TextField} from 'cx/ui/form/TextField';
import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Grid} from 'cx/ui/grid/Grid'
import {KeySelection} from 'cx/ui/selection/KeySelection';
import {casual} from '../data/casual';
import {ExposedRecordView} from 'cx/data/ExposedRecordView';
import {Binding} from 'cx/data/Binding';
import {TreeNode} from 'cx/ui/grid/TreeNode';
import {TreeAdapter} from 'cx/ui/grid/TreeAdapter';

class PageController extends Controller {
   init() {
      super.init();
      this.idSeq = 0;
      this.store.set('$page.data', this.generateRecords());
   }

   generateRecords(node) {
      if (!node || node.$level < 5)
         return Array.from({length: 20}).map(()=>({
            id: ++this.idSeq,
            fullName: casual.full_name,
            phone: casual.phone,
            city: casual.city,
            notified: casual.coin_flip,
            $leaf: casual.coin_flip
         }));
   }
}

export const TreeGrid = <cx>
   <Md controller={PageController}>
      <CodeSplit>
         # Tree Grid

         The following example shows how to make a tree out of grid control.

         <Grid records:bind='$page.data'
               mod="tree"
               style={{width: "100%", height: '500px'}}
               scrollable={true}
               dataAdapter={{
                  type: TreeAdapter,
                  load: (context, {controller}, node) => controller.generateRecords(node)
               }}
               selection={{type: KeySelection, bind:"$page.selection"}}
               columns={[
                  { header: 'Name', field: 'fullName', sortable: true, items: <cx>
                     <TreeNode expanded:bind="$record.$expanded"
                        leaf:bind="$record.$leaf"
                        level:bind="$record.$level"
                        loading:bind="$record.$loading"
                        text:bind="$record.fullName" />
                  </cx>},
                  { header: 'Phone', field: 'phone' },
                  { header: 'City', field: 'city', sortable: true },
                  { header: 'Notified', field: 'notified', sortable: true, value: { expr: '{$record.notified} ? "Yes" : "No"' } }
               ]}
         />

         <CodeSnippet putInto="code">{`
          class PageController extends Controller {
            init() {
               super.init();
               this.idSeq = 0;
               this.store.set('$page.data', this.generateRecords());
            }

            generateRecords(node) {
               if (!node || node.$level < 5)
                  return Array.from({length: 5}).map(()=>({
                     id: ++this.idSeq,
                     fullName: casual.full_name,
                     phone: casual.phone,
                     city: casual.city,
                     notified: casual.coin_flip,
                     $leaf: casual.coin_flip
                  }));
            }
         }
         ...
         <Grid records:bind='$page.data'
               mod="tree"
               style={{width: "100%"}}
               dataAdapter={{
               type: TreeAdapter,
               load: (context, {controller}, node) => controller.generateRecords(node)
            }}
               selection={{type: KeySelection, bind:"$page.selection"}}
               columns={[
               { header: 'Name', field: 'fullName', sortable: true, items: <cx>
                  <TreeNode expanded:bind="$record.$expanded"
                     leaf:bind="$record.$leaf"
                     level:bind="$record.$level"
                     loading:bind="$record.$loading"
                     text:bind="$record.fullName" />
               </cx>},
               { header: 'Phone', field: 'phone' },
               { header: 'City', field: 'city', sortable: true },
               { header: 'Notified', field: 'notified', sortable: true, value: { expr: '{$record.notified} ? "Yes" : "No"' } }
            ]}
            />`}
         </CodeSnippet>
      </CodeSplit>
   </Md>
</cx>
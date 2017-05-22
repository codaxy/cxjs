
import {cx, Section, FlexRow, List, Text} from 'cx/widgets';
import {bind, Controller, PropertySelection} from 'cx/ui';

class PageController extends Controller {
   init() {
      super.init();

      this.store.init('$page.records', Array.from({length: 5}, (x, i)=>({
         text: `${i+1}`
      })));
   }
}

export default <cx>
    <FlexRow wrap spacing="large" target="desktop">
        <Section mod="well" controller={PageController}>
            <List records={bind("$page.records")}
               selection={PropertySelection}
               style="width:200px"
               emptyText="Nothing found."
               mod="bordered">
               <div>
                  <strong>Header <Text expr="{$index}+1" /></strong>
               </div>
               Description
            </List>
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
declare let module: any;
hmr(module);
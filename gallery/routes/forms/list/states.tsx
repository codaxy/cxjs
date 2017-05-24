
import {cx, Section, FlexRow, List, Text} from 'cx/widgets';
import {bind, Controller, PropertySelection} from 'cx/ui';

class PageController extends Controller {
  init() {
    super.init();

    this.store.init(
      "records",
      Array.from({ length: 5 }).map((x, i) => ({ text: `${i + 1}` }))
    );
  }
}

const listMod = mod => <cx>
    <List
        records={bind('records')}
        selection={PropertySelection} 
        style={{ width: '200px' }}
        emptyText="Nothing found."
        mod={mod}
    >   
        <div>
          <strong>Header <Text expr="{$index}+1" /></strong>
        </div>
        Description
    </List>
</cx>


export default <cx>
    <FlexRow wrap spacing="large" target="desktop" controller={PageController}>
        <Section mod="well" >
            <FlexRow wrap spacing="large" >
            <div>
                <h6>Bordered</h6>
                {listMod("bordered")}
            </div>
            <div>
                <h6>Big</h6>
                {listMod("big")}
            </div>
            </FlexRow>
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
declare let module: any;
hmr(module);

import {cx, Section, FlexRow, List, Text} from 'cx/widgets';
import {bind, tpl, Controller, PropertySelection, KeySelection} from 'cx/ui';
import casual from '../../../util/casual';

class PageController extends Controller {
  init() {
    this.store.init(
      "$page.records",
      Array.from({ length: 20 }).map((v, i) => {
        var name = casual.full_name;
        return {
          id: i + 1,
          fullName: name,
          phone: casual.phone,
          city: casual.city,
          email: name.toLowerCase().replace(" ", ".") + "@example.com",
          country: casual.country
        };
      })
    );
  }
}

export default <cx>
    <FlexRow wrap spacing="large" target="desktop">
        <Section mod="well" controller={PageController}>
            <List
              records={bind("$page.records")}
              selection={{ type: KeySelection, bind: "$page.selection" }}
              grouping={{
                  key: { firstLetter: { expr: "{$record.fullName}[0]" } },
                  aggregates: { count: { type: "count", value: 1 } },
                  header: (
                    <div style={{ paddingTop: '25px'}}>
                      <strong text={bind("$group.firstLetter")} />
                    </div>
                  ),
                  footer: <strong text={tpl("{$group.count} item(s)")} />
                }}
            >
              <strong text={bind("$record.fullName")}></strong>
              <br />
               Phone: <span text={bind("$record.phone")} />
              <br />
               City: <span text={bind("$record.city")} />
            </List>
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
declare let module: any;
hmr(module);
import { Grid, HtmlElement, Button, Section, Select, cx, ValidationGroup, TreeAdapter, TreeNode } from "cx/widgets";
import { Controller, bind, expr, KeySelection } from "cx/ui";
import { Format } from "cx/util";
import casual from '../../../util/casual';

class PageController extends Controller {
  
  idSeq: number;

  init() {
    super.init();
    this.idSeq = 0;
    this.store.set("$page.data", this.generateRecords());
  }

  generateRecords(node?) {
    if (!node || node.$level < 5)
      return Array
        .from({ length: 5 })
        .map(() => ({
          id: ++this.idSeq,
          fullName: casual.full_name,
          phone: casual.phone,
          city: casual.city,
          notified: casual.coin_flip,
          $leaf: casual.coin_flip
        }));
  }
}

export default (
  <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/grids/tree-grid.tsx" target="_blank" putInto="github">GitHub</a>
    <Section
      mod="well"      
      controller={PageController}
    >
      <Grid
        scrollable
        records={bind("$page.data")}
        mod="tree"
        style={{ width: "100%", "max-height": "800px", "min-height": "400px" }}
        dataAdapter={
          {
            type: TreeAdapter,
            load: (context, { controller }, node) =>
              controller.generateRecords(node)
          }
        }
        selection={{ type: KeySelection, bind: "$page.selection" }}
        columns={[
          {
            header: "Name",
            field: "fullName",
            sortable: true,
            items: (
              <cx>
                <TreeNode
                  expanded={bind("$record.$expanded")}
                  leaf={bind("$record.$leaf")}
                  level={bind("$record.$level")}
                  loading={bind("$record.$loading")}
                  text={bind("$record.fullName")}
                />
              </cx>
            )
          },
          { header: "Phone", field: "phone" },
          { header: "City", field: "city", sortable: true },
          {
            header: "Notified",
            field: "notified",
            sortable: true,
            value: { expr: '{$record.notified} ? "Yes" : "No"' }
          }
        ]}
      />
    </Section>
  </cx>
);

import { hmr } from '../../hmr.js';
hmr(module);
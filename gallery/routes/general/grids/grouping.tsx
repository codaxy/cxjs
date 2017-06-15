import { Grid, Section, cx, HtmlElement, Select } from "cx/widgets";
import { Controller, KeySelection, bind } from "cx/ui";
import casual from '../../../util/casual';

class PageController extends Controller {
  init() {
    super.init();

    //init grid data
    this.store.init(
      "$page.records",
      Array
        .from({ length: 50 })
        .map((v, i) => ({
          id: i + 1,
          fullName: casual.full_name,
          continent: casual.continent,
          browser: casual.browser,
          os: casual.operating_system,
          visits: casual.integer(1, 100)
        }))
    );
  }
}

export default (
  <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/grids/grouping.tsx" target="_blank" putInto="github">Source Code</a>
    <Section
      mod="well"
      style="height: 100%"
      bodyStyle="display:flex; flex-direction:column"
      controller={PageController}
    >
      <Grid
        records={bind("$page.records")}
        scrollable={true}
        style={{ width: "100%", height: "700px" }}
        columns={
          [
            {
              header: "Name",
              field: "fullName",
              sortable: true,
              aggregate: "count",
              aggregateField: "people",
              footer: {
                tpl: "{$group.name} - {$group.people} {$group.people:plural;person}"
              }
            },
            {
              header: "Continent",
              field: "continent",
              sortable: true,
              aggregate: "distinct",
              footer: {
                tpl: "{$group.continent} {$group.continent:plural;continent}"
              }
            },
            {
              header: "Browser",
              field: "browser",
              sortable: true,
              aggregate: "distinct",
              footer: {
                tpl: "{$group.browser} {$group.browser:plural;browser}"
              }
            },
            {
              header: "OS",
              field: "os",
              sortable: true,
              aggregate: "distinct",
              footer: { tpl: "{$group.os} {$group.os:plural;OS}" }
            },
            {
              header: "Visits",
              field: "visits",
              sortable: true,
              aggregate: "sum",
              align: "right"
            }
          ]
        }
        grouping={
          [
            {
              key: { name: { bind: "$record.continent" } },
              showFooter: true,
              caption: { bind: "$group.name" }
            }
          ]
        }
      />
    </Section>
  </cx>
);

import { hmr } from '../../hmr.js';
hmr(module);
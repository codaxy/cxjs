import { Grid, HtmlElement, LookupField, Section, Select, cx } from "cx/widgets";
import { Controller, bind } from "cx/ui";
import { Format } from "cx/util";
import casual from '../../../util/casual';

function plural(word, count) {
  if (count > 1) return word + "s";
  return word;
}

class PageController extends Controller {
  init() {
    super.init();

    //init grid data
    this.store.set(
      "$page.records",
      Array
        .from({ length: 100 })
        .map((v, i) => ({
          id: i + 1,
          fullName: casual.full_name,
          continent: casual.continent,
          browser: casual.browser,
          os: casual.operating_system,
          visits: casual.integer(1, 100)
        }))
    );

    //init grouping options
    this.store.set("$page.groupableFields", [
      { id: "continent", text: "Continent" },
      { id: "browser", text: "Browser" },
      { id: "os", text: "Operating System" }
    ]);

    this.store.set("$page.groups", [{ id: "browser", text: "Browser" }]);

    //when changed, apply grouping to the grid
    this.addTrigger("grouping", ["$page.groups"], g => {
      var groupings = [{ key: {}, showFooter: true }];
      groupings.push(...(g || []).map(x => x.id));
      var grid = this.widget.findFirst(Grid);
      grid.groupBy(groupings, { autoConfigure: true });
    }, true);
  }
}

Format.registerFactory("plural", (format, text) => {
  return value => plural(text, value);
});


export default (
  <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/grids/dynamic-grouping.tsx" target="_blank" putInto="github">GitHub</a>
    <Section
      mod="well"
      style="height: 100%"
      bodyStyle="display:flex; flex-direction:column"
      controller={PageController}
    >
      <p>
        Group by: <LookupField
          records={bind("$page.groups")}
          options={bind("$page.groupableFields")}
          multiple={true}
        />
      </p>
      <Grid
        records={bind("$page.records")}
        style={{ width: "100%" }}
        columns={
        [
          {
            header: "Name",
            field: "fullName",
            sortable: true,
            aggregate: "count",
            footer: {
              expr: '({$group.$level} > 1 ? {$group.$name:s:TOTAL} + " - " : "") + {$group.fullName} + " " + {$group.fullName:plural;item}'
            }
          },
          {
            header: "Continent",
            field: "continent",
            sortable: true,
            aggregate: "distinct",
            aggregateField: "continents",
            footer: {
              tpl: "{$group.continents} {$group.continents:plural;continent}"
            }
          },
          {
            header: "Browser",
            field: "browser",
            sortable: true,
            aggregate: "distinct",
            aggregateField: "browsers",
            footer: {
              tpl: "{$group.browsers} {$group.browsers:plural;browser}"
            }
          },
          {
            header: "OS",
            field: "os",
            sortable: true,
            aggregate: "distinct",
            aggregateField: "oss",
            footer: { tpl: "{$group.oss} {$group.oss:plural;OS}" }
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
      />
    </Section>
  </cx>
);

import { hmr } from '../../hmr.js';
hmr(module);
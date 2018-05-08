import {Grid, HtmlElement, Select} from "cx/widgets";
import {Controller, Format} from "cx/ui";
import {casual} from "../../casual";

Format.registerFactory('plural', (format, word) => {
   return v => `${word}s`;
});

class PageController extends Controller {
   init() {
      super.init();

      this.store.set(
         "$page.records",
         Array.from({length: 100}).map((v, i) => ({
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
      <div controller={PageController}>
         <Grid
            records:bind="$page.records"
            keyField='id'
            scrollable
            mod="responsive"
            style={{width: '400px', height: "700px", margin: "50px"}}
            fixedFooter
            columns={[
               {
                  header: "Name",
                  field: "fullName",
                  sortable: true,
                  aggregate: "count",
                  aggregateAlias: "people",
                  style: "white-space: nowrap",
                  footer: {
                     tpl:
                        "{$group.name:suffix; - }{$group.people} {$group.people:plural;person}"
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
                  footer: {tpl: "{$group.os} {$group.os:plural;OS}"}
               },
               {
                  header: "Visits",
                  field: "visits",
                  sortable: true,
                  aggregate: "sum",
                  align: "right"
               }
            ]}
            grouping={[
               {
                  showFooter: true
               },
               {
                  key: {name: {bind: "$record.continent"}},
                  showFooter: true,
                  caption: {bind: "$group.name"}
               }
            ]}
         />
      </div>
   </cx>
);

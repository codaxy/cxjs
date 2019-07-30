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

      this.addComputable('$page.totals', ['$page.records'], records => {
         return {
            visits: 1000
         }
      })
   }
}

export default (
   <cx>
      <div controller={PageController}>
         <Grid
            records-bind="$page.records"
            keyField='id'
            scrollable
            mod="responsive"
            style={{width: '600px', height: "700px", margin: "50px"}}
            fixedFooter
            grouping={[{ showFooter: true }, { showFooter: false, showCaption: true, key: { name: { bind: "$record.continent"} } }]}
            columns={[
               {
                  header: "Name",
                  field: "fullName",
                  sortable: true,
                  style: "white-space: nowrap",
                  footer: 'TOTAL',
                  caption: {
                     expand: true,
                     value: { tpl: '{$group.name}' }
                  }
               },
               {
                  header: "Continent",
                  field: "continent",
                  sortable: true,
                  aggregate: 'count'
               },
               {
                  header: "Browser",
                  field: "browser",
                  sortable: true,
                  aggregate: 'count'
               },
               {
                  header: "OS",
                  field: "os",
                  sortable: true,
                  aggregate: 'count'
               },
               {
                  header: "Visits",
                  field: "visits",
                  sortable: true,
                  align: "right",
                  aggregate: 'sum'
               }
            ]}
         />
      </div>
   </cx>
);

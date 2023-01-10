import { bind, Controller, KeySelection } from "cx/ui";
import { Button, Grid } from "cx/widgets";
import { casual } from "../../casual";

class PageController extends Controller {
   onInit() {
      //init grid data
      if (!this.store.get("$page.records")) this.shuffle();
   }

   shuffle() {
      this.store.set("$page.resetScroll", Math.random());
      this.store.set(
         "$page.records",
         Array.from({ length: 20000 }).map((v, i) => ({
            id: i + 1,
            fullName: casual.full_name,
            continent: casual.continent,
            browser: casual.browser,
            os: casual.operating_system,
            visits: casual.integer(1, 100),
         }))
      );
   }
}

let fixed = true;

export default (
   <cx>
      <div controller={PageController} style="padding: 10px">
         <p>
            <Button onClick="shuffle">Shuffle</Button>
         </p>
         <Grid
            records-bind="$page.records"
            scrollable
            buffered
            measureRowHeights
            style="height: 800px"
            lockColumnWidths
            cached
            scrollResetParams-bind="$page.resetScroll"
            row={{
               line1: {
                  columns: [
                     { header: "#", field: "index", sortable: true, value: { bind: "$index" }, fixed, width: 100 },
                     {
                        header: {
                           text: "Name",
                        },
                        fixed,
                        field: "fullName",
                        sortable: true,
                        aggregate: 'count',
                        aggregateAlias: 'people',
                        footer: { tpl: '{$group.fullName|TOTAL} - {$group.people} {$group.people:plural;person}' },
                        caption: { tpl: '{$group.fullName} ({$group.people} {$group.people:plural;person})' },
                        width: 200,

                     },
                     {
                        header: "Continent", field: "continent", sortable: true, aggregate: 'count',
                        aggregate: 'distinct',
                        footer: { tpl: '{$group.continent} {$group.continent:plural;continent}' },
                        caption: { tpl: '{$group.continent} {$group.continent:plural;continent}' },
                     },
                     {
                        header: "Browser", field: "browser", sortable: true, aggregate: 'distinct',
                        footer: { tpl: '{$group.browser} {$group.browser:plural;browser}' },
                        caption: { tpl: '{$group.browser} {$group.browser:plural;browser}' }
                     },
                     {
                        header: "OS", field: "os", sortable: true, aggregate: 'distinct',
                        footer: { tpl: '{$group.os} {$group.os:plural;OS}' },
                        caption: { tpl: '{$group.os} {$group.os:plural;OS}' }
                     },
                     {
                        header: "Visits",
                        field: "visits",
                        sortable: true,
                        align: "right",
                        aggregate: "sum",
                     },
                     {
                        header: "Visits",
                        field: "visits",
                        sortable: true,
                        align: "right",
                        aggregate: "sum",
                     },
                     {
                        header: "Visits",
                        field: "visits",
                        sortable: true,
                        align: "right",
                        aggregate: "sum",
                     },
                     {
                        header: "Visits",
                        field: "visits",
                        sortable: true,
                        align: "right",
                        aggregate: "sum",
                     },
                     {
                        header: "Visits",
                        field: "visits",
                        sortable: true,
                        align: "right",
                        aggregate: "sum",
                     },
                     {
                        header: "Visits",
                        field: "visits",
                        sortable: true,
                        align: "right",
                        aggregate: "sum",
                     },
                     {
                        header: "Visits",
                        field: "visits",
                        sortable: true,
                        align: "right",
                        aggregate: "sum",
                     },
                     {
                        header: "Visits",
                        field: "visits",
                        sortable: true,
                        align: "right",
                        aggregate: "sum",
                     },
                     {
                        header: "Visits",
                        field: "visits",
                        sortable: true,
                        align: "right",
                        aggregate: "sum",
                     },
                     {
                        header: "Visits",
                        field: "visits",
                        sortable: true,
                        align: "right",
                        aggregate: "sum",
                     },
                     {
                        header: "Visits",
                        field: "visits",
                        sortable: true,
                        align: "right",
                        aggregate: "sum",
                     },
                     {
                        header: "Visits",
                        field: "visits",
                        sortable: true,
                        align: "right",
                        aggregate: "sum",
                     },
                     {
                        header: "Visits",
                        field: "visits",
                        sortable: true,
                        align: "right",
                        aggregate: "sum",
                     },
                     {
                        visible: false,
                        items: <cx>
                           <Button mod="hollow" onClick={(e, { store }) => {
                              store.toggle('$record.showLine');
                           }}>Expand</Button>
                        </cx>
                     },
                  ],
               },
               line2: {
                  visible: bind('$record.showLine'),
                  columns: {
                     field: 'visits',
                     colSpan: 1000,
                     style: 'border-top: none',
                     items: <cx>
                        <div>Test</div>
                     </cx>
                  }
               }
            }}
            selection={{ type: KeySelection, bind: "$page.selection" }}
            grouping={[
               { showFooter: true },
               {
                  key: {
                     name: { bind: '$record.continent' }
                  },
                  showCaption: true,
                  showFooter: true,
               }
            ]}
         />
      </div>
   </cx>
);

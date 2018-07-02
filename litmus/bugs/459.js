import { Button, Grid, HtmlElement } from "cx/widgets";
import { Controller } from "cx/ui";
import { casual } from "../casual";

class PageController extends Controller {
   onInit() {
      if (!this.store.get("$page.records")) this.shuffle();
   }

   shuffle() {
      this.store.set(
         "$page.records",
         Array.from({ length: 20 }).map((v, i) => ({
            fullName: casual.full_name,
            continent: casual.continent,
            visits: casual.integer(1, 100)
         }))
      );
   }
}

export default (
   <cx>
      <Grid
         controller={PageController}
         records:bind="$page.records"
         lockColumnWidths
         cached
         row={{
            line1: {
               columns: [
                  {
                     header: "Name",
                     field: "fullName",
                     sortable: true,
                     aggregate: "count",
                     aggregateAlias: "names",
                     footer: {
                        tpl: "({$group.names} names)"
                     }
                  },
                  {
                     header: "Continent",
                     field: "continent",
                     aggregate: "distinct",
                     aggregateAlias: "continents",
                     footer: {
                        tpl: "({$group.continents} continents)"
                     }
                  },
                  {
                     header: "Visits",
                     field: "visits",
                     align: "right",
                     aggregate: "sum",
                     aggregateAlias: "visits",
                     footer: {
                        tpl: "({$group.visits} visits)"
                     }
                  },
                  {
                     align: "center",
                     items: (
                        <cx>
                           <Button
                              mod="hollow"
                              icon="drop-down"
                              onClick={(e, { store }) => {
                                 store.toggle("$record.showDescription");
                              }}
                           />
                        </cx>
                     )
                  }
               ]
            },
            line3: {
               visible: { expr: "{$record.showDescription}" },
               columns: [
                  {
                     colSpan: 1000,
                     style: "border-top-color: rgba(0, 0, 0, 0.05)",
                     items: (
                        <cx>
                           <span text="Test" />
                        </cx>
                     )
                  }
               ]
            }
         }}
      />
   </cx>
);

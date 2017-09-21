import {Grid, HtmlElement, LookupField, Select, Pagination} from "cx/widgets";
import {Controller} from "cx/ui";
import {Format} from "cx/util";

import {casual} from 'shared/data/casual';

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
            .from({length: 100})
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
         {id: "continent", text: "Continent"},
         {id: "browser", text: "Browser"},
         {id: "os", text: "Operating System"}
      ]);

      //when changed, apply grouping to the grid
      this.addTrigger("grouping", ["$page.groups"], g => {
         var groupings = [{key: {}, showFooter: true}];
         groupings.push(...(g || []).map(x => x.id));
         var grid = this.widget.findFirst(Grid);
         grid.groupBy(groupings, {autoConfigure: true});
      });
   }
}

Format.registerFactory("plural", (format, text) => {
   return value => plural(text, value);
});

export default (
   <cx>
      <div controller={PageController}>
         <p style="margin-bottom: 10px">
            Group by: <LookupField
            records:bind="$page.groups"
            options:bind="$page.groupableFields"
            multiple={true}
         />
         </p>
         <Grid
            records:bind="$page.records"
            style={{width: "100%"}}
            cached
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
                     footer: {tpl: "{$group.oss} {$group.oss:plural;OS}"}
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
      </div>
      <div style="display: flex; margin-top: 20px">
         <Pagination page:bind="$page.page" pageCount:bind="$page.pageCount"/>
         <div style="flex:1"/>
         <Select value:bind="$page.pageSize" style="width: 50px">
            <option value="5">5</option>
            <option value={10}>10</option>
            <option value="20">20</option>
            <option value="50">50</option>
         </Select>
      </div>
   </cx>
);

import { Checkbox, Grid, HtmlElement, LookupField, Select } from "cx/widgets";
import { ContentResolver, Controller } from "cx/ui";
import { Format } from "cx/util";
import { casual } from "../../casual";

function plural(word, count) {
   if (count > 1) return word + "s";
   return word;
}

class PageController extends Controller {
   init() {
      super.init();

      this.store.set(
         "$page.records",
         Array.from({ length: 10 }).map((v, i) => ({
            id: i + 1,
            person: {
               fullName: casual.full_name,
            },
            details: {
               continent: casual.continent,
            },
            browser: casual.browser,
            os: casual.operating_system,
            visits: casual.integer(1, 100),
         })),
      );

      this.store.set("$page.groupableFields", [
         { id: "details.continent", text: "Continent" },
         { id: "browser", text: "Browser" },
         { id: "os", text: "Operating System" },
      ]);
   }
}

Format.registerFactory("plural", (format, text) => {
   return (value) => plural(text, value);
});

export default (
   <cx>
      <div controller={PageController}>
         <p style="margin-bottom: 10px">
            Group by:
            <LookupField records:bind="$page.grouping" options:bind="$page.groupableFields" multiple={true} />
            <Checkbox value:bind="$page.buffered" text="Buffered" style="margin-left: 20px" />
         </p>
         <ContentResolver
            params={{ buffered: { bind: "$page.buffered" } }}
            onResolve={({ buffered }) => (
               <cx>
                  <Grid
                     buffered={buffered}
                     records:bind="$page.records"
                     style={{ width: "100%" }}
                     groupingParams:bind="$page.grouping"
                     onGetGrouping={(groupingParams) => [
                        { key: {}, showFooter: true },
                        ...(groupingParams || []).map((x) => x.id),
                     ]}
                     columns={[
                        {
                           header: "Name",
                           field: "person.fullName",
                           aggregateValue: 2,
                           sortable: true,
                           aggregate: "sum",
                           // footer: {
                           //    expr: '({$group.$level} > 1 ? {$group.$name:s|TOTAL} + " - " : "") + {$group.person.fullName} + " " + {$group.person.fullName:plural;item}',
                           // },
                        },
                        {
                           header: "Continent",
                           field: "details.continent",
                           sortable: true,
                           aggregate: "distinct",
                           aggregateAlias: "continents",
                           footer: {
                              tpl: "{$group.continents} {$group.continents:plural;continent}",
                           },
                        },
                        {
                           header: "Browser",
                           field: "browser",
                           sortable: true,
                           aggregate: "distinct",
                           aggregateAlias: "browsers",
                           footer: {
                              tpl: "{$group.browsers} {$group.browsers:plural;browser}",
                           },
                        },
                        {
                           header: "OS",
                           field: "os",
                           sortable: true,
                           aggregate: "distinct",
                           aggregateAlias: "oss",
                           footer: { tpl: "{$group.oss} {$group.oss:plural;OS}" },
                        },
                        {
                           header: "Visits",
                           field: "visits",
                           sortable: true,
                           aggregate: "sum",
                           align: "right",
                        },
                     ]}
                     dragSource={{ data: { type: "column", source: "activeColumns" } }}
                     onDropTest={(e, { store }) => {
                        return e.source.data.type == "column";
                     }}
                     onDrop={(e, { store }) => {
                        console.log("DROPPED", e);
                     }}
                  />
               </cx>
            )}
         />
      </div>
   </cx>
);

function move(store, target, e) {
   let selection = e.source.records.map((r) => r.data);

   store.update(e.source.data.source, (array) => array.filter((a, i) => selection.indexOf(a) == -1));

   if (e.source.data.source == target)
      e.source.records.forEach((record) => {
         if (record.index < e.target.insertionIndex) e.target.insertionIndex--;
      });

   store.update(target, insertElement, e.target.insertionIndex, ...selection);
}

function insertElement(array, index, ...args) {
   return [...array.slice(0, index), ...args, ...array.slice(index)];
}

import { KeySelection } from "cx/ui";
import { Grid, PureContainer, Repeater, Switch } from "cx/widgets";
import { casual } from "../casual.js";

export default () => (
   <cx>
      <PureContainer
         controller={{
            init() {
               this.store.init(
                  "$page.records",
                  Array.from({ length: 6 }).map((v, i) => ({
                     id: i + 1,
                     fullName: casual.full_name,
                     continent: casual.continent,
                     browser: casual.browser,
                     os: casual.operating_system,
                     visits: casual.integer(1, 100),
                  })),
               );
            },
         }}
      >
         <div style="margin:5x; height:240px;">
            <h3>Clearable sort and default sort field.</h3>
            <Switch value-bind="$page.showFirstCol" text="Show first column" />
            <Grid
               records-bind="$page.records"
               style={{ height: "200px", width: "1000px", marginTop: "10px" }}
               scrollable
               columnParams-bind="$page.showFirstCol"
               onGetColumns={(showFirstCol) => {
                  let cols = showFirstCol ? [{ header: "Name", field: "fullName", fixed: true }] : [];
                  cols.push(
                     { header: "Continent", field: "continent" },
                     { header: "Browser", field: "browser" },
                     { header: "OS", field: "os" },
                     {
                        header: "Visits",
                        field: "visits",
                        sortable: true,
                        align: "right",
                        resizable: true,
                        primarySortDirection: "DESC",
                     },
                  );

                  return cols;
               }}
               selection={{ type: KeySelection, bind: "$page.selection", multiple: true }}
            />
         </div>
      </PureContainer>
   </cx>
);

import { KeySelection } from "cx/ui";
import { Grid, PureContainer } from "cx/widgets";

export default () => (
   <cx>
      <PureContainer
         controller={{
            init() {
               this.store.init(
                  "$page.records",
                  Array.from({ length: 100 }).map((v, i) => ({
                     id: i + 1,
                     fullName: "Mike",
                     continent: "Europe",
                     browser: "Chrome",
                     os: "Windows",
                     visits: 1,
                  })),
               );
            },
         }}
      >
         <Grid
            records-bind="$page.records"
            style={{ height: "300px" }}
            mod="responsive"
            scrollable
            columns={[
               { header: "Name", field: "fullName", sortable: true },
               { header: "Continent", field: "continent", sortable: true },
               { header: "Browser", field: "browser", sortable: true },
               { header: "OS", field: "os", sortable: true },
               { header: "Visits", field: "visits", sortable: true, align: "right" },
            ]}
            selection={{ type: KeySelection, bind: "$page.selection" }}
            sortField-bind="field"
            sortDirection-bind="sortDirection"
            clearableSort
         />
      </PureContainer>
   </cx>
);

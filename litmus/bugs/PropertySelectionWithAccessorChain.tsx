import { createAccessorModelProxy } from "cx/data";
import { PropertySelection } from "cx/ui";
import { Grid, PureContainer } from "cx/widgets";

interface Model {
   records: any[];
}

var m = createAccessorModelProxy<Model>();

export default (
   <cx>
      <PureContainer
         controller={{
            onInit() {
               this.store.set(m.records, [{ a: 1 }, { a: 2 }]);
            },
         }}
      >
         <Grid
            records={m.records}
            lockColumnWidths
            selection={{ type: PropertySelection, keyField: "a" }}
            columns={[
               {
                  field: "a",
                  header: "A",
               },
            ]}
         />
      </PureContainer>
   </cx>
);

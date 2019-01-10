import { Grid, HtmlElement } from 'cx/widgets';

export const GridSection = <cx>
   <section>
      <h3>Grid</h3>
         <Grid
            columns={[
               { field: "name", header: 'Name', sortable: true },
               { field: "value", header: 'Value', sortable: true }
            ]}
            records={[
               { name: 'X', value: 3 },
               { name: 'Y', value: 2 },
               { name: 'Z', value: 1 }
            ]}
         />
      </section>
</cx>;

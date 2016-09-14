import {Grid} from 'cx/ui/grid/Grid';
import {HtmlElement} from 'cx/ui/HtmlElement';

export const GridSection = <cx>
   <section>
      <h3>Grid</h3>
         <Grid
            columns={[
               { field: "name", header: 'Name', sortable: true }
            ]}
            records={[
               { name: 'X' },
               { name: 'Y' },
               { name: 'Z' }
            ]}
         />
      </section>
</cx>;

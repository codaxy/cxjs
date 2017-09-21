import {Controller} from "cx/ui";
import {Grid, HtmlElement, TextField} from "cx/widgets";
import {casual} from 'shared/data/casual';

class PageController extends Controller {
   init() {
      super.init();

      this.store.set(
         "$page.records",
         Array.from({length: 20}).map((v, i) => {
            var name = casual.full_name;
            return {
               id: i + 1,
               fullName: name,
               phone: casual.phone,
               city: casual.city,
               email: name.toLowerCase().replace(" ", ".") + "@example.com",
               country: casual.country
            };
         })
      );
   }
}

export default <cx>
   <Grid
      controller={PageController}
      records:bind="$page.records"
      style={{height: "532px"}}
      scrollable
      border
      vlines
      cached
      columns={
         [
            {
               header1: {text: "Name", rowSpan: 2},
               field: "fullName",
               sortable: true
            },
            {
               align: "center",
               header1: {text: "Contact", colSpan: 2},
               header2: "Phone",
               style: "white-space: nowrap",
               field: "phone"
            },
            {
               header2: "Email",
               style: "font-size: 10px",
               field: "email",
               sortable: true,
               align: "center"
            },
            {
               header1: {
                  text: "Address",
                  colSpan: 2,
                  align: "center",
                  allowSorting: false
               },
               header2: "City",
               field: "city",
               sortable: true
            },
            {header2: "Country", field: "country", sortable: true}
         ]
      }
      sorters:bind="$page.sorters"
   />
</cx>
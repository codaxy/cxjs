import { Grid, HtmlElement, TextField, Section, cx } from "cx/widgets";
import { Controller, bind, expr, KeySelection } from "cx/ui";
import { Format } from "cx/util";
import casual from '../../../util/casual';

class PageController extends Controller {
  init() {
    super.init();

    this.store.set(
      "$page.records",
      Array.from({ length: 20 }).map((v, i) => {
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

export default (
  <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/grids/complex-header.tsx" target="_blank" putInto="github">Source Code</a>
    <Section
      mod="well"      
      style="height: 100%"
      bodyStyle="display:flex; flex-direction:column"
      controller={PageController}
    >
      <Grid
        scrollable
        controller={PageController}
        records={bind("$page.records")}
        style={{ width: "100%" }}
        border
        vlines
        columns={
          [
            {
              header1: { text: "Name", rowSpan: 2 },
              field: "fullName",
              sortable: true
            },
            {
              align: "center",
              header1: { text: "Contact", colSpan: 2 },
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
            { header2: "Country", field: "country", sortable: true }
          ]
        }
        sorters={bind("$page.sorters")}
      />
    </Section>
  </cx>
);

import { hmr } from '../../hmr.js';
hmr(module);
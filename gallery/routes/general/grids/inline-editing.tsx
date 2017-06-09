import { Grid, HtmlElement, Checkbox, LookupField, TextField, Section, Select, cx } from "cx/widgets";
import { Controller, bind } from "cx/ui";
import { getComparer } from "cx/data";
import casual from '../../../util/casual';

class PageController extends Controller {
  init() {
    super.init();

    this.store.set(
      "$page.records",
      Array
        .from({ length: 20 })
        .map((v, i) => ({
          id: i + 1,
          fullName: casual.full_name,
          phone: casual.phone,
          city: casual.city,
          notified: casual.coin_flip
        }))
    );
  }
};

export default (
  <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/grids/plain.tsx" target="_blank" putInto="github">GitHub</a>
    <Section
      mod="well"
      style="height: 100%"
      bodyStyle="display:flex; flex-direction:column"
      controller={PageController}
    >
      <Grid
        records={bind("$page.records")}
        style={{ width: "100%" }}
        scrollable={true}
        columns={[
          {
            header: "Name",
            field: "fullName",
            sortable: true,
            items: (
              <cx>
                <TextField
                  value={bind("$record.fullName")}
                  style={{ width: "100%" }}
                />
              </cx>
            )
          },
          {
            header: "Phone",
            field: "phone",
            items: (
              <cx>
                <TextField
                  value={bind("$record.phone")}
                  style={{ width: "100%" }}
                />
              </cx>
            )
          },
          {
            header: "City",
            field: "city",
            sortable: true,
            items: (
              <cx>
                <TextField
                  value={bind("$record.city")}
                  style={{ width: "100%" }}
                />
              </cx>
            )
          },
          {
            header: "Notified",
            field: "notified",
            sortable: true,
            align: "center",
            items: (
              <cx>
                <Checkbox value={bind("$record.notified")} />
              </cx>
            )
          }
        ]}
      />
    </Section>
  </cx>
);

import { hmr } from '../../hmr.js';
hmr(module);
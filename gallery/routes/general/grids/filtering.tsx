import { Grid, HtmlElement, Pagination, TextField, Section, Select, cx } from "cx/widgets";
import { Controller, bind } from "cx/ui";
import { getComparer } from "cx/data";
import casual from '../../../util/casual';

class PageController extends Controller {
  init() {
    super.init();

    var dataSet = Array
      .from({ length: 1000 })
      .map((v, i) => ({
        id: i + 1,
        fullName: casual.full_name,
        phone: casual.phone,
        city: casual.city
      }));

    this.store.init("$page.pageSize", 20);
    this.store.init("$page.filter", { name: null, phone: null, city: null });

    //if context changes, go to the first page
    this.addTrigger(
      "page",
      [ "$page.pageSize", "$page.sorters", "$page.filter" ],
      () => {
        this.store.set("$page.page", 1);
      },
      true
    );

    this.addTrigger(
      "pagination",
      ["$page.pageSize", "$page.page", "$page.sorters", "$page.filter"],
      (size, page, sorters, filter) => {
        //simulate server call
        setTimeout(
          () => {
            var filtered = dataSet;
            if (filter) {
              if (filter.name) {
                var checks = filter.name
                  .split(" ")
                  .map(w => new RegExp(w, "gi"));
                filtered = filtered.filter(
                  x => checks.every(ex => x.fullName.match(ex))
                );
              }

              if (filter.phone)
                filtered = filtered.filter(
                  x => x.phone.indexOf(filter.phone) != -1
                );

              if (filter.city)
                filtered = filtered.filter(
                  x => x.city.indexOf(filter.city) != -1
                );
            }
            var compare = getComparer(
              (sorters || []).map(x => ({
                value: { bind: x.field },
                direction: x.direction
              }))
            );
            filtered.sort(compare);
            //simulate database sort
            this.store.set(
              "$page.records",
              filtered.slice((page - 1) * size, page * size)
            );
            this.store.set(
              "$page.pageCount",
              Math.ceil(filtered.length / size)
            );
          },
          100
        );
      },
      true
    );
  }
};


export default (
  <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/grids/filtering.tsx" target="_blank" putInto="github">Source Code</a>
    <Section
      mod="well"
      style="height: 100%; min-width: 640px;"
      bodyStyle="display:flex; flex-direction:column"
      controller={PageController}
    >
      <Grid
        records={bind("$page.records")}
        style={{ width: "100%" }}
        mod="bordered"
        scrollable={true}
        lockColumnWidths
        columns={
          [
            {
              field: "fullName",
              sortable: true,
              header1: "Name",
              header2: {
                allowSorting: false,
                items: (
                  <TextField
                    value={bind("$page.filter.name")}
                    style="width:100%"
                    placeholder="Filter by Name"
                  />
                )
              }
            },
            {
              header1: "Phone",
              header2: {
                items: (
                  <TextField
                    value={bind("$page.filter.phone")}
                    style="width:100%"
                    placeholder="Filter by Phone Number"
                  />
                )
              },
              field: "phone"
            },
            {
              header1: "City",
              header2: {
                allowSorting: false,
                items: (
                  <TextField
                    value={bind("$page.filter.city")}
                    style="width:100%"
                    placeholder="Filter by City"
                  />
                )
              },
              field: "city",
              sortable: true
            }
          ]
        }
        sorters={bind("$page.sorters")}
        remoteSort
      />
      <div style={{ marginTop: "20px" }}>
        <Pagination page={bind("$page.page")} pageCount={bind("$page.pageCount")} />
        <Select value={bind("$page.pageSize")} style={{ float: "right" }}>
          <option value="5">5</option>
          <option value={10}>10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </Select>
      </div>
    </Section>
  </cx>
);

import { hmr } from '../../hmr.js';
hmr(module);
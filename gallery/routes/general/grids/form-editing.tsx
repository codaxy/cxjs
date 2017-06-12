import { Grid, HtmlElement, Button, LookupField, Section, Select, cx, Checkbox, TextField, ValidationGroup, FlexCol } from "cx/widgets";
import { Controller, bind, expr, KeySelection, LabelsLeftLayout } from "cx/ui";
import { Format } from "cx/util";
import casual from '../../../util/casual';

class PageController extends Controller {
  init() {
    super.init();

    this.store.set(
      "$page.records",
      Array
        .from({ length: 5 })
        .map((v, i) => ({
          id: i + 1,
          fullName: casual.full_name,
          phone: casual.phone,
          city: casual.city,
          notified: casual.coin_flip
        }))
    );

    this.addTrigger("$page.form", ["$page.id", "$page.records"], (
      id,
      records
    ) => {
      this.store.set("$page.form", records.find(a => a.id == id));
      this.store.set("$page.add", false);
    });
  }

  newRecord() {
    var records = this.store.get("$page.records");
    this.store.set("$page.add", true);
    this.store.set("$page.form", { fullName: "New Entry" });
  }

  saveRecord() {
    var page = this.store.get("$page"), newRecords;
    if (page.add) {
      var id = page.records.reduce((acc, rec) => Math.max(acc, rec.id), 0) + 1;
      newRecords = [...page.records, Object.assign({ id: id }, page.form)];
      this.store.set("$page.id", id);
    } else newRecords = page.records.map(r => r.id == page.id ? page.form : r);

    this.store.set("$page.records", newRecords);
  }

  removeRecord(id) {
    var newRecords = this.store.get("$page.records").filter(r => r.id != id);
    this.store.set("$page.records", newRecords);
  }
}

export default (
  <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/grids/form-editing.tsx" target="_blank" putInto="github">GitHub</a>
    <Section
      mod="well"      
      controller={PageController}
    >
      <FlexCol spacing align="start">
        <Grid
          records={bind("$page.records")}
          style={{
            "width": "100%",
            "max-height": "400px"
          }}
          scrollable
          selection={{ type: KeySelection, bind: "$page.id", keyField: "id" }}
          columns={[
          { header: "Name", field: "fullName", sortable: true },
          { header: "Phone", field: "phone" },
          { header: "City", field: "city", sortable: true },
          {
            header: "Notified",
            field: "notified",
            sortable: true,
            value: { expr: '{$record.notified} ? "Yes" : "No"' }
          },
          {
            header: "Actions",
            items: (
              <cx>
                <Button
                  type="button"
                  mod="flat-primary"
                  data-id={bind("$record.id")}
                      onClick={(e, { controller, data }) => {
                        controller.removeRecord(data.data.id);
                }}
                >
                Remove
                </Button>
              </cx>
            )
          }
          ]}
        />
        <Button
          type="button"
          onClick={(e, { controller }) => {
            controller.newRecord();
          }}
          style={{  }}
        >
          Add
        </Button>
        <hr style={{ margin: "30px" }} />
        <ValidationGroup visible={expr("{$page.form}")}>
          <h4 text={bind("$page.form.fullName")} />
          <div layout={LabelsLeftLayout}>
            <TextField label="Name" value={bind("$page.form.fullName")} />
            <TextField label="Phone" value={bind("$page.form.phone")} />
            <TextField label="City" value={bind("$page.form.city")} />
            <Checkbox label="Notified" value={bind("$page.form.notified")} />
            <Button
              onClick={(e, { controller }) => {
                controller.saveRecord();
              }}
            >
              Save
            </Button>
          </div>
        </ValidationGroup>
      </FlexCol>
    </Section>
  </cx>
);

import { hmr } from '../../hmr.js';
hmr(module);
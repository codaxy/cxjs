import {
  Button,
  Checkbox,
  Grid,
  HtmlElement,
  LookupField,
  Select,
  TextField,
  ValidationGroup
} from "cx/widgets";
import { Controller, KeySelection, LabelsLeftLayout } from "cx/ui";

import {casual} from 'shared/data/casual';

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

    this.addTrigger("$page.form", [ "$page.id", "$page.records" ], (
      id,
      records
    ) =>
    {
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
      newRecords = [ ...page.records, Object.assign({ id: id }, page.form) ];
      this.store.set("$page.id", id);
    } else newRecords = page.records.map(r => r.id == page.id ? page.form : r);

    this.store.set("$page.records", newRecords);
  }

  removeRecord(id) {
    var newRecords = this.store.get("$page.records").filter(r => r.id != id);
    this.store.set("$page.records", newRecords);
  }
}

export default <cx>
    <div controller={PageController}>
      <Grid
        records:bind="$page.records"
        style={{ height: "450px" }}
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
                  data-id:bind="$record.id"
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
    <Button style="margin-top: 20px;"
      type="button"
      onClick={(e, { controller }) => {
        controller.newRecord();
      }}
      >
      Add
    </Button>
      <hr style={{ margin: "30px" }} />
      <ValidationGroup visible:expr="{$page.form}">
        <h4 text:bind="$page.form.fullName" />
        <div layout={LabelsLeftLayout}>
          <TextField label="Name" value:bind="$page.form.fullName" />
          <TextField label="Phone" value:bind="$page.form.phone" />
          <TextField label="City" value:bind="$page.form.city" />
          <Checkbox label="Notified" value:bind="$page.form.notified" />
          <Button
      onClick={(e, { controller }) => {
        controller.saveRecord();
      }}
                >
      Save
    </Button>
      </div>
      </ValidationGroup>
  </div>
</cx>
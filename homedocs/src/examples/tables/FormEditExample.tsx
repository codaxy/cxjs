import { createModel } from "cx/data";
import {
  Controller,
  expr,
  hasValue,
  KeySelection,
  LabelsLeftLayout,
} from "cx/ui";
import { stopPropagation } from "cx/util";
import { Button, Checkbox, Grid, TextField } from "cx/widgets";

// @model
interface Person {
  id: number;
  fullName: string;
  phone: string;
  city: string;
  notified: boolean;
}

interface PageModel {
  records: Person[];
  selectedId: number | null;
  form: Person | null;
  $record: Person;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.records, [
      {
        id: 1,
        fullName: "Alice Johnson",
        phone: "555-0101",
        city: "New York",
        notified: true,
      },
      {
        id: 2,
        fullName: "Bob Smith",
        phone: "555-0102",
        city: "Los Angeles",
        notified: false,
      },
      {
        id: 3,
        fullName: "Carol White",
        phone: "555-0103",
        city: "Chicago",
        notified: true,
      },
      {
        id: 4,
        fullName: "David Brown",
        phone: "555-0104",
        city: "Houston",
        notified: false,
      },
      {
        id: 5,
        fullName: "Eva Green",
        phone: "555-0105",
        city: "Phoenix",
        notified: true,
      },
    ]);

    this.addTrigger("loadForm", [m.selectedId, m.records], (id, records) => {
      const record = records?.find((r: Person) => r.id === id);
      this.store.set(m.form, record || null);
    });
  }

  saveRecord() {
    const form = this.store.get(m.form);
    if (!form) return;
    this.store.update(m.records, (records) =>
      records.map((r) => (r.id === form.id ? form : r)),
    );
  }

  addRecord() {
    const newRecord: Person = {
      id: Date.now(),
      fullName: "New Entry",
      phone: "",
      city: "",
      notified: false,
    };
    this.store.update(m.records, (records) => [...records, newRecord]);
    this.store.set(m.selectedId, newRecord.id);
  }

  removeRecord(id: number) {
    this.store.update(m.records, (records) =>
      records.filter((r) => r.id !== id),
    );
    if (this.store.get(m.selectedId) === id) {
      this.store.set(m.selectedId, null);
    }
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Grid
      records={m.records}
      selection={{ type: KeySelection, bind: m.selectedId, keyField: "id" }}
      columns={[
        { header: "Name", field: "fullName", sortable: true },
        { header: "Phone", field: "phone" },
        { header: "City", field: "city", sortable: true },
        {
          header: "Notified",
          field: "notified",
          value: expr(m.$record.notified, (n) => (n ? "Yes" : "No")),
        },
        {
          header: "Actions",
          style: "padding: 2px",
          children: (
            <Button
              mod="hollow"
              onMouseDown={stopPropagation}
              onClick={(e, instance) => {
                const id = instance.store.get(m.$record.id);
                instance.getControllerByType(PageController).removeRecord(id);
              }}
            >
              Remove
            </Button>
          ),
        },
      ]}
      recordAlias={m.$record}
    />

    <p class="mt-4">
      <Button
        onClick={(e, instance) =>
          instance.getControllerByType(PageController).addRecord()
        }
      >
        Add
      </Button>
    </p>

    <hr class="my-6" />

    <LabelsLeftLayout visible={hasValue(m.form)}>
      <strong text={m.form.fullName} class="mb-4" />
      <TextField label="Name" value={m.form.fullName} />
      <TextField label="Phone" value={m.form.phone} />
      <TextField label="City" value={m.form.city} />
      <Checkbox label="Notified" value={m.form.notified} />
      <Button
        onClick={(e, instance) =>
          instance.getControllerByType(PageController).saveRecord()
        }
      >
        Save
      </Button>
    </LabelsLeftLayout>
  </div>
);
// @index-end

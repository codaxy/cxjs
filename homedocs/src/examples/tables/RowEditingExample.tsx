import { createModel } from "cx/data";
import { Controller, expr, PureContainer } from "cx/ui";
import { Button, Grid, NumberField, TextField } from "cx/widgets";

// @model
interface Person {
  id: number;
  fullName: string;
  continent: string;
  browser: string;
  visits: number;
  $editing?: Person & { add?: boolean };
  valid?: boolean;
}

interface PageModel {
  records: Person[];
  $record: Person;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.records, [
      { id: 1, fullName: "Alice Johnson", continent: "North America", browser: "Chrome", visits: 45 },
      { id: 2, fullName: "Bob Smith", continent: "Europe", browser: "Firefox", visits: 32 },
      { id: 3, fullName: "Carol White", continent: "Asia", browser: "Safari", visits: 28 },
      { id: 4, fullName: "David Brown", continent: "Europe", browser: "Edge", visits: 51 },
    ]);
  }

  editRow(e: Event, { store }: { store: any }) {
    let record = store.get(m.$record);
    store.set(m.$record.$editing, record);
  }

  saveRow(e: Event, { store }: { store: any }) {
    store.delete(m.$record.$editing);
  }

  cancelRowEditing(e: Event, { store }: { store: any }) {
    let oldRecord = store.get(m.$record.$editing);
    if (oldRecord?.add) {
      store.delete(m.$record);
    } else {
      store.set(m.$record, oldRecord);
    }
  }

  addRow() {
    this.store.update(m.records, (records) => [
      ...records,
      { id: Date.now(), fullName: "", continent: "", browser: "", visits: 0, $editing: { add: true } as any },
    ]);
  }

  deleteRow(e: Event, { store }: { store: any }) {
    store.delete(m.$record);
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController}>
    <Grid
      records={m.records}
      lockColumnWidths
      cached
      row={{
        style: { background: expr(m.$record.$editing, (editing) => (editing ? "lightsteelblue" : undefined)) },
        valid: m.$record.valid,
      }}
      columns={[
        {
          header: "Name",
          field: "fullName",
          sortable: true,
          children: (
            <TextField
              value={m.$record.fullName}
              viewMode={expr(m.$record.$editing, (e) => !e)}
              style="width: 100%"
              autoFocus
              required
            />
          ),
        },
        {
          header: "Continent",
          field: "continent",
          sortable: true,
          children: (
            <TextField
              value={m.$record.continent}
              viewMode={expr(m.$record.$editing, (e) => !e)}
              style="width: 100%"
              required
            />
          ),
        },
        {
          header: "Browser",
          field: "browser",
          sortable: true,
          children: (
            <TextField
              value={m.$record.browser}
              viewMode={expr(m.$record.$editing, (e) => !e)}
              style="width: 100%"
              required
            />
          ),
        },
        {
          header: "Visits",
          field: "visits",
          sortable: true,
          align: "right",
          children: (
            <NumberField
              value={m.$record.visits}
              viewMode={expr(m.$record.$editing, (e) => !e)}
              style="width: 100%"
              inputStyle="text-align: right"
              required
            />
          ),
        },
        {
          header: "Actions",
          style: "width: 180px",
          align: "center",
          pad: false,
          children: (
            <PureContainer>
              <Button mod="hollow" onClick="editRow" visible={expr(m.$record.$editing, (e) => !e)}>
                Edit
              </Button>
              <Button
                mod="hollow"
                onClick="deleteRow"
                visible={expr(m.$record.$editing, (e) => !e)}
                confirm="Are you sure?"
              >
                Delete
              </Button>
              <Button
                mod="primary"
                onClick="saveRow"
                disabled={expr(m.$record.valid, (v) => !v)}
                visible={expr(m.$record.$editing, (e) => !!e)}
              >
                Save
              </Button>
              <Button mod="hollow" onClick="cancelRowEditing" visible={expr(m.$record.$editing, (e) => !!e)}>
                Cancel
              </Button>
            </PureContainer>
          ),
        },
      ]}
      recordAlias={m.$record}
    />
    <p class="mt-4">
      <Button onClick="addRow">Add</Button>
    </p>
  </div>
);
// @index-end

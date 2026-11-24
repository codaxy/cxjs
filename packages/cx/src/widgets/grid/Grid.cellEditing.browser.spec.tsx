import { describe, it } from "vitest";
import { userEvent } from "vitest/browser";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { TextField } from "../form/TextField";
import { NumberField } from "../form/NumberField";
import { Grid, GridConfig } from "./Grid";
import { render, settle, RenderResult } from "../../util/test/render";

interface Person {
   id: number;
   name: string;
   city: string;
   age: number;
}

interface Model {
   records: Person[];
   $record: Person;
}

const m = createModel<Model>();

function setup(gridProps: Partial<GridConfig> = {}) {
   let edits: { field: string; oldName: string; newName: string; newCity: string; index?: number }[] = [];
   let store = new Store({
      data: { records: [1, 2, 3].map((id) => ({ id, name: "Name " + id, city: "City " + id, age: 20 + id })) },
   });
   let widget = (
      <cx>
         <Grid
            records={m.records}
            recordAlias={m.$record}
            keyField="id"
            cellEditable
            onCellEdited={(change, record) =>
               edits.push({
                  field: change.field,
                  oldName: change.oldData.name,
                  newName: change.newData.name,
                  newCity: change.newData.city,
                  index: record.index,
               })
            }
            columns={[
               { header: "Name", field: "name", editor: <TextField value={m.$record.name} required /> },
               { header: "City", field: "city", editor: <TextField value={m.$record.city} /> },
               { header: "Id", field: "id" },
            ]}
            {...gridProps}
         />
      </cx>
   );
   return { store, widget, edits };
}

// the cell cursor is shown on one cell of the cursor row
function cursorCell(screen: RenderResult) {
   let cells = Array.from(screen.container.querySelectorAll("td.cxs-cellected"));
   return cells.map((td) => td.textContent).join(", ");
}

function editor(screen: RenderResult) {
   return screen.container.querySelector("input") as HTMLInputElement | null;
}

// focus changes during editing are handled asynchronously
async function wait() {
   await new Promise((resolve) => setTimeout(resolve, 30));
   await settle();
}

async function click(screen: RenderResult, text: string) {
   await settle(() => userEvent.click(screen.getByText(text, { exact: true }).element()));
   await wait();
}

async function press(keys: string) {
   await settle(() => userEvent.keyboard(keys));
   await wait();
}

describe("Grid cell cursor", () => {
   it("moves to the clicked cell", async () => {
      let { store, widget } = setup();
      let screen = await render(widget, { store });

      await click(screen, "City 2");
      assert.equal(cursorCell(screen), "City 2");
   });

   it("moves between cells with the arrow keys, stopping at the first and the last column", async () => {
      let { store, widget } = setup();
      let screen = await render(widget, { store });

      await click(screen, "City 1");
      await press("{ArrowRight}");
      assert.equal(cursorCell(screen), "1");
      await press("{ArrowRight}");
      assert.equal(cursorCell(screen), "1");

      await press("{ArrowLeft}{ArrowLeft}{ArrowLeft}");
      assert.equal(cursorCell(screen), "Name 1");

      await press("{ArrowDown}");
      assert.equal(cursorCell(screen), "Name 2");
   });

   it("moves to the next cell with tab and to the previous one with shift+tab, wrapping between rows", async () => {
      let { store, widget } = setup();
      let screen = await render(widget, { store });

      await click(screen, "City 1");
      await press("{Tab}");
      assert.equal(cursorCell(screen), "1");
      await press("{Tab}");
      assert.equal(cursorCell(screen), "Name 2");

      await press("{Shift>}{Tab}{/Shift}");
      assert.equal(cursorCell(screen), "1");
   });
});

describe("Grid cell editing", () => {
   it("opens the editor with enter and saves the value with enter", async () => {
      let { store, widget, edits } = setup();
      let screen = await render(widget, { store });

      await click(screen, "Name 2");
      await press("{Enter}");
      assert.equal(editor(screen)?.value, "Name 2");
      assert.equal(document.activeElement, editor(screen));

      await press("{Control>}a{/Control}Bob{Enter}");

      assert.equal(editor(screen), null);
      assert.equal(store.get(m.records)[1].name, "Bob");
      assert.equal(cursorCell(screen), "Bob");
      assert.deepEqual(edits, [{ field: "name", oldName: "Name 2", newName: "Bob", newCity: "City 2", index: 1 }]);
   });

   it("opens the editor on double click", async () => {
      let { store, widget } = setup();
      let screen = await render(widget, { store });

      await settle(() => userEvent.dblClick(screen.getByText("City 3", { exact: true }).element()));
      await wait();

      assert.equal(editor(screen)?.value, "City 3");
   });

   it("saves the value when another row is clicked", async () => {
      let { store, widget, edits } = setup();
      let screen = await render(widget, { store });

      await click(screen, "City 1");
      await press("{Enter}{Control>}a{/Control}Paris");
      await click(screen, "Name 3");

      assert.equal(editor(screen), null);
      assert.equal(store.get(m.records)[0].city, "Paris");
      assert.deepEqual(
         edits.map((e) => [e.field, e.newCity]),
         [["city", "Paris"]],
      );
   });

   it("does not report unchanged values", async () => {
      let { store, widget, edits } = setup();
      let screen = await render(widget, { store });

      await click(screen, "Name 1");
      await press("{Enter}");
      await press("{Enter}");

      assert.equal(editor(screen), null);
      assert.deepEqual(edits, []);
   });

   it("restores the previous value if the edited value is invalid", async () => {
      let { store, widget, edits } = setup();
      let screen = await render(widget, { store });

      await click(screen, "Name 2");
      await press("{Enter}{Control>}a{/Control}{Backspace}");
      assert.equal(editor(screen)?.value, "");
      await press("{Enter}");

      assert.equal(editor(screen), null);
      assert.equal(store.get(m.records)[1].name, "Name 2");
      assert.deepEqual(edits, []);
   });

   it("does not open an editor for columns without one", async () => {
      let { store, widget } = setup();
      let screen = await render(widget, { store });

      await click(screen, "2");
      await press("{Enter}");

      assert.equal(editor(screen), null);
      assert.equal(cursorCell(screen), "2");
   });

   it("does not open the editor if onBeforeCellEdit returns false", async () => {
      let checked: string[] = [];
      let { store, widget } = setup({
         onBeforeCellEdit: (change) => {
            checked.push(`${change.field}:${change.data.id}`);
            return change.data.id != 3;
         },
      });
      let screen = await render(widget, { store });

      await click(screen, "Name 3");
      await press("{Enter}");
      assert.equal(editor(screen), null);

      await click(screen, "Name 1");
      await press("{Enter}");
      assert.equal(editor(screen)?.value, "Name 1");
      assert.deepEqual(checked, ["name:3", "name:1"]);
   });

   it("cancels the edit with escape (#1346)", async () => {
      let { store, widget, edits } = setup();
      let screen = await render(widget, { store });

      await click(screen, "City 2");
      await press("{Enter}{Control>}a{/Control}Rome");
      await press("{Escape}");

      assert.equal(editor(screen), null);
      assert.equal(store.get(m.records)[1].city, "City 2");
      assert.deepEqual(edits, []);
   });

   it("cancels a NumberField edit with escape and saves it with enter (#1346)", async () => {
      // NumberField writes its value on blur, which happens while the edit ends
      let { store, widget, edits } = setup({
         columns: [{ header: "Age", field: "age", editor: <NumberField value={m.$record.age} /> }],
      });
      let screen = await render(widget, { store });

      await click(screen, "22");
      await press("{Enter}{Control>}a{/Control}99");
      await press("{Escape}");

      assert.equal(editor(screen), null);
      assert.equal(store.get(m.records)[1].age, 22);
      assert.deepEqual(edits, []);

      await press("{Enter}{Control>}a{/Control}99{Enter}");

      assert.equal(store.get(m.records)[1].age, 99);
      assert.deepEqual(
         edits.map((e) => e.field),
         ["age"],
      );
   });
});

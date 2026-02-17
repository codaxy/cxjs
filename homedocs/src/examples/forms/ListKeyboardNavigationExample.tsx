import { createModel } from "cx/data";
import { Controller, KeySelection } from "cx/ui";
import { HighlightedSearchText, List, TextField } from "cx/widgets";
import { getSearchQueryPredicate, KeyCode } from "cx/util";

// @model
interface Item {
  id: number;
  text: string;
}

interface Model {
  query: string;
  records: Item[];
  filteredRecords: Item[];
  selection: number;
  $record: Item;
}

const m = createModel<Model>();
// @model-end

// @controller
const countries = [
  "Australia",
  "Austria",
  "Belgium",
  "Brazil",
  "Canada",
  "Denmark",
  "Finland",
  "France",
  "Germany",
  "Italy",
  "Japan",
  "Netherlands",
  "Norway",
  "Spain",
  "Sweden",
  "Switzerland",
  "United Kingdom",
  "United States",
];

class PageController extends Controller {
  listKeyDownPipe?: ((e: React.KeyboardEvent) => void) | null;

  onInit() {
    this.store.set(
      m.records,
      countries.map((text, i) => ({ id: i + 1, text })),
    );

    this.addComputable(
      m.filteredRecords,
      [m.records, m.query],
      (records, query) => {
        if (!query) return records;
        let predicate = getSearchQueryPredicate(query);
        return records.filter((r) => predicate(r.text));
      },
    );
  }

  pipeKeyDown(cb: ((e: React.KeyboardEvent) => void) | null) {
    this.listKeyDownPipe = cb;
  }

  onKeyDown(e: React.KeyboardEvent) {
    if (
      e.keyCode === KeyCode.up ||
      e.keyCode === KeyCode.down ||
      e.keyCode === KeyCode.enter
    ) {
      this.listKeyDownPipe?.(e);
      e.preventDefault();
    }
  }
}
// @controller-end

// @index
export default (
  <div
    controller={PageController}
    class="flex flex-col gap-2"
    style="width: 300px"
  >
    <TextField
      value={m.query}
      placeholder="Search..."
      onKeyDown={(e, instance) =>
        instance.getControllerByType(PageController).onKeyDown(e)
      }
      inputAttrs={{ autoComplete: "off" }}
      autoFocus
    />
    <List
      records={m.filteredRecords}
      selection={{ type: KeySelection, bind: m.selection, keyField: "id" }}
      mod="bordered"
      style="height: 200px; overflow-y: auto"
      emptyText="No items found."
      recordAlias={m.$record}
      pipeKeyDown={(cb, instance) =>
        instance.getControllerByType(PageController).pipeKeyDown(cb)
      }
      focused
      scrollSelectionIntoView
    >
      <HighlightedSearchText text={m.$record.text} query={m.query} />
    </List>
  </div>
);
// @index-end

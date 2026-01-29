import { createModel, insertElement } from "cx/data";
import { Controller, computable } from "cx/ui";
import {
  Button,
  DragSource,
  DropZone,
  Grid,
  GridInstance,
  Repeater,
} from "cx/widgets";

// @model
interface Person {
  id: number;
  fullName: string;
  continent: string;
  browser: string;
  os: string;
  visits: number;
}

interface Column {
  key: string;
  header: string;
  field: string;
  sortable?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  align?: string;
}

interface PageModel {
  records: Person[];
  columnOrder: string[];
  unusedColumns: string[];
  $record: Column;
}

const m = createModel<PageModel>();
// @model-end

// @columns
const allColumns: Column[] = [
  { key: "fullName", header: "Name", field: "fullName", sortable: true, resizable: true, draggable: true },
  { key: "continent", header: "Continent", field: "continent", sortable: true, resizable: true, draggable: true },
  { key: "browser", header: "Browser", field: "browser", sortable: true, resizable: true, draggable: true },
  { key: "os", header: "OS", field: "os", sortable: true, resizable: true, draggable: true },
  { key: "visits", header: "Visits", field: "visits", sortable: true, resizable: true, align: "right", draggable: true },
];
// @columns-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.records, [
      {
        id: 1,
        fullName: "Alice Johnson",
        continent: "Europe",
        browser: "Chrome",
        os: "Windows",
        visits: 45,
      },
      {
        id: 2,
        fullName: "Bob Smith",
        continent: "Asia",
        browser: "Firefox",
        os: "macOS",
        visits: 23,
      },
      {
        id: 3,
        fullName: "Carol White",
        continent: "North America",
        browser: "Safari",
        os: "macOS",
        visits: 67,
      },
      {
        id: 4,
        fullName: "David Brown",
        continent: "Europe",
        browser: "Chrome",
        os: "Linux",
        visits: 12,
      },
      {
        id: 5,
        fullName: "Eva Green",
        continent: "Asia",
        browser: "Edge",
        os: "Windows",
        visits: 89,
      },
    ]);

    this.store.init(
      m.columnOrder,
      allColumns.map((c) => c.key),
    );
    this.store.init(m.unusedColumns, []);
  }

  onResetColumns() {
    this.store.set(
      m.columnOrder,
      allColumns.map((c) => c.key),
    );
    this.store.set(m.unusedColumns, []);
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <div class="flex mb-2">
      <Repeater
        records={computable(m.unusedColumns, (columns) =>
          columns.map((key) => allColumns.find((c) => c.key === key)),
        )}
      >
        <DragSource
          class="bg-gray-100 border border-gray-300 px-2 py-1 text-sm mr-1 cursor-pointer"
          data={{ type: "unused-column", key: m.$record.key }}
        >
          <span text={m.$record.header} />
        </DragSource>
      </Repeater>

      <DropZone
        class="border border-dashed border-gray-300 flex-grow px-2 py-1 text-sm transition-colors"
        onDropTest={(e) => e?.source?.type === "grid-column"}
        overClass="bg-yellow-100"
        onDrop={(e, { store }) => {
          let { key } = e.source.column;
          store.update(m.columnOrder, (order) =>
            order.filter((c) => c !== key),
          );
          store.update(m.unusedColumns, (cols) => [...cols, key]);
        }}
      >
        Drag column here to remove
      </DropZone>
    </div>

    <Grid
      records={m.records}
      mod="fixed-layout"
      scrollable
      border
      style="height: 250px; margin-bottom: 10px"
      lockColumnWidths
      columnParams={m.columnOrder}
      onGetColumns={(columnOrder) =>
        columnOrder.map((key: string) => allColumns.find((c) => c.key === key))
      }
      onColumnDropTest={(e, instance) =>
        (e.source?.type === "grid-column" &&
          e.source?.gridInstance === instance) ||
        e.source?.data?.type === "unused-column"
      }
      onColumnDrop={(e, { store }) => {
        let key =
          e.source.type === "grid-column"
            ? e.source.column.key
            : e.source.data.key;
        let { index } = e.target;
        let columnOrder = store.get(m.columnOrder);
        let at = columnOrder.indexOf(key);
        let result = columnOrder.filter((c) => c !== key);
        if (at >= 0 && at < index) index--;
        result = insertElement(result, index, key);
        store.set(m.columnOrder, result);
        store.update(m.unusedColumns, (unused) =>
          unused.filter((c) => c !== key),
        );
      }}
    />

    <Button onClick="onResetColumns">Reset Columns</Button>
  </div>
);
// @index-end

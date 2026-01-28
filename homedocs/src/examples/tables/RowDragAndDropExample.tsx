import { createModel, insertElement } from "cx/data";
import { Controller } from "cx/ui";
import { DragHandle, Grid } from "cx/widgets";

// @model
interface Person {
  id: number;
  fullName: string;
  city: string;
}

interface PageModel {
  left: Person[];
  right: Person[];
  $record: Person;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.left, [
      { id: 1, fullName: "Alice Johnson", city: "New York" },
      { id: 2, fullName: "Bob Smith", city: "Los Angeles" },
      { id: 3, fullName: "Carol White", city: "Chicago" },
    ]);

    this.store.set(m.right, [
      { id: 4, fullName: "David Brown", city: "Houston" },
      { id: 5, fullName: "Eva Green", city: "Phoenix" },
    ]);
  }

  onDrop(e: any, targetPath: string) {
    const draggedRecords = e.source.records.map((r: any) => r.data);
    const sourcePath = e.source.data.source;
    let insertionIndex = e.target.insertionIndex;

    // Remove from source
    this.store.update(sourcePath, (records: Person[]) =>
      records.filter((r) => !draggedRecords.includes(r)),
    );

    // Adjust insertion index if moving within the same grid
    if (sourcePath === targetPath) {
      draggedRecords.forEach((record: any) => {
        const originalIndex = e.source.records.find(
          (r: any) => r.data === record,
        )?.index;
        if (originalIndex < insertionIndex) {
          insertionIndex--;
        }
      });
    }

    // Insert into target
    this.store.update(targetPath, (records: Person[]) => {
      let result = records;
      draggedRecords.forEach((record: any, i: number) => {
        result = insertElement(result, insertionIndex + i, record);
      });
      return result;
    });
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController} class="flex gap-4">
    <div class="flex-1">
      <h3 class="text-sm font-semibold mb-2">Team A</h3>
      <Grid
        records={m.left}
        style="width: 100%"
        border
        columns={[
          {
            header: "",
            align: "center",
            pad: false,
            items: (
              <DragHandle class="cursor-move text-gray-400 hover:text-gray-600 px-1">
                ⋮⋮
              </DragHandle>
            ),
          },
          { header: "Name", field: "fullName" },
          { header: "City", field: "city" },
        ]}
        dragSource={{ data: { type: "person", source: "left" } }}
        onDropTest={(e) => e.source?.data?.type === "person"}
        onDrop={(e, instance) =>
          instance.getControllerByType(PageController).onDrop(e, "left")
        }
      />
    </div>

    <div class="flex-1">
      <h3 class="text-sm font-semibold mb-2">Team B</h3>
      <Grid
        records={m.right}
        style="width: 100%"
        border
        columns={[
          { header: "Name", field: "fullName" },
          { header: "City", field: "city" },
        ]}
        row={{ style: { cursor: "move" } }}
        dragSource={{ data: { type: "person", source: "right" } }}
        dropZone={{ mode: "insertion" }}
        onDropTest={(e) => e.source?.data?.type === "person"}
        onDrop={(e, instance) =>
          instance.getControllerByType(PageController).onDrop(e, "right")
        }
      />
    </div>
  </div>
);
// @index-end

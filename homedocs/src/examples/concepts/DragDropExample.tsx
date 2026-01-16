import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { DragSource, DropZone, Repeater } from "cx/widgets";

// @model
interface Item {
  id: number;
  text: string;
}

interface PageModel {
  items: Item[];
  $record: Item;
  $index: number;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.items, [
      { id: 1, text: "Apple" },
      { id: 2, text: "Banana" },
      { id: 3, text: "Cherry" },
      { id: 4, text: "Date" },
      { id: 5, text: "Elderberry" },
    ]);
  }
}
// @controller-end

// @index
export default () => (
  <div class="flex flex-col gap-2" controller={PageController}>
    <Repeater
      records={m.items}
      recordAlias={m.$record}
      indexAlias={m.$index}
      keyField="id"
    >
      <DropZone
        mod="block"
        onDrop={({ source }, { store }) => {
          let targetIndex = store.get(m.$index);
          let items = store
            .get(m.items)
            .filter((item) => item.id !== source.data.id);
          store.set(m.items, [
            ...items.slice(0, targetIndex),
            source.data,
            ...items.slice(targetIndex),
          ]);
        }}
        matchWidth
        matchHeight
        matchMargin
        inflate={50}
      />
      <DragSource
        data={m.$record}
        //hideOnDrag
        class="p-2 border rounded bg-white cursor-move hover:bg-gray-50"
      >
        <span text={m.$record.text} />
      </DragSource>
    </Repeater>
    <DropZone
      mod="block"
      matchWidth
      matchHeight
      matchMargin
      onDrop={({ source }, { store }) => {
        let items = store
          .get(m.items)
          .filter((item) => item.id !== source.data.id);
        store.set(m.items, [...items, source.data]);
      }}
      inflate={50}
    >
      <div class="h-2" />
    </DropZone>
  </div>
);
// @index-end

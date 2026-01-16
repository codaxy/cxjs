import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { DragHandle, DragSource, DropZone, Repeater } from "cx/widgets";

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
      { id: 1, text: "Select this text without triggering drag" },
      { id: 2, text: "Use the handle on the left to drag" },
      { id: 3, text: "Content remains interactive" },
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
      <DragSource data={m.$record} hideOnDrag handled>
        <div class="flex items-center gap-2 p-2 border rounded bg-white">
          <DragHandle>
            <div class="cursor-move text-gray-400 hover:text-gray-600 px-1">
              ⋮⋮
            </div>
          </DragHandle>
          <span text={m.$record.text} />
        </div>
      </DragSource>
    </Repeater>
    <DropZone
      mod="block"
      onDrop={({ source }, { store }) => {
        let items = store
          .get(m.items)
          .filter((item) => item.id !== source.data.id);
        store.set(m.items, [...items, source.data]);
      }}
      matchWidth
      matchHeight
      matchMargin
      inflate={50}
    >
      <div class="h-2" />
    </DropZone>
  </div>
);
// @index-end

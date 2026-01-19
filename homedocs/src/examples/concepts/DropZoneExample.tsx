import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { DragSource, DropZone, Repeater } from "cx/widgets";

// @model
interface Item {
  name: string;
  type: "fruit" | "vegetable";
}

interface PageModel {
  fruits: Item[];
  vegetables: Item[];
  anything: Item[];
  $fruit: Item;
  $vegetable: Item;
  $item: Item;
}

const m = createModel<PageModel>();

function removeItem(store: any, item: Item) {
  store.set(
    m.fruits,
    store.get(m.fruits).filter((x: Item) => x.name !== item.name),
  );
  store.set(
    m.vegetables,
    store.get(m.vegetables).filter((x: Item) => x.name !== item.name),
  );
  store.set(
    m.anything,
    store.get(m.anything).filter((x: Item) => x.name !== item.name),
  );
}
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.fruits, [
      { name: "Apple", type: "fruit" },
      { name: "Banana", type: "fruit" },
    ]);
    this.store.set(m.vegetables, [
      { name: "Carrot", type: "vegetable" },
      { name: "Broccoli", type: "vegetable" },
    ]);
    this.store.set(m.anything, []);
  }
}
// @controller-end

// @index
export default () => (
  <div class="flex gap-4" controller={PageController}>
    <DropZone
      class="flex flex-col gap-2 p-4 border rounded min-w-32 min-h-32 bg-gray-50"
      overClass="!bg-green-50 !border-green-300"
      onDropTest={({ source }) => source.data.type === "fruit"}
      onDrop={({ source }, { store }) => {
        removeItem(store, source.data);
        store.set(m.fruits, [...store.get(m.fruits), source.data]);
      }}
    >
      <div class="text-sm font-medium mb-2">Fruits</div>
      <div class="flex flex-col gap-1 min-h-16">
        <Repeater records={m.fruits} recordAlias={m.$fruit} keyField="name">
          <DragSource data={m.$fruit}>
            <div class="p-2 border rounded bg-white cursor-move">
              <span text={m.$fruit.name} />
            </div>
          </DragSource>
        </Repeater>
      </div>
    </DropZone>

    <DropZone
      class="flex flex-col gap-2 p-4 border rounded min-w-32 min-h-32 bg-gray-50"
      overClass="!bg-orange-50 !border-orange-300"
      onDropTest={({ source }) => source.data.type === "vegetable"}
      onDrop={({ source }, { store }) => {
        removeItem(store, source.data);
        store.set(m.vegetables, [...store.get(m.vegetables), source.data]);
      }}
    >
      <div class="text-sm font-medium mb-2">Vegetables</div>
      <div class="flex flex-col gap-1 min-h-16">
        <Repeater
          records={m.vegetables}
          recordAlias={m.$vegetable}
          keyField="name"
        >
          <DragSource data={m.$vegetable}>
            <div class="p-2 border rounded bg-white cursor-move">
              <span text={m.$vegetable.name} />
            </div>
          </DragSource>
        </Repeater>
      </div>
    </DropZone>

    <DropZone
      class="flex flex-col gap-2 p-4 border rounded min-w-32 min-h-32 bg-gray-50"
      overClass="!bg-blue-50 !border-blue-300"
      onDrop={({ source }, { store }) => {
        removeItem(store, source.data);
        store.set(m.anything, [...store.get(m.anything), source.data]);
      }}
    >
      <div class="text-sm font-medium mb-2">Anything</div>
      <div class="flex flex-col gap-1 min-h-16">
        <Repeater records={m.anything} recordAlias={m.$item} keyField="name">
          <DragSource data={m.$item}>
            <div class="p-2 border rounded bg-white cursor-move">
              <span text={m.$item.name} />
            </div>
          </DragSource>
        </Repeater>
      </div>
    </DropZone>
  </div>
);
// @index-end

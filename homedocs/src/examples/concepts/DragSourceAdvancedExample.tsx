import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { DragHandle, DragSource, DropZone, Repeater } from "cx/widgets";

// @model
interface Widget {
  id: number;
  title: string;
  color: string;
}

interface PageModel {
  widgets: Widget[];
  $widget: Widget;
  $index: number;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.widgets, [
      { id: 1, title: "Sales", color: "bg-blue-100" },
      { id: 2, title: "Orders", color: "bg-green-100" },
      { id: 3, title: "Users", color: "bg-purple-100" },
    ]);
  }
}
// @controller-end

// @index
export default () => (
  <div class="flex flex-col gap-2" controller={PageController}>
    <Repeater
      records={m.widgets}
      recordAlias={m.$widget}
      indexAlias={m.$index}
      keyField="id"
    >
      <DropZone
        mod="block"
        onDrop={({ source }, { store }) => {
          let targetIndex = store.get(m.$index);
          let widgets = store
            .get(m.widgets)
            .filter((w) => w.id !== source.data.id);
          store.set(m.widgets, [
            ...widgets.slice(0, targetIndex),
            source.data,
            ...widgets.slice(targetIndex),
          ]);
        }}
        matchWidth
        matchHeight
        matchMargin
        inflate={100}
      />
      <DragSource
        data={m.$widget}
        handled
        clone={
          <div
            class="p-2 border rounded bg-white shadow-lg opacity-90"
            text={m.$widget.title}
          />
        }
      >
        <div class={["p-4 border rounded", m.$widget.color]}>
          <div class="flex items-center gap-2 mb-2">
            <DragHandle>
              <div class="cursor-move text-gray-400 hover:text-gray-600">
                ⋮⋮
              </div>
            </DragHandle>
            <div class="font-medium" text={m.$widget.title} />
          </div>
          <div class="text-2xl font-bold">1,234</div>
          <div class="text-sm text-gray-500">Sample metric</div>
        </div>
      </DragSource>
    </Repeater>
    <DropZone
      mod="block"
      matchWidth
      matchHeight
      matchMargin
      onDrop={({ source }, { store }) => {
        let widgets = store
          .get(m.widgets)
          .filter((w) => w.id !== source.data.id);
        store.set(m.widgets, [...widgets, source.data]);
      }}
      inflate={100}
    >
      <div class="h-2" />
    </DropZone>
  </div>
);
// @index-end

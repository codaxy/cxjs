import { Svg, Rectangle } from "cx/svg";
import { createModel } from "cx/data";
import { Repeater, Controller, HoverSync, HoverSyncElement } from "cx/ui";

// @model
interface DataItem {
  id: number;
  name: string;
  color: string;
  anchors: string;
}

interface Model {
  items: DataItem[];
  $record: DataItem;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.items, [
      { id: 0, name: "Red", color: "#ef4444", anchors: "0 0.5 0.5 0" },
      { id: 1, name: "Green", color: "#22c55e", anchors: "0 1 0.5 0.5" },
      { id: 2, name: "Blue", color: "#3b82f6", anchors: "0.5 0.5 1 0" },
      { id: 3, name: "Yellow", color: "#eab308", anchors: "0.5 1 1 0.5" },
    ]);
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <HoverSync>
      <div class="flex gap-4 items-start">
        <div class="flex flex-col gap-2">
          <Repeater records={m.items} recordAlias={m.$record}>
            <HoverSyncElement
              hoverId={m.$record.id}
              class="px-4 py-2 border rounded cursor-pointer transition-all"
              style="background: white; border-color: #e5e7eb"
              hoverStyle="background: #f3f4f6; border-color: #9ca3af"
              hoverClass="shadow-md"
            >
              <span text={m.$record.name} />
            </HoverSyncElement>
          </Repeater>
        </div>

        <Svg style="width: 200px; height: 200px">
          <Repeater records={m.items} recordAlias={m.$record}>
            <HoverSyncElement
              hoverId={m.$record.id}
              style="--rect-opacity: 0.6"
              hoverStyle="--rect-opacity: 1"
            >
              <Rectangle
                anchors={m.$record.anchors}
                margin={3}
                style={{
                  fill: m.$record.color,
                  opacity: "var(--rect-opacity)",
                  transition: "opacity 0.15s",
                }}
              />
            </HoverSyncElement>
          </Repeater>
        </Svg>
      </div>
    </HoverSync>
  </div>
);
// @index-end

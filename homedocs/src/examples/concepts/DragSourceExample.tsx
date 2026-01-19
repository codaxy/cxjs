import { DragSource, DropZone } from "cx/widgets";

// @index
export default () => (
  <div class="flex items-center gap-8">
    <DragSource data={{ text: "Drag me!" }}>
      <div class="p-4 border-2 border-dashed rounded bg-blue-50 cursor-move hover:bg-blue-100">
        Drag me!
      </div>
    </DragSource>

    <DragSource data={{ text: "Or me!" }}>
      <div class="p-4 border-2 border-dashed rounded bg-blue-50 cursor-move hover:bg-blue-100">
        Or me!
      </div>
    </DragSource>

    <DropZone
      onDrop={({ source }) => {
        alert(`Dropped: ${source.data.text}`);
      }}
    >
      <div class="p-4 border border-gray-200 rounded bg-green-50 min-w-32 text-center">
        Drop here
      </div>
    </DropZone>
  </div>
);
// @index-end

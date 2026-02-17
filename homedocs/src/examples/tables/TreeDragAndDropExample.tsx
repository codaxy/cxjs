import { createModel, updateTree } from "cx/data";
import { Controller, TreeAdapter } from "cx/ui";
import { Grid, GridRowDragEvent, TreeNode } from "cx/widgets";

// @model
interface FileNode {
  id: number;
  name: string;
  $leaf: boolean;
  $expanded?: boolean;
  $children?: FileNode[];
  $level?: number;
  $loading?: boolean;
}

interface PageModel {
  files: FileNode[];
  $file: FileNode;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller {
  nextId = 100;

  onInit() {
    this.store.set(m.files, [
      { id: 1, name: "Documents", $leaf: false, $expanded: true },
      { id: 2, name: "Pictures", $leaf: false, $expanded: true },
      { id: 3, name: "Music", $leaf: false, $expanded: true },
      { id: 4, name: "report.pdf", $leaf: true },
      { id: 5, name: "notes.txt", $leaf: true },
      { id: 6, name: "data.xlsx", $leaf: true },
    ]);
  }

  onRowDrop(e: GridRowDragEvent<FileNode>) {
    const sourceNode = e.source.record.data;
    const targetNode = e.target.record.data;

    this.store.update(m.files, (files) =>
      updateTree(
        files,
        (node) => ({
          ...node,
          $children: [
            ...(node.$children || []),
            { ...sourceNode, id: ++this.nextId },
          ],
        }),
        (node) => node.id === targetNode.id,
        "$children",
        (node) => node.id === sourceNode.id,
      ),
    );
  }
}
// @controller-end

// @index
export default (
  <Grid
    controller={PageController}
    records={m.files}
    recordAlias={m.$file}
    border
    dataAdapter={{ type: TreeAdapter }}
    keyField="id"
    columns={[
      {
        header: "Name",
        field: "name",
        items: (
          <TreeNode
            expanded={m.$file.$expanded}
            leaf={m.$file.$leaf}
            level={m.$file.$level}
            loading={m.$file.$loading}
            text={m.$file.name}
          />
        ),
      },
    ]}
    dragSource={{ mode: "copy", data: { type: "file" } }}
    onRowDropTest={(e) => e.source?.data?.type === "file"}
    onRowDragOver={(e) => {
      const target = e.target?.record?.data;
      const source = e.source?.record?.data;
      // Only allow dropping onto folders (not leaves) and not onto itself
      if (target?.$leaf || source?.id === target?.id) return false;
    }}
    onRowDrop={(e, instance) =>
      instance.getControllerByType(PageController).onRowDrop(e)
    }
  />
);
// @index-end

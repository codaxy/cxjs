import {
  createModel,
  findTreeNode,
  removeTreeNodes,
  updateTree,
} from "cx/data";
import { Controller, expr, KeySelection, TreeAdapter } from "cx/ui";
import { Button, Grid, TreeNode } from "cx/widgets";

import "../../icons/lucide";

// @model
interface TreeRecord {
  id: number;
  name: string;
  $leaf?: boolean;
  $expanded?: boolean;
  $level?: number;
  $children?: TreeRecord[];
}

interface PageModel {
  data: TreeRecord[];
  selection: number;
  $record: TreeRecord;
}

const m = createModel<PageModel>();
// @model-end

// @controller
let idSeq = 100;

class PageController extends Controller {
  onInit() {
    this.store.set(m.data, [
      {
        id: 1,
        name: "Documents",
        $leaf: false,
        $expanded: true,
        $children: [
          { id: 2, name: "report.pdf", $leaf: true },
          { id: 3, name: "notes.txt", $leaf: true },
        ],
      },
      {
        id: 4,
        name: "Images",
        $leaf: false,
        $children: [
          { id: 5, name: "photo.jpg", $leaf: true },
          { id: 6, name: "logo.png", $leaf: true },
        ],
      },
    ]);
  }

  expandAll() {
    this.store.update(
      m.data,
      (data) =>
        updateTree(
          data,
          (node) => ({ ...node, $expanded: true }),
          (node) => !node.$leaf,
          "$children",
        ) || data,
    );
  }

  collapseAll() {
    this.store.update(
      m.data,
      (data) =>
        updateTree(
          data,
          (node) => ({ ...node, $expanded: false }),
          (node) => !node.$leaf,
          "$children",
        ) || data,
    );
  }

  addFolder() {
    this.addNode(false);
  }

  addFile() {
    this.addNode(true);
  }

  addNode(leaf: boolean) {
    const selectedId = this.store.get(m.selection);
    const data = this.store.get(m.data);

    const newNode: TreeRecord = leaf
      ? { id: ++idSeq, name: `file-${idSeq}.txt`, $leaf: true }
      : { id: ++idSeq, name: `Folder ${idSeq}`, $leaf: false, $children: [] };

    if (!selectedId) {
      // Add to root
      this.store.update(m.data, (data) => [...data, newNode]);
    } else {
      // Check if selected node is a folder
      const selectedNode = findTreeNode(
        data,
        (n) => n.id === selectedId,
        "$children",
      );
      if (selectedNode && selectedNode.$leaf) {
        alert("Cannot add to a file. Please select a folder.");
        return;
      }
      // Add to selected folder
      this.store.update(
        m.data,
        (data) =>
          updateTree(
            data,
            (node) => ({
              ...node,
              $expanded: true,
              $children: [...(node.$children || []), newNode],
            }),
            (node) => node.id === selectedId,
            "$children",
          ) || data,
      );
    }
  }

  deleteSelected() {
    const selectedId = this.store.get(m.selection);
    if (!selectedId) return;

    this.store.update(
      m.data,
      (data) =>
        removeTreeNodes(data, (node) => node.id === selectedId, "$children") ||
        data,
    );
    this.store.delete(m.selection);
  }

  renameSelected() {
    const selectedId = this.store.get(m.selection);
    if (!selectedId) return;

    const newName = prompt("Enter new name:");
    if (!newName) return;

    this.store.update(
      m.data,
      (data) =>
        updateTree(
          data,
          (node) => ({ ...node, name: newName }),
          (node) => node.id === selectedId,
          "$children",
        ) || data,
    );
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <div style="margin-bottom: 16px; display: flex; gap: 8px; flex-wrap: wrap">
      <Button
        onClick={(e, instance) =>
          instance.getControllerByType(PageController).addFolder()
        }
        text="Add Folder"
        icon="folder"
      />
      <Button
        onClick={(e, instance) =>
          instance.getControllerByType(PageController).addFile()
        }
        text="Add File"
        icon="file"
      />
      <Button
        onClick={(e, instance) =>
          instance.getControllerByType(PageController).renameSelected()
        }
        text="Rename"
        icon="pencil"
        disabled={expr(m.selection, (s) => !s)}
      />
      <Button
        onClick={(e, instance) =>
          instance.getControllerByType(PageController).deleteSelected()
        }
        text="Delete"
        icon="trash"
        disabled={expr(m.selection, (s) => !s)}
      />
      <Button
        onClick={(e, instance) =>
          instance.getControllerByType(PageController).expandAll()
        }
        text="Expand All"
      />
      <Button
        onClick={(e, instance) =>
          instance.getControllerByType(PageController).collapseAll()
        }
        text="Collapse All"
      />
    </div>
    <Grid
      records={m.data}
      mod="tree"
      style="height: 300px"
      scrollable
      keyField="id"
      dataAdapter={{ type: TreeAdapter }}
      selection={{ type: KeySelection, bind: m.selection, keyField: "id" }}
      columns={[
        {
          header: "Name",
          field: "name",
          children: (
            <TreeNode
              expanded={m.$record.$expanded}
              leaf={m.$record.$leaf}
              level={m.$record.$level}
              text={m.$record.name}
            />
          ),
        },
      ]}
    />
  </div>
);
// @index-end

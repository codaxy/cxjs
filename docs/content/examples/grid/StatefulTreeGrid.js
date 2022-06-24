import { removeTreeNodes, updateTree } from "cx/data";
import { bind, Controller, expr, KeySelection, TreeAdapter } from "cx/ui";
import {
  Button,
  Content,
  FlexRow,
  Grid,
  Menu,
  MenuItem,
  openContextMenu,
  Tab,
  TreeNode,
} from "cx/widgets";
import { CodeSnippet } from "../../../components/CodeSnippet";
import { CodeSplit } from "../../../components/CodeSplit";
import { Md } from "../../../components/Md";
import { casual } from "../data/casual";

let idSeq = 0;
let records = generateRecords();
console.log(records);
class PageController extends Controller {
  onInit() {
    this.load();
    this.store.init("$page.treeExpanded", false);
  }

  async load() {
    this.store.set("loading", true);
    // fake loading
    await waitFor(500);

    this.store.set("loading", false);
    let newRecords = structuredClone(records);

    this.store.set("$page.data", newRecords);
  }

  async reset() {
    this.store.delete("$page.data");
    records = generateRecords();
    this.load();
  }

  deleteRecordFromContextMenu(e, { store }) {
    let recordId = store.get("$record.id");
    this.doDelete(recordId);
  }

  deleteRecord() {
    let selection = this.store.get("$page.selection");
    this.doDelete(selection);
  }

  doDelete(id) {
    records = removeTreeNodes(records, (r) => r.id === id);
    this.load();
  }

  expandCollapseTree() {
    this.store.toggle("$page.treeExpanded");
    let expanded = this.store.get("$page.treeExpanded");

    records = updateTree(
      records,
      (node) => ({
        ...node,
        $expanded: expanded,
      }),
      (node) => !node.leaf,
      "$children"
    );

    this.load();
  }

  addFolder() {
    this.addEntry(false);
  }

  addLeaf() {
    this.addEntry(true);
  }

  addEntry(leaf) {
    const newEntry = getNewEntry(leaf);
    const selection = this.store.get("$page.selection");
    const record = this.store.get("$record");
    
    if (selection && record.$leaf) {
      return this.insertEntry(leaf, selection);
    }

    records = [...records, newEntry];
    this.load();
  }

  addEntryFromContextMenu(e, { store }, leaf) {
    const recordId = store.get("$record.id");
    this.insertEntry(leaf, recordId);

    this.load();
  }

  insertEntry(leaf, targetId) {
   const newEntry = getNewEntry(leaf);

   records = updateTree(
      records,
      (node) => ({
        ...node,
        $expanded: true,
        $children:
          node?.$children?.length > 0
            ? [...node.$children, newEntry]
            : [newEntry],
      }),
      (node) => node.id == targetId,
      "$children"
    );

    this.load();
  }
}

export const StatefulTreeGrid = (
  <cx>
    <Md controller={PageController}>
      <CodeSplit>
        # Stateful Tree Grid The following example shows how to make a tree out
        of grid control.
        <FlexRow spacing style="margin-bottom: 10px">
          <Button onClick="load" text="Reload" mod="primary" />
          <Button onClick="reset" mod="primary" text="Reset" />
          <Button
            onClick="expandCollapseTree"
            text="Expand All"
            text-expr="{$page.treeExpanded} ? 'Collapse All' : 'Expand All'"
          />
          <Button onClick="addFolder" text="Add Folder" />
          <Button onClick="addLeaf" text="Add File" />
          <Button
            onClick="deleteRecord"
            text="Delete"
            mod="danger"
            disabled-expr="!{$page.selection}"
          />
        </FlexRow>
        <Grid
          // buffered
          records-bind="$page.data"
          mod="tree"
          style={{
            width: "100%",
            opacity: expr("{loading} ? 0.4 : 1"),
            height: 500,
          }}
          scrollable={true}
          dataAdapter={{
            type: TreeAdapter,
            restoreExpandedNodesOnLoad: true,
            expandedNodesIdsMap: bind("$page.expandedNodesIds"),
          }}
          selection={{ type: KeySelection, bind: "$page.selection" }}
          columns={[
            {
              header: "Name",
              field: "fullName",
              sortable: true,
              items: (
                <cx>
                  <TreeNode
                    expanded-bind="$record.$expanded"
                    leaf-bind="$record.$leaf"
                    level-bind="$record.$level"
                    loading-bind="$record.$loading"
                    text-bind="$record.fullName"
                    icon-bind="$record.icon"
                  />
                </cx>
              ),
            },
            { header: "Phone", field: "phone" },
            { header: "City", field: "city", sortable: true },
            {
              header: "Notified",
              field: "notified",
              sortable: true,
              value: { expr: '{$record.notified} ? "Yes" : "No"' },
            },
          ]}
          onRowContextMenu={(e, instance) => {
            let { store, controller } = instance;
            openContextMenu(
              e,
              <cx>
                <Menu>
                  <MenuItem onClick="deleteRecordFromContextMenu" autoClose>
                    Delete
                  </MenuItem>
                  <MenuItem
                    onClick={(e) =>
                      controller.addEntryFromContextMenu(e, { store }, false)
                    }
                    autoClose
                  >
                    Add Folder
                  </MenuItem>
                  <MenuItem
                    onClick={(e) =>
                      controller.addEntryFromContextMenu(e, { store }, true)
                    }
                    autoClose
                  >
                    Add File
                  </MenuItem>
                </Menu>
              </cx>,
              instance
            );
          }}
        />
        <Content name="code">
          <Tab
            value-bind="$page.code.tab"
            mod="code"
            tab="controller"
            text="Controller"
          />
          <Tab
            value-bind="$page.code.tab"
            mod="code"
            tab="index"
            text="Index"
            default
          />
          <CodeSnippet
            visible-expr="{$page.code.tab}=='controller'"
            fiddle="ozMlaYlG"
          >
            {`...`}
          </CodeSnippet>
          <CodeSnippet
            visible-expr="{$page.code.tab}=='index'"
            fiddle="ozMlaYlG"
          >
            {`...`}
          </CodeSnippet>
        </Content>
      </CodeSplit>
    </Md>
  </cx>
);

function generateRecords(array = [], childrenCounter = 0) {
  for (let i = 0; i < 15; i++) {
    const leaf = Math.floor(Math.random() * 10) < 4;
    array.push(getNewEntry(leaf));

    if (childrenCounter < 3) {
      generateRecords(array[i].$children, childrenCounter + 1);
    }
  }

  return array;
}

function getNewEntry(leaf) {
  return {
    id: ++idSeq,
    fullName: casual.full_name,
    phone: casual.phone,
    city: casual.city,
    notified: false,
    $children: [],
    $leaf: leaf,
  };
}

function waitFor(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

import { removeTreeNodes, updateTree } from "cx/data";
import { Controller, expr, KeySelection, PureContainer, TreeAdapter } from "cx/ui";
import { Button, Content, FlexRow, Grid, Menu, MenuItem, openContextMenu, Tab, TreeNode } from "cx/widgets";
import { CodeSnippet } from "../../../components/CodeSnippet";
import { CodeSplit } from "../../../components/CodeSplit";
import { Md } from "../../../components/Md";
import { casual } from "../data/casual";

let idSeq = 0;
let records = generateRecords();
class PageController extends Controller {
   onInit() {
      this.load();
      this.store.init("$page.treeExpanded", false);
   }

   async load(addDelay = true) {
     // fake loading
     if (addDelay)  {
       this.store.set("$page.loading", true);
       await waitFor(500);
       this.store.set("$page.loading", false);
      }

      let newRecords = structuredClone(records);

      this.store.set("$page.data", newRecords);
   }

   deleteRecordFromContextMenu(e, { store }) {
      let recordId = store.get("$record.recordId");
      this.doDelete(recordId);
   }

   deleteRecord() {
      let selection = this.store.get("$page.selection");
      this.doDelete(selection);
   }

   doDelete(id) {
      records = removeTreeNodes(records, (r) => r.recordId === id);
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
         (node) => !node.$leaf,
         "$children"
      );

      this.load(false);
   }

   addFolder() {
      this.addEntry(false);
   }

   addLeaf() {
      this.addEntry(true);
   }

   addEntry(leaf) {
      const newEntry = getNewEntry(leaf);
      records = [...records, newEntry];
      this.load();
   }

   addFolderFromContextMenu(e, { store }) {
      const recordId = store.get("$record.recordId");
      this.addEntryFromContextMenu(recordId, false);
   }

   addLeafFromContextMenu(e, { store }) {
      const recordId = store.get("$record.recordId");
      this.addEntryFromContextMenu(recordId, true);
   }

   addEntryFromContextMenu(parentId, leaf) {
      const newEntry = getNewEntry(leaf);

      records = updateTree(
         records,
         (node) => ({
            ...node,
            $expanded: true,
            $children: node?.$children?.length > 0 ? [...node.$children, newEntry] : [newEntry],
         }),
         (node) => node.recordId == parentId,
         "$children"
      );

      this.load();
   }
}

export const StatefulTreeGrid = (
   <cx>
      <Md controller={PageController}>
         <CodeSplit>
         # Stateful Tree Grid

          The following example shows how to make a stateful tree grid component with some common tree functionalities.
          This way, the state (expanded folders) of the grid will be preserved, even if we reload grid data.
          Keep in mind that a record's state will be preserved only if the value of the record's `expanded` property after reload is nullish (null or undefined).

          To make grid stateful, `restoreExpandedNodesOnLoad` property should be set to `true`, and `expandedNodesIdsMap` should be defined as a `binding` on `TreeAdapter`.
          The map is a JavaScript object whose properties are unique identifiers of the records, with value set to `true`.
          By default, value of the record's `id` property is picked as a unique identifier, but if needed this can be overridden through `keyField` Grid property.
          We can add a trigger that listens to changes of the map store and preserve it permanently if needed.

          The Code also showcases usage of some builtin Cx functions for easier tree manipulation, like `updateTree` and `removeTreeNodes`.
            <FlexRow spacing style="margin-bottom: 10px">
               <Button onClick="load" text="Reload" mod="primary" />
               <Button
                  onClick="expandCollapseTree"
                  text="Expand All"
                  text-expr="{$page.treeExpanded} ? 'Collapse All' : 'Expand All'"
               />
               <Button onClick="addFolder" text="Add Folder" />
               <Button onClick="addLeaf" text="Add File" />
               <Button onClick="deleteRecord" text="Delete" mod="danger" disabled-expr="!{$page.selection}" />
            </FlexRow>
            <Grid
               emptyText="Loading data..."
               records-bind="$page.data"
               mod="tree"
               style={{
                  width: "100%",
                  opacity: expr("{$page.loading} ? 0.4 : 1"),
                  height: 400,
               }}
               scrollable={true}
               dataAdapter={{
                  type: TreeAdapter,
                  restoreExpandedNodesOnLoad: true,
               }}
               keyField='recordId'
               selection={{ type: KeySelection, bind: "$page.selection", keyField: 'recordId' }}
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
                  openContextMenu(
                     e,
                     <cx>
                        <Menu>
                           <MenuItem onClick="deleteRecordFromContextMenu" autoClose>
                              Delete
                           </MenuItem>
                           <PureContainer visible-expr="!{$record.$leaf}">
                              <MenuItem onClick="addFolderFromContextMenu" autoClose>
                                 Add Folder
                              </MenuItem>
                              <MenuItem onClick="addLeafFromContextMenu" autoClose>
                                 Add File
                              </MenuItem>
                           </PureContainer>
                        </Menu>
                     </cx>,
                     instance
                  );
               }}
            />
            <Content name="code">
               <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller" />
               <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default />
               <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="ozMlaYlG">
                  {`
                     let idSeq = 0;
                     let records = generateRecords();

                     function generateRecords(level = 0) {
                        let array = [];
                        for (let i = 0; i < 12 - 4 * level; i++) {
                           const leaf = Math.floor(Math.random() * 10) < 4;
                           array.push(getNewEntry(leaf));

                           if (!leaf && level < 3) {
                              array[i].$children = generateRecords(level + 1);
                           }
                        }

                        return array;
                     }

                     function getNewEntry(leaf) {
                        return {
                           recordId: ++idSeq,
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

                     class PageController extends Controller {
                        onInit() {
                           this.load();
                           this.store.init("$page.treeExpanded", false);
                        }

                        async load(addDelay = true) {

                           // fake loading
                           if (addDelay)  {
                              this.store.set("$page.loading", true);
                              await waitFor(500);
                              this.store.set("$page.loading", false);
                           }
 
                           let newRecords = structuredClone(records);
 
                           this.store.set("$page.data", newRecords);
                        }

                        deleteRecordFromContextMenu(e, { store }) {
                           let recordId = store.get("$record.recordId");
                           this.doDelete(recordId);
                        }

                        deleteRecord() {
                           let selection = this.store.get("$page.selection");
                           this.doDelete(selection);
                        }

                        doDelete(id) {
                           records = removeTreeNodes(records, (r) => r.recordId === id);
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
                              (node) => !node.$leaf,
                              "$children"
                           );

                           this.load(false);
                        }

                        addFolder() {
                           this.addEntry(false);
                        }

                        addLeaf() {
                           this.addEntry(true);
                        }

                        addEntry(leaf) {
                           const newEntry = getNewEntry(leaf);
                           records = [...records, newEntry];
                           this.load();
                        }

                        addFolderFromContextMenu(e, { store }) {
                           const recordId = store.get("$record.recordId");
                           this.addEntryFromContextMenu(recordId, false);
                        }

                        addLeafFromContextMenu(e, { store }) {
                           const recordId = store.get("$record.recordId");
                           this.addEntryFromContextMenu(recordId, true);
                        }

                        addEntryFromContextMenu(parentId, leaf) {
                           const newEntry = getNewEntry(leaf);

                           records = updateTree(
                              records,
                              (node) => ({
                                 ...node,
                                 $expanded: true,
                                 $children: node?.$children?.length > 0 ? [...node.$children, newEntry] : [newEntry],
                              }),
                              (node) => node.recordId == parentId,
                              "$children"
                           );

                           this.load();
                        }
                     }
                  `}
               </CodeSnippet>
               <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="ozMlaYlG">
                  {`
                  <div controller={PageController}>
                     <FlexRow spacing style="margin-bottom: 10px">
                        <Button onClick="load" text="Reload" mod="primary" />
                        <Button
                           onClick="expandCollapseTree"
                           text="Expand All"
                           text-expr="{$page.treeExpanded} ? 'Collapse All' : 'Expand All'"
                        />
                        <Button onClick="addFolder" text="Add Folder" />
                        <Button onClick="addLeaf" text="Add File" />
                        <Button onClick="deleteRecord" text="Delete" mod="danger" disabled-expr="!{$page.selection}" />
                     </FlexRow>
                     <Grid
                        emptyText="Loading data..."
                        records-bind="$page.data"
                        mod="tree"
                        style={{
                           width: "100%",
                           opacity: expr("{$page.loading} ? 0.4 : 1"),
                           height: 400,
                        }}
                        scrollable={true}
                        dataAdapter={{
                           type: TreeAdapter,
                           restoreExpandedNodesOnLoad: true,
                        }}
                        keyField='recordId'
                        selection={{ type: KeySelection, bind: "$page.selection", keyField: 'recordId' }}
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
                           openContextMenu(
                              e,
                              <cx>
                                 <Menu>
                                    <MenuItem onClick="deleteRecordFromContextMenu" autoClose>
                                       Delete
                                    </MenuItem>
                                    <PureContainer visible-expr="!{$record.$leaf}">
                                       <MenuItem onClick="addFolderFromContextMenu" autoClose>
                                          Add Folder
                                       </MenuItem>
                                       <MenuItem onClick="addLeafFromContextMenu" autoClose>
                                          Add File
                                       </MenuItem>
                                    </PureContainer>
                                 </Menu>
                              </cx>,
                              instance
                           );
                        }}
                     />
                  </div>
                  `}
               </CodeSnippet>
            </Content>
         </CodeSplit>
      </Md>
   </cx>
);

function generateRecords(level = 0) {
   let array = [];
   for (let i = 0; i < 12 - 4 * level; i++) {
      const leaf = Math.floor(Math.random() * 10) < 4;
      array.push(getNewEntry(leaf));

      if (!leaf && level < 3) {
         array[i].$children = generateRecords(level + 1);
      }
   }

   return array;
}

function getNewEntry(leaf) {
   return {
      recordId: ++idSeq,
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

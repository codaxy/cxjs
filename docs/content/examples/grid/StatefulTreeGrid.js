import { removeTreeNodes, updateTree } from "cx/data";
import { bind, Controller, expr, KeySelection, TreeAdapter } from 'cx/ui';
import { Button, Content, FlexRow, Grid, Menu, MenuItem, openContextMenu, Tab, TreeNode } from 'cx/widgets';
import { CodeSnippet } from '../../../components/CodeSnippet';
import { CodeSplit } from '../../../components/CodeSplit';
import { Md } from '../../../components/Md';
import { casual } from '../data/casual';

let idSeq = 0;
let records = getRecords();

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
      records = getRecords();
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
            '$children'
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
        const newEntry = this.getNewEntry(leaf);
        records = [...records, newEntry];
        this.load();
    }

    addEntryFromContextMenu(e, {store}, leaf) {
        const recordId = store.get("$record.id");
        const newEntry = this.getNewEntry(leaf);

         records = updateTree(
            records,
            (node) => ({
               ...node,
               $expanded: true,
               $children: node?.$children?.length > 0 ? [...node.$children, newEntry] : [newEntry]
            }),
            (node) => node.id == recordId,
            '$children'
         );

        this.load();
    }

    getNewEntry(leaf) {
        return {
            id: ++idSeq,
            fullName: casual.full_name,
            phone: casual.phone,
            city: casual.city,
            notified: false,
            $leaf: leaf,
        }
    }
}

export const StatefulTreeGrid = <cx>
    <Md controller={PageController}>
        <CodeSplit>
            # Stateful Tree Grid

            The following example shows how to make a tree out of grid control.

        <FlexRow spacing style="margin-bottom: 10px">
            <Button onClick="load" text="Reload" mod="primary" />
            <Button onClick="reset" mod="primary" text="Reset"/>
            <Button
               onClick="expandCollapseTree"
               text="Expand All"
               text-expr="{$page.treeExpanded} ? 'Collapse All' : 'Expand All'"
            />
            <Button onClick='addFolder' text="Add Folder"/>
            <Button onClick='addLeaf' text="Add File"/>
            <Button onClick="deleteRecord" text="Delete" mod="danger" disabled-expr="!{$page.selection}" />
         </FlexRow>
         <Grid
            // buffered
            records-bind="$page.data"
            mod="tree"
            style={{ width: "100%", opacity: expr('{loading} ? 0.4 : 1'), height: 500}}
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
                        <MenuItem onClick='deleteRecordFromContextMenu' autoClose>
                           Delete
                        </MenuItem>
                        <MenuItem onClick={(e) => controller.addEntryFromContextMenu(e, { store }, false)} autoClose>
                           Add Folder
                        </MenuItem>
                        <MenuItem onClick={(e) => controller.addEntryFromContextMenu(e, { store }, true)} autoClose>
                           Add File
                        </MenuItem>
                     </Menu>
                  </cx>,
                  instance
               )
            }}
         />

        <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller"/>
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>
                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="ozMlaYlG">{`
                    class PageController extends Controller {
                        onInit() {
                            this.load();
                            this.store.init("$page.treeExpanded", false);
                          }

                          load() {
                            this.store.set("$page.data", getRecords());
                          }

                          deleteRecordFromContextMenu(e, { store }) {
                            store.delete("$record");
                          }

                          deleteRecord() {
                            let selection = this.store.get("$page.selection");
                            this.store.update("$page.data", (records) =>
                              removeTreeNodes(records, (r) => r.id === selection)
                            );
                          }

                          expandCollapseTree() {
                            this.store.toggle("$page.treeExpanded");
                            let treeExpanded = this.store.get("$page.treeExpanded");

                            this.store.update("$page.data", (records) =>
                              updateTree(
                                records,
                                (node) => ({
                                  ...node,
                                  $expanded: $page.treeExpanded
                                }),
                                (node) => !node.leaf
                              )
                            );
                        }
                    }`}
                </CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="ozMlaYlG">{`
                    <FlexRow spacing style="margin-bottom: 10px">
                        <Button onClick="load" text="Reload" mod="primary" />
                        <Button
                            onClick="expandCollapseTree"
                            text="Expand All"
                            text-expr="{$page.treeExpanded} ? 'Collapse All' : 'Expand All'"
                        />
                        <Button
                            onClick="deleteRecord"
                            text="Delete"
                            mod="danger"
                            disabled-expr="!{$page.selection}"
                        />
                    </FlexRow>
                    <Grid
                        records-bind="$page.data"
                        mod="tree"
                        style={{ width: "100%" }}
                        scrollable={true}
                        dataAdapter={{
                            type: TreeAdapter,
                            restoreExpandedNodesOnLoad: true,
                            expandedNodesIdsMap: bind("$page.expandedNodesIds")
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
                            )
                        },
                        { header: "Phone", field: "phone" },
                        { header: "City", field: "city", sortable: true },
                        {
                            header: "Notified",
                            field: "notified",
                            sortable: true,
                            value: { expr: '{$record.notified} ? "Yes" : "No"' }
                        }
                        ]}
                        onRowContextMenu={(e, { store, controller }) =>
                        openContextMenu(
                            e,
                            <cx>
                                <Menu>
                                    <MenuItem
                                        onClick={controller.deleteRecordFromContextMenu}
                                        autoClose>
                                    Delete
                                    </MenuItem>
                                </Menu>
                            </cx>,
                            store
                        )}
                    />`}
                </CodeSnippet>
            </Content>
        </CodeSplit>
    </Md>
</cx>

function generateRecords(node) {
   if (!node || node.$level < 5)
      return Array.from({length: 20}).map(() => ({
         id: ++idSeq,
         fullName: casual.full_name,
         phone: casual.phone,
         city: casual.city,
         notified: casual.coin_flip,
         $leaf: casual.coin_flip,
         //icon: 'circle'
      })
   );
}


function getRecords() {
    return [
       {
          id: ++idSeq,
          fullName: "Cristian Strosin",
          phone: "495-726-3417",
          city: "Dejahview",
          notified: false,
          $leaf: false,
          $children: [
             {
                id: ++idSeq,
                fullName: "Madelyn Hoppe",
                phone: "348-923-4635",
                city: "Ednabury",
                notified: true,
                $leaf: false,
                $children: [
                   {
                      id: ++idSeq,
                      fullName: "Orlo Larson",
                      phone: "673-856-0106",
                      city: "Creminborough",
                      notified: false,
                      $leaf: false,
                   },
                   {
                      id: ++idSeq,
                      fullName: "Geovanni Crona",
                      phone: "876-299-5445",
                      city: "East Trenton",
                      notified: true,
                      $leaf: false,
                   },
                   {
                      id: ++idSeq,
                      fullName: "Ferne Schulist",
                      phone: "194-070-1267",
                      city: "Lefflerfort",
                      notified: false,
                      $leaf: false,
                   },
                   {
                      id: ++idSeq,
                      fullName: "Brian Littel",
                      phone: "798-857-5198",
                      city: "New Dagmarshire",
                      notified: false,
                      $leaf: false,
                   },
                ],
             },
             {
                id: ++idSeq,
                fullName: "Terence Cormier",
                phone: "786-784-9637",
                city: "Port Erika",
                notified: false,
                $leaf: false,
             },
             {
                id: ++idSeq,
                fullName: "Harmon Bode",
                phone: "698-306-7094",
                city: "Rebecaview",
                notified: false,
                $leaf: false,
             },
          ],
       },
       {
          id: ++idSeq,
          fullName: "Erick Tremblay",
          phone: "541-671-9860",
          city: "Letitiaberg",
          notified: true,
          $leaf: false,
          $children: [
             {
                id: ++idSeq,
                fullName: "Timmothy Gislason",
                phone: "980-211-5716",
                city: "Rhettport",
                notified: false,
                $leaf: true,
             },
             {
                id: ++idSeq,
                fullName: "Easter Gleason",
                phone: "936-701-9452",
                city: "Fannieport",
                notified: true,
                $leaf: false,
             },
             {
                id: ++idSeq,
                fullName: "Claudie Barton",
                phone: "716-884-5573",
                city: "Konopelskiburgh",
                notified: true,
                $leaf: false,
             },
             {
                id: ++idSeq,
                fullName: "Kory Prosacco",
                phone: "914-802-7593",
                city: "Lake Elise",
                notified: false,
                $leaf: true,
             },
          ],
       },
       {
          id: ++idSeq,
          fullName: "Leatha Crist",
          phone: "176-418-7449",
          city: "Angelicahaven",
          notified: false,
          $leaf: false,
          $children: [
             {
                id: ++idSeq,
                fullName: "Jaiden Hamill",
                phone: "028-962-9298",
                city: "Shieldsbury",
                notified: false,
                $leaf: false,
             },
             {
                id: ++idSeq,
                fullName: "Leda Langosh",
                phone: "340-448-2466",
                city: "New Clementinashire",
                notified: true,
                $leaf: false,
             },
          ],
       },
       {
          id: ++idSeq,
          fullName: "Rebeka Ankunding",
          phone: "968-349-1333",
          city: "Bergstrommouth",
          notified: false,
          $leaf: true,
       },
       {
          id: ++idSeq,
          fullName: "Carter Sauer",
          phone: "316-209-2080",
          city: "Adriannaton",
          notified: false,
          $leaf: false,
          $children: [
             {
                id: ++idSeq,
                fullName: "Arthur Stiedemann",
                phone: "266-374-6645",
                city: "South Tyra",
                notified: false,
                $leaf: false,
             },
             {
                id: ++idSeq,
                fullName: "Cyril Satterfield",
                phone: "577-374-4808",
                city: "New Brooke",
                notified: false,
                $leaf: false,
             },
          ],
       },
    ];
}

function waitFor(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

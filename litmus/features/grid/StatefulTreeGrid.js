import { removeTreeNodes, updateTree } from "cx/data";
import { bind, Controller, KeySelection, TreeAdapter } from "cx/ui";
import { Button, FlexRow, Grid, Menu, MenuItem, openContextMenu, TreeNode } from "cx/widgets";
import { casual } from "../../casual";

class PageController extends Controller {
   onInit() {
      this.load();
      this.store.init("expanded", false);
   }

   load() {
      this.store.set("$page.data", getRecords());
   }

   deleteRecordFromContextMenu(e, { store }) {
      store.delete("$record");
   }

   deleteRecord() {
      let selection = this.store.get("$page.selection");
      this.store.update("$page.data", (records) => removeTreeNodes(records, (r) => r.id === selection));
   }

   expandCollapseTree() {
      this.store.toggle("expanded");
      let expanded = this.store.get("expanded");

      this.store.update("$page.data", (records) =>
         updateTree(
            records,
            (node) => ({
               ...node,
               $expanded: expanded,
            }),
            (node) => !node.leaf
         )
      );
   }

   addFolder() {
      const randomId = Math.floor(Math.random() * 100);
      console.log(casual[randomId]);
   }
}

export default (
   <cx>
      <div controller={PageController} style="padding: 10px">
         <FlexRow spacing style="margin-bottom: 10px">
            <Button onClick="load" text="Reload" mod="primary" />
            <Button
               onClick="expandCollapseTree"
               text="Expand All"
               text-expr="{expanded} ? 'Collapse All' : 'Expand All'"
            />
            <Button onClick="deleteRecord" text="Delete" mod="danger" disabled-expr="!{$page.selection}" />
         </FlexRow>
         <Grid
            records-bind="$page.data"
            mod="tree"
            style={{ width: "100%" }}
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
            onRowContextMenu={(e, { store, controller }) =>
               openContextMenu(
                  e,
                  <cx>
                     <Menu>
                        <MenuItem onClick={controller.deleteRecordFromContextMenu} autoClose>
                           Delete
                        </MenuItem>
                     </Menu>
                  </cx>,
                  store
               )
            }
         />
      </div>
   </cx>
);

function getRecords() {
   return [
      {
         id: 1,
         fullName: "Cristian Strosin",
         phone: "495-726-3417",
         city: "Dejahview",
         notified: false,
         $leaf: false,
         $children: [
            {
               id: 6,
               fullName: "Madelyn Hoppe",
               phone: "348-923-4635",
               city: "Ednabury",
               notified: true,
               $leaf: false,
               $children: [
                  {
                     id: 15,
                     fullName: "Orlo Larson",
                     phone: "673-856-0106",
                     city: "Creminborough",
                     notified: false,
                     $leaf: false,
                  },
                  {
                     id: 16,
                     fullName: "Geovanni Crona",
                     phone: "876-299-5445",
                     city: "East Trenton",
                     notified: true,
                     $leaf: false,
                  },
                  {
                     id: 17,
                     fullName: "Ferne Schulist",
                     phone: "194-070-1267",
                     city: "Lefflerfort",
                     notified: false,
                     $leaf: false,
                  },
                  {
                     id: 18,
                     fullName: "Brian Littel",
                     phone: "798-857-5198",
                     city: "New Dagmarshire",
                     notified: false,
                     $leaf: false,
                  },
               ],
            },
            {
               id: 7,
               fullName: "Terence Cormier",
               phone: "786-784-9637",
               city: "Port Erika",
               notified: false,
               $leaf: false,
            },
            {
               id: 8,
               fullName: "Harmon Bode",
               phone: "698-306-7094",
               city: "Rebecaview",
               notified: false,
               $leaf: false,
            },
         ],
      },
      {
         id: 2,
         fullName: "Erick Tremblay",
         phone: "541-671-9860",
         city: "Letitiaberg",
         notified: true,
         $leaf: false,
         $children: [
            {
               id: 9,
               fullName: "Timmothy Gislason",
               phone: "980-211-5716",
               city: "Rhettport",
               notified: false,
               $leaf: true,
            },
            {
               id: 10,
               fullName: "Easter Gleason",
               phone: "936-701-9452",
               city: "Fannieport",
               notified: true,
               $leaf: false,
            },
            {
               id: 11,
               fullName: "Claudie Barton",
               phone: "716-884-5573",
               city: "Konopelskiburgh",
               notified: true,
               $leaf: false,
            },
            {
               id: 12,
               fullName: "Kory Prosacco",
               phone: "914-802-7593",
               city: "Lake Elise",
               notified: false,
               $leaf: true,
            },
         ],
      },
      {
         id: 3,
         fullName: "Leatha Crist",
         phone: "176-418-7449",
         city: "Angelicahaven",
         notified: false,
         $leaf: false,
         $children: [
            {
               id: 13,
               fullName: "Jaiden Hamill",
               phone: "028-962-9298",
               city: "Shieldsbury",
               notified: false,
               $leaf: false,
            },
            {
               id: 14,
               fullName: "Leda Langosh",
               phone: "340-448-2466",
               city: "New Clementinashire",
               notified: true,
               $leaf: false,
            },
         ],
      },
      {
         id: 4,
         fullName: "Rebeka Ankunding",
         phone: "968-349-1333",
         city: "Bergstrommouth",
         notified: false,
         $leaf: true,
      },
      {
         id: 5,
         fullName: "Carter Sauer",
         phone: "316-209-2080",
         city: "Adriannaton",
         notified: false,
         $leaf: false,
         $children: [
            {
               id: 19,
               fullName: "Arthur Stiedemann",
               phone: "266-374-6645",
               city: "South Tyra",
               notified: false,
               $leaf: false,
            },
            {
               id: 20,
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

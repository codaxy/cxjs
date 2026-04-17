import { Controller, createModel } from "cx/ui";
import { Grid, TreeNode, Button, FlexRow } from "cx/widgets";
import { validateConfig } from "cx/util";
import { MappedTreeAdapter, MappedTreeNode, MappedTreeNodeInfo } from "./MappedTreeAdapter";

let nextProjectId = 4;
let nextTaskId = 400;

interface Task {
   id: number;
   title: string;
   assignee: string;
}

interface Project {
   id: number;
   name: string;
   status: string;
   priority: string;
   tasks: Task[];
}

interface PageModel {
   $page: {
      projects: Project[];
   };
   $record: MappedTreeNodeInfo;
}

let { $page, $record } = createModel<PageModel>();

class PageController extends Controller {
   onInit() {
      this.store.set($page.projects, [
         {
            id: 1,
            name: "Website Redesign",
            status: "Active",
            priority: "High",
            tasks: [
               { id: 101, title: "Design mockups", assignee: "Alice" },
               { id: 102, title: "Implement frontend", assignee: "Bob" },
               { id: 103, title: "Write tests", assignee: "Carol" },
            ],
         },
         {
            id: 2,
            name: "API v2",
            status: "Planning",
            priority: "Medium",
            tasks: [
               { id: 201, title: "Define endpoints", assignee: "Dave" },
               { id: 202, title: "Database schema", assignee: "Eve" },
            ],
         },
         {
            id: 3,
            name: "Mobile App",
            status: "Active",
            priority: "High",
            tasks: [
               { id: 301, title: "Setup React Native", assignee: "Frank" },
               { id: 302, title: "Login screen", assignee: "Grace" },
            ],
         },
      ] as Project[]);
   }

   addProject() {
      let id = nextProjectId++;
      this.store.update($page.projects, (projects: Project[]) => [
         ...projects,
         {
            id,
            name: `New Project ${id}`,
            status: "Draft",
            priority: "Low",
            tasks: [{ id: nextTaskId++, title: "Initial setup", assignee: "TBD" }],
         },
      ]);
   }

   updateFirstProject() {
      this.store.update($page.projects, (projects: Project[]) => [
         { ...projects[0], name: projects[0].name + " (updated)" },
         ...projects.slice(1),
      ]);
   }
}

// Maps a single source record (project or task) to a display node.
// No children - children are loaded on demand via onLoadChildRecords.
function onMapRecord(record: Project | Task): MappedTreeNode {
   if ("tasks" in record) {
      return {
         id: `p-${record.id}`,
         text: `${record.name} [${record.status}]`,
         data: record,
         extra: { type: "project" },
         expanded: true,
      };
   }
   return {
      id: `t-${record.id}`,
      text: `${record.title} - ${record.assignee}`,
      isLeaf: true,
      data: record,
      extra: { type: "task" },
   };
}

// Returns child source records. Can return sync array or Promise.
function onLoadChildRecords(node: MappedTreeNode): any[] | Promise<any> {
   let project = node.data as Project;
   return project.tasks || [];
   return new Promise((resolve) => {
      setTimeout(() => {
         let project = node.data as Project;
         resolve(project.tasks || []);
      }, 500);
   });
}

export default (
   <cx>
      <div controller={PageController} style="padding: 20px">
         <h3>MappedTreeAdapter Demo</h3>
         <p style="margin-bottom: 10px; color: #666">
            Lazy tree: projects are mapped immediately, tasks load on expand (500ms delay).
         </p>

         <FlexRow style="margin-bottom: 10px; gap: 8px">
            <Button onClick="addProject">Add Project</Button>
            <Button onClick="updateFirstProject">Update First Project</Button>
         </FlexRow>

         <Grid
            records={$page.projects}
            dataAdapter={validateConfig({
               type: MappedTreeAdapter,
               onMapRecord,
               onLoadChildRecords,
            })}
            style="width: 600px"
            columns={[
               {
                  header: "Tree",
                  items: (
                     <cx>
                        <TreeNode
                           expanded={$record.expanded}
                           leaf={$record.isLeaf}
                           level={$record.$level}
                           text={$record.text}
                           loading={$record.$loading}
                        />
                     </cx>
                  ),
               },
               {
                  header: "Type",
                  value: $record.extra.type,
                  style: "width: 100px; color: #999",
               },
            ]}
         />
      </div>
   </cx>
);

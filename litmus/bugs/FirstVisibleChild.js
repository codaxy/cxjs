import {LabelsLeftLayout, LabelsTopLayout, FirstVisibleChildLayout, PureContainer, UseParentLayout, Repeater, Controller} from "cx/ui";
import {TextField, Route, Checkbox, Button, LabeledContainer, DateTimeField} from "cx/widgets";

class TodoListController extends Controller {
   onInit() {
      this.store.init("$page.todoList", [
         { id: 0, text: 'Learn Cx', done: true },
         { id: 1, text: "Feed the cat", done: false },
      ])
   }

   addNewTask(task) {
      this.store.update("$page.todoList", todoList => {
         return [
            ...todoList,
            {
               id: todoList.length,
               text: task,
               done: false
            }
         ];
      });
   }
}

// NewTask component
class NewTaskController extends Controller {
   addTask() {
      let task = this.store.get("$page.task");
      this.store.delete("$page.task");
      this.invokeParentMethod("addNewTask", task);
   }
}
const NewTask = (
   <cx>
      <div controller={NewTaskController} layout={LabelsTopLayout} >
         <TextField value-bind="$page.task" label="Task description" />
         <Button onClick="addTask" text="Add task" />
      </div>
   </cx>
);

export default <cx>
   <div layout={FirstVisibleChildLayout} visible={false}>
      <div visible={false}>1</div>
      <PureContainer>
         <div visible={false}>2</div>
         <Route url="1" route="2">
            Test
         </Route>
      </PureContainer>
      <div>3</div>
      <div>4</div>
   </div>

   <div className="widgets" visible={false}>
      <div controller={TodoListController} layout={LabelsLeftLayout}>
         <NewTask/>

         <h4 style="padding: 0; margin: 0; margin-top: 10px;">Todo List</h4>
         <Repeater records-bind="$page.todoList">
            <Checkbox value-bind="$record.done" text-bind="$record.text"/>
            <br/>
         </Repeater>
      </div>
   </div>

   <div layout={LabelsLeftLayout}>
      <TextField value-bind="$page.text" label="Label 1"/>
      <Checkbox value-bind="$page.showSection1">Show More</Checkbox>
      <PureContainer layout={UseParentLayout} visible-bind="$page.showSection1">
         <TextField value-bind="$page.text" label="Label 1"/>
         <TextField value-bind="$page.text" label="Label 2"/>
         <Checkbox value-bind="$page.showSection2">Show More</Checkbox>
         <PureContainer layout={UseParentLayout} visible-bind="$page.showSection2">
            <TextField value-bind="$page.text" label="Label 3"/>
            <TextField value-bind="$page.text" label="Label 4"/>
            <Checkbox value-bind="$page.showSection3">Show More</Checkbox>
            <Repeater records={[{}, {}, {}]} useParentLayout>
               <TextField value-bind="$page.text" label="Label 4"/>
            </Repeater>
            <PureContainer layout={UseParentLayout} visible-bind="$page.showSection3">
               <TextField value-bind="$page.text" label="Label 3"/>
               <TextField value-bind="$page.text" label="Label 4"/>
            </PureContainer>
         </PureContainer>
      </PureContainer>
   </div>

</cx>
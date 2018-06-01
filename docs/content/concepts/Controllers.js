import {
    Button,
    Content,
    Tab,
    HtmlElement,
    Checkbox,
    TextField,
    NumberField,
    Select,
    Option,
    Repeater,
    Text,
    MsgBox
} from 'cx/widgets';
import {LabelsTopLayout, LabelsLeftLayout, Controller} from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ImportPath} from '../../components/ImportPath';

class TabController extends Controller {
    onInit() {
        this.store.set('$page.tabOpenTime', 0);
        this.timer = setInterval(() => {
            this.store.update('$page.tabOpenTime', t => t + 1);
        }, 1000);
    }

    onDestroy() {
        clearInterval(this.timer);
    }
}

class CbController extends Controller {
    onInit() {
        this.addTrigger('t1', ['$page.cb1'], cb1 => {
            this.store.set('$page.cb2', !cb1);
        });
        this.addTrigger('t2', ['$page.cb2'], cb2 => {
            this.store.set('$page.cb1', !cb2);
        });
    }
}

class InfoController extends Controller {
    onInit() {
        this.store.set('$page.cities', [{id: 'ams', text: 'Amsterdam', population: '1.6M'}, {
            id: 'bg',
            text: 'Belgrade',
            population: '3M'
        }]);

        this.addComputable('$page.city', ['$page.cities', '$page.cityId'], (options, id) => {
            return options.find(o => o.id == id);
        });
    }
}

class MethodController extends Controller {
    sayHello() {
        MsgBox.alert('Hello!');
    }
}

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

export const Controllers = <cx>

    <Md>
        <CodeSplit>

            # Controllers

            <ImportPath path="import {Controller} from 'cx/ui';"/>

            Controllers are used to concentrate business logic required for views. This includes preparing data for
            rendering, calculating values, reacting on changes, defining callbacks, etc.
            Controllers are assigned to widgets using the `controller` attribute. Once assigned, controllers are passed
            down the widget tree to all descendants.

            ### `onInit`, `onDestroy`

            `onInit` method is invoked once the controller is created. Similarly, `onDestroy` is called
            just before the controller is destroyed.

            <div class="widgets">
                <div>
                    <div>
                        <Tab value:bind="$page.tab" tab="1" default>Tab 1</Tab>
                        <Tab value:bind="$page.tab" tab="2">Tab 2</Tab>
                    </div>
                    <div visible:bind="$page.tab=='1'" controller={TabController}>
                        Tab 1 is open <span text:bind="$page.tabOpenTime"/> seconds.
                    </div>
                    <div visible:bind="$page.tab=='2'" controller={TabController}>
                        Tab 2 is open <span text:bind="$page.tabOpenTime"/> seconds.
                    </div>
                </div>
            </div>

            <CodeSnippet putInto="code">{`
                class TabController extends Controller {
                    onInit() {
                        this.store.set('$page.tabOpenTime', 0);
                        this.timer = setInterval(() => {
                            this.store.update('$page.tabOpenTime', t => t + 1);
                        }, 1000);
                    }
                    onDestroy() {
                        clearInterval(this.timer);
                    }
                }
                ...
                <div>
                    <Tab value:bind="$page.tab" tab="1" default>Tab 1</Tab>
                    <Tab value:bind="$page.tab" tab="2">Tab 2</Tab>
                </div>
                <div visible:bind="$page.tab=='1'" controller={TabController}>
                    Tab 1 is open <span text:bind="$page.tabOpenTime"/> seconds.
                </div>
                <div visible:bind="$page.tab=='2'" controller={TabController}>
                    Tab 2 is open <span text:bind="$page.tabOpenTime"/> seconds.
                </div>

            `}</CodeSnippet>

            `onInit` method is a good place to initialize or fetch data and define triggers and computable values.
        </CodeSplit>

        <CodeSplit>
            ### Triggers

            Triggers execute a given callback when specified data changes.

            <div class="widgets">
                <div controller={CbController}>
                    <Checkbox value:bind="$page.cb1">Checkbox 1</Checkbox>
                    <br/>
                    <Checkbox value:bind="$page.cb2">Checkbox 2</Checkbox>
                </div>
            </div>

            Triggers are defined using the `addTrigger` method which takes four arguments.
            The first argument is the trigger's name which can later be used to remove the trigger using the
            `removeTrigger` method.
            The second argument is a list of bindings to be monitored.
            The third argument is a function which will be executed when any of the bindings change.
            The fourth argument should be a boolean value which controls whether or not the trigger should be
            immediately executed.

            Triggers are used to:

            - load data from the server when selection changes
            - implement complex data behavior

            <Content name="code">
                <CodeSnippet fiddle="QmlMqPUa">{`
               class CbController extends Controller {
                  onInit() {
                     this.addTrigger('t1', ['$page.cb1'], cb1 => {
                        this.store.set('$page.cb2', !cb1);
                     });
                     this.addTrigger('t2', ['$page.cb2'], cb2 => {
                        this.store.set('$page.cb1', !cb2);
                     });
                  }
               }
               ...
               <div controller={CbController}>
                  <Checkbox value:bind="$page.cb1">Checkbox 1</Checkbox>
                  <br/>
                  <Checkbox value:bind="$page.cb2">Checkbox 2</Checkbox>
               </div>
            `}</CodeSnippet>
            </Content>
        </CodeSplit>

        <CodeSplit>

            ### Computed Values

            Computed values are automatically calculated based on other data, similar to how spreadsheet formulas work.
            The following example shows how the population is calculated by selecting individual cities from the drop-down.

            <div class="widgets">
                <div controller={InfoController}>
                    <Select value:bind="$page.cityId">
                        <Repeater records:bind='$page.cities'>
                            <Option value:bind='$record.id' text:bind='$record.text'/>
                        </Repeater>
                    </Select>
                    <p visible:expr='{$page.cityId}'>
                        <Text tpl='{$page.city.text} has {$page.city.population} people.'/>
                    </p>
                </div>
            </div>


            <CodeSnippet putInto="code" fiddle="ooYt3HD9">{`
                class InfoController extends Controller {
                   onInit() {
                      this.store.set('$page.cities', [{id: 'ams', text: 'Amsterdam', population: '1.6M'}, {id: 'bg',text: 'Belgrade',population: '3M'}]);

                      this.addComputable('$page.city', ['$page.cities', '$page.cityId'], (options, id) => {
                         return options.find(o=>o.id == id);
                      });
                   }
                }
                ...
                <div controller={InfoController}>
                   <Select value:bind="$page.cityId">
                      <Repeater records:bind='$page.cities'>
                         <Option value:bind='$record.id' text:bind='$record.text' />
                      </Repeater>
                   </Select>
                   <p visible:expr='{$page.cityId}'>
                      <Text tpl='{$page.city.text} has {$page.city.population} people.' />
                   </p>
                </div>
            `}</CodeSnippet>

            Computed values are defined using the `addComputable` method which takes three arguments.
            The first argument is a binding path where computed data will be stored.
            The second argument is a list of bindings. Values pointed by these bindings will be used as input parameters
            for calculation. The third argument is a function which computes the data.

            Computed values are commonly used to:

            - filter data
            - provide additional data based on selection
            - aggregate data

        </CodeSplit>

        ### Callback Methods

        <CodeSplit>

            Any method defined in a controller can be invoked from the view code.
            This is commonly used for event callbacks.

            <div class="widgets">
                <div controller={MethodController}>
                    <Button onClick={(e, {controller}) => {
                        controller.sayHello();
                    }}>Say Hello
                    </Button>
                </div>
            </div>

            <CodeSnippet putInto="code" fiddle="ztNKYqEO">{`
            class MethodController extends Controller {
               sayHello() {
                  MsgBox.alert('Hello!');
               }
            }
            ...
            <div controller={MethodController}>
               <Button onClick={(e, {controller})=>{ controller.sayHello();}}>Say Hello</Button>
            </div>
         `}</CodeSnippet>
        </CodeSplit>

        For simple controller invocations, use short syntax by assigning just the name of the
        controller method to the handler. In this case, arguments passed over to the method will be `event` and `instance`.

        <CodeSplit>
            <div class="widgets">
                <div controller={MethodController}>
                    <Button onClick="sayHello">Say Hello</Button>
                </div>
            </div>

            <CodeSnippet putInto="code" fiddle="ztNKYqEO">{`
            <div controller={MethodController}>
               <Button onClick="sayHello">Say Hello</Button>
            </div>
         `}</CodeSnippet>
        </CodeSplit>

        When using names of callbacks, it's possible to invoke methods defined higher in the ancestor controller tree.

        <CodeSplit>

            ### `invokeParentMethod`

            In some cases we might need to call the parent Controller's method from within the child Controller
            that contains part of the business logic.        
            
            In such cases, we can use `invokeParentMethod` as shown in the example below.
            
            <div class="widgets" >
                <div controller={TodoListController} layout={LabelsLeftLayout}>
                    <NewTask />
                
                    <h4 style="padding: 0; margin: 0; margin-top: 10px;">Todo List</h4>
                    <Repeater records:bind="$page.todoList" >
                        <Checkbox value:bind="$record.done" text:bind="$record.text"/>
                        <br/>
                    </Repeater>
                </div>
            </div>

            <CodeSnippet putInto="code">{`
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
                ...
                // Main TodoList component
                class TodoListController extends Controller {                
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
                <div controller={TodoListController} layout={LabelsLeftLayout}>
                    <NewTask />
                
                    <h4 style="padding: 0; margin: 0; margin-top: 10px;">Todo List</h4>
                    <Repeater records:bind="$page.todoList" >
                        <Checkbox value:bind="$record.done" text:bind="$record.text"/>
                        <br/>
                    </Repeater>
                </div>
            `}</CodeSnippet>

            `invokeParentMethod` accepts the name of the parent method, followed by any number
            of arguments it expects.
        </CodeSplit>

    </Md>

</cx>;


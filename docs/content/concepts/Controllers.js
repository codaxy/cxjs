import { Button, Content, HtmlElement, Checkbox, TextField, NumberField, Select, Option, Repeater, Text, MsgBox } from 'cx/widgets';
import { LabelsLeftLayout, Controller } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ImportPath} from '../../components/ImportPath';


class CbController extends Controller {
    init() {
        this.addTrigger('t1', ['$page.cb1'], cb1 => {
            this.store.set('$page.cb2', !cb1);
        });
        this.addTrigger('t2', ['$page.cb2'], cb2 => {
            this.store.set('$page.cb1', !cb2);
        });
    }
}

class InfoController extends Controller {
    init() {
        this.store.set('$page.cities', [{id: 'ams', text: 'Amsterdam', population: '1.6M'}, {
            id: 'bg',
            text: 'Belgrade',
            population: '3M'
        }]);

        this.addComputable('$page.city', ['$page.cities', '$page.cityId'], (options, id) => {
            return options.find(o=>o.id == id);
        });
    }
}

class MethodController extends Controller {
    sayHello() {
        MsgBox.alert('Hello!');
    }
}

export const Controllers = <cx>

    <Md>
        # Controllers
        
        <ImportPath path="import {Controller} from 'cx/ui';" />        

        <CodeSplit>

            Controllers are used to concentrate business logic required for views. This includes preparing data for
            rendering purposes and also executing callbacks based on user input.

            Controllers are assigned to widgets using the `controller` attribute. Once assigned, controllers are passed
            down the widget tree.

            ### Triggers

            Triggers execute given callback when specified data change.

            <div class="widgets">
                <div controller={CbController}>
                    <Checkbox value:bind="$page.cb1">Checkbox 1</Checkbox>
                    <br/>
                    <Checkbox value:bind="$page.cb2">Checkbox 2</Checkbox>
                </div>
            </div>

            Triggers are defined using the `addTrigger` method which takes four arguments.
            The first argument is the trigger's name which can later be used to remove the trigger, using the
            `removeTrigger` method.
            The second argument is a list of bindings to be monitored.
            The third argument is a function which will be executed when any of the bindings change.
            The fourth argument should be a boolean value which controls if the trigger should be immediately executed or
            not.

            Triggers are used to:

            - load data from the server on selection change
            - implement complex data behavior

            <Content name="code">
                <CodeSnippet fiddle="QmlMqPUa">{`
               class CbController extends Controller {
                  init() {
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

            Computed values are very convenient when some of the data can be calculated based on other data.
            This is similar to how spreadsheet formulas work.

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
               init() {
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
            The second argument is a list of bindings. Values pointed by these bindings are used as input parameters for
            calculation.
            The third argument is a function which computes and returns the data.

            Computed values are used to:

            - filter data
            - provide additional data based on selection
            - store totals or other significant values which can be calculated from the data

        </CodeSplit>

        ## Controller Methods

        <CodeSplit>

            It's allowed to define custom methods within a controller, which can be invoked when necessary.
            This keeps the view code tidy.

            <div class="widgets">
                <div controller={MethodController}>
                    <Button onClick={(e, {controller})=> {
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

        For simple controller invocations, it's easier to use short syntax by passing just the name of the
        controller method to the handler. In this case, arguments passed to the method will be `event` and `instance`.

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

    </Md>

</cx>;


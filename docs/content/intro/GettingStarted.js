import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {Content} from 'cx/ui/layout/Content';

import {CodeSnippet} from '../../components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Todo} from '../examples/todo/Todo';
import {Tab} from 'cx/ui/nav/Tab';

export const GettingStarted = <cx>
    <Md>
        # Getting Started
        
        Cx is built using ES2015 JSX with webpack as a module bundling, building and
        dev server option. This is also the preferred way for developing Cx applications,
        although it is not required. In this step-by-step tutorial, we will show how to 
        get started with Cx by developing a simple **Todo manager** application using  
        the same preferred tools.

        <CodeSplit>
            You can get the source code of the completed application
            [here](https://github.com/codaxy/cx-getting-started).

            <Content name="code">
                <CodeSnippet>{`
                    git clone https://github.com/codaxy/cx-getting-started
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        It is worth mentioning that this tutorial is intended to familiraze you with some of the
        packages that are used by cx. A more practical way to start a new cx project is explained 
        [here](~/intro/command-line).

        ## Prerequisites

        <CodeSplit>
            There are a couple of components required for developing Cx applications which we
            will be using in this tutorial:

            - Git
            - Node.Js (>= 4.4.7)
            - npm (>= 3.10.6)

            Before continuing, please check that these components are installed and
            up to date.

            <Content name="code">
                <CodeSnippet>{`
                    git version
                    node --version
                    npm --version
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Initializing the application

        <CodeSplit>
            First, let's create an empty folder that will serve as a root for our new Cx application
            and initialize the application by issuing: `npm init` from within this folder.
            We fill in the required data following the on-screen instructions, making sure that we
            change the default choice for application entry point to `app/index.js` (we will
            follow the recommended Cx source layout) and it will create an initial `project.json`
            file for our application.

            Next, we need to install prerequisite packages, by issuing `npm install` commands.
            <Content name="code">
                <CodeSnippet>{`
                    mkdir cx-getting-started && cd cx-getting-started

                    npm init

                    npm install cx-core cx-react --save

                    npm install webpack@2.1.0-beta.20 webpack-dev-server@2.0.0-beta babel-core
                    babel babel-loader babel-plugin-cx babel-plugin-react babel-plugin-react-transform
                    babel-plugin-syntax-jsx babel-plugin-transform-decorators-legacy
                    babel-plugin-transform-react-jsx babel-plugin-transform-runtime babel-preset-es2015
                    babel-preset-es2015-loose babel-preset-react babel-preset-stage-0 bundle-loader
                    css-loader file-loader json-loader node-sass sass-loader style-loader
                    extract-text-webpack-plugin@2.0.0-beta.2 html-webpack-plugin --save-dev
                `}</CodeSnippet>
            </Content>

        </CodeSplit>

        After installing the required packages, we need to set up webpack by creating a suitable
        configuration in `webpack.config.js` file. Explaining various webpack configuration options exceeds
        the scope of this tutorial, so you should check out
        [the official webpack config documentation](https://webpack.github.io/docs/configuration.html)
        for an extensive explanation of the contents of this file. For now, you can simply download
        and use a relatively simple configuration that works for us from
        [here](https://github.com/codaxy/cx-getting-started/blob/master/webpack.config.js).

        ## Application entry point

        <CodeSplit>
            At this point, we have everything needed to start writing our first Cx application.
            First, let's define an index HTML template. In the
            application root folder, create a subfolder named `app`, and within it, create
            a simple HTML file `app/index.html`.

            The file is very simple&mdash;it only contains an `app` div, a place where our application (or, in fact, our
            top-level widget) will mount.

            Next, we need to define an `app/index.js` JavaScript file that will serve
            as our application entry point.

            In this file, we're importing a few required objects from Cx modules. In order
            to use plain HTML elements, like `p` or `div` within our widgets, we need to import `HtmlElement`. 
            The `store` instance we define a few lines below will hold the data model of
            our entire application&mdash;all UI bindings in our application will point to elements
            in this store tree.

            `hello` is a very simple Cx widget defined using JSX syntax. By wrapping the widget contents
            inside a `cx` tag, we're distinguishing it from a standard React component, and it gets parsed
            by the Cx transformer, which will turn it into a configuration describing the widget contents.
            Technically, we can write the configuration by hand, using plain JavaScript, but JSX syntax is
            much clearer to write and read.

            At the very end, we're starting the application rendering loop, passing three parameters:

            - the element in the HTML template where the widget will mount,
            - application store instance,
            - the widget to be mounted (our simple `hello`).

            The `startAppLoop` function returns a handle for stopping the application rendering
            loop. We will use this handle in the hot module replacement related code we will add a little
            later in this tutorial.

            <Content name="code">
                <div>
                    <Tab value={{bind:"$page.entryPoint.tab", defaultValue: "html"}} tab="html" mod="code" >
                        <code>app/index.html</code>
                    </Tab>
                    <Tab value:bind="$page.entryPoint.tab" tab="js" mod="code">
                        <code>app/index.js</code>
                    </Tab>
                </div>

                <CodeSnippet visible:expr="{$page.entryPoint.tab} === 'html'">{`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Todo Manager</title>
                    </head>
                    <body>
                        <div id="app"></div>
                    </body>
                    </html>
                `}</CodeSnippet>

                <CodeSnippet visible:expr="{$page.entryPoint.tab} === 'js'">{`
                    import {startAppLoop} from 'cx/app/startAppLoop';
                    import {Store} from 'cx/data/Store';
                    import {HtmlElement} from 'cx/ui/HtmlElement';

                    require('./index.scss');
                    const store = new Store();

                    var hello = <cx>
                        <p>Hello, Cx</p>
                    </cx>;

                    var stop;
                    // We will add HMR related code here...
                    stop = startAppLoop(document.getElementById('app'), store, hello);
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        <CodeSplit>
            Before we can start the application, we need to take care of one more thing.
            The line: `require('./index.scss')` in `app/index.js` will instruct webpack
            to load the stylesheet from the transformation of `app/index.scss` file.
            For this to work, we need to have this file defined. For now, we will create
            a minimal SCSS file that will just import the default Cx stylesheet.

            <Content name="code">
                <div>
                    <Tab value={"scss"} tab="scss" mod="code" >
                        <code>app/index.scss</code>
                    </Tab>
                </div>
                <CodeSnippet>{`
                    @import "~cx-core/src/index";
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Starting the application

        <CodeSplit>
            We can now run our Cx application using `webpack-dev-server`. To simplify server invocation,
            we can add a `start` script to our `package.json` file.

            This enables us to start the application simply by issuing `npm start` from the application
            root folder. Upon issuing this command, a browser will open and you should see the
            following result:

            <div class="widgets">
                <p>
                    Hello, Cx
                </p>
            </div>

            <Content name="code">
                <div>
                    <Tab value={"json"} tab="json" mod="code">
                        <code>package.json</code>
                    </Tab>
                </div>
                <CodeSnippet>{`
                    ...
                    "description": "Cx demo application",
                    "main": "index.js",
                    "scripts": {
                        "start": "webpack-dev-server --open"
                    },
                    ...
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        <CodeSplit>
            ### Hot module replacement

            While developing this application, we will be using hot module replacement feature of webpack,
            so before we move on, we will add a small block of code in order for everything to work
            correctly. We want to remember the data in the store when the main module code gets replaced,
            and use that data for the new module
            (for details, see [webpack documentation](https://webpack.github.io/docs/hot-module-replacement.html#dispose-adddisposehandler)).

            To achieve this, we will add this little snippet to our `app/index.js` file right after the
            `stop` variable declaration.
            <Content name="code">
                <div>
                    <Tab value={"app/index.js"} tab="app/index.js" mod="code" >
                        <code>app/index.js</code>
                    </Tab>
                </div>
                <CodeSnippet>{`
                    ...
                    var stop;
                    if (module.hot) {
                        // accept itself
                        module.hot.accept();

                        // remember data on dispose
                        module.hot.dispose(function (data) {
                            data.state = store.getData();
                            if (stop)
                                stop();
                        });

                        // apply data on hot replace
                        if (module.hot.data)
                            store.load(module.hot.data);
                    }
                    stop = startAppLoop(document.getElementById('app'), store, hello);
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Creating Todo widget

        In a previous section, we showed how to build a minimal application, with a
        very simple static widget. Now we will replace that static widget with a working
        Todo manager.

        First, create a subfolder `app/todo` where all the files related to our new component
        will reside. Within this folder, we will create a file `app/todo/index.js` that will hold
        the definition of our widget.

        Again, we are importing objects from several Cx modules
        we will be using, as well as a local `Controller` module. We could have defined
        the controller needed for this widget directly in the `app/todo/index.js` file, but we'll follow
        the Cx convention and put it in a separate file: `app/todo/Controller.js`.

        ### The widget

        <CodeSplit>
            As with the hello widget, our Todo widget is also wrapped in a `cx` tag, which denotes that
            it's a Cx widget.

            The widget itself is composed of several components. Top-most element, `HtmlElement` of type `div`
            has the `controller` attribute set to our `Controller` class. This means that an instance of this class
            will be in charge for this view's behavior logic, in this case, data initialization and event
            handling. All descendants of the `div` element are passed the same controller instance
            (see [Controller documentation](http://cx.codaxy.com/docs/concepts/controllers) for more details).

            The next interesting component is a `TextField`.
            This is a place where the user will enter new items for the Todo list. We're binding a value from this
            field to the value of `$page.text` value in the application store. This is a two-way binding&mdash;whenever
            a value of `$page.text` changes, the field will reflect the change; also, as the user types the text
            into the field, a value of `$page.text` will change accordingly.

            A `Button` element is a Cx wrapper around HTML button input. By clicking on this particular button, the user
            will add the item from the text field to the list of the all Todo items, so we need to insert the appropriate
            handler to it. By assigning a simple string value `"onAdd"` to its `onClick` attribute, we're connecting
            the button's click event to the method of the controller (passed down to the button from the `div` above) which
            we will explain shortly.

            To disable the button when the text field is empty, we bind its `disabled` property to
            an expression. If the result of calculating this expression is truthy (meaning, the text is empty), the
            button will be disabled. This is a very simplistic validation strategy; in real-world applications, we
            will use something more flexible, like [Validation groups](http://localhost:8065/widgets/validation-groups).

            The last part of our Todo widget is the actual dynamic list of Todo items. Here, we use a `Repeater`
            component to iterate through all items of a collection like this one:

            {`<pre>
[{
    id: 1,
    text: 'Create GitHub project',
    done: true
}, {
    id: 2,
    text: 'Explain parts of the application',
    done: false
}]
            </pre>`}

            This collection will be present in the store under the name `$page.todos`, so we're binding repeater's
            `records` attribute accordingly. Repeater component will iterate through the collection,
            instantiating the content within (in this case, an `li` item), once for each element of the collection.
            While doing so, it exposes two values to the store of each instantiated component:

            - `$record` is bound to the current item in the collection,
            - `$index` holds the index of the current item in the collection.

            The `li` element for each item in the `$page.todos` collection contains a checkbox and a button. The `text`
            property of the checkbox is bound to the current record's `text` property (`$record.text`), so that it
            shows task name. In this case, we're using one-way binding in form of a template which
            is generally more suitable for displaying formatted text
            (see [Templates](http://cx.codaxy.com/docs/concepts/data-binding#templates-code-tpl-code-)). However,
            in this basic example (template is just a value), we could have easily used a simple binding, too.

            Property `value` is bound to the `$record.done` value, so that the checkbox appears checked if
            the task is marked as done, and `$record.done` will change whenever the user changes checkbox state.
            We're also setting binding class name of the checkbox element like this:

            {`<pre>
{ "css-task-done": { bind: "$record.done "} }
            </pre>`}

            This means that the class name `css-task-done` will be applied to the checkbox element only if the `$record.done`
            value is truthy. This is just a more verbose syntax of the same binding mechanism
            (applying binding configuration object to the property instead of a more common `:bind` syntax).
            As expected, class name will be recalculated every time `$record.done` value changes
            (for example, when the user clicks on the checkbox). We can use this class in our stylesheet
            to display completed tasks as stricken through.

            The button is used for removing the task from the list. Its `onClick` property is connected to the
            controller's `onRemove` handler which we will explain shortly. In this case, we used a simple `HtmlElement`
            button, since we don't need Cx styling applied to it (we will add our own styling to it later).

            <Content name="code">
                <div>
                    <Tab value={"app/todo/index.js"} tab="app/todo/index.js" mod="code">
                        <code>app/todo/index.js</code>
                    </Tab>
                </div>

                <CodeSnippet>{`
                    import {HtmlElement} from 'cx/ui/HtmlElement';
                    import {Repeater} from 'cx/ui/Repeater';
                    import {TextField} from 'cx/ui/form/TextField';
                    import {Checkbox} from 'cx/ui/form/Checkbox';
                    import {Button} from 'cx/ui/Button';
                    import Controller from './Controller';

                    export default <cx>
                        <div class="csb-todo-wrap" controller={Controller}>
                            <div class="csb-todo">
                                <h1>Todo list</h1>

                                <div preserveWhitespace>
                                    <TextField style={{width: 320}}
                                            value:bind="$page.text"
                                            placeholder="Type a task name here"
                                            required
                                    />
                                    <Button type="button" onClick="onAdd" disabled:expr="!{$page.text}">Add</Button>
                                </div>

                                <ul class="csb-task-list">
                                    <Repeater records:bind="$page.todos">
                                        <li class="csb-task">
                                            <Checkbox class={{ "css-task-done": {bind: '$record.done'} }}
                                                    text:tpl="{$record.text}" value:bind="$record.done"/>

                                            <button onClick="onRemove" text="x"/>
                                        </li>
                                    </Repeater>
                                </ul>
                            </div>
                        </div>
                    </cx>;
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        <CodeSplit>
            ### The controller

            Although it's possible (and easy) to connect component handlers directly to functions,
            typically within the same module where the widget resides, for larger applications it
            makes sense to concentrate the behavior logic in a controller, and that's what we're
            showing in this example, too.

            Upon the controller's instantiation, the `init` method is called and, in this method, we can
            perform initialization our widget requires. Here, we're just
            making sure our `$page.todos` collection is well-defined. If the collection does not exist in the
            store, or if it's empty, we reset it to the default (a collection of one element).

            We've seen that one of our widget's buttons has a callback set to the controller's
            `onAdd` method. In this method, we want to add a new item to the `$page.todos` collection, by
            the following steps:

            - we define an `id` for the new item (we take the maximum `id` vlaue from the existing records and
                increment it by one);

            - we're adding a new item to the `$page.todos` collection (with the new `id` and the `text` set
                to the text field value read from the `$page.text` store value bound to it).
                A new collection is created by concatenating this new item to the current list of items and
                this new collection is set as the new value of `$page.todos` in the store;

            - we clear the `$page.text` value, so that the text field is cleared.

            We also need the code for removing a task from the list. Signature of the `onRemove` method
            shows that button's `onClick` handlers receive two parameters: an event object, and a target
            component instance (which contains properties like `store`, `controller`, etc.). Since the
            button is a part of the repeater's iterated content (an `li` instance), its store will have
            `$record` and `$index` values defined, set there by the repeater. We use the `$record.id`
            value to identify the record associated with the button clicked (the record we want to remove
            from the collection). Then we just create a new collection by filtering out the given record
            and set that new collection as a new value for `$page.todos`.

            Note that we don't need to set up anything in the controller for the "mark as done/undone"
            functionality&mdash;it all works simply by means of data binding.

            <Content name="code">
                <div>
                    <Tab value={"app/todo/Controller.js"} tab="app/todo/Controller.js" mod="code">
                        <code>app/todo/Controller.js</code>
                    </Tab>
                </div>

                <CodeSnippet>{`
                    import {Controller} from 'cx/ui/Controller';

                    export default class extends Controller {
                        init() {
                            super.init();
                            var items = this.store.get('$page.todos');
                            // Reset the list to default data if it's empty
                            if (!items || !items.length) {
                                items = [{ id: 1, text: 'Create a demo app', done: true }]
                                this.store.set('$page.todos', items);
                            }
                        }

                        onAdd() {
                            var items = this.store.get('$page.todos');
                            var id = items.reduce((acc, item) => Math.max(acc, item.id), 0) + 1;
                            items = items.concat({
                                id: id,
                                text: this.store.get('$page.text') || \`Untitled ($\{id\})\`,
                                done: false
                            });

                            this.store.set('$page.todos', items);
                            this.store.delete('$page.text');
                        }

                        onRemove(e, {store}) {
                            var id = store.get('$record.id');
                            var items = this.store.get('$page.todos');
                            this.store.set('$page.todos', items.filter(item => item.id !== id));
                        }
                    }
                `}</CodeSnippet>
            </Content>
        </CodeSplit>


        ## Using Todo widget in our application

        <CodeSplit>
            Now let's use our newly created Todo widget in our application in place of the
            hello widget we defined earlier. In the `app/index.js` file, we need to import the
            widget and pass it to the `startAppLoop` as the root widget of the application.

            We can now run our application again (`npm start`) to make sure everything is
            working correctly.

            <div class="widgets">
                <Todo />
            </div>

            <Content name="code">
                <div>
                    <Tab value={{bind:"$page.todo2.tab", defaultValue: "index"}} tab="index" mod="code" >
                        <code>app/index.js</code>
                    </Tab>
                </div>
                <CodeSnippet>{`
                    ...
                    import Todo from './todo';
                    ...
                    stop = startAppLoop(document.getElementById('app'), store, Todo);
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        <CodeSplit>
            Also, we want to style the widget a bit, so we will add the following line in the `app/index.scss`
            file and create the new `app/todo/index.scss` file. In this file we can add any style definitions
            concerning this particular widget. A sample `app/todo/index.scss` can be downloaded from
            [here](https://github.com/codaxy/cx-getting-started/blob/master/app/index.scss).

            <Content name="code">
                <div>
                    <Tab value={{bind:"$page.todo3.tab", defaultValue: "scss"}} tab="scss" mod="code" >
                        <code>app/index.scss</code>
                    </Tab>
                </div>
                <CodeSnippet>{`
                    @import "~cx-core/src/index";
                    @import "todo/index";
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        After these changes, the new look should be applied immediately, and we can play with it
        until we get the final version of our application that we're satisfied with.

        ## Cx Starter Kit

        This concludes our tutorial in which we showed how to create a Cx application from scratch
        and explained its main elements.

        <CodeSplit>
            For new projects, however, it is much more convenient to use our
            [Cx Starter Kit boilerplate application](https://gitlab.com/codaxy/cx-starter-kit),
            which has all of the elements described here (plus many other features
            needed for building large client-side applications, such as routing, application layout,
            ready-to-use design, consistent folder structure, etc.) already set up.

            <Content name="code">
                <CodeSnippet>{`
                    git clone https://gitlab.com/codaxy/cx-starter-kit
                `}</CodeSnippet>
            </Content>
        </CodeSplit>
   </Md>
</cx>

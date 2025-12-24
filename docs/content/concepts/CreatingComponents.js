import { Md } from "../../components/Md";
import { Content, FlexCol, Slider, Tab, Widget } from "cx/widgets";
import { CodeSplit } from "../../components/CodeSplit";
import { CodeSnippet } from "../../components/CodeSnippet";

class Square extends Widget{
    declareData(...args) {
        super.declareData(
            {
                red: undefined,
                green: undefined,
                blue: undefined
            },
            ...args
        );
    }

    setRandomColor(e, instance) {
        instance.set('red', Math.random() * 255);
        instance.set('green', Math.random() * 255);
        instance.set('blue', Math.random() * 255);
    }

    render(_context, instance, key) {
        let { data } = instance;
        return (
            <div
                key={key}
                style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: `rgb(${data.red}, ${data.green}, ${data.blue})`,
                    padding: 10,
                }}
                onClick={(e) => this.setRandomColor(e, instance)}
            />
        );
    }
}

Square.prototype.red = 0;
Square.prototype.blue = 0;
Square.prototype.green = 0;

export const CreatingComponents = <cx>
    <Md>
        # Creating new CxJS components

        Although CxJS contains a large set of built-in components, you might sometimes need to create
        a custom CxJS component for your use case. In this guide, we'll go over the steps to create
        a simple custom component, `Square`, whose color is set through **binding**. Sliders will
        update the color in the `store`, and that will cause our component to re-render. If you click on the component itself,
        it will change its color to a random one.

        Try moving the sliders below and see how the color changes.

        <CodeSplit>
            <div class="widgets">
                <FlexCol>
                    <Slider label="Red" value-bind="$page.red" minValue={0} maxValue={255} />
                    <Slider label="Green" value-bind="$page.green" minValue={0} maxValue={255} />
                    <Slider label="Blue" value-bind="$page.blue" minValue={0} maxValue={255} />
                </FlexCol>
                <Square red-bind="$page.red" green-bind="$page.green" blue-bind="$page.blue" />
            </div>

            <Content name="code">
                <Tab value-bind="$page.code1.tab" mod="code" tab="component" text="Component" default />
                <Tab value-bind="$page.code1.tab" mod="code" tab="usage" text="Usage" />

                <CodeSnippet visible-expr="{$page.code1.tab}=='component'">{`
                class Square extends Widget {
                    declareData(...args) {
                        super.declareData(
                            {
                                red: undefined,
                                green: undefined,
                                blue: undefined
                            },
                            ...args
                        );
                    }

                    setRandomColor(e, instance) {
                        instance.set('red', Math.random() * 255);
                        instance.set('green', Math.random() * 255);
                        instance.set('blue', Math.random() * 255);
                    }

                    render(_context, instance, key) {
                        let { data } = instance;
                        return (
                            <div
                                key={key}
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    backgroundColor: \`rgb(\${data.red}, \${data.green}, \${data.blue})\`,
                                    padding: 10,
                                }}
                                onClick={(e) => this.setRandomColor(e, instance)}
                            />
                        );
                    }
                }

                Square.prototype.red = 0;
                Square.prototype.blue = 0;
                Square.prototype.green = 0;
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code1.tab}=='usage'">{`
                    <FlexCol>
                        <Slider label="Red" value-bind="$page.red" minValue={0} maxValue={255} />
                        <Slider label="Green" value-bind="$page.green" minValue={0} maxValue={255} />
                        <Slider label="Blue" value-bind="$page.blue" minValue={0} maxValue={255} />
                    </FlexCol>
                    <Square red-bind="$page.red" green-bind="$page.green" blue-bind="$page.blue" />
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        Before proceeding, we highly recommend reviewing the [Widgets](/concepts/widgets) documentation
        for better understanding.

        To create a custom component, you typically define a class that extends one of the existing CxJS
        component classes, e.g. `Widget`, `Field`, `Container`, or `PureContainer`, based on the functionality and purpose of the
        component you're building.

        ## Methods

        ### `declareData()`

        This method is used in  components to declare dynamic properties that can be bound to certain paths in the store.
        In the `Square` component, `declareData()` declares `red`, `green`, and `blue` properties. These fields correspond
        to the RGB values determining the initial color of the square, if specified.

        The value `undefined` associated with properties means that this property has no special processing flags.
        You may use `&#123; structured: true &#125;` to annotate a property as a structured field which can receive objects
        whose properties are also bindable.

        You can set the initial values of these properties by using the `prototype` property of the component class.

        ### `init()`

        This is a lifecycle method that is called **once** when the widget is initialized, **before** it
        is rendered for the first time. We don't use it in our `Square` component as it's fairly simple.

        ### `initState()`

        This is a lifecycle method that is used for setting the initial component state. This is used only for components which have
        an internal state, which is not the case with the `Square` component.

        ### `initInstance()`

        This is a lifecycle method that is used for setting up each instance of a widget. For example, if a widget is rendered
        within a Repeater, `initInstance()` will be called for each item in the Repeater, while `init` will be called only once.

        ### `render()`

        The `render()` method is a fundamental part of CxJS components. It defines how a component
        should be rendered based on its current state and props. In the `Square` component, it renders
        a fixed-size square whose color depends on the bound values.

        ### `VDOM.Component`

        `VDOM.Component` is the base class for CxJS components that use **virtual DOM** (**VDOM**) for
        rendering. It's an alias for `React.Component` or `Preact.Component` depending on the chosen VDOM library.

        ## Using React components in CxJS applications

        Similarly to creating new components, we can use existing React components in our CxJS apps.
        Take a look at [this example](https://github.com/ognjenst/cxjs-widget-mask-field) to learn more
        about it.
    </Md>
</cx>
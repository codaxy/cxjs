import { Md } from "../../components/Md";
import { Content, FlexCol, Slider, Tab } from "cx/widgets";
import { CodeSplit } from "../../components/CodeSplit";
import { CodeSnippet } from "../../components/CodeSnippet";
import { Widget } from "../../../packages/cx/src/ui/Widget";

class Square extends Widget {
    declareData() {
        super.declareData(
            {
                red: 0,
                green: 0,
                blue: 0
            },
            ...arguments
        );
    }

    getColorFromRgb(red, green, blue) {
        return `rgb(${red}, ${green}, ${blue})`;
    }

    render(_context, { data }, key) {
        return (
            <div
                key={key}
                style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: this.getColorFromRgb(
                        data.red, data.green, data.blue
                    ),
                    padding: 10,
                }}
            />
        );
    }
}

export const CreatingComponents = <cx>
    <Md>
        # Creating new CxJS components

        Although CxJS contains a large set of built-in components, you might sometimes need to create
        a custom CxJS component for your use case. In this guide, we'll go over the steps to create
        a simple custom component, `Square`, whose color is set through **binding**. Sliders will
        update the color in the `store`, and that will cause our component to re-render.

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
                        declareData() {
                            super.declareData(
                                {
                                    red: 0,
                                    green: 0,
                                    blue: 0
                                },
                                ...arguments
                            );
                        }

                        getColorFromRgb(red, green, blue) {
                            return \`rgb(\${red}, \${green}, \${blue})\`;
                        }

                        render(_context, { data }, key) {
                            return (
                                <div
                                    key={key}
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        backgroundColor: this.getColorFromRgb(
                                            data.red, data.green, data.blue
                                        ),
                                        padding: 10,
                                    }}
                                />
                            );
                        }
                    }

                    Widget.alias("square", Square);
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
        component classes, e.g. `Widget` or `Field`, based on the functionality and purpose of the
        component you're building.

        ## Concepts

        ### `declareData()`

        This method is often used in custom components to declare the expected properties
        (data fields) that can be passed to the component. In the `Square` component, `declareData()`
        is used to specify the expected data fields `red`, `green`, and `blue`. These fields correspond
        to the RGB values determining the inital color of the square, if specified.

        ### `onInit()`

        This is a lifecycle method that is called **once** when the widget is initialized, **before** it
        is rendered for the first time. We don't use it in our `Square` component as it's fairly simple,
        but it is usually used for setting the initial state.

        ### `render()`

        The `render()` method is a fundamental part of CxJS components. It defines how a component
        should be rendered based on its current state and props. In the `Square` component, it renders
        a fixed-size square whose color depends on the binded values.

        ### `Widget.alias()`

        `Widget.alias()` is used to register a custom component under a specific alias.

        ### `VDOM.Component`

        `VDOM.Component` is the base class for CxJS components that use **virtual DOM** (**VDOM**) for
        rendering.

        ## Using React components in CxJS applications
        Similarly to creating new components, we can use existing React components in our CxJS apps.
        Take a look at [this example](https://github.com/ognjenst/cxjs-widget-mask-field) to learn more
        about it.
    </Md>
</cx>
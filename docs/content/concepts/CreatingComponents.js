import { Md } from "../../components/Md";
import { Content, Tab } from "cx/widgets";
import { CodeSplit } from "../../components/CodeSplit";
import { CodeSnippet } from "../../components/CodeSnippet";
import { Widget } from "../../../packages/cx/src/ui/Widget";

class Square extends Widget {
    declareData() {
        super.declareData(
            {
                red: undefined,
                green: undefined,
                blue: undefined
            },
            ...arguments
        );
    }

    onInit(_context, instance) {
        const { red, green, blue } = this;

        if (red && green && blue) {
            // Set the initial color based on the props
            instance.setState({ color: this.getColorFromRgb(red, green, blue) });
        } else {
            instance.setState({ color: this.getRandomColor() });
        }
    }

    getRandomColor() {
        const getRandomRgbValue = () => (
            Math.floor(Math.random() * 200)
            // Not 256 because we wouldn't see a white square
        );

        return this.getColorFromRgb(getRandomRgbValue(), getRandomRgbValue(), getRandomRgbValue());
    }

    getColorFromRgb(red, green, blue) {
        return `rgb(${red}, ${green}, ${blue})`;
    }

    handleClick(e, instance) {
        e.preventDefault();
        instance.setState({ color: this.getRandomColor() });
    }

    render(_context, instance, key) {
        return (
            <div
                key={key}
                style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: instance.state.color,
                    padding: 10,
                    cursor: "pointer"
                }}
                onClick={(e) => this.handleClick(e, instance)}
            />
        );
    }
}

export const CreatingComponents = <cx>
    <Md>
        # Creating new CxJS components

        Although CxJS contains a large set of built-in components, you might sometimes need to create
        a custom CxJS component for your use case. In this guide, we'll go over the steps to create
        a simple custom component, `Square`, that changes its background color when clicked.

        <CodeSplit>
            <div class="widgets">
                <Square red={100} green={150} blue={255} />
                <Square />
            </div>

            <Content name="code">
                <Tab value-bind="$page.code1.tab" mod="code" tab="component" text="Component" default />
                <Tab value-bind="$page.code1.tab" mod="code" tab="usage" text="Usage" />

                <CodeSnippet visible-expr="{$page.code1.tab}=='component'">{`
                    class Square extends Widget {
                        declareData() {
                            super.declareData(
                                {
                                    red: undefined,
                                    green: undefined,
                                    blue: undefined
                                },
                                ...arguments
                            );
                        }

                        onInit(_context, instance) {
                            const { red, green, blue } = this;

                            if (red && green && blue) {
                                // Set the initial color based on the props
                                instance.setState({ color: this.getColorFromRgb(red, green, blue) });
                            } else {
                                instance.setState({ color: this.getRandomColor() });
                            }
                        }

                        getRandomColor() {
                            const getRandomRgbValue = () => (
                                Math.floor(Math.random() * 200)
                                // Not 256 because we wouldn't see a white square
                            );

                            return this.getColorFromRgb(getRandomRgbValue(), getRandomRgbValue(), getRandomRgbValue());
                        }

                        getColorFromRgb(red, green, blue) {
                            return \`rgb(\${red}, \${green}, \${blue})\`;
                        }

                        handleClick(e, instance) {
                            e.preventDefault();
                            instance.setState({color: this.getRandomColor() });
                        }

                        render(_context, instance, key) {
                            return (
                                <div
                                    key={key}
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        backgroundColor: instance.state.color,
                                        padding: 10,
                                        cursor: "pointer"
                                    }}
                                    onClick={(e) => this.handleClick(e, instance)}
                                />
                            );
                        }
                    }

                    Widget.alias("square", Square);
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code1.tab}=='usage'">{`
                    // With props
                    <Square red={100} green={150} blue={255} />

                    // Without props
                    <Square />
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

        This is a lifecycle method that is called when the widget is initialized, before it is rendered
        for the first time. In our `Square` component, we use it to set the initial color of the square.

        ### `render()`

        The `render()` method is a fundamental part of CxJS components. It defines how a component
        should be rendered based on its current state and props. In the `Square` component, it renders
        a fixed-size square whose color depends on the state.

        ### `Widget.alias()`

        `Widget.alias()` is used to register a custom component under a specific alias.

        ### `VDOM.Component`

        `VDOM.Component` is the base class for CxJS components that use **virtual DOM** (**VDOM**) for
        rendering.

        In our case, the state holds square's current color. We set the state in the `onInit()` method
        depending on the passed props. If the initial color is provided using the RGB props, we call
        `getColorFromRgb()` method to set the color. Otherwise, we invoke `getRandomColor()` to assign
        a random color. `render()` method renders a square and assigns an `onClick()` event callback
        that updates the state (color) and causes a re-render.

        ## Using React components in CxJS applications
        Similarly to creating new components, we can use existing React components in our CxJS apps.
        Take a look at [this example](https://github.com/ognjenst/cxjs-widget-mask-field) to learn more
        about it.
    </Md>
</cx>
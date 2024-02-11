import { Md } from "../../components/Md";
import { Content, Tab } from "cx/widgets";
import { CodeSplit } from "../../components/CodeSplit";
import { CodeSnippet } from "../../components/CodeSnippet";
import { VDOM, Widget } from "../../../packages/cx/src/ui/Widget";

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

    render(_context, { data }, key) {
        const { red, green, blue } = data;
        return <SquareCmp
            key={key}
            red={red}
            green={green}
            blue={blue}
        />;
    }
}

class SquareCmp extends VDOM.Component {
    constructor(props) {
        super(props);

        const { red, green, blue } = props;
        this.state = {
            color: (red && green && blue) ?
                this.getColorFromRgb(red, green, blue) : this.getRandomColor()
        };
    }

    getRandomColor() {
        const getRandomRgbValue = () => (
            Math.floor(Math.random() * 200) // Not 256 because we wouldn't see a white square
        );

        return this.getColorFromRgb(getRandomRgbValue(), getRandomRgbValue(), getRandomRgbValue());
    }

    getColorFromRgb(red, green, blue) {
        return `rgb(${red}, ${green}, ${blue})`;
    }

    handleClick(e) {
        e.preventDefault();
        this.setState({ color: this.getRandomColor() });
    }

    render() {
        return (
            <div
                style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: this.state.color,
                    padding: 10,
                    cursor: "pointer"
                }}
                onClick={(e) => this.handleClick(e)}
            />
        )
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

                        render(_context, { data }, key) {
                            const { red, green, blue } = data;
                            return <SquareCmp
                                key={key}
                                red={red}
                                green={green}
                                blue={blue}
                            />;
                        }
                    }

                    Widget.alias("square", Square);

                    class SquareCmp extends VDOM.Component {
                        constructor(props) {
                            super(props);

                            const { red, green, blue } = props;
                            this.state = {
                                color: (red && green && blue) ?
                                    this.getColorFromRgb(red, green, blue) : this.getRandomColor()
                            };
                        }

                        getRandomColor() {
                            const getRandomRgbValue = () => (
                                Math.floor(Math.random() * 200) // Not 256 because we wouldn't see a white square
                            );

                            return this.getColorFromRgb(getRandomRgbValue(), getRandomRgbValue(), getRandomRgbValue());
                        }

                        getColorFromRgb(red, green, blue) {
                            return \`rgb(\${red}, \${green}, \${blue})\`;
                        }

                        handleClick(e) {
                            e.preventDefault();
                            this.setState({color: this.getRandomColor() });
                        }

                        render() {
                            return (
                                <div
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        backgroundColor: this.state.color,
                                        padding: 10,
                                        cursor: "pointer"
                                    }}
                                    onClick={(e) => this.handleClick(e)}
                                />
                            )
                        }
                    }
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

        ### `declareData()`

        This method is often used in custom components to declare the expected properties
        (data fields) that can be passed to the component. In the `Square` component, `declareData()`
        is used to specify the expected data fields `red`, `green`, and `blue`. These fields correspond
        to the RGB values determining the inital color of the square, if specified.

        ### `render()`

        The `render()` method is a fundamental part of CxJS components. It defines how the component
        should be rendered based on its current state and props. In the `Square` component, the
        `render()` method is responsible for rendering the actual `SquareCmp` JSX component. It
        extracts properties from the component's data and passes them down to `SquareCmp`.

        ### `Widget.alias()`

        `Widget.alias()` is used to register a custom component under a specific alias.

        ### `VDOM.Component`

        `VDOM.Component` is the base class for CxJS components that use **virtual DOM** (**VDOM**) for
        rendering. In the `SquareCmp` class, we extend `VDOM.Component` to create a new component
        class that can manage its own state and lifecycle methods.

        In our case, the state holds square's current color. We set the state in the constructor
        depending on the passed props. If the initial color is provided using the RGB props, we call
        `getColorFromRgb()` method to set the color. Otherwise, we invoke `getRandomColor()` to assign
        a random color. `render()` method renders a square and assigns an `onClick()` event callback
        that updates the state (color) and causes a re-render.
    </Md>
</cx>
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
        a simple custom component.

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
    </Md>
</cx>
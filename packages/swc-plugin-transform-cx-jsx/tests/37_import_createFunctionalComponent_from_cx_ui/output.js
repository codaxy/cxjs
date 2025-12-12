import { createFunctionalComponent } from "cx/ui";
import { HtmlElement } from "cx/widgets";
let MyComponent = createFunctionalComponent((props)=>({
        "$type": HtmlElement,
        "tag": "div",
        "text": props.text,
        "jsxAttributes": [
            "text"
        ]
    }));
let AnotherComponent = createFunctionalComponent((props)=>({
        "$type": HtmlElement,
        "tag": "span",
        "text": props.name,
        "jsxAttributes": [
            "text"
        ]
    }));

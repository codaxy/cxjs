// Test that createFunctionalComponent is imported from cx/ui (not cx/src/ui/createFunctionalComponent.js)
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
import { createFunctionalComponent } from "cx/ui";
import { HtmlElement } from "cx/widgets";

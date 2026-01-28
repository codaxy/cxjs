import { HtmlElement } from "cx/widgets";
// Test self-closing tags with spread and attributes
let props = {
    className: "test",
    id: "myInput"
};
let component = {
    "$type": HtmlElement,
    "tag": "input",
    "type": "text",
    "placeholder": "Enter text",
    "jsxSpread": [
        props
    ],
    "jsxAttributes": [
        "type",
        "placeholder"
    ]
};

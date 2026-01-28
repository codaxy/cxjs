import { HtmlElement } from "cx/widgets";
// Test multiple spreads in one element
let props1 = {
    a: 1
};
let props2 = {
    b: 2
};
let component = {
    "$type": HtmlElement,
    "tag": "div",
    "className": "test",
    "id": "myDiv",
    "jsxSpread": [
        props1,
        props2
    ],
    "jsxAttributes": [
        "className",
        "id"
    ]
};

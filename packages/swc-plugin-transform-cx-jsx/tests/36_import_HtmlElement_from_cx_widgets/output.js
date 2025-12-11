// Test that HtmlElement is imported from cx/widgets (not cx/src/widgets/HtmlElement.js)
let component = [
    {
        "$type": HtmlElement,
        "tag": "div",
        "children": [
            "Hello"
        ]
    },
    {
        "$type": HtmlElement,
        "tag": "span",
        "children": [
            "World"
        ]
    }
];
import { HtmlElement } from "cx/widgets";

import { HtmlElement } from "cx/widgets";
// Test nested cx blocks
let component = {
    "$type": HtmlElement,
    "tag": "div",
    "className": "outer",
    "jsxAttributes": [
        "className"
    ],
    "children": [
        condition && {
            "$type": HtmlElement,
            "tag": "span",
            "className": "inner",
            "jsxAttributes": [
                "className"
            ],
            "children": [
                "Nested content"
            ]
        }
    ]
};

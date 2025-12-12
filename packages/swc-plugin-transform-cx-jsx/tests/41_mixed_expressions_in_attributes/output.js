import { HtmlElement } from "cx/widgets";
// Test mixed expressions in attributes
let active = true;
let component = {
    "$type": HtmlElement,
    "tag": "div",
    "className": `base ${active ? 'active' : 'inactive'}`,
    "style": {
        color: 'red',
        fontSize: 14
    },
    "onClick": (e)=>handleClick(e),
    "data-count": items.length,
    "jsxAttributes": [
        "className",
        "style",
        "onClick",
        "data-count"
    ]
};

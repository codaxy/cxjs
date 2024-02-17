import { Button } from "cx/widgets";
import { createFunctionalComponent } from "cx/ui";
export default createFunctionalComponent(({ asd })=>{
    let a = 5;
    return {
        "$type": Button,
        "asd": true,
        "text": "   asd   ",
        "jsxAttributes": [
            "asd",
            "text"
        ]
    };
});
import { Md } from "docs/components/Md";

import boundedObject from "../../svg/configs/BoundedObject";
import noChildren from "../../widgets/configs/noChildren";

export default {
    ...boundedObject,
    ...noChildren,
    x: {
    key: true,
    type: 'string/number',
    description: <cx><Md>
        The `x` value binding or expression.
    </Md></cx>
    },

    y: {
        key: true,
        type: 'string/number',
        description: <cx><Md>
            The `y` value binding or expression.
        </Md></cx>
    },
    size: {
        key: true,
        type: "number",
        description: (
            <cx>
                <Md>Represents a swimlane size.</Md>
            </cx>
        ),
    },
    vertical: {
        key: true,
        type: "boolean",
        description: (
            <cx>
                <Md>Switch to vertical swimlane.</Md>
            </cx>
        ),
    },
    laneStyle: {
        type: "string/object",
        description: (
            <cx>
                <Md>Style object applied to the swimlane. </Md>
            </cx>
        ),
    },
    laneOffset: {
        type: "number",
        description: (
            <cx>
                <Md>
                The laneOffset property adjusts the positioning of lane elements, enhancing their alignment and
                readability.
                </Md>
            </cx>
        ),
    },
};

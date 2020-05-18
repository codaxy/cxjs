import { Md } from "docs/components/Md";

import columnBarBase from "./ColumnBarBase";

export default {
    ...columnBarBase,

    y0: {
        type: "number",
        key: true,
        description: (
            <cx>
                <Md>Column base value. Default value is `0`.</Md>
            </cx>
        ),
    },
    hiddenBase: {
        type: "boolean",
        description: (
            <cx>
                <Md>
                    If set to `true`, the chart can clip the base of the graph and show only the appropriate range that
                    contains the values. Default value is `false`.
                </Md>
            </cx>
        ),
    },

    minPixelHeight: {
        type: "number",
        description: (
            <cx>
                <Md>Minimum column size in pixels. Useful for indicating very small values. Default value is `0.5`.</Md>
            </cx>
        ),
    },
};

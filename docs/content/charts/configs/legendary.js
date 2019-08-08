import {Md} from 'docs/components/Md';
import {ShapeRender} from "cx/src/charts";

export default {
    active: {
        key: false,
        type: 'boolean',
        description: <cx><Md>
            Used to indicate if an item is active or not. Inactive items are shown only in the legend.
        </Md></cx>
    },
    name: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Name of the item as it will appear in the legend.
        </Md></cx>
    },
    legend: {
        key: false,
        type: 'string',
        description: <cx><Md>
            Name of the legend to be used. Default is `legend`.
        </Md></cx>
    },
    colorIndex: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Index of a color from the standard palette of colors. 0-15.
        </Md></cx>
    },
    colorMap: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Used to automatically assign a color based on the `colorName` and the contextual `ColorMap` widget.
        </Md></cx>
    },
    colorName: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Name used to automatically resolve color based from the contextual `ColorMap` widget. If value is not
            provided,
            `name` is used instead.
        </Md></cx>
    },
    legendAction: {
        type: 'string',
        description: <cx><Md>
            Action to be performed if the user clicks on the legend entry. Default value is `auto`. Other permitted
            values are `toggle` and `select`.
        </Md></cx>
    },
    legendShape: {
        type: 'string',
        description: <cx><Md>
            Shape of the icon in the the legend. Default value is based on the chart type.
            Additional shapes can be registered using the `registerShape` function. Out of the box, CxJS offers
            `square`, `bar`, `column`, `line`, `vline` and `triangle` shapes.
        </Md></cx>
    }
};

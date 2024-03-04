import { Md } from 'docs/components/Md';

import pureContainer from '../../widgets/configs/PureContainer';
import classAndStyle from '../../widgets/configs/classAndStyle';

export default {
    ...pureContainer,
    ...classAndStyle,
    active: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Used to indicate whether an item is active or not. Inactive items are shown only in the legend.
      </Md></cx>
    },
    r: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Outer pie radius in percents of the maximum available radius. If `percentageRadius` flag is set to false, then
            the value represents the radius in pixels. Default is `50`.
      </Md></cx>
    },
    offset: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Value in pixels to be used to *explode* the pie.
      </Md></cx>
    },
    r0: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Inner pie radius in percents of the maximum available radius. If `percentageRadius` flag is set to false, then
            the value represents the radius in pixels. Default is `0`.
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
    stack: {
        key: false,
        type: 'string',
        description: <cx><Md>
            Multi-level pie charts consist of multiple stacks. Assign a unique name to each level. Default is `stack`.
      </Md></cx>
    },
    selection: {
        key: true,
        type: 'config',
        description: <cx><Md>
            [Selection](~/concepts/selections) model to be used.
      </Md></cx>
    },

    hoverChannel: {
        type: 'string',
        description: <cx><Md>
            A value used to identify the group of components participating in hover effect synchronization. See [HoverSync](~/charts/hover-sync).
        </Md></cx>
    },

    hoverId: {
        type: 'string',
        description: <cx><Md>
            A value used to uniquely identify the record within the hover sync group. See [HoverSync](~/charts/hover-sync).
        </Md></cx>
    },

    borderRadius: {
        key: true,
        alias: 'br',
        type: 'number',
        description: <cx><Md>
            Border radius of the slice. Default is `0`.
        </Md></cx>
    },
};

import { Md } from '../../../components/Md';

export default {
    visible: {
        type: 'boolean',
        alias: 'if',
        description: <cx><Md>
            Visibility of the widget. Defaults to `true`.
        </Md></cx>
    },
    mod: {
        type: 'string/array',
        description: <cx><Md>
            Appearance modifier. For example, `mod="big"` will add the CSS class `.cxm-big` to the block element.
        </Md></cx>
    },
    outerLayout: {
        type: 'widget',
        description: <cx><Md>
            Defines the outer layout which wraps the widget.
        </Md></cx>
    },
    putInto: {
        type: 'string',
        alias: 'contentFor',
        description: <cx><Md>
            Used with outer layouts. Specifies the name of the content placeholder which should render the widget.
        </Md></cx>
    },
    vdomKey: {
        type: 'string',
        description: <cx><Md>
            Key that will be used as the key when rendering the React component.
        </Md></cx>
    }
};

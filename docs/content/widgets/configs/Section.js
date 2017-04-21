import {Md} from '../../../components/Md';
import container from './PureContainer';
import classAndStyle from './classAndStyle';

export default {
    ...container,
    ...classAndStyle,
    pad: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Add default padding to the section body. Default is `true`.
        </Md></cx>
    },
    title: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Section's title.
        </Md></cx>
    },
    header: {
        type: 'config',
        key: true,
        description: <cx><Md>
            Contents that should go in the header.
        </Md></cx>
    },
    headerStyle: {
        type: 'string/object',
        key: true,
        description: <cx><Md>
            A custom style which will be applied to the header.
        </Md></cx>
    },
    footerStyle: {
        type: 'string/object',
        key: true,
        description: <cx><Md>
            A custom style which will be applied to the footer.
        </Md></cx>
    },
    bodyStyle: {
        type: 'string/object',
        key: true,
        description: <cx><Md>
            A custom style which will be applied to the body.
        </Md></cx>
    },
    headerClass: {
        type: 'string/object',
        key: true,
        description: <cx><Md>
            Additional CSS class to be applied to the header.
        </Md></cx>
    },
    footerClass: {
        type: 'string/object',
        key: true,
        description: <cx><Md>
            Additional CSS class to be applied to the footer.
        </Md></cx>
    },
    bodyClass: {
        type: 'string/object',
        key: true,
        description: <cx><Md>
            Additional CSS class to be applied to the section body.
        </Md></cx>
    },
    footer: {
        type: 'config',
        key: true,
        description: <cx><Md>
            Contents that should go in the footer.
        </Md></cx>
    },
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the element. Default is 'section'.
        </Md></cx>
    }
};

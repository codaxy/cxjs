import {Md} from '../../../components/Md';
import classAndStyle from './classAndStyle';

export default {
    ...classAndStyle,
    horizontal: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Make resizer horizontal.
        </Md></cx>
    },
    forNextElement: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Use the element after the resizer for size measurements.
        </Md></cx>
    },
    size: {
        type: 'number',
        key: true,
        description: <cx><Md>
            A binding for the new size which is in pixels.
        </Md></cx>
    },
    defaultSize: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Default size that will be set when the user double-clicks the resizer. Default size value is `null`.
        </Md></cx>
    },
    minSize: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Minimum size of the element in pixels.
        </Md></cx>
    },
    maxSize: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Maximum size of the element in pixels.
        </Md></cx>
    },
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the element. Default is 'resizer'.
        </Md></cx>
    }

};

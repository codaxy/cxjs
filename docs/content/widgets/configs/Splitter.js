import {Md} from '../../../components/Md';
import classAndStyle from './classAndStyle';

export default {
    ...classAndStyle,
    horizontal: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Make splitter horizontal.
        </Md></cx>
    },
    forNextElement: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Use the element after the the splitter for size measurements.
        </Md></cx>
    },
    value: {
        type: 'number',
        key: true,
        description: <cx><Md>
            A binding for the new size which is in pixels.
        </Md></cx>
    },
    defaultValue: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Default value that will be set when the user double click on the splitter. Default value is `null`.
        </Md></cx>
    },
    minValue: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Minimum size of the element in pixels.
        </Md></cx>
    },
    maxValue: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Maximum size of the element in pixels.
        </Md></cx>
    },
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the element. Default is 'splitter'.
        </Md></cx>
    }

};

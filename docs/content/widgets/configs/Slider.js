import {Md} from '../../../components/Md';
import field from './Field';

export default {
    ...field,
    to: {
        key: true,
        alias: 'value',
        type: 'number',
        description: <cx><Md>
            High value of the slider range.
        </Md></cx>
    },
    from: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Low value of the slider range.
        </Md></cx>
    },
    min: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Minimum allowed value. Default is `0`.
        </Md></cx>
    },
    max: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Maximum allowed value. Default is `100`.
        </Md></cx>
    },
    step: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Rounding step.
        </Md></cx>
    },
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied on the field. Defaults to `slider`.
        </Md></cx>
    },
};
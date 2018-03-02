import {Md} from '../../../components/Md';
import field from './Field';
import calendar from './Calendar';

let {
    minValue, 
    minExclusive, 
    maxValue, 
    maxExclusive, 
} = calendar;

export default {
    minValue,
    minExclusive,
    maxValue,
    maxExclusive,
    ...field,
    format: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Template used to format the value. Examples: `ps` - percentage sign; `n;2` - two decimals.
            By default, number formatting is applied with optional maximum decimal precision.
        </Md></cx>
    },
    value: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Value of the input.
        </Md></cx>
    },
    reactOn: {
        type: 'string',
        description: <cx><Md>
            Defaults to `input`. Other permitted values are `enter` and `blur`. Multiple values should be separated by
            space,
            .e.g. 'enter blur'.
        </Md></cx>
    },
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the field. Defaults to `numberfield`.
        </Md></cx>
    },
    increment: {
        key: true,
        alias: 'step',
        type: 'number',
        description: <cx><Md>
            Increment/decrement value when using arrow keys or mouse wheel.
        </Md></cx>
    },
    snapToIncrement: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Round values to the nearest tick. Default is `true`.
        </Md></cx>
    },
    incrementPercentage: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Percentage used to calculate the increment when it's not explicitly specified.
            Default value is `0.1` (10%).
        </Md></cx>
    },
    showClear: {
        type: 'string',
        description: <cx><Md>
            Set to `false` to hide the clear button. It can be used interchangeably with the `hideClear` property.
            Default value is `false`.
        </Md></cx>
    },
    alwaysShowClear: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to display the clear button even if `required` is set. Default value is `false`.
        </Md></cx>
    },
    hideClear: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to hide the clear button. It can be used interchangeably with the `showClear` property.
            Default value is `true`.
        </Md></cx>
    },
    scale: {
        type: 'number',
        key: true,
        description: <cx><Md>
            A scale used to define mapping between displayed and stored values. E.g. 0.01 for displaying percentages. `DV = (SV - OFFSET) / SCALE`
        </Md></cx>
    },
    offset: {
        type: 'number',
        key: true,
        description: <cx><Md>
            An offset used to define mapping between displayed and stored values. E.g. 273.15 for displaying temperatures in Kelvins. `DV = (SV - OFFSET) / SCALE`
        </Md></cx>
    }
};
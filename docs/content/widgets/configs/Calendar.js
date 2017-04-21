import {Md} from '../../../components/Md';
import field from './Field';

export default {
    ...field,
    icon: false,
    showClear: false,
    hideClear: false,
    value: {
        type: 'string/Date',
        key: true,
        description: <cx><Md>
            Selected date. This should be a `Date` object or a valid date string consumable by `Date.parse` function.
        </Md></cx>
    },
    refDate: {
        type: 'string/Date',
        key: true,
        description: <cx><Md>
            View reference date. If no date is selected, this date is used to determine which month to show in the
            calendar.
        </Md></cx>
    },
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the calendar. Defaults to `calendar`.
        </Md></cx>
    },
    highlightToday: {
        type: 'boolean',
        description: <cx><Md>
            Highlight today's date. Default is `true`.
        </Md></cx>
    },
    minValue: {
        type: 'string/Date',
        description: <cx><Md>
            Minimum date value. This should be a `Date` object or a valid date string consumable by `Date.parse` function.
        </Md></cx>
    }, 
    minExclusive: {
        type: 'string/Date',
        description: <cx><Md>
            Minimum (exclusive) date value. This should be a `Date` object or a valid date string consumable by `Date.parse` function.
        </Md></cx>
    }, 
    maxValue: {
        type: 'string/Date',
        description: <cx><Md>
            Maximum date value. This should be a `Date` object or a valid date string consumable by `Date.parse` function.
        </Md></cx>
    }, 
    maxExclusive: {
        type: 'string/Date',
        description: <cx><Md>
            Maximum (exclusive) date value. This should be a `Date` object or a valid date string consumable by `Date.parse` function.
        </Md></cx>
    }
};

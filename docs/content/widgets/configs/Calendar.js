import {Md} from '../../../components/Md';
import field from './Field';

export default {
    ...field,
    value: {
        type: 'string/Date',
        key: true,
        description: <cx><Md>
            Selected date. This should be a valid date string consumable by `Date.parse` function.
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
            Base CSS class to be applied on the calendar. Defaults to `calendar`.
        </Md></cx>
    },
    highlightToday: {
        type: 'boolean',
        description: <cx><Md>
            Highlight today's date. Default is `true`.
        </Md></cx>
    }
};

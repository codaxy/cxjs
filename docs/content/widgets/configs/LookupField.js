import {Md} from '../../../components/Md';
import field from './Field';

export default {
    ...field,
    value: {
        type: 'number/string',
        key: true,
        description: <cx><Md>
            Selected value. Used only if `multiple` is set to `false`.
        </Md></cx>
    },
    text: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Text associated with the selection. Used only if `multiple` is set to `false`.
        </Md></cx>
    },
    records: {
        type: 'array',
        key: true,
        description: <cx><Md>
            A list of selected records. Used only if `multiple` is set to `true`.
        </Md></cx>
    },
    values: {
        type: 'array',
        key: true,
        description: <cx><Md>
            A list of selected ids. Used only if `multiple` is set to `true`.
        </Md></cx>
    },
    options: {
        type: 'array',
        key: true,
        description: <cx><Md>
            A list of available options.
        </Md></cx>
    },
    multiple: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Defaults to `false`. Set to `true` to enable multiple selection.
        </Md></cx>
    },
    minQueryLength: {
        type: 'number',
        description: <cx><Md>Number of characters required to start the search. Default `0`.</Md></cx>
    },
    hideSearchField: {
        type: 'boolean',
        description: <cx><Md>Set to `true` to hide the search field.</Md></cx>
    },

    minOptionsForSearchField: {
        type: 'number',
        description: <cx><Md>Number of options required to show the search field.
            If there is only a few options there is no need for search. Defaults to `7`.</Md></cx>
    },

    valueIdField: {
        type: 'string',
        key: true,
        description: <cx><Md>Available only if `multiple` selection mode and without custom `bindings`.
            Name of the field to store id of the selected value. Default value is `id`.</Md></cx>
    },

    valueTextField: {
        type: 'string',
        key: true,
        description: <cx><Md>Available only if `multiple` selection mode. Name of the field to store display text of the
            selected value.
            Default value is `text`.</Md></cx>
    },

    optionIdField: {
        type: 'string',
        key: true,
        description: <cx><Md>Name of the field which holds the id of the option. Default value is `id`.</Md></cx>
    },

    optionTextField: {
        type: 'string',
        key: true,
        description: <cx><Md>Name of the field which holds the display text of the option. Default value is `text`.</Md>
        </cx>
    },

    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied on the field. Defaults to `lookupfield`.
        </Md></cx>
    },

    dropdownOptions: {
        type: 'config',
        description: <cx><Md>
            Additional configuration to be passed to the dropdown, such as `style`, `positioning`, etc.
        </Md></cx>
    },
};
import {Md} from '../../../components/Md';

import widget from './Widget';
import classAndStyle from './classAndStyle';

export default {
    keys: {
        type: 'object',
        description: <cx><Md>{`
        A hash of name/selector pairs used as a grouping key.
        Example:
        \`\`\`
        {
            id: {
                bind: '$record.groupId'
            },
            name: {
                bind: '$record.groupName'
            }
        }
        \`\`\`
         Grouping key will be available as \`\$group\` if needed for captions.
      `}</Md></cx>
    },
    showHeader: {
        type: 'boolean',
        description: <cx><Md>
            Show grid header within the group. Useful for long report-like (printable) grids.
            Defaults to `false`.
        </Md></cx>
    },
    showFooter: {
        type: 'boolean',
        description: <cx><Md>
            Show grid footer. Defaults to `false`.
        </Md></cx>
    },
    caption: {
        type: 'string',
        description: <cx><Md>
            A selector used to calculate group's caption.
        </Md></cx>
    },
    showCaption: {
        type: 'boolean',
        description: <cx><Md>
            Show group caption. Values shown in the caption should be specified in the column definition.
        </Md></cx>
    },
    text: {
        type: 'string',
        description: <cx><Md>
            A selector used to calculate text which can be used in totals as `$group.$name`.
        </Md></cx>
    },
    aggregates: {
        type: 'object',
        description: <cx>
            <Md>{`
                An array of objects defining group level aggregate values.
                Example:
                 \`\`\`
                {
                    total: {
                        type: 'sum',
                        value: {
                            bind: '$record.amount'
                        }
                    }
                }
                \`\`\`
                All calculated values will be available under the \`$group\` object, e.g. \`$group.total\`.
            `}</Md>
        </cx>
    },
    comparer: {
        type: 'function',
        description: <cx><Md>
            A function used to compare values between groups to determine their order.
        </Md></cx>
    }
};

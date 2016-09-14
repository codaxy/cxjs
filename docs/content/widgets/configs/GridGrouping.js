import {Md} from '../../../components/Md';

import widget from './Widget';
import classAndStyle from './classAndStyle';

export default {
   keys: {
      type: 'object',
      description: <cx><Md>
         A hash of name/selector pairs used as a grouping key.
         Example: {`\`{ key: { bind: '$record.groupId }, name: { bind: '$record.groupName' } }\``}
         Grouping key will be available as `$group` if needed for captions.
      </Md></cx>
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
   text: {
      type: 'string',
      description: <cx><Md>
         A selector used to calculate text which can be used in totals as `$group.text`.
      </Md></cx>
   },
   aggregates: {
      type: 'object',
      description: <cx><Md>
         An array of objects defining group level aggregate values.
         Example: {`\`{ total: { type: 'sum', value: { bind: '$record.amount' } } }\``}
         All calculated values will be available under the `$group` object, e.g. `$group.total`.
      </Md></cx>
   }
};

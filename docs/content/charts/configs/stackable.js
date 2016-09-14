import {Md} from 'docs/components/Md';

export default {
   stack: {
      key: false,
      type: 'string',
      description: <cx><Md>
         Name of the stack. If multiple stacks are used, each should have a unique name.
         Default value is `stack`.
      </Md></cx>
   },
   stacked: {
      key: true,
      type: 'boolean',
      description: <cx><Md>
         Indicate that columns should be stacked on top of the other columns. Default value is `false`.
      </Md></cx>
   }
};

import {Md} from 'docs/components/Md';

export default {
   xAxis: {
      key: true,
      type: 'string',
      description: <cx><Md>
         Name of the horizontal axis. The value should match one of the horizontal axes set in the `axes` configuration of the parent `Chart` component.
         Default value is `x`.
      </Md></cx>
   },
   yAxis: {
      key: true,
      type: 'string',
      description: <cx><Md>
         Name of the vertical axis. The value should match one of the vertical axes set in the `axes` configuration if the parent `Chart` component.
         Default value is `y`.
      </Md></cx>
   },
};

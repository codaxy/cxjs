import {Md} from '../../../components/Md';

export default {
   route: {
      type: 'string',
      key: true,
      description: <cx><Md>
         Target route, e.g. `~/user/:userId`. All routes should start with `~/`.
      </Md></cx>
   },
   url: {
      type: 'string',
      key: true,
      description: <cx><Md>
         Url binding. Bind this to the global `url` variable.
      </Md></cx>
   },
   params: {
      type: 'string',
      key: true,
      description: <cx><Md>
         Params binding. Matched route parameters will be stored inside.
      </Md></cx>
   }
};

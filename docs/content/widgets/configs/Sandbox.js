import { Md } from '../../../components/Md';

export default {
   storage: {
      type: 'string',
      key: true,
      description: <cx><Md>
         Storage binding. All data will be stored inside.
      </Md></cx>
   },
   key: {
      type: 'string',
      key: true,
      alias: 'accessKey',
      description: <cx><Md>
         Key value used to access the data from the `storage`.
      </Md></cx>
   },
   recordName: {
      type: 'string',
      key: true,
      alias: 'recordAlias',
      description: <cx><Md>
         Name used to expose local data. Defaults to `$page`.
      </Md></cx>
   },
   immutable: {
      type: 'boolean',
      description: <cx><Md>
         Indicate that the data in the parent store should **not** be mutated. Defaults to `false`.
      </Md></cx>
   }
};

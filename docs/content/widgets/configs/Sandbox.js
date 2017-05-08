import {Md} from '../../../components/Md';

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
      description: <cx><Md>
         Name used to expose local data. Defaults to `$page`.
      </Md></cx>
   }
};

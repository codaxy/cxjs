import {Md} from '../../../components/Md';

export default {
   disabled: {
      type: 'boolean',
      description: <cx><Md>
         Set to `true` to disable the link.
      </Md></cx>
   },
   href: {
      type: 'string',
      key: true,
      description: <cx><Md>
         Url to the link's target location. Should start with `~/` or `#/` for pushState/hash based navigation.
      </Md></cx>
   },
   text: {
      type: 'string',
      description: <cx><Md>
         Text associated with the link.
      </Md></cx>
   }
};

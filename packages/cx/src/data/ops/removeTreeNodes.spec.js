import {Store} from '../Store';
import {removeTreeNodes} from './removeTreeNodes';
import assert from 'assert';

describe('removeTreeNodes', function() {
   it('removes all nodes that satisfy criteria', function () {
      let store = new Store({
         data: {array: [{
            id: 'n1',
            value: 1,
            children: [{
               id: 'n11',
               value: 2
            }, {
               id: 'n12',
               value: 3
            }]
         }]}
      });

      assert(store.update('array', removeTreeNodes, x => x.value > 1, 'children'));
      assert.deepEqual(store.get('array'), [{
         id: 'n1',
         value: 1,
         children: []
      }]);
   });
});

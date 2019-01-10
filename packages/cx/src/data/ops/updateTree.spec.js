import {Store} from '../Store';
import {updateTree} from './updateTree';
import assert from 'assert';

describe('updateTree', function() {
   it('updates all nodes that satisfy criteria', function () {
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

      assert(store.update('array', updateTree, x => ({ ...x, value: x.value + 1}), x => x.value > 1, 'children'));
      assert.deepEqual(store.get('array'), [{
         id: 'n1',
         value: 1,
         children: [{
            id: 'n11',
            value: 3
         }, {
            id: 'n12',
            value: 4
         }]
      }]);
   });
});

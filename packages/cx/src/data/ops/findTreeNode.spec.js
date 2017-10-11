import {Store} from '../Store';
import {findTreeNode} from './findTreeNode';
import assert from 'assert';

describe('removeTreeNodes', function() {
   it('removes all nodes that satisfy criteria', function () {
      let array = [{
         id: 'n1',
         value: 1,
         children: [{
            id: 'n11',
            value: 2
         }, {
            id: 'n12',
            value: 3
         }]
      }];

      let node = findTreeNode(array, x => x.value == 3, 'children');

      assert(node);
      assert.equal(node.value, 3)
   });
});

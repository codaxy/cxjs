import { TraversalStack } from './TraversalStack';

import assert from 'assert';

interface TreeNode {
   id: number;
   children?: TreeNode[];
}

describe('TraversalStack', function () {

   it('push', function () {
      let stack = new TraversalStack<number>();
      stack.push(1);
      assert.equal(stack.pop(), 1);
   });

   it('traverses the tree in the right order', function () {
      let stack = new TraversalStack<TreeNode>();

      let tree: TreeNode = {
         id: 1,
         children: [{
            id: 2,
            children: [{
               id: 3
            }, {
               id: 4
            }]
         }, {
            id: 5,
            children: [{
               id: 6
            }]
         }]
      };

      let list: number[] = [];
      stack.push(tree);
      while (!stack.empty()) {
         let node = stack.pop();
         if (node) {
            list.push(node.id);
            if (node.children) {
               stack.hop();
               node.children.forEach((child) => {
                  stack.push(child);
               })
            }
         }
      }
      assert.deepEqual(list, [1, 2, 3, 4, 5, 6]);
   });
});
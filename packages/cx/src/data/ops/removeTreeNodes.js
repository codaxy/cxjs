import {updateTree} from './updateTree';

export function removeTreeNodes(array, criteria, childrenField) {
   return updateTree(array, null, item => false, childrenField, criteria);
}

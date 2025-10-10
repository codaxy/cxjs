import {TraversalStack} from "../util/TraversalStack";
import {reverseSlice} from "../util/reverseSlice";

export class RenderingContext {
   options: any;
   exploreStack: any;
   prepareList: any[];
   cleanupList: any[];
   stacks: any;
   renderList: any;
   [key: string]: any;

   constructor(options?: any) {
      this.options = options || {};
      this.exploreStack = new TraversalStack();
      this.prepareList = [];
      this.cleanupList = [];
      this.stacks = {};
      this.renderList = new LinkedListsNode();
   }

   getStack(key: string) {
      let stack = this.stacks[key];
      if (!stack)
         stack = this.stacks[key] = [];
      return stack;
   }


   push(key: string, value: any) {
      let stack = this.getStack(key);
      stack.push(this[key]);
      return this[key] = value;
   }

   pop(key: string) {
      let stack = this.getStack(key);
      return this[key] = stack.pop();
   }

   pushNamedValue(key: string, name: string, value: any) {
      let stack = this.getStack(`${key}:${name}`);
      if (!this[key])
         this[key] = {};
      stack.push(this[key][name]);
      return this[key][name] = value;
   }

   popNamedValue(key: string, name: string) {
      let stack = this.getStack(`${key}:${name}`);
      return this[key][name] = stack.pop();
   }

   get(key: string) {
      return this[key];
   }

   getRootRenderList() {
      let rl = this.renderList;
      while (rl.left)
         rl = rl.left;
      return rl;
   }
}

class LinkedListsNode {
   left?: LinkedListsNode;
   right?: LinkedListsNode;
   data: any[];
   reverseIndex?: number;

   constructor(left?: LinkedListsNode, right?: LinkedListsNode) {
      this.left = left;
      this.right = right;
      this.data = [];
   }

   insertLeft() {
      let node = new LinkedListsNode(this.left, this);
      if (this.left)
         this.left.right = node;
      this.left = node;
      return node;
   }

   insertRight() {
      let node = new LinkedListsNode(this, this.right);
      if (this.right)
         this.right.left = node;
      this.right = node;
      return node;
   }

   markReverseIndex() {
      this.reverseIndex = this.data.length;
   }

   reverse() {
      reverseSlice(this.data, this.reverseIndex);
   }
}

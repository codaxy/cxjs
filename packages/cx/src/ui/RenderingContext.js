export class RenderingContext {
   constructor(options) {
      this.options = options || {};
      this.exploreStack = [];
      this.prepareList = [];
      this.cleanupList = [];
      this.stacks = {};
   }

   push(key, value) {
      let stack = this.stacks[key];
      if (!stack)
         stack = this.stacks[key] = [];
      stack.push(value);
      this[key] = value;
      return value;
   }

   pop(key) {
      let stack = this.stacks[key];
      if (!stack)
         return;
      stack.pop();
      this[key] = stack[stack.length - 1];
   }

   get(key) {
      return this[key];
   }
}

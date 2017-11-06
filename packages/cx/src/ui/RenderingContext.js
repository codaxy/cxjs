export class RenderingContext {
   constructor(options) {
      this.options = options || {};
      this.exploreStack = [];
      this.prepareList = [];
      this.cleanupList = [];
   }

   push(key, value) {
      if (!this.stacks)
         this.stacks = {};
      let stack = this.stacks[key];
      if (!stack)
         stack = this.stacks[key] = [];
      stack.push(value);
      this[key] = value;
   }

   pop(key) {
      if (!this.stacks)
         return;
      let stack = this.stacks[key];
      if (!stack)
         return;
      let v = stack.pop();
      this[key] = v;
   }

   get(key) {
      return this[key];
   }
}

export class RenderingContext {
   constructor(options) {
      this.options = options || {};
      this.exploreStack = [];
      this.prepareList = [];
      this.renderList = [];
      this.cleanupList = [];
      this.stacks = {};

   }

   getStack(key) {
      let stack = this.stacks[key];
      if (!stack)
         stack = this.stacks[key] = [];
      return stack;
   }


   push(key, value) {
      let stack = this.getStack(key);
      stack.push(value);
      this[key] = value;
      return value;
   }

   pop(key) {
      let stack = this.getStack(key);
      stack.pop();
      this[key] = stack[stack.length - 1];
   }

   pushNamedValue(key, name, value) {
      let stack = this.getStack(`${key}:${name}`);
      stack.push(value);
      if (!this[key])
         this[key] = {};
      this[key][name] = value;
   }

   popNamedValue(key, name) {
      let stack = this.getStack(`${key}:${name}`);
      stack.pop();
      this[key][name] = stack[stack.length - 1];
   }

   get(key) {
      return this[key];
   }
}

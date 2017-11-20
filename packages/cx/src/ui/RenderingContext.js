export class RenderingContext {
   constructor(options) {
      this.options = options || {};
      this.exploreStack = [];
      this.prepareList = [];
      this.renderList = [];
      this.renderStack = [this.renderList];
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
      stack.push(this[key]);
      return this[key] = value;
   }

   pop(key) {
      let stack = this.getStack(key);
      return this[key] = stack.pop();
   }

   pushNamedValue(key, name, value) {
      let stack = this.getStack(`${key}:${name}`);
      if (!this[key])
         this[key] = {};
      stack.push(this[key][name]);
      return this[key][name] = value;
   }

   popNamedValue(key, name) {
      let stack = this.getStack(`${key}:${name}`);
      return this[key][name] = stack.pop();
   }

   get(key) {
      return this[key];
   }

   newRenderList() {
      let list = [];
      this.renderStack.push(list);
      return list;
   }
}

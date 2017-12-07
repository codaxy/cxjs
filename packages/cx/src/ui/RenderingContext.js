export class RenderingContext {
   constructor(options) {
      this.options = options || {};
      this.exploreStack = [];
      this.prepareList = [];
      this.cleanupList = [];
      this.stacks = {};

      this.renderLists = {
         0: []
      };
      this.renderListIndex = 0;
      this.minRenderListIndex = 0;
      this.maxRenderListIndex = 0;
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

   getCurrentRenderList() {
      return this.renderLists[this.renderListIndex];
   }

   insertRenderList() {
      this.maxRenderListIndex++;
      for (let i = this.maxRenderListIndex; i > this.renderListIndex; i--)
         this.renderLists[i] = this.renderLists[i - 1];
      return this.renderLists[this.renderListIndex] = [];
   }

   getPrevRenderList() {
      this.renderListIndex--;
      if (this.renderListIndex < this.minRenderListIndex) {
         this.minRenderListIndex = this.renderListIndex;
         this.renderLists[this.renderListIndex] = [];
      }
      return this.renderLists[this.renderListIndex];
   }

   getNextRenderList() {
      this.renderListIndex++;
      if (this.renderListIndex > this.maxRenderListIndex) {
         this.maxRenderListIndex = this.renderListIndex;
         this.renderLists[this.renderListIndex] = [];
      }
      return this.renderLists[this.renderListIndex];
   }

   getRenderLists() {
      let result = [];
      for (let i = this.minRenderListIndex; i <= this.maxRenderListIndex; i++)
         result.push(this.renderLists[i]);
      return result;
   }
}

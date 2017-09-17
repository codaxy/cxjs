export class RenderingContext {
   constructor(options) {
      this.options = options || {};
      this.exploreStack = [];
      this.prepareList = [];
   }
}

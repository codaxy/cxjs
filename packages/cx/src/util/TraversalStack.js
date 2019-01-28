export class TraversalStack {

   constructor() {
      this.data = [];
   }

   push(node) {
      if (this.data.length == 0)
         this.hop();

      this.data[this.data.length - 1].elements.push(node);
   }

   hop() {
      this.data.push({
         elements: [],
         index: 0
      });
   }


   pop() {
      while (this.data.length > 0) {
         let line = this.data[this.data.length - 1];
         if (line.index < line.elements.length) {
            line.index++;
            return line.elements[line.index - 1];
         }
         this.data.pop();
      }
      return null;
   }

   empty() {
      while (this.data.length > 0) {
         let line = this.data[this.data.length - 1];
         if (line.index < line.elements.length)
            return false;
         this.data.pop();
      }
      return true;
   }
}
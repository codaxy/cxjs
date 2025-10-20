interface StackLine<T> {
   elements: T[];
   index: number;
}

export class TraversalStack<T> {
   private data: StackLine<T>[];

   constructor() {
      this.data = [];
   }

   push(node: T): void {
      if (this.data.length == 0)
         this.hop();

      this.data[this.data.length - 1].elements.push(node);
   }

   hop(): void {
      this.data.push({
         elements: [],
         index: 0
      });
   }

   pop(): T | null {
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

   empty(): boolean {
      while (this.data.length > 0) {
         let line = this.data[this.data.length - 1];
         if (line.index < line.elements.length)
            return false;
         this.data.pop();
      }
      return true;
   }
}
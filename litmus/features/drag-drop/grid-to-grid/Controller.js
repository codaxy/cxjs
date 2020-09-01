import { Controller } from 'cx/ui';

export default class extends Controller {
   init() {
      this.store.init('grid1', Array.from({ length: 150 }, (_, c) => ({
         id: c + 1,
         name: 'A' + (c + 1),
         number: Math.random() * 100
      })));

      this.store.init('grid2', Array.from({ length: 150 }, (_, c) => ({
         id: 10000 + c + 1,
         name: 'B' + (c + 1),
         number: Math.random() * 100
      })));
   }
}

import { Controller } from 'cx/ui';

export default class extends Controller {
   init() {
      this.store.init('grid1', [{
         id: 1,
         name: 'A1',
         number: 5,
         children: [{
            id: 2,
            name: 'A1-1',
            number: 6,
            leaf: true,
         }, {
            id: 3,
            name: 'A1-2',
            number: 7,
            leaf: true,
         }]
      }]);

      this.store.init('grid2', Array.from({ length: 150 }, (_, c) => ({
         id: 10000 + c + 1,
         name: 'B' + (c + 1),
         number: Math.random() * 100
      })));
   }
}

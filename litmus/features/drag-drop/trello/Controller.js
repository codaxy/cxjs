import { Controller } from 'cx/ui';

export default class extends Controller {
   init() {
      this.store.init('cards', Array.from({length: 5}, (_, c) => ({
         id: c + 1,
         name: 'Card #' + c,
         items: Array.from({length: 10}, (_, i) => ({
            id: i + 1,
            text: 'Item #' + i
         }))
      })));

      console.log(this.store.get('cards'));
   }
}

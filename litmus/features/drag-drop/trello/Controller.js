import { Controller } from 'cx/ui';

export default class extends Controller {
   init() {
      this.store.init('cards', Array.from({length: 5}, (_, c) => ({
         id: c + 1,
         name: 'Card #' + (c + 1),
         items: Array.from({length: 10}, (_, i) => ({
            id: `${c + 1}:${i + 1}`,
            text: 'Item #' + i
         }))
      })));
   }
}

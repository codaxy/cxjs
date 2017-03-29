import { View } from './../../data/View';
import * as Cx from '../../core';

export class History {
   static connect(store: View, bind: string);

   static pushState(state, title, url: string);

   static replaceState(state, title, url: string);
}

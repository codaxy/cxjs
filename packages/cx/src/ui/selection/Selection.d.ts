import {Record} from '../../core';

import {View} from '../../data/View';
import {Instance} from '../Instance';

export class Selection {

   isSelected(store: View, record: Record, index: number);

   getIsSelectedDelegate(store: View) : (record: Record, index: number) => boolean;
   
   select(store: View, record: Record, index: number);

   declareData(): Record;

   configureWidget(widget): Record;

   selectInstance(instance: Instance);

   isInstanceSelected(instance: Instance): boolean;

   static create(type: any, config: any, more: any): any;
}

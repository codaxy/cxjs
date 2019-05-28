import {Record} from '../../core';
import {Component} from '../../util/Component';
import {View} from '../../data/View';
import {Instance} from '../Instance';

interface Config {
    add: Boolean;
    toggle: Boolean;
}

export class Selection extends Component {

   isSelected(store: View, record: Record, index?: number);

   getIsSelectedDelegate(store: View) : (record: Record, index: number) => boolean;
   
   select(store: View, record: Record, index: number);

   declareData(): Record;

   configureWidget(widget): Record;

   selectInstance(instance: Instance, options: Config);

   isInstanceSelected(instance: Instance): boolean;

}

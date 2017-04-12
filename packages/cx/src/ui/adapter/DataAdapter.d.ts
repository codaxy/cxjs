import * as Cx from '../../core';
import {Instance} from '../Instance';
import {View} from '../../data/View';
import {RenderingContext} from '../RenderingContext';

export class DataAdapter {

   getRecords(context?: RenderingContext, instance?: Instance, records?: Cx.Record[], parentStore?: View) : Cx.Record[];
   
   setFilter(filterFn: (data: any) => boolean) : void;

   sort(sorters?: Cx.Sorter[]) : void;

}

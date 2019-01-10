import * as Cx from '../core';
import {Filter} from './Container';

export class PureContainer extends Cx.Widget<Cx.PureContainerProps> {

   add(...args: Array<any>);
   
   clear();

   addText(text: string);

   find(filter: Filter, options?: Cx.Config) : any[];

   findFirst(filter: Filter, options?: Cx.Config) : any;

}

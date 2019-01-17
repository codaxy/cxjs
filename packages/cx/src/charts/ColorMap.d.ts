import * as Cx from '../core';
import {PureContainer} from '../ui/PureContainer';

interface ColorMapProps extends Cx.WidgetProps {}

export class ColorMap extends Cx.Widget<ColorMapProps> {

   static Scope: ColorMapScope;

   onGetCache?: string | (() => Cx.Record);

   names?: Cx.Prop<string[]>;

   step?: Cx.NumberProp;
   offset?: Cx.NumberProp;
   size?: Cx.NumberProp;
}


export class ColorMapScope extends PureContainer {}

export class ColorIndex  {

   acknowledge(name: string);

   map(name: string) : number;
}
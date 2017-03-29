import {View, ViewConfig} from './View';
import {Binding} from './Binding';

interface ZoomIntoPropertyViewConfig extends ViewConfig {
   rootName?: string,
   binding: Binding
}

export class ZoomIntoPropertyView extends View {
   constructor(config?: ZoomIntoPropertyViewConfig);
}

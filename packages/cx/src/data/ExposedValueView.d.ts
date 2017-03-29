import {View, ViewConfig} from './View';

interface ExposedValueViewConfig extends ViewConfig {
   itemIndex?: number;
   immutable?: boolean;
}

export class ExposedValueView extends View {
   constructor(config?: ExposedValueViewConfig);

   setKey(key: string);

   getKey(): string;

   setStore(store: View);
}

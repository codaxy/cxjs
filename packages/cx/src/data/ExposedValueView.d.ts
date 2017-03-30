import {View, ViewConfig} from './View';

import { Binding } from './Binding';

interface ExposedValueViewConfig extends ViewConfig {
   containerBinding: Binding;
   recordName?: string;
   immutable?: boolean;
}

export class ExposedValueView extends View {
   constructor(config?: ExposedValueViewConfig);

   setKey(key: string);

   getKey(): string;

   setStore(store: View);
}

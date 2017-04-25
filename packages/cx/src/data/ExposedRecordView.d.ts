import {View, ViewConfig} from './View';

interface ExposedRecordViewConfig extends ViewConfig {
   itemIndex?: number;
   immutable?: boolean;
}

export class ExposedRecordView extends View {
   constructor(config?: ExposedRecordViewConfig);

   setIndex(index: number);

   setStore(store: View);
}

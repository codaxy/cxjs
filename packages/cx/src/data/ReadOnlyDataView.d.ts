import {View, ViewConfig} from './View';

interface ReadOnlyDataViewConfig extends ViewConfig {
   data?: any;
   immutable?: boolean;
}

export class ReadOnlyDataView extends View {
   constructor(config?: ReadOnlyDataViewConfig);

   setData(data: any);

   setStore(store: View);
}

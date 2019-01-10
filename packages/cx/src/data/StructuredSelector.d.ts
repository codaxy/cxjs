import { StructuredProp, Record, StructuredSelector as SS } from '../core';
import { View } from './View';

interface StructuredSelectorConfig {
   props: StructuredProp,
   values: Record,
}

export class StructuredSelector {

   constructor(config: StructuredSelectorConfig);

   init(store: View);

   create(): SS
}

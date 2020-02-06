import {View} from './View';
import * as Cx from '../core';
import {Accessor} from "./getAccessor";

export abstract class AugmentedViewBase extends View {
   arrayAccessor: Accessor;

   protected abstract getAugmentData(data: Cx.Record): Cx.Record;

   protected abstract setExtraKeyValue(key: string, value: any): boolean;

   protected abstract deleteExtraKeyValue(key: string): boolean;

   protected abstract isExtraKey(key: string): boolean;

   protected abstract embedAugmentData(result: Cx.Record, parentStoreData: Cx.Record): void;

   immutable: boolean;
   recordAlias: string;
   indexAlias: string;
   lengthAlias: string;
}


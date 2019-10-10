import {Accessor} from "./getAccessor";
import {AugmentedViewBase} from "./AugmentedViewBase";

export abstract class ArrayElementView extends AugmentedViewBase {
   arrayAccessor: Accessor;
   immutable: boolean;
   recordAlias: string;
   indexAlias: string;
   lengthAlias: string;

   setIndex(itemIndex: number): void;
}


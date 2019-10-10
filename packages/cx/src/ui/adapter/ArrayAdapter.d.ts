import {DataAdapter} from './DataAdapter';
import {Binding} from "../../data/Binding";
import {Ref} from "../../data/Ref";

interface Accessor {
   binding: Binding,
   ref: Ref
}

interface Config {
   immutable?: boolean;
   sealed?: boolean;
}

export class ArrayAdapter extends DataAdapter {
   constructor(config: Config);
}

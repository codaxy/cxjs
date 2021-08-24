import { Instance } from "./Instance";

export interface StructuredInstanceDataAccessorConfig {
   data: Cx.StructuredProp;
   instance: Instance;
   useParentStore: boolean;
}

export class StructuredInstanceDataAccessor {
   constructor(config: StructuredInstanceDataAccessorConfig);
   getSelector(): (data: any) => any;
   get(): any;
   setItem(key, value);
   containsKey(key): boolean;
   getKeys(): string[];
}

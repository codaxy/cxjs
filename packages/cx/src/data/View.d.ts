import {Record} from '../core'
import {Binding} from './Binding';

declare type Path = string | Binding;

interface ViewConfig {
   store?: View
}

export class View {

   constructor(config?: ViewConfig);

   getData(): Record;

   init(path: Path, value: any): boolean;

   set(path: Path | Record, value?: any): boolean;

   copy(from: Path, to: Path);

   move(from: Path, to: Path);

   delete(path: Path): boolean;
   delete(paths: Path[]): boolean;
   delete(...paths: Path[]): boolean;

   clear();

   get(path: Path);
   get(paths: Path[]);
   get(...paths: Path[]);

   toggle(path: Path): boolean;

   update(path: Path, updateFn: (currentValue: any) => any, ...args): boolean;

   batch(callback: () => void): boolean;

   silently(callback: () => void): boolean;

   notify(path: string);

   subscribe(callback: (changes?) => void);

   load(data: Record): boolean;

   dispatch(action);
}

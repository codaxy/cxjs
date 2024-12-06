import { View } from "cx/data";
import { Instance } from "cx/ui";
import { Overlay } from "cx/widgets";

export interface HotPromiseWindowFactoryOptions {
   parent?: Instance;
   store?: View;
}

export function createHotPromiseWindowFactoryWithProps<Props, R = any>(
   module: any,
   factory: (props: Props) => (resolve: (value: R | PromiseLike<R>) => void, reject: (reason?: any) => void) => Overlay,
): (props: Props, options?: HotPromiseWindowFactoryOptions) => Promise<R>;

export function createHotPromiseWindowFactory<R = any>(
   module: any,
   factory: (resolve: (value: R | PromiseLike<R>) => void, reject: (reason?: any) => void) => Overlay,
): (options?: HotPromiseWindowFactoryOptions) => Promise<R>;

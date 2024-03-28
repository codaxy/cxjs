import { Instance } from "./Instance";
import * as Cx from "../core";
import { CultureInfo } from "./Culture";

interface RestateProps extends Cx.PureContainerProps {
   data?: Cx.StructuredProp;
   detached?: boolean;
   deferredUntilIdle?: Cx.BooleanProp;
   idleTimeout?: Cx.NumberProp;
   cacheKey?: Cx.StringProp;

   /* Set to true to disable batching of updates. */
   immediate?: boolean;

   onError?: (err: Error, instance: Instance) => void;

   culture?: CultureInfo;
}

export class Restate extends Cx.Widget<RestateProps> {}
export class PrivateStore extends Cx.Widget<RestateProps> {}

import * as React from 'react';
import {View} from "../data/View";
import {Instance} from "./Instance";

interface CxProps {
   widget?: Cx.Config,
   store?: View,
   instance?: Instance,
   parentInstance?: Instance,
   subscribe?: boolean,
   immediate?: boolean,
   deferredUntilIdle?: boolean,
   idleTimeout?: number,
   options?: any,
   onError?: (error: Error, instance: Instance, info: any) => void
}

export class Cx extends React.Component<CxProps, any> {}

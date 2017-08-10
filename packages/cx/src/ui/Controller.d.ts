import * as Cx from '../core';

import {View} from '../data/View';

export class Controller {
   onInit?(): void;

   onExplore?(context?): void;

   onPrepare?(context?): void;

   onCleanup?(context?): void;

   init?(): void;

   store: View;
   widget: any;

   addTrigger(name: string, args: string[], callback: (...args) => void, autoRun?: boolean) : void;

   addComputable(name: string, args: string[], callback: (...args) => any) : void;

   removeTrigger(name: string) : void;

   removeComputable(name: string) : void;
}

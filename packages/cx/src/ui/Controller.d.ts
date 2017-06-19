import * as Cx from '../core';

import {View} from '../data/View';

export class Controller {
   onInit?(): void;

   onExplore?(): void;

   onPrepare?(): void;

   onCleanup?(): void;

   init?(): void;

   store: View;
   widget: any;

   addTrigger(name: string, args: string[], callback: (...args) => void, autoRun?: boolean) : void;

   addComputable(name: string, args: string[], callback: (...args) => any) : void;

   removeTrigger(name: string) : void
}

import * as Cx from '../core';

import {View} from '../data/View';

export class Controller {
   onInit?(): void;

   onExplore?(): void;

   onPrepare?(): void;

   onCleanup?(): void;

   init?(): void;

   store: View;

   addTrigger(name: string, args: string[], callback: (values: any[]) => void, autoRun?: boolean) : void;

   addComputable(name: string, args: string[], callback: () => any) : void;

   removeTrigger(name: string) : void
}

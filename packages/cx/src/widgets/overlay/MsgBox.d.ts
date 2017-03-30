import * as Cx from '../../core';

export class MsgBox {
   static alert(options: string | Cx.Config): Promise<void>;

   static yesNo(options: string | Cx.Config): Promise<string>;
}

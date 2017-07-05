import * as Cx from '../../core';

interface MsgBoxProps {

   buttonMod?: null,
   footerDirection?: string,
   footerJustify?: string
   
}

export class MsgBox {
   static alert(options: string | Cx.Config): Promise<void>;

   static yesNo(options: string | Cx.Config): Promise<string>;
}

export function enableMsgBoxAlerts();
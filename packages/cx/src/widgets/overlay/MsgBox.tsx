import { Window } from "./Window";
import { Button } from "../Button";
import { Localization } from "../../ui/Localization";
import { FlexRow } from "../FlexBox";
import { registerAlertImpl } from "./alerts";
import { isString } from "../../util/isString";
import { Instance } from "../../ui/Instance";

export interface MsgBoxOptions {
   message?: string;
   title?: string;
   header?: string;
   style?: string;
   callback?: (option?: string) => boolean | void;
   okText?: string;
   yesText?: string;
   noText?: string;
   yesButtonMod?: string;
   noButtonMod?: string;
   items?: any;
   children?: any;
   store?: any;
}

export class MsgBox {
   buttonMod?: string;
   footerDirection?: string;
   footerJustify?: "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly" | false;
   yesText?: string;
   noText?: string;

   static alert(options: string | MsgBoxOptions): Promise<void> {
      let opts: MsgBoxOptions;
      if (isString(options))
         opts = {
            message: options,
         };
      else opts = options;

      return new Promise<void>(function (resolve) {
         let callback = (e: any, instance: Instance) => {
            if (opts.callback && opts.callback() === false) return;
            instance.parentOptions.dismiss();
            resolve();
         };

         let w = Window.create(
            <cx>
               <Window
                  title={opts.title}
                  header={opts.header}
                  mod="alert"
                  modal
                  center
                  resizable={false}
                  closable={false}
                  style={opts.style || "max-width: 90vw"}
                  dismissOnPopState
               >
                  {opts.message || opts.items || opts.children}
                  <FlexRow
                     putInto="footer"
                     direction={MsgBox.prototype.footerDirection}
                     justify={MsgBox.prototype.footerJustify}
                  >
                     <Button mod={MsgBox.prototype.buttonMod} onClick={callback}>
                        {opts.okText || "OK"}
                     </Button>
                  </FlexRow>
               </Window>
            </cx>,
         ) as any;

         w.open(opts.store);
      });
   }

   static yesNo(options: string | MsgBoxOptions): Promise<string> {
      let opts: MsgBoxOptions;
      if (isString(options))
         opts = {
            message: options,
         };
      else opts = options;

      return new Promise<string>(function (resolve, reject) {
         let callback = (option: string) => (e: any, instance: Instance) => {
            if (opts.callback && opts.callback(option) === false) return;
            instance.parentOptions.dismiss();
            if (option == "yes") resolve(option);
            else resolve(option);
         };
         let w = Window.create(
            <cx>
               <Window
                  title={opts.title}
                  header={opts.header}
                  mod="alert"
                  modal
                  center
                  resizable={false}
                  closable={false}
                  style={opts.style || "max-width: 90vw"}
                  dismissOnPopState
               >
                  {opts.message || opts.items || opts.children}
                  <FlexRow
                     putInto="footer"
                     direction={MsgBox.prototype.footerDirection}
                     justify={MsgBox.prototype.footerJustify}
                     hspacing="small"
                  >
                     <Button mod={opts.yesButtonMod || MsgBox.prototype.buttonMod} onClick={callback("yes")}>
                        {opts.yesText || MsgBox.prototype.yesText}
                     </Button>
                     <Button mod={opts.noButtonMod || MsgBox.prototype.buttonMod} onClick={callback("no")}>
                        {opts.noText || MsgBox.prototype.noText}
                     </Button>
                  </FlexRow>
               </Window>
            </cx>,
         ) as any;

         w.open(opts.store);
      });
   }
}

MsgBox.prototype.buttonMod = undefined;
MsgBox.prototype.footerDirection = "row";
MsgBox.prototype.footerJustify = "center";
MsgBox.prototype.yesText = "Yes";
MsgBox.prototype.noText = "No";
Localization.registerPrototype("cx/widgets/MsgBox", MsgBox);

export function enableMsgBoxAlerts(): void {
   registerAlertImpl({
      yesNo: MsgBox.yesNo.bind(MsgBox),
      alert: MsgBox.alert.bind(MsgBox),
   });
}

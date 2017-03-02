import {Widget} from '../../ui/Widget';
import {HtmlElement} from '../HtmlElement';
import {Window} from './Window';
import {Button} from '../Button';
import {Localization} from '../../ui/Localization';

export class MsgBox {
   
   static alert(options) {
      if (typeof options == 'string')
         options = {
            message: options
         };

      return new Promise(function (resolve) {
         var callback = (e, instance)=> {
            if (options.callback && options.callback() === false)
               return;
            instance.parentOptions.dismiss();
            resolve();
         };

         var w = Widget.create(<cx>
            <Window title={options.title} header={options.header} mod="alert" modal={true} center={true}
                    resizable={false} closable={false}>
               {options.message}
               <div putInto="footer">
                  <Button mod={ MsgBox.prototype.buttonMod } onClick={callback}>OK</Button>
               </div>
            </Window>
         </cx>);

         w.open(options.store);
      });
   }

   static yesNo(options) {
      if (typeof options == 'string')
         options = {
            message: options
         };

      return new Promise(function (resolve, reject) {

         var callback = (option) => (e, instance)=> {
            if (options.callback && options.callback(option) === false)
               return;
            instance.parentOptions.dismiss();
            if (option == 'yes')
               resolve(option);
            else
               resolve(option);
         };
         var w = Widget.create(<cx>
            <Window title={options.title} header={options.header} mod="alert" modal={true} center={true}
                    resizable={false} closable={false}>
               {options.message}
               <div putInto="footer">
                  <Button mod={ MsgBox.prototype.buttonMod } onClick={callback('yes')}>Yes</Button>
                  {' '}
                  <Button mod={ MsgBox.prototype.buttonMod } onClick={callback('no')}>No</Button>
               </div>
            </Window>
         </cx>);

         w.open(options.store);
      });
   }
}

MsgBox.prototype.buttonMod = null;
Localization.registerPrototype('cx/widgets/MsgBox', MsgBox);

import {debug, deprecatedFlag} from '../../util/Debug';
import {isString} from '../../util/isString';

export type AlertOptions = string | { message?: string; [key: string]: any };

interface AlertImpl {
   alert(options: AlertOptions): Promise<void>;
   yesNo(options: AlertOptions): Promise<string>;
}

function getMessage(options: AlertOptions): string | null {
   debug(deprecatedFlag, "Call enableMsgBoxes() on startup to use Cx based message boxes. Message boxes are not auto enabled anymore to reduce the bundle size for apps that do not use them. ");
   if (!options)
      return null;
   if (isString(options))
      return options;
   if (options && typeof options === 'object' && options.message)
      return options.message;
   return null;
}

let impl: AlertImpl = {
   yesNo: function (options: AlertOptions): Promise<string> {
      let result = window.confirm(getMessage(options) || '');
      return Promise.resolve(result ? 'yes' : 'no');
   },

   alert: function (options: AlertOptions): Promise<void> {
      window.alert(getMessage(options) || '');
      return Promise.resolve();
   }
};

export function alert(options: AlertOptions): Promise<void> {
   return impl.alert(options);
}

export function yesNo(options: AlertOptions): Promise<string> {
   return impl.yesNo(options);
}

export function registerAlertImpl(x: AlertImpl): void {
   impl = x;
}



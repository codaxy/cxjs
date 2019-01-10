import {debug, deprecatedFlag} from '../../util/Debug';
import {isString} from '../../util/isString';

function getMessage(options) {
   debug(deprecatedFlag, "Call enableMsgBoxes() on startup to use Cx based message boxes. Message boxes are not auto enabled anymore to reduce the bundle size for apps that do not use them. ");
   if (!options)
      return null;
   if (isString(options))
      return options;
   if (options && options.message)
      return options.message;
   return null;
}

let impl = {
   yesNo: function (options) {
      let result = window.confirm(getMessage(options));
      return Promise.resolve(result ? 'yes' : 'no');
   },

   alert: function (options) {
      window.alert(getMessage(options));
      return Promise.resolve();
   }
};

export function alert(options) {
   return impl.alert.apply(impl, arguments);
}

export function yesNo(options) {
   return impl.yesNo.apply(impl, arguments);
}

export function registerAlertImpl(x) {
   impl = x;
}



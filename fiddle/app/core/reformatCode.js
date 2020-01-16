let callback = code => code;

export function reformatCode(code) {
   try {
      return callback(code);
   } catch (e) {
      console.warn("Error occurred while formatting code.", e);
      return code;
   }
}

import(/* webpackChunkName: 'prettier' */ "./reformatCodeChunk").then(
   module => {
      callback = module.reformatCode;
   }
);

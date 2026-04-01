//use this for debugging transpilation errors for IE
//import { transpile as transpileJS } from "./transpilerChunk";

export function transpile(code) {
   return new Promise((resolve, reject) => {
      return import(/* webpackChunkName: 'babel' */ "./transpilerChunk")
         .then(m => {
            try {
               //resolve(transpileJS(code || ""));
               resolve(m.transpile(code || ""));
            } catch (e) {
               resolve(`/* Error: ${e} */`);
            }
         })
         .catch(reject);
   });
}

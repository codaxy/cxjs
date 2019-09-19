import {useStoreMethods, useTrigger, useState} from "cx/src/hooks";

export function getModel() {
   let status = useState();
   let data = useState();
   let query = useState();

   useTrigger([query], (q) => {
      status.set("loading");
      fetch(`https://api.github.com/search/repositories?q=${q}`)
         .then(r => r.json())
         .then(d => {
            data.set(d.items);
            status.set("ok");
         })
         .catch(err => {
            console.log(err);
            status.set("error");
         })
   });

   return {
      status,
      data,
      query,

      onClear: () => {
         query.set(null);
         data.set(null);
      }
   }
}
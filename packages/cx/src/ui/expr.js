import { isString } from "../util/isString";

export function expr(text) {
   if (isString(text))
      return {
         expr: text,
      };

   let args = Array.from(arguments);
   return (data) => {
      let argv = [];
      for (let i = 0; i < args.length - 1; i++) argv.push(args[i](data));
      return args[args.length - 1].apply(this, argv);
   };
}

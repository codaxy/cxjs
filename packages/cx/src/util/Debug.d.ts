
export class Debug {

   static enable(flag: string);

   static disable(flag: string);

   static log(flag): string;
}

export function debug(flag: string, ...args: any[]);
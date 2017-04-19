
export class Timing {

   static now(): number;

   static enable(flag: string);

   static disable(flag: string);

   static count(flag: string) : number;

   static log(flag: string);

}
export class Stack {

   reset() : void;

   acknowledge(ordinal: string, value?: number) : void;
   
   measure(normalized: boolean) : [number, number];

   stack(ordinal: string, value?: number) : number | null;

}
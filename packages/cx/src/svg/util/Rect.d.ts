type RectMargin = string | Rect | Array<string | number>;

export interface IRect {
   l: number,
   r: number,
   t: number,
   b: number
}

export class Rect implements IRect {

   isRect: boolean;

   l: number;
   r: number;
   t: number;
   b: number;

   constructor(config?: { t?: number, r?: number, b?: number, l?: number });

   width() : number;

   height() : number;

   valid() : boolean;

   makeValid() : Rect;

   isEqual(r: Rect) : boolean;

   static add(a: Rect, b: Rect) : Rect;

   static multiply(a: Rect, b: Rect) : Rect;

   static margin(r: Rect, m?: RectMargin) : Rect;

   static convertMargin(m?: RectMargin) : Rect;

   static convert(r?: RectMargin | number) : Rect;

}
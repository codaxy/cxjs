type RectMargin = string | Rect | Array<string | number>;

export class Rect {

   isRect: boolean = true;

   l: number = 0;
   r: number = 0;
   t: number = 0;
   b: number = 0;

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
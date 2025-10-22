import { isNumber } from "../../util/isNumber";
import { isArray } from "../../util/isArray";

type RectMargin = string | Rect | Array<string | number>;

export interface IRect {
   l: number;
   r: number;
   t: number;
   b: number;
}

export class Rect implements IRect {
   isRect: boolean = true;
   l: number = 0; //left;
   r: number = 0; //right
   t: number = 0; //top
   b: number = 0; //bottom

   constructor(config?: { t?: number; r?: number; b?: number; l?: number }) {
      Object.assign(this, config);
   }

   width(): number {
      return this.r - this.l;
   }

   height(): number {
      return this.b - this.t;
   }

   valid(): boolean {
      return this.r > this.l && this.b > this.t;
   }

   makeValid(): Rect {
      return new Rect({
         l: Math.min(this.l, this.r),
         r: Math.max(this.l, this.r),
         t: Math.min(this.t, this.b),
         b: Math.max(this.t, this.b),
      });
   }

   isEqual(r: Rect): boolean {
      if (!r || !r.isRect) return false;

      return r.l == this.l && r.r == this.r && r.t == this.t && r.b == this.b;
   }

   static add(a: Rect, b: Rect): Rect {
      return new Rect({
         l: a.l + b.l,
         t: a.t + b.t,
         r: a.r + b.r,
         b: a.b + b.b,
      });
   }

   static multiply(a: Rect, b: Rect): Rect {
      return new Rect({
         l: a.l + (a.r - a.l) * b.l,
         r: a.l + (a.r - a.l) * b.r,
         t: a.t + (a.b - a.t) * b.t,
         b: a.t + (a.b - a.t) * b.b,
      });
   }

   static margin(r: Rect, m?: RectMargin): Rect {
      var mr = Rect.convertMargin(m);
      return Rect.add(r, mr);
   }

   static convertMargin(m?: RectMargin): Rect {
      if (!m) return new Rect();

      if ((m as any).isRect) return m as Rect;

      if (isNumber(m)) return new Rect({ l: m as number, t: m as number, r: -(m as number), b: -(m as number) });

      var mr = Rect.convert(m);
      mr.b = -mr.b;
      mr.r = -mr.r;
      return mr;
   }

   static convert(r?: RectMargin | number): Rect {
      if (!r) return new Rect({ l: 0, r: 0, t: 0, b: 0 });

      if ((r as any).isRect) return r as Rect;

      if (typeof r === "string") r = r.split(" ");

      if (isArray(r)) {
         return new Rect({
            t: parseFloat(r[0] as any),
            r: parseFloat(r[1] as any),
            b: parseFloat(r[2] as any),
            l: parseFloat(r[3] as any),
         });
      }

      return new Rect(r as any);
   }
}

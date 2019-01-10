import {isNumber} from '../../util/isNumber';
import {isArray} from '../../util/isArray';

export class Rect {

   constructor(config) {
      Object.assign(this, config);
   }

   width() {
      return this.r - this.l;
   }

   height() {
      return this.b - this.t;
   }

   valid() {
      return this.r > this.l && this.b > this.t;
   }

   makeValid() {
      return new Rect({
         l: Math.min(this.l, this.r),
         r: Math.max(this.l, this.r),
         t: Math.min(this.t, this.b),
         b: Math.max(this.t, this.b)
      })
   }

   isEqual(r) {

      if (!r || !r.isRect)
         return false;

      return r.l == this.l
         && r.r == this.r
         && r.t == this.t
         && r.b == this.b;
   }

   static add(a, b) {
      return new Rect({
         l: a.l + b.l,
         t: a.t + b.t,
         r: a.r + b.r,
         b: a.b + b.b
      });
   }

   static multiply(a, b) {
      return new Rect({
         l: a.l + (a.r - a.l) * b.l,
         r: a.l + (a.r - a.l) * b.r,
         t: a.t + (a.b - a.t) * b.t,
         b: a.t + (a.b - a.t) * b.b
      });
   }

   static margin(r, m) {
      var mr = Rect.convertMargin(m);
      return Rect.add(r, mr);
   }

   static convertMargin(m) {
      if (!m)
         return new Rect();

      if (m.isRect)
         return m;

      if (isNumber(m))
         return new Rect({l: m, t: m, r: -m, b: -m});

      var m = Rect.convert(m);
      m.b = -m.b;
      m.r = -m.r;
      return m;
   }

   static convert(r) {
      if (!r)
         return new Rect({l: 0, r: 0, t: 0, b: 0});

      if (r.isRect)
         return r;

      if (typeof r === 'string')
         r = r.split(' ');

      if (isArray(r)) {
         return new Rect({
            t: parseFloat(r[0]),
            r: parseFloat(r[1]),
            b: parseFloat(r[2]),
            l: parseFloat(r[3])
         });
      }

      return new Rect(r);
   }
}

Rect.prototype.isRect = true;

Rect.prototype.l = 0; //left;
Rect.prototype.r = 0; //right
Rect.prototype.t = 0; //top
Rect.prototype.b = 0; //bottom
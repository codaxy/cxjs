import {HtmlElement, Slider, ColorField} from "cx/widgets";
import {VDOM, LabelsLeftLayout} from "cx/ui";
import {parseColor} from "cx/util";
import {Svg, BoundedObject, Rectangle} from 'cx/svg';

let lc = [[1, 7], [1, 6], [1, 5], [2, 5], [2, 4], [3, 4], [3, 5], [4, 5], [4, 6], [4, 7]];
let xc = [
   [4, 8], [4, 9], [3, 9], [3, 10], [2, 10], [2, 11], [1, 11], [1, 12],
   [1, 8], [1, 8], [1, 9], [2, 9], [3, 11], [4, 11], [4, 12]
];

let matColors = ["f44336", "E91E63", "9C27B0", "673AB7", "3F51B5", "2196F3",
"03A9F4", "00BCD4", "009688", "4CAF50", "8BC34A", "CDDC39", "FFEB3B", "FFC107",
"FF9800", "FF5722", "795548", "9E9E9E", "607D8B"];

let randomColor = (from, to) => {
   return matColors[from  + Math.floor(Math.random() * (to - from))];
}

class Logo extends BoundedObject {

   declareData() {
      super.declareData(...arguments, {
         space: undefined,
         cColor: undefined,
         xColor: undefined,
         c2Color: undefined,
         x2Color: undefined,
         size: undefined
      })
   }

   prepareData(context, instance) {
      let {data} = instance;

      let {xColor, x2Color, cColor, c2Color} = data;

      let mesh = {};
      const meshSet = (r, c, data) => {
         let row = mesh[r];
         if (!row)
            row = mesh[r] = {};
         row[c] = data;
      };

      lc.forEach(([r, c], i) => {
         meshSet(r, c, {
            style: {
               fill: (i % 2 ? cColor : c2Color) || cColor
            }
         })
      });

      xc.forEach(([r, c], i) => {
         meshSet(r, c, {
            style: {
               fill: (i % 2 ? xColor : x2Color) || xColor
            }
         })
      });
      this.mesh = mesh;
      super.prepareData(context, instance);
   }

   render(context, instance, key) {
      let {data} = instance;
      let {bounds} = data;

      let size = Math.min(3 * bounds.width() / this.meshWidth) * data.size;
      let xsize = size / 2;
      let ir = xsize / Math.sqrt(3);
      let ysize = 3 * ir;
      let children = [];
      let fillFactor = 1.05 - data.space;

      let sx = (bounds.l + bounds.r - this.meshWidth * xsize) / 2;
      let sy = (bounds.t + bounds.b - this.meshHeight * ysize) / 2;

      for (let r = 0; r < this.meshHeight; r++) {
         let row = this.mesh[r] || {};
         for (let c = 0; c < this.meshWidth; c++) {

            let cx = sx + c * xsize + xsize / 2;
            let cy = sy + r * ysize + ysize / 2;

            let off = r % 2 ? 0 : 1;

            let orf = (c + off) % 2 ? 1 : -1;
            cy += orf * ir / 2;

            let cell = row[c] || {};

            let d = `M ${cx - xsize * fillFactor} ${cy + orf * ir * fillFactor}`;
            d += ` l ${xsize * fillFactor} ${-3 * orf * ir * fillFactor}`;
            d += ` l ${xsize * fillFactor} ${3 * orf * ir * fillFactor}`;
            d += ` Z`;

            let triangle = <path
               key={`t-${c}-${r}`}
               d={d}
               style={cell.style}
            />;


            children.push(triangle);
         }
      }

      return <g
         key={key}
         className={data.classNames}
      >
         {/*<rect*/}
            {/*x={sx}*/}
            {/*y={sy}*/}
            {/*width={this.meshWidth * size / 2}*/}
            {/*height={this.meshHeight * ysize}*/}
            {/*fill="rgba(255, 255, 255, 0.5)"*/}
         {/*/>*/}
         {children}

      </g>
   }
}

Logo.prototype.anchors = '0 1 1 0';
Logo.prototype.meshWidth = 17;
Logo.prototype.meshHeight = 6;
Logo.prototype.space = 0;
Logo.prototype.size = 1;
Logo.prototype.baseClass = "cxlogo";
Logo.prototype.cColor = "#f00";
Logo.prototype.xColor = "#00f";

export default (
   <cx>
      <div style="padding: 50px">
         <Svg style="width: 400px; height: 400px">
            <Rectangle fill:bind="backColor"/>
            <Logo
               size={{ bind: "size", defaultValue: 1 }}
               space={{ bind: "space", defaultValue: 0 }}
               cColor={{ bind: "cColor", defaultValue: "rgba(53,36,36,1)" }}
               xColor={{ bind: "xColor", defaultValue: "rgba(198,36,36,1)" }}
               c2Color={{ bind: "c2Color" }}
               x2Color={{ bind: "x2Color" }}
            />
         </Svg>

         <div layout={LabelsLeftLayout}>
            <ColorField label="Background" value={{bind: "backColor", defaultValue: "rgba(251,236,236,1)"}} />
            <Slider label="Size" minValue={0} maxValue={2} value:bind="size" />
            <Slider label="Space" minValue={0} maxValue={1} value:bind="space" />
            <ColorField label="c" value:bind="cColor" />
            <ColorField label="x" value:bind="xColor" />
            <ColorField label="c2" value:bind="c2Color" />
            <ColorField label="x2" value:bind="x2Color" />
         </div>
      </div>
   </cx>
);

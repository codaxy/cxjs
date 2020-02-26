import { Widget, VDOM, startAppLoop } from "cx/ui";
import { HtmlElement } from "cx/widgets";
import { Store } from "cx/data";
import deepEqual from "deep-equal";
import casualData from "app/components/casual";

import * as Cx from "cx/index";

export class Preview extends HtmlElement {
   declareData() {
      super.declareData(...arguments, {
         js: undefined,
         data: undefined
      });
   }

   render(context, instance, key) {
      return (
         <PreviewComponent key={key} instance={instance} data={instance.data} />
      );
   }
}

class PreviewComponent extends VDOM.Component {
   render() {
      var { data } = this.props.instance;
      return (
         <div className={data.classNames} style={data.style}>
            <div ref="el" />
         </div>
      );
   }

   componentDidMount() {
      this.update();
   }

   componentWillReceiveProps(props) {
      if (
         this.store &&
         props.data.js == this.props.data.js &&
         props.data.data != this.props.data.data
      ) {
         try {
            var newData = JSON.parse(props.data.data || "{}");
            var currentData = this.getReportableData();
            if (deepEqual(newData, currentData)) return;
         } catch (e) {}
      }
      setTimeout(::this.update, 0);
   }

   getReportableData() {
      var data = { ...this.store.getData() };
      Object.keys(data)
         .filter(k => k[0] == "$")
         .forEach(k => delete data[k]);
      return data;
   }

   update() {
      var { data, widget } = this.props.instance;
      var preview;

      if (this.stop) this.stop();

      this.stop = null;

      if (!this.store) {
         this.store = new Store();
         this.unsubscribe = this.store.subscribe(() => {
            if (widget.nameMap.data) {
               if (this.updateTimeout) clearTimeout(this.updateTimeout);
               this.updateTimeout = setTimeout(() => {
                  var json = JSON.stringify(this.getReportableData(), null, 2);
                  this.props.instance.store.set(widget.nameMap.data, json);
               }, 500);
            }
         });
      }

      try {
         var store = this.store;

         var d = JSON.parse(data.data || "{}");
         store.silently(() => {
            store.clear();
            store.load(d);
         });

         var exports = {};
         var cx = Cx;
         var casual = casualData;

         var code = `         
            ${transformImports(data.js)}
         `;

         eval(code);
         for (var key in exports) {
            if (key == "__esModule") continue;
            preview = exports[key];
            break;
         }

         this.stop = startAppLoop(this.refs.el, store, preview);
      } catch (e) {
         console.log(e);
         preview = (
            <cx>
               <div>{e.toString()}</div>
            </cx>
         );
      }

      if (!preview)
         preview = (
            <cx>
               <div>No export found.</div>
            </cx>
         );

      if (!this.stop)
         this.stop = startAppLoop(this.refs.el, this.store, preview);
   }

   componentWillUnmount() {
      if (this.stop) this.stop();

      if (this.unsubscribe) this.unsubscribe();
   }
}

Preview.prototype.baseClass = "preview";

function transformImports(code) {
   return code.replace(/require\(('|").*('|")\)/g, match => {
      return match.substring(9, match.length - 2).replace(/\//g, ".");
   });
}

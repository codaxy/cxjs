import {VDOM, getContent, contentAppend} from '../Widget';
import {Layout} from './Layout';
import {isArray} from '../../util/isArray';
import {isUndefined} from '../../util/isUndefined';

function validContent(r) {
   let content = [];
   for (let key in r)
      if (key != "label")
         contentAppend(content, r[key]);
   return content;
}

export class LabelsTopLayout extends Layout {

   init() {
      if (this.vertical && isUndefined(this.columns))
         this.columns = 1;

      super.init();
   }

   render(context, instance, keyPrefix) {
      let {children} = instance;
      let {CSS, baseClass} = this;

      let state = {
         rows: []
      };

      children.forEach((c) => {
         let r = c.vdom; //render(context);
         if (c.widget.layout && c.widget.layout.useParentLayout && isArray(r.content)) {
            r.content.forEach(item => {
               this.addItem(state, item);
            })
         }
         else {
            this.addItem(state, r);
         }
      });

      this.addRow(state);

      return <table key={keyPrefix} className={CSS.block(baseClass, this.mod)}>
         <tbody>
         {state.rows}
         </tbody>
      </table>;
   }

   addRow(state) {
      if (state.labelCells && state.labelCells.length > 0)
         state.rows.push(<tr key={state.rows.length}>{state.labelCells}</tr>);

      if (state.fieldCells && state.fieldCells.length > 0)
         state.rows.push(<tr key={state.rows.length}>{state.fieldCells}</tr>);

      state.labelCells = [];
      state.fieldCells = [];
   }

   addItem(state, item) {
      if (!state.labelCells || state.labelCells.length + 1 > this.columns)
         this.addRow(state);


      state.labelCells.push(
         <td className={this.CSS.element(this.baseClass, "label")} key={state.labelCells.length}>
            {getContent(item.label)}
         </td>
      );
      state.fieldCells.push(
         <td className={this.CSS.element(this.baseClass, "field")} key={state.fieldCells.length}>
            {validContent(item)}
         </td>
      );
   }
}

LabelsTopLayout.prototype.baseClass = 'labelstoplayout';
LabelsTopLayout.prototype.vertical = false;
LabelsTopLayout.prototype.columns = undefined;

Layout.alias('labels-top', LabelsTopLayout);
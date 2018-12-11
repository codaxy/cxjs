import {VDOM, getContent, contentAppend} from '../Widget';
import {PureContainer} from '../PureContainer';
import {isArray} from '../../util/isArray';
import {isUndefined} from '../../util/isUndefined';

function validContent(r) {
   let content = [];
   for (let key in r)
      if (key != "label")
         contentAppend(content, r[key]);
   return content;
}

export class LabelsTopLayout extends PureContainer {

   init() {
      if (this.vertical && isUndefined(this.columns))
         this.columns = 1;

      super.init();
   }

   render(context, instance, key) {
      let {children} = instance;
      let {CSS, baseClass} = this;

      let state = {
         rows: []
      };

      const processContent = (r) => {
         if (!r)
            return;
         if (isArray(r.content) && r.useParentLayout)
            r.content.forEach((x) => processContent(x));
         else
            this.addItem(state, r);
      };

      children.forEach(item => processContent(item.vdom));

      this.addRow(state);

      return <table key={key} className={CSS.block(baseClass, this.mod)}>
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
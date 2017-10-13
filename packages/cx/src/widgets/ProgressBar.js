import {Widget, VDOM} from '../ui/Widget';

export class ProgressBar extends Widget {

   declareData() {
      return super.declareData({
         disabled: undefined,
         text: undefined,
         value: undefined       
      }, ...arguments)
   }

   render(context, instance, key) {
      let { widget, data } = instance;
      let { text, value, disabled } = data;
      let {CSS, baseClass} = widget;

      return (
         <div
            key={key}
            className= {CSS.expand(data.classNames, CSS.state({
               disabled               
            }))}
           
            style={data.style}
         >           
            <div 
               className={CSS.element(this.baseClass, 'indicator')} 
               style={{
                  width: `${value*100}%`,
                  ...data.indicatorStyle
               }} 
            />
            <div className={CSS.element(this.baseClass, 'label')}>            
               { text }
            </div>
         </div>
      )
   }
}

ProgressBar.prototype.styled = true;
ProgressBar.prototype.disabled = false;
ProgressBar.prototype.baseClass = 'progressbar';
ProgressBar.prototype.progress = 0;

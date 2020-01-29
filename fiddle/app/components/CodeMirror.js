import { Widget, VDOM, CSS } from 'cx/ui';
import codemirror from 'codemirror';
import "codemirror/lib/codemirror.css";
import "codemirror/mode/jsx/jsx";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import "codemirror/addon/edit/matchtags";
import "codemirror/addon/edit/closetag";


export class CodeMirror extends Widget {

   declareData() {
      return super.declareData(...arguments, {
         code: undefined,
         className: { structured: true },
         class: { structured: true },
         style: { structured: true }
      });
   }

   render(context, instance, key) {
      return <Component key={key} instance={instance} data={instance.data} />
   }
}

CodeMirror.prototype.baseClass = 'codemirror';

class Component extends VDOM.Component {
   render() {
      var {data, widget} = this.props.instance;
      return <div className={data.classNames} style={data.style}>
         <textarea className={CSS.element(widget.baseClass, 'input')}
                   defaultValue={data.code}
                   ref="input"/>
      </div>
   }

   shouldComponentUpdate() {
      return false;
   }

   componentDidMount() {
      var {widget} = this.props.instance;
      this.cm = codemirror.fromTextArea(this.refs.input, {
         lineNumbers: true,
         mode: widget.mode,
         tabSize: 2,
         matchTags: {bothTags: true},
         autoCloseTags: true,
         extraKeys: {
            'Ctrl-R': ::this.save,
            'Ctrl-S': ::this.save,
            'Ctrl-I': ::this.resolveImport,
         }
      });
      this.cm.on('blur', ::this.onBlur);
   }
   
   componentWillReceiveProps(props) {
      if (props.data.code != this.cm.getValue())
         this.cm.setValue(props.data.code || '');
   }

   save() {
      var {widget, store} = this.props.instance;
      if (widget.nameMap.code) {
         var value = this.cm.getValue();
         if (typeof value == 'string')
            store.set(widget.nameMap.code, value);
      }
   }

   resolveImport() {
      var {widget} = this.props.instance;
      var selection = this.cm.getSelection();
      if (selection && widget.onImportName) {
         var code = widget.onImportName(this.cm.getValue(), selection);
         this.cm.setValue(code);
      }
   }

   onBlur() {
      this.save();
   }
}

CodeMirror.prototype.mode = 'javascript';

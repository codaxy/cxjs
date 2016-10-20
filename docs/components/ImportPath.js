import {Widget, VDOM} from 'cx/ui/Widget';
//import {HtmlElement} from 'cx/ui/HtmlElement';
//import {PureContainer} from 'cx/ui/PureContainer';
//import {Button} from 'cx/ui/Button';
//import {Md} from './Md';
//import {HtmlElement} from 'cx/ui/HtmlElement';


export class ImportPath extends Widget {
    init(){
        super.init();
    }
    
    copyToClipboard = (e) => {
        //console.log("TEST", this.path, arguments[0].path);
        //console.log(e.target);
        // find target element
        //debugger;
        var inp = e.target;
            //c = t.dataset.copytarget,
            //inp = (c ? document.querySelector(c) : null);

        // is element selectable?
        if (inp && inp.select) {

            // select text
            inp.select();
            
            try {
                // copy text
                document.execCommand('copy');
                inp.blur();
            }
            catch (err) {
                alert('please press Ctrl/Cmd+C to copy');
            }
        }
    }

    render(context, instance, key){
        return (
            <div key={key} className="dxb-importpath">
                <span className="inputWithButton">
                <input type="text" defaultValue={this.path} onClick={this.copyToClipboard}></input>
                <button onClick={this.copyToClipboard} >
                    <i className="fa fa-copy" aria-hidden="true"></i>
                </button>
                </span>
            </div>
        );
    }
}

ImportPath.prototype.className = "importpath";
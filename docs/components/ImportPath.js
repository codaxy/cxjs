import {Widget, VDOM} from 'cx/ui/Widget';
import React from 'react';
//import {HtmlElement} from 'cx/ui/HtmlElement';
//import {PureContainer} from 'cx/ui/PureContainer';
//import {Button} from 'cx/ui/Button';
//import {Md} from './Md';
//import {HtmlElement} from 'cx/ui/HtmlElement';

class InputWithButton extends React.Component {    
    copyToClipboard = () => {
        // copy text from this.textInput to clipboard...
        // select text
        this.textInput.select();
        try {
            // copy selected text
            document.execCommand('copy');
            //this.textInput.blur(); // deselect text
        } catch (err) {
            alert('Please press CTRL/CMD+C to copy');
        }
    }
    render(){
        return (
            <div>
                <span className="dxe-inputWithButton">
                <input 
                    ref={(input) => this.textInput = input} 
                    type="text" defaultValue={this.props.path} 
                    onClick={this.copyToClipboard}
                />
                <button onClick={this.copyToClipboard} >
                    <i className="fa fa-copy" aria-hidden="true"></i>
                </button>
                </span>
            </div>
        );
    }
}

export class ImportPath extends Widget {
    init(){
        super.init();
    }

    render(context, instance, key){
        return (
            <div key={key} className="dxb-importpath">
                <InputWithButton path={this.path} />
            </div>
        );
    }
}

ImportPath.prototype.className = "importpath";
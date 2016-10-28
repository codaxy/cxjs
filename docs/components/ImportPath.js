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
        let range = document.createRange();
        range.selectNodeContents(this.textInput);
        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        try {
            // copy selected text
            document.execCommand('copy');
            selection.removeAllRanges(); // deselect text
        } catch (err) {
            alert('Please press CTRL/CMD+C to copy');
        }
    }
    render(){
        return (
            <div className="dxb-importpath">
                <code ref={(input) => this.textInput = input} onClick={this.copyToClipboard}>
                    {this.props.path}
                    <i className="fa fa-copy" aria-hidden="true"></i>
                </code>
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
            <div key={key} >
                <InputWithButton path={this.path} />
            </div>
        );
    }
}

ImportPath.prototype.className = "importpath";
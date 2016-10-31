import {Widget, VDOM} from 'cx/ui/Widget';
import React from 'react';

class InputWithButton extends React.Component { 
    constructor(props){
        super(props);
        this.state = { tooltipText: "Copy to clipboard" };
    }   
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
            this.setState({tooltipText: 'Copied'}); // set tooltip text to "Copied"
        } catch (err) {
            alert('Please press CTRL/CMD+C to copy');
        }
    }

    resetTooltipText = () => {
        this.setState({tooltipText: 'Copy to clipboard'});
    }

    render(){
        return (
            <div className="dxb-importpath" onMouseLeave={this.resetTooltipText}>
                <code ref={(input) => this.textInput = input} onClick={this.copyToClipboard} >
                    {this.props.path}
                    <i className="fa fa-copy" aria-hidden="true"></i>
                </code>
                <span aria-hidden="true">{this.state.tooltipText}</span>
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
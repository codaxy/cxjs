import {Widget, VDOM} from 'cx/ui/Widget';
import React from 'react';

class InputWithButton extends React.Component { 
    constructor(props){
        super(props);
        this.state = { copied: false };
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
            this.setState({copied: true}); // set tooltip text to "Copied"
        } catch (err) {
            alert('Please press CTRL/CMD+C to copy');
        }
    }

    resetTooltipText = () => {
        this.setState({copied: false});
    }

    render(){
        return (
            <div className="dxb-importpath" >
                <code ref={(input) => this.textInput = input} 
                    onClick={this.copyToClipboard}
                    onMouseLeave={this.resetTooltipText} >
                    {this.props.path}
                    <i className="fa fa-copy" aria-hidden="true"></i>
                </code>
                <span aria-hidden="true" 
                    style={this.state.copied ? 
                        {transition: "visibility 0s, opacity 0.5s", visibility: "visible", opacity: 1} : 
                        {opacity: 0, visibility: "hidden"}}>
                        Copied
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
            <div key={key} >
                <InputWithButton path={this.path} />
            </div>
        );
    }
}

ImportPath.prototype.className = "importpath";
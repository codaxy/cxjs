import { Widget, VDOM } from 'cx/ui';

class InputWithButton extends VDOM.Component {
    constructor(props) {
        super(props);
        this.state = { copied: false };
    }

    copyToClipboard() {
        navigator.clipboard.writeText(this.props.path).then(() => {
            this.setState({ copied: true }); // Sets tooltip text to "Copied"
        }).catch(() => {
            alert('Please press Ctrl/Cmd + C to copy.');
        });
    }

    resetTooltipText() {
        this.setState({ copied: false });
    }

    render() {
        return (
            <div className="dxb-importpath" >
                <code ref={(input) => this.textInput = input}
                    onClick={this.copyToClipboard.bind(this)}
                    onMouseLeave={this.resetTooltipText.bind(this)} >
                    {this.props.path}
                    <i className="fa fa-copy" aria-hidden="true"></i>
                </code>
                <span aria-hidden="true"
                    style={this.state.copied ?
                        { transition: "visibility 0s, opacity 0.5s", visibility: "visible", opacity: 1 } :
                        { opacity: 0, visibility: "hidden" }}>
                    Copied
                </span>
            </div >
        );
    }
}

export class ImportPath extends Widget {
    init() {
        super.init();
    }

    render(context, instance, key) {
        return (
            <div key={key} >
                <InputWithButton path={this.path} />
            </div>
        );
    }
}

ImportPath.prototype.className = "importpath";
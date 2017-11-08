import {VDOM} from 'cx/ui';

export class DocSearch extends VDOM.Component
{
    render() {
        return <input
            type="text"
            placeholder="Search..."
            ref={el => this.el = el}
            className="docsearch"
        />
    }

    componentDidMount() {
        if (typeof docsearch == "function")
            docsearch({
                apiKey: 'b77ab797ddcee40f03751aeb694168ed',
                indexName: 'cxjs',
                inputSelector: this.el,
                debug: false // Set debug to true if you want to inspect the dropdown
            });
    }
}
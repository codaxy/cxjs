import {VDOM} from 'cx/ui';

export class DocSearch extends VDOM.Component
{
    render() {
        return <input
            type="text"
            id="docsearch"
            placeholder="Search..."
            className="docsearch"
        />
    }

    componentDidMount() {
        if (typeof docsearch == "function")
            try {
            docsearch({
                apiKey: 'b77ab797ddcee40f03751aeb694168ed',
                indexName: 'cxjs',
                inputSelector: '#docsearch',
                debug: false // Set debug to true if you want to inspect the dropdown
            });
            } 
        catch (err) {
            console.log("DocSearch init error.", err);
        }
    }
}

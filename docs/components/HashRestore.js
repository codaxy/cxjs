import {VDOM} from 'cx/ui';

export class HashRestore extends VDOM.Component {
    render() {
        return null;
    }

    componentDidMount() {
        let hash = window.location.hash;
        if (hash) {
            location.replace("#");
            location.replace(hash);
        }
    }
}
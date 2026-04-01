import {VDOM} from 'cx/ui';

export class HashRestore extends VDOM.Component {
    render() {
        return null;
    }

    componentDidMount() {
        let hash = this.props.instance.store.get('hash');
        if (hash) {
            location.replace("#");
            location.replace(hash);
        }
    }
}
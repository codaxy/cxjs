import { VDOM } from 'cx/ui';
import { Icon } from 'cx/widgets';

Icon.registerFactory((name, props) => {
    props = { ...props };
    props.className = `fa fa-${name} ${props.className || ''}`;
    return <i {...props} />
});

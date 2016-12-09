import { VDOM } from 'cx/ui';
import { Icon } from 'cx/ui';

Icon.registerFactory((name, props) => {
    props = { ...props };
    props.className = `fa fa-${name} ${props.className || ''}`;
    return <i {...props} />
});

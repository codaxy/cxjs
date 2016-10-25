import {Icon} from 'cx/ui/icons/Icon';
import {VDOM} from 'cx/ui/Widget';

Icon.registerFactory((name, props) => {
    props = { ...props };
    props.className = `fa fa-${name} ${props.className || ''}`;
    return <i {...props} />
});

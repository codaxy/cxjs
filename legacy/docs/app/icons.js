import { VDOM } from 'cx/ui';
import { Icon } from 'cx/widgets';

Icon.registerFactory((name, props) => {
    let { key, ...rest } = props;
    rest.className = `fa fa-${name} ${rest.className || ''}`;
    return <i key={key} {...rest} />
});

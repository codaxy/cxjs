import { Icon } from 'cx/widgets';
import { VDOM } from 'cx/ui';

Icon.register('hamburger', props => {
    return (
        <svg viewBox="0 0 32 32" {...props}>
            <path
                d="M4 10h24a2 2 0 000-4H4a2 2 0 000 4zm24 4H4a2 2 0 000 4h24a2 2 0 000-4zm0 8H4a2 2 0 000 4h24a2 2 0 000-4z"
                fill="currentColor"
            />
        </svg>
    );
});

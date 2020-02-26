import { computable } from 'cx/ui';
import { getSelector } from 'cx/src/data';

export const Animicon = ({ shape, onClick }) => (
    <cx>
        <div
            onClick={onClick}
            class={computable(getSelector(shape), shape => {
                return {
                    'lines-button': true,
                    close: true,
                    x: shape == 'close',
                    'arrow arrow-left': shape == 'arrow',
                };
            })}
        >
            <span class="lines" />
        </div>
    </cx>
);

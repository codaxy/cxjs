import { Overlay } from 'cx/widgets';

export const SideDrawer = ({ out, children }) => (
    <cx>
        <Overlay backdrop class="master_sidedrawer" visible={out} animate>
            {children}
        </Overlay>
    </cx>
);

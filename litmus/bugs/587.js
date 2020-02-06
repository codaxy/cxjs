import { createFunctionalComponent, computable, DataProxy } from "cx/ui";
import { useState } from "cx/hooks";
import { Button } from "cx/widgets";

export default createFunctionalComponent(() => {
    let onOffRef = useState(true);
    return (
        <cx>
            <Button
                text={computable(onOffRef, v => (v ? 'On' : 'Off'))}
                onClick={() => {
                    onOffRef.toggle();
                }}
                mod={computable(onOffRef, v => (v ? 'primary' : null))}
            />
            <Button
                text={computable(onOffRef, v => (v ? 'On' : 'Off'))}
                onClick={() => {
                    onOffRef.toggle();
                }}
                mod={computable(onOffRef, v => (v ? 'primary' : null))}
            />
            <DataProxy
                data={{
                    onOff: onOffRef,
                }}
            >
                <Button
                    text={computable('onOff', v => (v ? 'On' : 'Off'))}
                    onClick={(e, { store }) => {
                        store.update('onOff', v => (v ? false : true));
                    }}
                    mod={computable('onOff', v => (v ? 'primary' : null))}
                />
            </DataProxy>
        </cx>
    );
});
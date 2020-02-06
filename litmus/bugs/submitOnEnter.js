import { LookupField, TextField, Button } from "cx/widgets";

export default (
    <cx>
        <form
            onSubmit={(e, {store}) => {
                e.preventDefault();
                //document.activeElement.blur();

                store.set('status', 'onSubmit fired!' + ' ' + Date.now());
            }}
            style="display: flex; flex-direction: column;"
        >
            <TextField label="Text" value-bind="text" />
            <div style="display: flex; flex-direction: column;">
                <LookupField
                    label="Open dropdown on Enter"
                    value-bind="val1"
                    options={[
                        {
                            id: 0,
                            text: "Option 0"
                        },
                        {
                            id: 1,
                            text: "Option 1"
                        },
                        {
                            id: 2,
                            text: "Option 2"
                        },
                        {
                            id: 3,
                            text: "Option 3"
                        },
                    ]}
                    //submitOnEnterKey
                />
                <LookupField
                    label="Submit on Enter"
                    value-bind="val2"
                    options={[
                        {
                            id: 0,
                            text: "Option 0"
                        },
                        {
                            id: 1,
                            text: "Option 1"
                        },
                        {
                            id: 2,
                            text: "Option 2"
                        },
                        {
                            id: 3,
                            text: "Option 3"
                        },
                    ]}
                    submitOnEnterKey
                />
            </div>
            <h4 text-bind="status" />
        </form>
    </cx>
)
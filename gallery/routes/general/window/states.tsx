import {cx, Section, FlexRow, Window, MsgBox, Button, TextField, DateField, TextArea} from 'cx/widgets';
import {LabelsLeftLayout, bind, expr} from 'cx/ui';

const showModal = (store) => {
    let modal = Window.create({
        title: 'Modal',
        modal: true,
        center: true,
        style: 'width: 500px; max-width: 90vw',
        bodyStyle: "padding: 20px",
        items: <cx>
            <p>
                Modal windows have a modal backdrop which prevents
                user from interacting with the contents on the page
                while the window is open.
            </p>
            <p>
                There can be multiple modal windows open in the same time.
            </p>
            <Button mod="hollow"
                onClick={(e, {store}) => {
                    showModal(store);
                }}
            >
                Open Modal
            </Button>
        </cx>
    });

    modal.open(store);
};

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/general/window/states.tsx" target="_blank" putInto="github">Source Code</a>
    <FlexRow wrap spacing="large" target="tablet" align="start">

        <Window title="Contact"
            visible={{bind: "contact.visible", defaultValue: false}}
            center
            styles="width:500px;max-width: 90vw"
            modal>
            <div style={{padding: "20px"}} layout={{type: LabelsLeftLayout, mod: 'stretch'}}>
                <TextField label="Name" value={bind("$page.contact.name")} style={{width: '100%'}}/>
                <TextField label="Email" value={bind("$page.contact.email")} style={{width: '100%'}}/>
                <TextArea label="Message" value={bind("$page.contact.message")} rows={5} style={{width: '100%'}}/>
                <DateField label="Date" value={bind("$page.contact.date")}/>
            </div>
            <FlexRow putInto="footer" spacing justify="end">
                <Button mod="primary">Submit</Button>
                <Button onClick={(e, ins) => {
                    ins.parentOptions.dismiss()
                }}>
                    Cancel
                </Button>
            </FlexRow>
        </Window>

        <Window
            title="Backdrop"
            backdrop
            center
            styles="width:500px;max-width: 90vw"
            visible={{bind: "backdrop.visible"}}
            bodyStyle="padding: 50px"
        >
            <p>
                Windows with backdrop can be closed by clicking anywhere outside the window.
            </p>
        </Window>

        <Section mod="well" hLevel={4} title="Options">
            <FlexRow wrap spacing>
                <Button
                    onClick={(e, {store}) => {
                        store.toggle("contact.visible")
                    }}
                >
                    Standard
                </Button>

                <Button
                    onClick={(e, {store}) => {
                        store.toggle("backdrop.visible")
                    }}
                >
                    Backdrop
                </Button>

                <Button
                    onClick={(e, {store}) => {
                        showModal(store);
                    }}
                >
                    Modal
                </Button>
            </FlexRow>
        </Section>
        <Section mod="well" hLevel={4} title="MsgBox">
            <FlexRow wrap spacing>

                <Button onClick={(e) => {
                    MsgBox.alert("This is an important message!")
                }}>
                    Alert
                </Button>


                <Button onClick={(e) => {
                    MsgBox.yesNo("Do you like CxJS?")
                        .then(result => {
                            if (result == 'yes') {
                                MsgBox.alert({
                                    message: <div ws>
                                        Great! Please support CxJS by giving it
                                        {' '}
                                        <a href="https://github.com/codaxy/cxjs" target="_blank">a star on GitHub!</a>.
                                    </div>
                                });
                            }
                        })
                }}>
                    Yes or No
                </Button>
            </FlexRow>
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);
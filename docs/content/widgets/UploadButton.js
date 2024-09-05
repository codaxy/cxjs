import {HtmlElement, UploadButton, MsgBox, Content, Tab} from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';


import configs from './configs/UploadButton';

function onUploadStarting(xhr, instance, file) {
    if (file.type.indexOf("image/") != 0) {
        MsgBox.alert('Only images are allowed.');
        return false;
    }

    if (file.size > 1e6) {
        MsgBox.alert('The file is too large.');
        return false;
    }

    //xhr.setRequestHeader('name', 'value');
}

function onUploadComplete(xhr, instance, file) {
    MsgBox.alert(`Upload completed with status ${xhr.status}.`);
}

function onUploadError(e) {
    console.log(e);
}


export const UploadButtonPage = <cx>
    <Md>
        # Upload Button

        <ImportPath path="import {UploadButton} from 'cx/widgets';"/>

        <CodeSplit>

            Upload buttons are used for selecting files and uploading them to the server.

            <div class="widgets">
                <UploadButton
                    icon="upload"
                    url="https://api.cxjs.io/uploads"
                    onUploadStarting={onUploadStarting}
                    onUploadComplete={onUploadComplete}
                    onUploadError={onUploadError}
                >
                    Upload
                </UploadButton>
            </div>

            ## Examples:

            * [Multi file upload](~/examples/form/multi-file-upload)

            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller"/>
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>
                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="mB8pDfIq">{`
                function onUploadStarting(xhr, instance, file) {
                    if (file.type.indexOf("image/") != 0) {
                        MsgBox.alert('Only images are allowed.');
                        return false;
                    }

                    if (file.size > 1e6) {
                        MsgBox.alert('The file is too large.');
                        return false;
                    }

                    //xhr.setRequestHeader('name', 'value');
                }

                function onUploadComplete(xhr, instance) {
                    MsgBox.alert(\`Upload completed with status \${xhr.status}.\`);
                }

                function onUploadError(e) {
                    console.log(e);
                }
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="mB8pDfIq">{`
                <div class="widgets">
                    <UploadButton
                        icon="upload"
                        url="https://api.cxjs.io/uploads"
                        onUploadStarting={onUploadStarting}
                        onUploadComplete={onUploadComplete}
                        onUploadError={onUploadError}
                    >
                        Upload
                    </UploadButton>
                </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>


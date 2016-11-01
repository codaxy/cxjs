import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {UploadButton} from 'cx/ui/form/UploadButton';
import {MsgBox} from 'cx/ui/overlay/MsgBox';

import configs from './configs/UploadButton';

function onUploadStarting(file, instance) {
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
    MsgBox.alert(`Upload completed with status ${xhr.status}.`);
}

function onUploadError(e) {
    console.log(e);
}


export const UploadButtonPage = <cx>
    <Md>
        # Upload Button

        <ImportPath path={"import {UploadButton} from 'cx/ui/form/UploadButton';"} />

        <CodeSplit>

            Upload buttons are used for selecting and uploading files on the server.

            <div class="widgets">
                <UploadButton url="https://cx.codaxy.com/fiddle/api/uploads"
                              onUploadStarting={onUploadStarting}
                              onUploadComplete={onUploadComplete}
                              onUploadError={onUploadError}>
                    Upload
                </UploadButton>
            </div>

            <CodeSnippet putInto="code">{`
            function onUploadStarting(file, instance) {
                if (file.type.indexOf("image/") != 0) {
                    MsgBox.alert('Only images are allowed.');
                    return false;
                }

                if (file.size > 1e6) {
                    MsgBox.alert('The file is too large.');
                    return false;
                }
            }

            function onUploadComplete(xhr, instance) {
                MsgBox.alert(\`Upload completed with status \${xhr.status}.\`);
            }

            function onUploadError(e) {
                console.log(e);
            }
            ...
            <div class="widgets">
                <UploadButton url="https://cx.codaxy.com/fiddle/api/uploads"
                              onUploadStarting={onUploadStarting}
                              onUploadComplete={onUploadComplete}
                              onUploadError={onUploadError}>
                    Upload
                </UploadButton>
            </div>
            `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>


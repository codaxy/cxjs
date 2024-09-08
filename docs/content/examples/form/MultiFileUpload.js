import { append } from 'cx/src/data/ops';
import { Controller, bind, computable } from 'cx/ui';
import { Button, Content, Grid, MsgBox, ProgressBar, Repeater, Tab, UploadButton, ValidationGroup, Validator } from 'cx/widgets';
import { CodeSnippet } from '../../../components/CodeSnippet';
import { CodeSplit } from '../../../components/CodeSplit';
import { Md } from '../../../components/Md';
import "./MultiFileUpload.scss";

class PageController extends Controller {
    onUploadStarting(xhr, instance, file, formData) {
        let invalidSize = file.size > 1e6;
        let invalidType = file.type.indexOf("image/") != 0;

        let f = { file };
        if (invalidSize || invalidType) {
            f.invalid = {
                size: invalidSize,
                type: invalidType
            }
        }

		instance.store.update("$page.form.files", append, f);

        this.store.set('$page.form.visited', false);
        this.store.delete('$page.form.progress');
		return false;
	}

	async upload(e, { store }) {
        let formInvalid = store.get('$page.form.invalid');
        if (formInvalid) {
            this.store.set('$page.form.visited', true);
            return;
        }

        this.store.set("$page.form.uploadInProgress", true);
		try {
            let files = this.store.get("$page.form.files");
            let response = await uploadFilesWithProgress("https://api.cxjs.io/uploads", files.map(f => f.file), (progress) => {
                store.set('$page.form.progress', progress);
            });
            this.store.delete('$page.form.files');
            MsgBox.alert(`Upload completed with status ${response.status}.`);
		} catch (err) {
            console.error('Upload failed:', err);
            MsgBox.alert(err.message);
		} finally {
            this.store.set("$page.form.uploadInProgress", false);
        }
	}

    onRemoveFile(e, {store}) {
        store.delete('$record');
        this.store.set('$page.form.visited', false);
    }

    onClearForm() {
        this.store.delete('$page.form');
        this.store.set('$page.form.visited', false);
    }
}

function uploadFilesWithProgress(url, files, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();

        // Append multiple files to the form data
        files.forEach((file) => formData.append("file", file));

        // Set up progress event listener
        xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);

        // Handle when the request finishes successfully
        xhr.onload = () => xhr.status >= 200 && xhr.status < 300
            ? resolve(xhr)
            : reject(new Error(`Failed with status: ${xhr.status} - ${xhr.statusText}`));

        // Handle errors
        xhr.onerror = () => reject(new Error("Network error or request failed."));

        // Open the request and send the form data
        xhr.open('POST', url);
        xhr.send(formData);
    });
}

export const MultiFileUpload = <cx>
    <Md controller={PageController}>

        # Multi File Upload

        <CodeSplit>

            The following example demonstrates how to use the `UploadButton` component to handle multiple file upload.

            By default, `UploadButton` automatically uploads each file as soon as it is selected, utilizing the `XMLHttpRequest` object.
            When multiple files are selected, each file is sent in a separate request.
            However, you can customize this behavior by defining the `onUploadStarting` callback.
            By preserving the selected files and returning `false` from the callback, the upload is deferred, allowing you to handle the actual upload process manually.
            This enables the button to load files into memory without initiating the upload, giving you full control over the upload logic.

            In this example, `XMLHttpRequest` is used for uploading files, as it provides better support for progress tracking.
            Although `fetch` could be used, its progress tracking capabilities are still somewhat limited.

            Selected files will appear in the table with validation applied, highlighting any invalid entries based on file size (&gt;= 1MB) or type (non images).

            <div class="widgets">
                <div style='width: 70%; gap: 24px' class='flex-column'>
                    <ValidationGroup invalid-bind='$page.form.invalid' errors-bind="$page.form.errors">
                        <Validator value-bind='$page.form.files.length' onValidate={(val = 0) => val < 1 && "Cannot submit empty form." } />
                        <Validator value-bind='$page.form.files' onValidate={(files) => files?.some(f => f.invalid) && "Only images with size less or equal to 1 MB are allowed." } />
                        <UploadButton
                            text="Choose files"
                            url="~/api/accounts/logos"
                            multiple
                            onUploadStarting="onUploadStarting"
                            style='width: fit-content'
                            icon='search'
                        />
                        <div>
                            <div text="Files to upload:" style='font-weight: 600; margin-bottom: 4px;'/>
                            <Grid
                                columns={[
                                    {
                                        header: 'File name',
                                        field: 'file.name',
                                        class: {
                                            invalidfile: bind('$record.invalid.type')
                                        }
                                    },
                                    {
                                        header: 'File size',
                                        field: 'size',
                                        value: computable('$record.file.size', s => {
                                            if (s >= 1e6) return `${(s / 1e6).toFixed(1)} MB`;
                                            return `${Math.round(s / 1e3, 1)} KB`;
                                        }),
                                        align: 'right',
                                        defaultWidth: 80,
                                        class: {
                                            invalidfile: bind('$record.invalid.size')
                                        }
                                    },
                                    {
                                        align: 'center',
                                        style: 'padding-left: 16px',
                                        items: <cx>
                                            <button
                                                onClick="onRemoveFile"
                                                text='x'
                                                tooltip-tpl="Remove file: {$record.file.name}"
                                                style="padding: 4px !important"
                                                disabled-bind='$page.form.uploadInProgress'
                                            />
                                        </cx>,
                                        defaultWidth: 50,
                                    },
                                ]}
                                records-bind='$page.form.files'
                                emptyText="Choose image type files with size not greater than 1 MB."
                                style='width: 100%'
                            />
                        </div>
                        <div>
                            Progress:
                            <ProgressBar style='width: 100%' value-bind='$page.form.progress' text-tpl='{$page.form.progress:p;0}'/>
                        </div>
                        <Repeater records-bind='$page.form.errors' visible-expr='{$page.form.invalid} && {$page.form.visited}'>
                            <div class='invalidfile' text-bind='$record.message'></div>
                        </Repeater>
                        <div style='display: flex; justify-content: space-between;'>
                            <Button text='Clear form' onClick='onClearForm' icon='clear' disabled-bind='$page.form.uploadInProgress' />
                            <Button text="Upload" onClick="upload" style='width: fit-content; margin-left: auto' disabled-bind='$page.form.uploadInProgress' icon='file' />
                        </div>
                    </ValidationGroup>
                </div>
            </div>

            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller" />
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>

                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="mB8pDfIq">{`
                    class PageController extends Controller {
                        onUploadStarting(xhr, instance, file, formData) {
                            let invalidSize = file.size > 1e6;
                            let invalidType = file.type.indexOf("image/") != 0;

                            let f = { file };
                            if (invalidSize || invalidType) {
                                f.invalid = {
                                    size: invalidSize,
                                    type: invalidType
                                }
                            }

                            instance.store.update("$page.form.files", append, f);

                            this.store.set('$page.form.visited', false);
                            this.store.delete('$page.form.progress');
                            return false;
                        }

                        async upload(e, { store }) {
                            let formInvalid = store.get('$page.form.invalid');
                            if (formInvalid) {
                                this.store.set('$page.form.visited', true);
                                return;
                            }

                            this.store.set("$page.form.uploadInProgress", true);
                            try {
                                let files = this.store.get("$page.form.files");
                                let response = await uploadFilesWithProgress("https://api.cxjs.io/uploads", files, (progress) => {
                                    store.set('$page.form.progress', progress);
                                });
                                this.store.delete('$page.form.files');
                                MsgBox.alert(\`Upload completed with status \${response.status}.\`);
                            } catch (err) {
                                console.error('Upload failed:', err);
                                MsgBox.alert(err.message);
                            } finally {
                                this.store.set("$page.form.uploadInProgress", false);
                            }
                        }

                        onRemoveFile(e, {store}) {
                            store.delete('$record');
                            this.store.set('$page.form.visited', false);
                        }

                        onClearForm() {
                            this.store.delete('$page.form');
                            this.store.set('$page.form.visited', false);
                        }
                    }

                    function uploadFilesWithProgress(url, files, onProgress) {
                        return new Promise((resolve, reject) => {
                            const xhr = new XMLHttpRequest();
                            const formData = new FormData();

                            // Append multiple files to the form data
                            files.forEach((file) => formData.append("file", file));

                            // Set up progress event listener
                            xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);

                            // Handle when the request finishes successfully
                            xhr.onload = () => xhr.status >= 200 && xhr.status < 300
                                ? resolve(xhr)
                                : reject(new Error(\`Failed with status: \${xhr.status} - \${xhr.statusText}\`));

                            // Handle errors
                            xhr.onerror = () => reject(new Error("Network error or request failed."));

                            // Open the request and send the form data
                            xhr.open('POST', url);
                            xhr.send(formData);
                        });
                    }
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="mB8pDfIq">{`
                    <ValidationGroup invalid-bind='$page.form.invalid' errors-bind="$page.form.errors">
                        <Validator value-bind='$page.form.files.length' onValidate={(val = 0) => val < 1 && "Cannot submit empty form." } />
                        <Validator value-bind='$page.form.files' onValidate={(files) => files?.some(f => f.invalid) && "Only images with size less or equal to 1 MB are allowed." } />
                        <UploadButton
                            text="Choose files"
                            url="~/api/accounts/logos"
                            multiple
                            onUploadStarting="onUploadStarting"
                            style='width: fit-content'
                            icon='search'
                        />
                        <div>
                            <div text="Files to upload:" style='font-weight: 600; margin-bottom: 4px;'/>
                            <Grid
                                columns={[
                                    {
                                        header: 'File name',
                                        field: 'file.name',
                                        class: {
                                            invalidfile: bind('$record.invalid.type')
                                        }
                                    },
                                    {
                                        header: 'File size',
                                        field: 'size',
                                        value: computable('$record.file.size', s => {
                                            if (s >= 1e6) return \`\${(s / 1e6).toFixed(1)} MB\`;
                                            return \`\${Math.round(s / 1e3, 1)} KB\`;
                                        }),
                                        align: 'right',
                                        defaultWidth: 80,
                                        class: {
                                            invalidfile: bind('$record.invalid.size')
                                        }
                                    },
                                    {
                                        align: 'center',
                                        style: 'padding-left: 16px',
                                        items: <cx>
                                            <button
                                                onClick="onRemoveFile"
                                                text='x'
                                                tooltip-tpl="Remove file: {$record.file.name}"
                                                style="padding: 4px !important"
                                                disabled-bind='$page.form.uploadInProgress'
                                            />
                                        </cx>,
                                        defaultWidth: 50,
                                    },
                                ]}
                                records-bind='$page.form.files'
                                emptyText="Choose image type files with size not greater than 1 MB."
                                style='width: 100%'
                            />
                        </div>
                        <div>
                            Progress:
                            <ProgressBar style='width: 100%' value-bind='$page.form.progress' text-tpl='{$page.form.progress:p;0}'/>
                        </div>
                        <Repeater records-bind='$page.form.errors' visible-expr='{$page.form.invalid} && {$page.form.visited}'>
                            <div class='invalidfile' text-bind='$record.message'></div>
                        </Repeater>
                        <div style='display: flex; justify-content: space-between;'>
                            <Button text='Clear form' onClick='onClearForm' icon='clear' disabled-bind='$page.form.uploadInProgress' />
                            <Button text="Upload" onClick="upload" style='width: fit-content; margin-left: auto' disabled-bind='$page.form.uploadInProgress' icon='file' />
                        </div>
                    </ValidationGroup>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>
    </Md>
</cx>

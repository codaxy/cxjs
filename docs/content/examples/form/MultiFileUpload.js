import { append } from 'cx/src/data/ops';
import { Controller, FirstVisibleChildLayout } from 'cx/ui';
import { Button, Content, Repeater, Tab, UploadButton, ValidationGroup, Validator } from 'cx/widgets';
import { CodeSnippet } from '../../../components/CodeSnippet';
import { CodeSplit } from '../../../components/CodeSplit';
import { Md } from '../../../components/Md';

async function sleep(ms = 1000) {
    return new Promise(resolve => {
        setTimeout(() => resolve(true), ms)
    });
}
class PageController extends Controller {
    onUploadStarting(xhr, instance, file, formData) {
		instance.store.update("$page.files", append, file);
        this.store.set('$page.formVisited', false);
		return false;
	}

	async upload(e, { store }) {
        let formInvalid = store.get('$page.formInvalid');
        if (formInvalid) {
            this.store.set('$page.formVisited', true);
            return;
        }
		let formData = new FormData();

		let files = this.store.get("$page.files");
		for (let file of files) formData.append("file", file, file.name);


        this.store.set("$page.uploadInProgress", true);
		try {
            // await fetch("#", {
            //     method: "POST",
			// 	body: formData,
			// })
            await sleep(1200);
		} catch (err) {
            console.error(err);
		} finally {
            this.store.set("$page.uploadInProgress", false);
        }
	}

    onRemoveFile(e, {store}) {
        store.delete('$record');
    }
}

export const MultiFileUpload = <cx>
    <Md controller={PageController}>

        # Multi File Upload

        <CodeSplit>

            The following example shows how to use `UploadButton` to upload multiple files at once.

            Default behavior of the `UploadButton` is to immediately upload the file upon selection using the `XMLHttpRequest` object.
            If multiple files are selected, they will be sent in subsequent requests. To prevent this behavior, we can define `onUploadStarting` callback,
            remember the selected file, and return `false` from it. This way the button is only used to load the files in browser memory, the upload logic
            is on the developer to implement.

            <div class="widgets">
                <div style='width: 100%;'>
                    <div style='width: 40%; display: flex; flex-direction: column; gap: 24px'>
                        <ValidationGroup invalid-bind='$page.formInvalid'>
                            <Validator value-bind='$page.files.length' onValidate={(val = 0) => val < 1 }/>
                            <UploadButton
                                text="Choose files"
                                url="~/api/accounts/logos"
                                multiple
                                onUploadStarting="onUploadStarting"
                                style='width: fit-content'
                            />
                            <div>
                                <div text="Files to upload:" style='font-weight: 600; margin-bottom: 4px;'/>
                                <FirstVisibleChildLayout>
                                    <i style='color: rgb(239 68 68);' visible-expr='{$page.formInvalid} && {$page.formVisited}'>Cannot submit empty form.</i>
                                    <i visible-expr="!{$page.files.length}">No files selected.</i>
                                    <Repeater records-bind="$page.files">
                                        <div style='display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 4px;'>
                                            <div text-expr="{$index} + 1 + '. ' + {$record.name}"/>
                                            <button onClick="onRemoveFile" text='x' tooltip-tpl="Remove file: {$record.name}" style="padding: 4px !important"/>
                                        </div>
                                    </Repeater>
                                </FirstVisibleChildLayout>
                            </div>
                            <Button text="Upload" onClick="upload" style='width: fit-content; margin-left: auto' disabled-bind='$page.uploadInProgress' icon-expr='{$page.uploadInProgress} ? "loading" : null'/>
                        </ValidationGroup>
                    </div>
                </div>
            </div>

            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller" />
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>

                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="5Zp9AfEj">{`
                    class PageController extends Controller {
                        onUploadStarting(xhr, instance, file, formData) {
                            instance.store.update("$page.files", append, file);
                            this.store.set('$page.formVisited', false);
                            return false;
                        }

                        async upload(e, { store }) {
                            let formInvalid = store.get('$page.formInvalid');
                            if (formInvalid) {
                                this.store.set('$page.formVisited', true);
                                return;
                            }
                            let formData = new FormData();

                            let files = this.store.get("$page.files");
                            for (let file of files) formData.append("file", file, file.name);


                            this.store.set("$page.uploadInProgress", true);
                            try {
                                // await fetch("#", {
                                //     method: "POST",
                                // 	body: formData,
                                // })
                                await sleep(1200);
                            } catch (err) {
                                console.error(err);
                            } finally {
                                this.store.set("$page.uploadInProgress", false);
                            }
                        }

                        onRemoveFile(e, {store}) {
                            store.delete('$record');
                        }
                    }
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="5Zp9AfEj">{`
                    <ValidationGroup invalid-bind='$page.formInvalid'>
                        <Validator value-bind='$page.files.length' onValidate={(val = 0) => val < 1 }/>
                        <UploadButton
                            text="Choose files"
                            url="~/api/accounts/logos"
                            multiple
                            onUploadStarting="onUploadStarting"
                            style='width: fit-content'
                        />
                        <div>
                            <div text="Files to upload:" style='font-weight: 600; margin-bottom: 4px;'/>
                            <FirstVisibleChildLayout>
                                <i style='color: rgb(239 68 68);' visible-expr='{$page.formInvalid} && {$page.formVisited}'>Cannot submit empty form.</i>
                                <i visible-expr="!{$page.files.length}">No files selected.</i>
                                <Repeater records-bind="$page.files">
                                    <div style='display: flex; flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 4px;'>
                                        <div text-expr="{$index} + 1 + '. ' + {$record.name}"/>
                                        <button onClick="onRemoveFile" text='x' tooltip-tpl="Remove file: {$record.name}" style="padding: 4px !important"/>
                                    </div>
                                </Repeater>
                            </FirstVisibleChildLayout>
                        </div>
                        <Button text="Upload" onClick="upload" style='width: fit-content; margin-left: auto' disabled-bind='$page.uploadInProgress' icon-expr='{$page.uploadInProgress} ? "loading" : null'/>
                    </ValidationGroup>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>
    </Md>
</cx>

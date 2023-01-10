import { Controller } from "cx/ui";
import { MsgBox, UploadButton } from "cx/widgets";

class PageController extends Controller {
    onInit() {}

    onUploadStarting(xhr, instance, file) {
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

    onUploadComplete(xhr, instance) {
        MsgBox.alert(`Upload completed with status ${xhr.status}.`);
    }

    onUploadError(e) {
        console.log(e);
    }
}

export default (
    <cx>
        <div class="widgets" controller={PageController}>
            <UploadButton
                icon="upload"
                url="https://api.cxjs.io/uploads"
                onUploadStarting="onUploadStarting"
                onUploadComplete="onUploadComplete"
                onUploadError="onUploadError"
                title="Text"
                accept="image/png"
            >
                Upload
            </UploadButton>
        </div>
    </cx>
)

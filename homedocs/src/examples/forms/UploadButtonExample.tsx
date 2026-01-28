import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { UploadButton, MsgBox } from "cx/widgets";
import "../../icons/lucide";

// @model
interface Model {
  status: string;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onUploadStarting(xhr: XMLHttpRequest, instance: any, file: File): boolean {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      MsgBox.alert("Only images are allowed.");
      return false;
    }
    // Validate file size (max 1MB)
    if (file.size > 1e6) {
      MsgBox.alert("File is too large (max 1MB).");
      return false;
    }
    this.store.set(m.status, `Uploading ${file.name}...`);
    return true;
  }

  onUploadProgress(event: ProgressEvent) {
    console.log(event);
    if (event.lengthComputable) {
      const percent = Math.round((event.loaded / event.total) * 100);
      this.store.set(m.status, `Uploading... ${percent}%`);
    }
  }

  onUploadComplete(xhr: XMLHttpRequest) {
    console.log("completed");
    this.store.set(m.status, `Upload complete (status: ${xhr.status})`);
  }

  onUploadError(error: any) {
    this.store.set(m.status, "Upload failed");
    console.error(error);
  }
}
// @controller-end

// @index
export default (
  <div class="flex flex-col gap-4" controller={PageController}>
    <div class="flex flex-wrap gap-2">
      <UploadButton
        icon="upload"
        url="https://api.cxjs.io/uploads"
        accept="image/*"
        onUploadStarting={(xhr, instance, file) =>
          instance.getControllerByType(PageController).onUploadStarting(xhr, instance, file)
        }
        onUploadProgress={(event, instance) =>
          instance.getControllerByType(PageController).onUploadProgress(event)
        }
        onUploadComplete={(xhr, instance) =>
          instance.getControllerByType(PageController).onUploadComplete(xhr)
        }
        onUploadError={(error, instance) =>
          instance.getControllerByType(PageController).onUploadError(error)
        }
      >
        Upload Image
      </UploadButton>
      <UploadButton icon="upload" url="https://api.cxjs.io/uploads" disabled>
        Disabled
      </UploadButton>
    </div>
    <div class="text-sm text-gray-600" text={m.status} />
  </div>
);
// @index-end

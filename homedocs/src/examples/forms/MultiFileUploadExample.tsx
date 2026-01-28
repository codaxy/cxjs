import { append, createModel } from "cx/data";
import {
  computable,
  Controller,
  expr,
  isNonEmpty,
  LabelsTopLayout,
  truthy,
} from "cx/ui";
import {
  Button,
  enableMsgBoxAlerts,
  Grid,
  LabeledContainer,
  MsgBox,
  ProgressBar,
  Repeater,
  UploadButton,
  ValidationGroup,
  Validator,
  type ValidationErrorData,
} from "cx/widgets";
import "../../icons/lucide";

enableMsgBoxAlerts();

// @model
interface FileEntry {
  file: File;
  invalid?: {
    size?: boolean;
    type?: boolean;
  };
}

interface Model {
  form: {
    files: FileEntry[];
    invalid: boolean;
    visited: boolean;
    progress: number;
    uploadInProgress: boolean;
    errors: ValidationErrorData[];
  };
  $record: FileEntry;
  $error: ValidationErrorData;
}

const m = createModel<Model>();
// @model-end

function formatFileSize(size: number): string {
  if (size >= 1e6) return `${(size / 1e6).toFixed(1)} MB`;
  return `${Math.round(size / 1e3)} KB`;
}

function uploadFilesWithProgress(
  url: string,
  files: File[],
  onProgress: (progress: number) => void,
): Promise<XMLHttpRequest> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    files.forEach((file) => formData.append("file", file));

    xhr.upload.onprogress = (e) =>
      e.lengthComputable && onProgress(e.loaded / e.total);

    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve(xhr)
        : reject(
            new Error(`Failed with status: ${xhr.status} - ${xhr.statusText}`),
          );

    xhr.onerror = () => reject(new Error("Network error or request failed."));

    xhr.open("POST", url);
    xhr.send(formData);
  });
}

// @controller
class PageController extends Controller {
  onUploadStarting(xhr: XMLHttpRequest, instance: any, file: File) {
    const invalidSize = file.size > 1e6;
    const invalidType = !file.type.startsWith("image/");

    const entry: FileEntry = { file };
    if (invalidSize || invalidType) {
      entry.invalid = { size: invalidSize, type: invalidType };
    }

    instance.store.update(m.form.files, append, entry);
    this.store.set(m.form.visited, false);
    this.store.delete(m.form.progress);
    return false;
  }

  async upload() {
    const formInvalid = this.store.get(m.form.invalid);
    if (formInvalid) {
      this.store.set(m.form.visited, true);
      return;
    }

    this.store.set(m.form.uploadInProgress, true);
    try {
      const files = this.store.get(m.form.files);
      const response = await uploadFilesWithProgress(
        "https://api.cxjs.io/uploads",
        files.map((f) => f.file),
        (progress) => this.store.set(m.form.progress, progress),
      );
      this.store.delete(m.form.files);
      MsgBox.alert(`Upload completed with status ${response.status}.`);
    } catch (err: any) {
      console.error("Upload failed:", err);
      MsgBox.alert(err.message);
    } finally {
      this.store.set(m.form.uploadInProgress, false);
    }
  }

  onRemoveFile(e: any, { store }: any) {
    store.delete(m.$record);
    this.store.set(m.form.visited, false);
  }

  onClearForm() {
    this.store.delete(m.form);
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <ValidationGroup invalid={m.form.invalid} errors={m.form.errors}>
      <Validator
        value={m.form.files}
        onValidate={(files: FileEntry[] = []) =>
          files.length < 1 && "Please select at least one file."
        }
      />
      <Validator
        value={m.form.files}
        onValidate={(files: FileEntry[]) =>
          files?.some((f) => f.invalid) &&
          "Only images with size up to 1 MB are allowed."
        }
      />

      <UploadButton
        text="Choose files"
        url="#"
        multiple
        onUploadStarting="onUploadStarting"
        icon="search"
      />

      <LabelsTopLayout vertical mod="stretch">
        <LabeledContainer label="Files to upload:">
          <Grid
            records={m.form.files}
            recordAlias={m.$record}
            emptyText="Select image files (max 1 MB each)."
            columns={[
              {
                header: "File name",
                field: "file.name",
                class: expr(m.$record.invalid.type, (invalid) =>
                  invalid ? "text-red-600 italic" : "",
                ),
              },
              {
                header: "Size",
                value: computable(m.$record.file.size, (s) =>
                  formatFileSize(s ?? 0),
                ),
                align: "right",
                defaultWidth: 80,
                class: expr(m.$record.invalid.size, (invalid) =>
                  invalid ? "text-red-600 italic" : "",
                ),
              },
              {
                align: "center",
                defaultWidth: 50,
                items: (
                  <Button
                    icon="x"
                    mod="hollow"
                    onClick="onRemoveFile"
                    disabled={m.form.uploadInProgress}
                  />
                ),
              },
            ]}
          />
        </LabeledContainer>
        <LabeledContainer label="Progress:" visible={m.form.uploadInProgress}>
          <ProgressBar value={m.form.progress} />
        </LabeledContainer>
      </LabelsTopLayout>

      <div visible={isNonEmpty(m.form.errors)} class="mt-4">
        <Repeater
          records={m.form.errors}
          recordAlias={m.$error}
          visible={expr(
            m.form.invalid,
            m.form.visited,
            (invalid, visited) => invalid && visited,
          )}
        >
          <div class="text-red-600 italic" text={m.$error.message} />
        </Repeater>
      </div>

      <div class="flex justify-between mt-4">
        <Button
          text="Clear"
          onClick="onClearForm"
          icon="trash"
          disabled={m.form.uploadInProgress}
        />
        <Button
          text="Upload"
          onClick="upload"
          icon="upload"
          disabled={m.form.uploadInProgress}
        />
      </div>
    </ValidationGroup>
  </div>
);
// @index-end

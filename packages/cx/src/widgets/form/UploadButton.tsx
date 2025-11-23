/** @jsxImportSource react */

import { Widget, VDOM } from "../../ui/Widget";
import { Icon } from "../Icon";
import { Field, FieldInstance } from "./Field";
import { Url } from "../../ui/app/Url";
import { Localization } from "../../ui/Localization";
import type { RenderingContext } from "../../ui/RenderingContext";
import type { Instance } from "../../ui/Instance";
import { isNonEmptyArray } from "../../util/isNonEmptyArray";

//TODO: Implement UploadStatus which will enable canceling

export class UploadButton extends Field {
   declare public multiple: boolean;
   declare public method: string;
   declare public abortOnDestroy: boolean;
   declare public uploadInProgressText: string;
   declare public onResolveUrl?: string | ((file: File, instance: Instance) => string | Promise<string>);
   declare public onUploadStarting?:
      | string
      | ((xhr: XMLHttpRequest, instance: Instance, file: File, formData: FormData) => boolean | Promise<boolean>);
   declare public onUploadComplete?:
      | string
      | ((xhr: XMLHttpRequest, instance: Instance, file: File, formData: FormData) => void);
   declare public onUploadProgress?:
      | string
      | ((event: ProgressEvent, instance: Instance, file: File, formData: FormData) => void);
   declare public onUploadError?: string | ((error: unknown, instance: Instance, file: File, formData: FormData) => void);

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(
         {
            disabled: undefined,
            enabled: undefined,
            text: undefined,
            url: undefined,
            icon: undefined,
            accept: undefined,
         },
         ...args,
      );
   }

   renderInput(context: RenderingContext, instance: FieldInstance<UploadButton>, key: string): React.ReactNode {
      let { data } = instance;
      return (
         <UploadButtonComponent key={key} instance={instance}>
            {data.text || this.renderChildren(context, instance)}
         </UploadButtonComponent>
      );
   }
}

UploadButton.prototype.baseClass = "uploadbutton";
UploadButton.prototype.multiple = false;
UploadButton.prototype.method = "POST";
UploadButton.prototype.abortOnDestroy = false;
UploadButton.prototype.uploadInProgressText = "Upload is in progress.";

Localization.registerPrototype("cx/widgets/UploadButton", UploadButton);

interface UploadButtonComponentProps {
   instance: FieldInstance<UploadButton>;
   children?: React.ReactNode;
}

interface UploadButtonComponentState {
   progress: number;
   uploadKey: number;
}

interface Upload {
   progress: number;
   size: number;
   file: File;
   xhr: XMLHttpRequest;
}

class UploadButtonComponent extends VDOM.Component<UploadButtonComponentProps, UploadButtonComponentState> {
   uploads: Record<string, Upload>;
   el?: HTMLDivElement;

   constructor(props: UploadButtonComponentProps) {
      super(props);
      this.uploads = {};
      this.state = {
         progress: 100,
         uploadKey: 0,
      };
   }

   render(): React.ReactNode {
      let { instance, children } = this.props;
      let { widget, data } = instance;
      let { CSS, baseClass } = widget;

      let icon;

      let className = data.classNames;

      if (data.icon) {
         icon = Icon.render(data.icon, {
            className: CSS.element(baseClass, "icon"),
         });
         className = CSS.expand(className, CSS.state("icon"), !isNonEmptyArray(children) && CSS.state("empty"));
      }

      return (
         <div
            ref={(el: HTMLDivElement | null) => {
               this.el = el || undefined;
            }}
            className={className}
            style={data.style}
         >
            <div
               key="progress"
               className={CSS.element(baseClass, "progress", { done: this.state.progress == 100 })}
               style={{ width: `${this.state.progress}%` }}
            />
            {icon}
            {children}
            {!data.disabled && (
               <input
                  key={this.state.uploadKey}
                  className={CSS.element(baseClass, "input")}
                  type="file"
                  title=" "
                  accept={data.accept as string}
                  multiple={widget.multiple}
                  tabIndex={data.tabIndex as number}
                  onChange={this.onFileSelected.bind(this)}
               />
            )}
         </div>
      );
   }

   onFileSelected(e: React.ChangeEvent<HTMLInputElement>): void {
      let files = e.target.files;
      if (files) {
         for (let i = 0; i < files.length; i++) this.uploadFile(files[i]);
      }
   }

   componentDidMount(): void {
      if (this.props.instance.data.autoFocus) this.el!.focus();
   }

   componentWillUnmount(): void {
      if (this.props.instance.widget.abortOnDestroy) {
         for (let key in this.uploads) {
            let upload = this.uploads[key];
            upload.xhr.abort();
         }
      }
   }

   uploadFile(file: File): void {
      let { instance } = this.props;
      let { data, widget } = instance;

      if (widget.onResolveUrl) {
         Promise.resolve(instance.invoke("onResolveUrl", file, instance)).then((url) => {
            this.doUpload(file, url);
         });
      } else {
         this.doUpload(file, data.url);
      }
   }

   doUpload(file: File, url: string): void {
      let { instance } = this.props;
      let { widget } = instance;

      if (!url) throw new Error("Upload URL not set.");

      let xhr = new XMLHttpRequest();
      xhr.open(widget.method, Url.resolve(url));

      let formData = new FormData();
      formData.append("file", file);

      let key = this.state.uploadKey;
      this.setState({
         uploadKey: key + 1,
      });

      let startingPromise = widget.onUploadStarting
         ? instance.invoke("onUploadStarting", xhr, instance, file, formData)
         : true;

      Promise.resolve(startingPromise)
         .then((result) => {
            if (result === false) return;

            let upload = (this.uploads[key] = {
               progress: 0,
               size: file.size || 1,
               file: file,
               xhr: xhr,
            });

            xhr.onload = () => {
               delete this.uploads[key];
               if (widget.onUploadComplete) instance.invoke("onUploadComplete", xhr, instance, file, formData);
               this.reportProgress();
            };
            xhr.onerror = (e) => {
               delete this.uploads[key];
               if (widget.onUploadError) instance.invoke("onUploadError", e, instance, file, formData);
               this.reportProgress();
            };

            xhr.upload.onprogress = (event) => {
               if (event.lengthComputable) {
                  upload.progress = event.loaded / event.total;
                  this.reportProgress();
                  if (widget.onUploadProgress) instance.invoke("onUploadProgress", event, instance, file, formData);
               }
            };

            xhr.send(formData);
         })
         .catch((err) => {
            if (widget.onUploadError) instance.invoke("onUploadError", err, instance, file, formData);
            else console.error("Unhandled upload error.", err);
         });

      this.reportProgress();
   }

   reportProgress(): void {
      let totalSize = 0;
      let uploaded = 0;

      for (let key in this.uploads) {
         let upload = this.uploads[key];
         totalSize += upload.size;
         uploaded += upload.size * upload.progress;
      }

      let progress = 100 * (totalSize ? uploaded / totalSize : 1);

      this.props.instance.setState({
         inputError: progress == 100 ? false : this.props.instance.widget.uploadInProgressText,
      });

      this.setState({
         progress: Math.max(0.001, Math.floor(progress)),
      });
   }
}

Widget.alias("upload-button", UploadButton);

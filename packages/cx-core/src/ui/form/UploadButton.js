import {Widget, VDOM} from '../Widget';
import {Field} from './Field';
import {Url} from '../../app/Url';

//TODO: Implement UploadStatus which will enable canceling

export class UploadButton extends Field {
   declareData() {
      super.declareData({
         disabled: undefined,
         text: undefined,
         url: undefined
      }, ...arguments);
   }

   renderInput(context, instance, key) {
      var {data} = instance;
      return <UploadButtonComponent key={key} instance={instance}>
         {data.text || this.renderChildren(context, instance)}
      </UploadButtonComponent>
   }
}

UploadButton.prototype.baseClass = 'uploadbutton';
UploadButton.prototype.multiple = false;

class UploadButtonComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.uploads = {};
      this.uploadKey = 0;
      this.state = {
         progress: 100,
      };
   }

   render() {
      var {instance} = this.props;
      var {widget, data} = instance;
      var {CSS, baseClass} = widget;

      return <div ref={el=>{this.el = el}} className={data.classNames} style={data.style}>
         <div key="progress"
              className={CSS.element(baseClass, "progress", {done: this.state.progress == 100})}
              style={{width: `${this.state.progress}%`}}/>
         {this.props.children}
         {
            !data.disabled && <input key={this.uploadKey}
                                     className={CSS.element(baseClass, "input")}
                                     type="file"
                                     onChange={::this.onFileSelected}
                                     multiple={widget.multiple}/>
         }
      </div>
   }

   onFileSelected(e) {
      let files = e.dataTransfer ? e.dataTransfer.files : e.target ? e.target.files : [];
      for (var i = 0; i < files.length; i++)
         this.uploadFile(files[i]);
   }

   componentDidMount() {
      if (this.props.instance.data.autoFocus)
         this.el.focus();
   }

   componentWillUnmount() {
      for (var key in this.uploads) {
         var upload = this.uploads[key];
         upload.xhr.abort();
      }
   }

   uploadFile(file) {
      var {instance} = this.props;
      var {widget, data} = instance;

      var xhr = new XMLHttpRequest();

      if (widget.onUploadStarting && widget.onUploadStarting(file, instance, xhr) === false)
         return;

      var key = this.uploadKey++;
      var upload = this.uploads[key] = {
         progress: 0,
         size: file.size || 1,
         file: file,
         xhr: xhr
      };

      if (!data.url)
         throw new Error('Upload url not set.');

      var formData = new FormData();
      formData.append("file", file);


      xhr.open('POST', Url.resolve(data.url));
      xhr.onload = () => {
         delete this.uploads[key];
         if (widget.onUploadComplete)
            widget.onUploadComplete(xhr, instance, file);
         this.reportProgress();
      };
      xhr.onerror = e=> {
         delete this.uploads[key];
         if (widget.onUploadError)
            widget.onUploadError(e, instance, file);
         this.reportProgress();
      };

      xhr.upload.onprogress = event => {
         if (event.lengthComputable) {
            upload.progress = event.loaded / event.total;
            this.reportProgress();
         }
      };

      xhr.send(formData);

      this.reportProgress();
      this.forceUpdate();
   }

   reportProgress() {
      var totalSize = 0;
      var uploaded = 0;

      for (var key in this.uploads) {
         var upload = this.uploads[key];
         totalSize += upload.size;
         uploaded += upload.size * upload.progress;
      }

      var progress = 100 * (totalSize ? uploaded / totalSize : 1);

      this.props.instance.setState({
         inputError: progress == 100 ? false : 'Upload is in progress'
      });

      this.setState({
         progress: Math.max(0.001, Math.floor(progress))
      });
   }
}

Widget.alias('upload-button', UploadButton);
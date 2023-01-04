import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  return (
    <div className="App">
      <Editor

        apiKey=""
        initialValue="<p>This is the initial content of the editor</p>"
        plugins="advlist autolink lists link image charmap print preview anchor
                          searchreplace visualblocks code fullscreen
                          insertdatetime media table paste code help wordcount"
        init={{
          height: 500,
          toolbar:
            'undo redo | formatselect | h1 h2 h3 h4 h5 h6 | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | image',
          file_picker_callback: function (callback, value, meta) {
            // Provide file and text for the link dialog
            if (meta.filetype == 'file') {
              callback('mypage.html', { text: 'My text' });
            }

            // Provide image and alt text for the image dialog
            if (meta.filetype == 'image') {
              callback('myimage.jpg', { alt: 'My alt text' });
            }

            // Provide alternative source and posted for the media dialog
            if (meta.filetype == 'media') {
              callback('movie.mp4', { source2: 'alt.ogg', poster: 'image.jpg' });
            }
          },
          file_picker_types: 'image',
          /* and here's our custom image picker*/
          file_picker_callback: function (cb, value, meta) {
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            /*
              Note: In modern browsers input[type="file"] is functional without
              even adding it to the DOM, but that might not be the case in some older
              or quirky browsers like IE, so you might want to add it to the DOM
              just in case, and visually hide it. And do not forget do remove it
              once you do not need it anymore.
            */

            input.onchange = function () {
              var file = this.files[0];

              var reader = new FileReader();
              reader.onload = function () {
                /*
                  Note: Now we need to register the blob in TinyMCEs image blob
                  registry. In the next release this part hopefully won't be
                  necessary, as we are looking to handle it internally.
                */
                var id = 'blobid' + (new Date()).getTime();
                var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                var base64 = reader.result.split(',')[1];
                var blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);

                /* call the callback and populate the Title field with the file name */
                cb(blobInfo.blobUri(), { title: file.name });
              };
              reader.readAsDataURL(file);
            };

            input.click();
          },
        }}

        onChange={e => console.log(e)}
      />
      <button onClick={log}>Log editor content</button>
    </div>
  );
}

export default App;

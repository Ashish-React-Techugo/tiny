import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const editorRef = useRef(null);
  const [content, setContent] = useState("")
  const [video,setVideo] = useState("")
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  console.log(content)
  return (
    <div className="App">
     <Editor
        apiKey=""
        // initialValue={content}
        // value={content}
        plugins="advlist autolink lists image media charmap print preview anchor
                          searchreplace visualblocks code fullscreen
                          insertdatetime media table paste code help wordcount"
        init={{
          height: 500,
          toolbar:
            'undo redo | formatselect | h1 h2 h3 h4 h5 h6 | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | image | media',
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
          browser_spellcheck:true,
          file_picker_types: 'image media',
          /* and here's our custom image picker*/
          file_picker_callback: function (cb, value, meta) {
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*,video/*');

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
              reader.onload = async function () {
                /*
                  Note: Now we need to register the blob in TinyMCEs image blob
                  registry. In the next release this part hopefully won't be
                  necessary, as we are looking to handle it internally.
                */
               debugger
               let formData = new FormData();
               formData.append("attachement",file);
               let response = await axios.post("https://techugoapps.com:9099/uploadfile",formData)
                // var id = 'blobid' + (new Date()).getTime();
                // var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                // var base64 = reader.result.split(',')[1];
                // var blobInfo = blobCache.create(id, file, base64);
                // blobCache.add(blobInfo);

                /* call the callback and populate the Title field with the file name */
                // cb(video, { title: file.name });
                cb(response.data.result, { title: file.name });
                // cb(video, { title: file.name });

              };
              reader.readAsDataURL(file);
            };

            input.click();
          },
          video_template_callback: function(data) {
            debugger
            return '<video width="' + data.width + '" height="' + data.height + '"' + (data.poster ? ' poster="' + data.poster + '"' : '') + ' controls="controls">\n' + '<source src="' + data.source + '"' + (data.sourcemime ? ' type="' + data.sourcemime + '"' : '') + ' />\n' + (data.altsource ? '<source src="' + data.altsource + '"' + (data.altsourcemime ? ' type="' + data.altsourcemime + '"' : '') + ' />\n' : '') + '</video>';
          }
        }}
        

        onChange={e => setContent(e.target.getContent())}
      />
      {/* <input type="file" onChange={async e=>{
        debugger
        let formData = new FormData();
        formData.append("attachement",e.target.files[0]);
        let response = await axios.post("https://techugoapps.com:9099/uploadfile",formData)
        setVideo(response.data.result);
      }} value={content}/> */}
      <button onClick={log}>Log editor content</button>
    </div>
  );
}

export default App;

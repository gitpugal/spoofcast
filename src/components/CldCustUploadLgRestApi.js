import React, { Component } from "react";

// function submitHandler(e){
//         e.preventDefault();
//         processFile();
// }

const CldCustUploadLgRestApi = (props) => {
    async function processFile(e){
        e.preventDefault();
        var file = e.target.files[0];
    
        // Set your cloud name and unsigned upload preset here:
        var YOUR_CLOUD_NAME = "dpgzkxcud";
        var YOUR_UNSIGNED_UPLOAD_PRESET = "sys3hurw";
    
        var POST_URL =
          "https://api.cloudinary.com/v1_1/" + YOUR_CLOUD_NAME + "/auto/upload";
    
        var XUniqueUploadId = +new Date();
    
        processFile();
    
        function processFile(e) {
            // e.preventDefault();
          var size = file.size;
          var sliceSize = 20000000;
          var start = 0;
    
          setTimeout(loop, 3);
    
          function loop() {
            var end = start + sliceSize;
    
            if (end > size) {
              end = size;
            }
            var s = slice(file, start, end);
            send(s, start, end - 1, size);
            if (end < size) {
              start += sliceSize;
              setTimeout(loop, 3);
            }
          }
        }
    
        function send(piece, start, end, size) {
          console.log("start ", start);
          console.log("end", end);
    
          var formdata = new FormData();
          console.log(XUniqueUploadId);
    
          formdata.append("file", piece);
          formdata.append("cloud_name", YOUR_CLOUD_NAME);
          formdata.append("upload_preset", YOUR_UNSIGNED_UPLOAD_PRESET);
          formdata.append("public_id", "myChunkedFile2");
    
          var xhr = new XMLHttpRequest();
          xhr.open("POST", POST_URL, false);
          xhr.setRequestHeader("X-Unique-Upload-Id", XUniqueUploadId);
          xhr.setRequestHeader(
            "Content-Range",
            "bytes " + start + "-" + end + "/" + size
          );
    
          xhr.onload = function (e) {
            e.preventDefault();
            // do something to response
            const response = JSON.parse(this.responseText);
            props.setPodCastUrl(response.url);
          };
    
          xhr.send(formdata);
        }
    
        function slice(file, start, end) {
          var slice = file.mozSlice
            ? file.mozSlice
            : file.webkitSlice
            ? file.webkitSlice
            : file.slice
            ? file.slice
            : noop;
    
          return slice.bind(file)(start, end);
        }
    
        function noop() {}
      };
    
    function submitHandler(e){
        e.preventDefault();
        processFile();
}
    
    return (
        <div>
          <form onSubmit={submitHandler}>
          <input type="file"  onChange={processFile}/>
          <button type="submit" className="cursor-pointer bg-black rounded-lg p-2 text-white w-fit">Upload</button>
          </form>
        </div>
      );
}

export default CldCustUploadLgRestApi;

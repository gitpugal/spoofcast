import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import '../App.css';
import axios from 'axios';
import music from '../contants';
import { upload } from '@testing-library/user-event/dist/upload';
import CldCustUploadLgRestApi from './CldCustUploadLgRestApi';
import {  TailSpin } from 'react-loader-spinner';


const AdminHome = (props) => {
  
  const [response, setResponse] = useState({});
  const [isUploading,  setIsUploading] = useState(false);

  useEffect(() => {
    setContent(prevContent => ({...prevContent, file: response.url}));
    console.log(content)
  }, [response])

    async function processFile(e){
      setIsUploading(true);
      let ress = {};
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
          formdata.append("public_id", e.target.files[0].name);
    
          var xhr = new XMLHttpRequest();
          xhr.open("POST", POST_URL, false);
          xhr.setRequestHeader("X-Unique-Upload-Id", XUniqueUploadId);
          xhr.setRequestHeader(
            "Content-Range",
            "bytes " + start + "-" + end + "/" + size
          );

          

          xhr.onload = function (e) {
            e.preventDefault();
             ress = JSON.parse(this.responseText); 
            setResponse(JSON.parse(this.responseText))
              // .then(console.log(response))  
              // .catch(err => console.log(err)) 
            // console.log(response);

          };
    
          xhr.send(formdata);
          console.log(ress)
          setResponse(ress);
          setIsUploading(false);
          // console.log(response);
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
        // console.log(ress)
      };



    const [musics, setMusics] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(()=> {
        axios.get(`https://spoofcastbackend.vercel.app/admin/musics/${props.user?.uid}`)
            .then(res => {setMusics(res.data)
            console.log(res)
            })
            .catch(err => console.log(err))
    }, [])
    const [content, setContent] = useState({
        name: "",
        description: "",
        category: "",
        speaker: "",
        file: "",
        uid: props.user?.uid || "",
        mid: Math.floor(Math.random()*1000)+props.user?.uid+Math.floor(Math.random()*1000)
    })
    function submitHandler(e){

        e.preventDefault();
        if(content.name.length == 0 || content.description.length == 0 || 
          content.category.length == 0 || content.speaker.length == 0 || 
          !content.file.length ){
            alert("Please fill all details in the uplaod Form!!")
          }else{
            props.submitPodcast(content)
            
        document.getElementById("podFile").value = "";
        setIsLoading(true);
        setContent({

            name: "",
            description: "",
            category: "",
            speaker: "",
            file: "",
            uid: props.user?.uid || "",
            mid: ""
        });
        setTimeout(() => {
            
            axios.get(`https://spoofcastbackend.vercel.app/admin/musics/${props.user?.uid}`)
        .then(res => {setMusics(res.data)
        console.log(res)
        setIsLoading(false)
        document.getElementById("podFile").value = "";
        })
        .catch(err => console.log(err))
        }, [5000])
          }
    }

    function changeHandler(e){
        e.preventDefault();
        const name = e.target.name;
        const value =  e.target.value;
        setContent(prevState => ({...prevState, [name]: value, 
            mid: Math.floor(Math.random()*1000)+props.user?.uid+Math.floor(Math.random()*1000)}))
    }

    function deleteHandler(mid){
        setIsDeleting(true);
        axios.delete(`https://spoofcastbackend.vercel.app/admin/musics/${mid}`)
            .then(console.log("deletd successfuly"))
            .catch(err => console.log(err));
        
        setMusics(prevMusic => prevMusic.filter(music => music.mid != mid))
        setIsDeleting(false);
    }
  return (
    <div className="home pt-10 w-full overflow-scroll text-center  h-full bg-black flex flex-col items-center">
        <h1 className='text-xl font-bold text-teal-300'>
            welcome to spoof cast Admin panel
        </h1>
        

        <div className='flex flex-col items-center'>
            {musics.length > 0 && musics.map((music) => (
                <div key={music.name} className="bg-opacity-25 bg-white  p-10 pb-2 rounded-lg my-10   w-[80%]  flex flex-col items-center justify-center">
                    <p>Song Name {music.name}</p>
                    <p>Description {music.description}</p>
                    <p>Category {music.category}</p>
                    <p>Author {music.speaker}</p>
                    {music.file.slice(-1) == "4" ? 
                    (<video className='w-[700px] h-full mt-5' controls >
                      <source src={music.file} type="video/mp4"/>
                    </video>) : 
                <ReactAudioPlayer src={music.file} controls className='w-[100%] mt-5'/>
                    }
                    <button className="bg-red-600 p-2 rounded-md my-2 top-10 relative" onClick={(e) => {
                        e.preventDefault()
                        deleteHandler(music.mid)
                        }}> delete</button>
                    
                    <p className='my-10'>{isDeleting ? "deleting your podcast.... ": ""}</p>
                </div>
            ))}
            <p className='my-10'>{isLoading ? "uploading your podcast.... ": "----------End of your uploads---------"}</p>
            {isLoading && <div className='my-3'>
              <TailSpin
  height="40"
  width="120"
  color="#4fa94d"
  ariaLabel="tail-spin-loading"
  radius="6"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
/>
              </div>}
        </div>
        <form onSubmit={submitHandler} className="bg-slate-300 p-10 w-[80%] rounded-md flex gap-3 flex-col items-center justify-center text-black">
            <input type="text" className="p-2 rounded-md"onChange={changeHandler} value={content.name} name='name' placeholder='enter the podcast title'/>
            <input type="text" className="p-2 rounded-md"onChange={changeHandler} value={content.description}name='description' placeholder='enter the podcast description'/>
            <input type="text" className="p-2 rounded-md"onChange={changeHandler} value={content.category}name='category' placeholder='enter the podcast category'/>
            <input type="text" className="p-2 rounded-md"onChange={changeHandler} value={content.speaker}name='speaker' placeholder='enter the podcast speaker'/>
            {/* <input type="text" className="p-2 rounded-md"onChange={changeHandler} value={content.file}name='file' placeholder='enter the podcast file'/> */}
            <input type="file" id="podFile" className='mx-auto' onChange={processFile}/>
            {isUploading && <div>
              
<p className='text-lg text-green-500 bg-yellow-300 p-1 rounded-lg' >please wait your file is uploading...</p>
            </div> }
          {/* <button type="submit" className="cursor-pointer bg-black rounded-lg p-2 text-white w-fit">Upload</button> */}
            {isUploading || isLoading ? <button className='p-2 rounded-md bg-slate-500 m-3' type="submit" disabled>Upload PodCast</button> : <button className='p-2 rounded-md bg-slate-500 m-3' type="submit">Upload PodCast</button>}
        </form>
<button className="bg-red-500 p-3 rounded-md my-3 cursor-pointer absolute bottom-2" onClick={() => signOut(props.auth)}>Sign Out</button>
    </div>
  )
}

export default AdminHome;

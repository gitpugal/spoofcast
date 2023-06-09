import { signOut } from 'firebase/auth';
import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import '../App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import music from '../contants';
import starFilled from "../starFilled.png"
import starEmpty from "../starEmpty.png"
// import { set } from 'mongoose';
// https://pngtree.com/freepng/vector-star-icon_3876637.html
const Home = (props) => {
  const [musics, setMusics] = useState([]);
  const [currUser, setUser] = useState();
  const [isFav, setIsFav] = useState(false);
  const [searchTerm, setSearchTerm] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [showFav, SetShowFav] = useState(false);

  function makeAsFav(midd){
    console.log(midd)
    axios.put(`https://spoofcastbackend.vercel.app/${props.user?.uid}`, {mid: midd})
      .then(res => setUser(res))
      .catch(err => console.log("Cannot fetch user "+err))
      setIsFav(true)
      
      // setIsFav(true)
      console.log(currUser)
    
  }

  function searchChangeHandler(e){
    setSearchTerm(e.target.value)
  }

  function searchHandler(e){
    e.preventDefault();
    axios.get(`https://spoofcastbackend.vercel.app/admin/musics/search/${searchTerm}`)
      .then(res =>{
        setSearchResults(res.data)
        console.log(res.data)
      })
      .catch(err => console.log(err))

  }

    useEffect(()=> {
        axios.get("https://spoofcastbackend.vercel.app/admin/musics")
            .then(res => {setMusics(res.data)
            })
            .catch(err => console.log(err))
        axios.get(`https://spoofcastbackend.vercel.app/${props.user?.uid}`)
            .then(res => setUser(res))
            .catch(err => console.log("Cannot fetch user "+err))
    }, [])
    

  //   useEffect(()=> {
  //     axios.get(`https://spoofcastbackend.vercel.app/${props.user?.uid}`)
  //         .then(res => setUser(res))
  //         .catch(err => console.log("Cannot fetch user "+err))
  // }, [isFav])

    function clearSearch(){
      setSearchResults([]);
      setSearchTerm('');
    }
    // const [isFav, setIsFav] = useState(false);

    function showFavHandler(){
      SetShowFav(prev => !prev);
    }

  return (
  
    <div className='home w-full overflow-y-scroll text-center mt-10 h-full  bg-[url("./background.jpg")] bg-cover flex flex-col items-center '>
      <button>
        Go to Home
      </button>
        <h1>
            Welcome to spoof cast
        </h1>
          

        <div className='flex flex-col items-center justify-center relative'>
        

        {/* search logic */}

        <div className='my-8'>
          <div className='flex flex-col'>
          <div>
          <button onClick={searchHandler} className='my-4 mx-1 h-9 w-fit px-3 py-2  rounded-xl bg-teal-400'>
            search
          </button>
          <input placeholder='search favorite track' value={searchTerm|| ""} onChange={searchChangeHandler}  type="search" name="search"
           className='mx-2 rounded-xl text-black bg-opacity-70 bg-white placeholder:text-black text-xs px-2 h-9 w-fit' id="search" />

          </div>
          <div>
          <button onClick={showFavHandler} className='my-4 mx-1 h-9 w-fit px-3 py-2  rounded-xl bg-teal-400'>
            show my favorites
          </button>
            {showFav && <button className="underline" onClick={() => SetShowFav(false)}>close Favorites</button>}
          </div>
          </div>


          <div className='w-full relative h-fit'>
            {searchResults.length >0 && <button className="underline" onClick={clearSearch}>clear Search</button>}
            {searchResults.length > 0 && <p className='mt-5 text-xl font-bold mb-[-5px]]'>search results</p>}
            {searchResults &&  searchResults.map((music) => {

              if( !isFav &&  currUser?.data?.favorites.length > 0){

                currUser.data.favorites.map(muisc => {
                  if(music.mid == muisc){
                    console.log("matched...")
                   setIsFav(true)
                  }
                })
               
              }
              
              async function favHandler(e){
                e.preventDefault();
                await axios.put(`https://spoofcastbackend.vercel.app/deleteFav/${props.user?.uid}`, {mid: music.mid})
                  .then(res => setUser(res))
                  .catch(err => console.log("Cannot fetch user "+err))
                 setIsFav(false);
                console.log("removed")
                console.log(currUser)
              }
              return (
                <div className='w-full flex flex-col items-center justify-center'>
                  <div key={music.mid} className="bg-gradient-to-tr from-gray-950 to-teal-500  p-10 pb-[120px] rounded-lg my-10 
                  w-[100%]  flex flex-col items-center justify-center relative">
                    {music.file.slice(-1) == "4" ? 
                    (<video className='w-[700px] h-full mt-5' controls >
                      <source src={music.file} type="video/mp4"/>
                    </video>) : 
                <ReactAudioPlayer src={music.file} controls className='w-[100%] mt-5'/>
                    }
                    <img src={ currUser?.data?.favorites.find((favs) => favs == music.mid) ? starFilled : starEmpty} 
                    onClick={currUser?.data?.favorites.find((favs) => favs == music.mid) ? favHandler : () => makeAsFav(music.mid)} alt=""
                     className='h-10 w-10 mb-5 absolute right-3 top-2 cursor-pointer'/>
                    <p className='absolute text-lg left-11   sm:bottom-24 bottom-16 flex-wrap w-[80%]'>{music.name}</p>
                    <p className='absolute bottom-10 text-xs font-extralight left-11'>{music.description}</p>
                    <p className='absolute bottom-4 opacity-50 text-xs right-4'>{music.category}</p>
                    <p className='absolute bottom-4 opacity-50 left-11 text-xs'>{music.speaker}</p>
                    
                    
                </div>
            {/* {searchResults.length >0 &&  <hr />} */}
          </div>
                
              )
})
            }
                  
            
            {searchResults.length > 0 &&  <p className='text-lg font-semibold mb-3 bg-black p-1 rounded-md'>end of your search...</p>}
            {searchResults.length > 0 &&  <hr className="w-[60%] mx-auto" />}
          </div>

          </div>






          {/* favroites list logic */}
          {/* <div className='flex flex-col items-center justify-center '> */}

          <div className='mx-auto w-full flex flex-col items-center justify-center'>
            
          
            
          {showFav && musics &&  musics.map((music) => {
               if(currUser?.data?.favorites.find((favs) => favs == music.mid)){
                async function favHandler(e){
                  e.preventDefault();
                  await axios.put(`https://spoofcastbackend.vercel.app/deleteFav/${props.user?.uid}`, {mid: music.mid})
                    .then(res => setUser(res))
                    .catch(err => console.log("Cannot fetch user "+err))
                   setIsFav(false);
                  console.log("removed")
                  console.log(currUser)
                }
                return (
                
                  <div key={music.mid} id ="tailtest" className="bg-gradient-to-tr from-gray-950 to-teal-500  p-10 pb-[120px] rounded-lg my-10 
                  w-[100%]  flex flex-col items-center justify-center relative">
                      {music.file.slice(-1) == "4" ? 
                    (<video className='w-[700px] h-full mt-5' controls >
                      <source src={music.file} type="video/mp4"/>
                    </video>) : 
                <ReactAudioPlayer src={music.file} controls className='w-[100%] mt-5'/>
                    }
                      <div className='flex w-full flex-row items-center justify-center'>
                        {currUser?.data?.favorites.find((favs) => favs == music.mid) ? <p>Favorited</p> : <p>Add to favorite</p>}
                      <img src={ currUser?.data?.favorites.find((favs) => favs == music.mid) ? starFilled : starEmpty} onClick={currUser?.data?.favorites.find((favs) => favs == music.mid) ? favHandler : () => makeAsFav(music.mid)} alt="" className='h-10 w-10 mb-5 absolute right-3 top-2 cursor-pointer'/>
                      </div>
                      <p className='absolute text-lg left-11   sm:bottom-24 bottom-16 flex-wrap w-[80%]'>{music.name}</p>
                      <p className='absolute bottom-10 text-xs font-extralight left-11'>{music.description}</p>
                      <p className='absolute bottom-4 opacity-50 text-xs right-4'>{music.category}</p>
                      <p className='absolute bottom-4 opacity-50 left-11 text-xs'>{music.speaker}</p>
                      
                      
                  </div>
              )
               }
            })
            }
            {showFav && <hr />}
          </div>

            {musics.length > 0 ? musics.map((music) => {
              // console.log(music.mid+""+music.name)
              let hand = false;
              // if(!isFav && currUser?.data?.favorites.length > 0){

              //   currUser.data.favorites.map(muisc => {
              //     if(music.mid == muisc){
              //       console.log("matched..."+ music.mid)
              //      setIsFav(true)
              //     }
              //   })

                
               
              // }

              // const [isFave, setIsFav] = useState(false);

              async function favHandler(e){
                e.preventDefault();
                await axios.put(`https://spoofcastbackend.vercel.app/deleteFav/${props.user?.uid}`, {mid: music.mid})
                  .then(res => setUser(res))
                  .catch(err => console.log("Cannot fetch user "+err))
                 setIsFav(false);
                console.log("removed")
                console.log(currUser)
              }
              return (
              
                <div key={music.mid} id ="tailtest" className="bg-gradient-to-tr from-gray-950 to-teal-500 p-10 pb-[120px] rounded-lg my-10 
                  w-[100%]  flex flex-col items-center justify-center relative text-left">
                    {music.file.slice(-1) == "4" ? 
                    (<video className='w-[700px] h-full mt-5' controls >
                      <source src={music.file} type="video/mp4"/>
                    </video>) : 
                <ReactAudioPlayer src={music.file} controls className='w-[100%] mt-5'/>
                    }
                    <div className='flex flex-row items-center justify-center mb-5 absolute right-3 top-2  '>
                        {currUser?.data?.favorites.find((favs) => favs == music.mid) ? <p className='bottom-3 right-3 relative'>Favorited</p> : <p className='bottom-3 right-3 relative'>Add to favorite</p>}
                      <img src={ currUser?.data?.favorites.find((favs) => favs == music.mid) ? starFilled : starEmpty} onClick={currUser?.data?.favorites.find((favs) => favs == music.mid) ? favHandler : () => makeAsFav(music.mid)} alt="" 
                      className='h-10 w-10 mb-5 cursor-pointer'/>
                      </div>
                    <p className='absolute text-lg left-11   sm:bottom-24 bottom-16 flex-wrap w-[80%]'>{music.name}</p>
                    <p className='absolute bottom-10 text-xs font-extralight left-11'>{music.description}</p>
                    <p className='absolute bottom-4 opacity-50 text-xs right-4'>{music.category}</p>
                    <p className='absolute bottom-4 opacity-50 left-11 text-xs'>{music.speaker}</p>
                    
                    
                </div>
            )
            }) : <p className='text-xs py-10'>Uhh ohh.. No Podacasts available , Kindly comeback later....</p>}
        </div>
        <button className="bg-red-500 p-3 rounded-md my-3 cursor-pointer absolute bottom-2" onClick={() => signOut(props.auth)}>Sign Out</button>
    </div>
  )
}

export default Home;
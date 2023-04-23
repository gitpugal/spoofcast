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

  function makeAsFav(midd){
    console.log(midd)
    axios.put(`http://localhost:3000/${props.user?.uid}`, {mid: midd})
      .then(console.log("fav added"))
      .catch(err => console.log(err))
      setIsFav(true)
      axios.get(`http://localhost:3000/${props.user?.uid}`)
            .then(res => setUser(res))
            .catch(err => console.log("Cannot fetch user "+err))
    
  }

  function searchChangeHandler(e){
    setSearchTerm(e.target.value)
  }

  function searchHandler(e){
    e.preventDefault();
    axios.get(`http://localhost:3000/admin/musics/search/${searchTerm}`)
      .then(res =>{
        setSearchResults(res.data)
        console.log(res.data)
      })
      .catch(err => console.log(err))

  }

    useEffect(()=> {
        axios.get("http://localhost:3000/admin/musics")
            .then(res => {setMusics(res.data)
            })
            .catch(err => console.log(err))
        axios.get(`http://localhost:3000/${props.user?.uid}`)
            .then(res => setUser(res))
            .catch(err => console.log("Cannot fetch user "+err))
    }, [])
    

    function clearSearch(){
      setSearchResults([]);
    }
    // const [isFav, setIsFav] = useState(false);


  return (
    <div className='home w-full overflow-y-scroll text-center mt-10 h-full bg-gradient-to-r to-[#414345] from-[#000000] flex flex-col items-center '>
      <button>
        Go to Home
      </button>
        <h1>
            Welcome to spoof cast
        </h1>
        

        <div className='flex flex-col items-center justify-center relative'>
          <div className='my-8'>
          <button onClick={searchHandler} className='my-4 mx-1 h-9 w-fit px-3 py-2  rounded-xl bg-teal-400'>
            search
          </button>
          <input placeholder='search favorite track' value={searchTerm|| ""} onChange={searchChangeHandler}  type="search" name="search" className='mx-2 rounded-xl bg-opacity-25 bg-white placeholder: text-xs px-2 h-9 w-fit' id="search" />



          <div className='w-full h-fit'>
            {searchResults.length >0 && <button className="underline" onClick={clearSearch}>clear Search</button>}
            
            {searchResults &&  searchResults.map((music) => {

              if( !isFav &&  currUser?.data?.favorites.length > 0){

                currUser.data.favorites.map(muisc => {
                  if(music.mid == muisc){
                    console.log("matched...")
                   setIsFav(true)
                  }
                })
               
              }

              // const [isFave, setIsFav] = useState(false);
              // let isFav = false;
              async function favHandler(e){
                  e.preventDefault();
                  await axios.put(`http://localhost:3000/deleteFav/${props.user?.uid}`, {mid: music.mid})
                    .then("fav added")
                    .catch(err => console.log(err))
                    // isFav = true;
                   setIsFav(false);
                  console.log("removed")
                  // console.log(currUser)
              }
              // const [isFav, setIsFav] = useState(false);
               
              return (
                <div className='w-full flex flex-col items-center justify-center'>
                  <p className='mt-5 mb-[-5px]]'>search results</p>
                <div key={music.mid} className="bg-opacity-25 bg-white  p-10 rounded-lg my-10 
              w-[80%]  flex flex-col items-center justify-center relative">
                <img src={isFav ? starFilled : starEmpty} onClick={isFav ? favHandler : () => makeAsFav(music.mid)} alt="" className='h-10 w-10 absolute right-3 top-2 cursor-pointer'/>
                <p>Song Name {music.name}</p>
                <p>Description {music.description}</p>
                <p>Category {music.category}</p>
                <p>Author {music.speaker}</p>
                <ReactAudioPlayer src={music.file} controls className='w-[140%]'/>
                
            </div>
            {searchResults.length >0 &&  <hr />}
          </div>
                
              )
})
            }
            {searchResults.length > 0 && <hr />}
          </div>

          </div>


            {musics.length > 0 ? musics.map((music) => {
              // console.log(music.mid+""+music.name)
              let hand = false;
              if( !isFav &&  currUser?.data?.favorites.length > 0){

                currUser.data.favorites.map(muisc => {
                  if(music.mid == muisc){
                    console.log("matched...")
                    hand = true
                  //  setIsFav(true)
                  }
                })

                
               
              }

              // const [isFave, setIsFav] = useState(false);

              async function favHandler(e){
                  e.preventDefault();
                  // let favs = currUser?.data?.favorites.filter(musc => musc != music.mid)
                  await axios.put(`http://localhost:3000/deleteFav/${props.user?.uid}`, {mid: music.mid})
                    .then("fav added")
                    .catch(err => console.log(err))
                  // setUser(prevState => ({...prevState, favorites: favs}))
                   setIsFav(false);
                  console.log("removed")
                  // console.log(currUser)
              }
              let type = music.file.slice(-1);
              // console.log(type)
              return (
              
                <div key={music.mid} className="bg-opacity-25 bg-white  p-10 pb-[120px] rounded-lg my-10 
                  w-[80%]  flex flex-col items-center justify-center relative">
                    {music.file.slice(-1) == "4" ? 
                    (<video className='w-[700px] h-full mt-5' controls >
                      <source src={music.file} type="video/mp4"/>
                    </video>) : 
                <ReactAudioPlayer src={music.file} controls className='w-[100%] mt-5'/>
                    }
                    <img src={ hand ? starFilled : starEmpty} onClick={isFav ? favHandler : () => makeAsFav(music.mid)} alt="" className='h-10 w-10 mb-5 absolute right-3 top-2 cursor-pointer'/>
                    <p className='absolute bottom-24 text-lg left-11'>{music.name}</p>
                    <p className='absolute bottom-20 text-xs font-extralight left-11'>{music.description}</p>
                    <p className='absolute bottom-4 opacity-50 text-xs right-4'>{music.category}</p>
                    <p className='absolute bottom-4 opacity-50 left-11 text-xs'>{music.speaker}</p>
                    
                    
                </div>
            )
            }) : <p className='text-xs py-10'>Uhh ohh.. No Podacasts available , Kindly comeback later....</p>}
        </div>
        <button className="bg-teal-400 p-3 rounded-md my-3 cursor-pointer absolute bottom-2" onClick={() => signOut(props.auth)}>Sign Out</button>
    </div>
  )
}

export default Home;
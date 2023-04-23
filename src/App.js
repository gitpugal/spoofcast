// import logo from './logo.svg';
import './App.css';
import {useAuthState} from 'react-firebase-hooks/auth';
// import { collection, getDocs,doc, setDoc, serverTimestamp, query, orderBy  } from "firebase/firestore";
// import { useState, useEffect } from 'react';
// import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { getAuth,GoogleAuthProvider, signInWithPopup } from "firebase/auth";
 import { initializeApp } from "firebase/app";
//  import { getFirestore } from "firebase/firestore";
 import axios  from 'axios';
import AdminLogin from './components/AdminLogin';

// import {Link} from 'react-router-dom';

 import Home from './components/Home';
import SignIn from './components/SignIn';
import { useEffect, useState } from 'react';
import {
	BrowserRouter ,
	Routes,
	Route,
	Link,
} from 'react-router-dom';

 const firebaseConfig = {
    apiKey: "AIzaSyAFb6Xdgc1tu9MqXSKE70F0b7zN1QbnpXo",
    authDomain: "chatroom-8f1a5.firebaseapp.com",
    projectId: "chatroom-8f1a5",
    storageBucket: "chatroom-8f1a5.appspot.com",
    messagingSenderId: "307724732197",
    appId: "1:307724732197:web:1df28cfa2623cc7a937ccc",
    measurementId: "G-CKTRY73SVK"
 };
 
 const app = initializeApp(firebaseConfig);
//  const db = getFirestore(app);
 const auth = getAuth(app);

 const provider = new GoogleAuthProvider();
//  background: #232526;  /* fallback for old browsers */
//  background: -webkit-linear-gradient(to right, #414345, #232526);  /* Chrome 10-25, Safari 5.1-6 */
//  background: linear-gradient(to right, #414345, #232526); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
 


 
 function App() {
  let [user] = useAuthState(auth);
   console.log(user?.uid);

   useEffect(() => {
    axios.get(`http://localhost:5000/${user?.uid}`)
    .then(res => {
     console.log(res)
     if (res == [] || res?.data?.uid != user.uid){
       axios.post("http://localhost:5000/login", {
         uid: user?.uid,
       })
     }
    })
    .catch(err => console.log(err))
   }, [user])
   function signIn(){
    signInWithPopup(auth, provider)
    //   .then(res => {
    //     console.log("hhh")
    //     axios.get(`http://localhost:5000/${userr?.uid}`)
    //    .then(res => {
    //     console.log(userr)
    //     if (res !="True"){
    //       axios.post("http://localhost:5000/login", {
    //         uid: userr?.uid,
    //       })
    //     }
    //    })
    //    .catch(err => console.log(err))
    // }
    //   )

  }
  function MainLogin(){
    return(<div className='
    w-full h-full  bg-[url("./background.jpg")] bg-cover backdrop-blur-md  absolute flex-col flex
     items-center justify-center '>
      {user ? <Home auth={auth} user={user}/> : <SignIn userType={"user"} signin={signIn}/>}
    </div>)
    
  }
  return (
    <BrowserRouter>
      <div 
      className=" h-full w-full
      flex flex-col items-center justify-center  bg-[url('./background.jpg')] bg-cover  
       text-white font-semibold absolute">
      {/* <h1>
      SpoofCast
      </h1>
       */}
       <h1 className=" text-6xl text-teal-300 bg-black  px-4  pt-4 pb-7 rounded-lg  shadow-3xl shadow-teal-400 mb-3 font-extrabold">Spoof Cast</h1>
      <Routes>
        <Route path="/user" exact Component={MainLogin}/>
        <Route path='/admin' exact Component={AdminLogin}/>
      </Routes>
      <div className='flex flex-row gap-5 mt-10'>
      <Link className="bg-gradient-to-r from-red-500 to-yellow-400 p-3 rounded-md my-3 cursor-pointer font-extrabold " to="/user">User Login ?</Link>
      <Link className="bg-gradient-to-r from-yellow-400 to-red-500 p-3 rounded-md my-3 cursor-pointer" to="/admin">Admin Login ?</Link>

      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;

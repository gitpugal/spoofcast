// import logo from './logo.svg';
import '../App.css';
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
import AdminHome from './AdminHome';
 import Home from './Home';
import SignIn from './SignIn';
import { useEffect, useState } from 'react';
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



 
 function AdminLogin() {
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

  function submitPodcast(music){
    console.log(music)
    axios.post("http://localhost:5000/admin/music", {
        name: music.name,
        description: music.description,
        category: music.category,
        speaker: music.speaker,
        file: music.file,
        uid: music.uid || user?.uid || "unknown",
        mid: music.mid
    })
        .then(console.log("uploaded!"))
        .catch(err => console.log(err))
  }
  return (
    <div className='
    w-full h-full bg-slate-500 absolute flex-col flex
     items-center justify-center' >
      {user ? <AdminHome submitPodcast={submitPodcast} auth={auth} user={user}/> : <SignIn signin={signIn}/>}
    </div>
  );
}

export default AdminLogin;

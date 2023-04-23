import { Link } from "react-router-dom";


function SignIn(props) {
    function signInWithGoogle(){
        props.signin();
    }
    return (
      <>
       <Link className="absolute top-3 bg-teal-400 p-3 rounded-md my-3 cursor-pointer" to="/">Go to Home</Link>
      <h1 className="text-5xl font-extrabold text-teal-300">
        SpoofCast
      </h1>
      <p className="text-md  mt-2 mb-[80px]">hear your fav podcasts...</p>
      <p>{props.userType == "user" ? "User Login" : "Admin Login"}</p>
        <button className="bg-teal-400 p-2 my-5 rounded-md" onClick={signInWithGoogle}>Sign in with Google</button>
      </>
    )
  
  }
  
  export default SignIn;
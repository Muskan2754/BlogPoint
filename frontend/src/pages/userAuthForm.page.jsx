import googleIcon from "../imgs/google.png";
import { useContext, useRef } from "react";
import InputBox from "../components/input.component";
import { Link, Navigate, useInRouterContext } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import {Toaster,toast} from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";
const UserAuthForm = ({ type }) => {

    const authForm =useRef();

    const { userAuth, setUserAuth } = useContext(UserContext);
    const access_token = userAuth?.access_token;
    //console.log(access_token);

    //console.log( access_token );

    const userAuthThroughServer = ( serverRoute, formData ) => 
    {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
        .then(({ data }) => {
            storeInSession("user", JSON.stringify(data))
            
            setUserAuth(data)
        
        })
        .catch(({ response }) => {
           toast.error(response.data.error) 
        })
        
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let serverRoute =type =="sign-in" ? "/signin" : "/sign-up";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


        let formData = new FormData(e.currentTarget);
        formData = Object.fromEntries(formData.entries());
   

        const { fullname, email, password } = formData;

        //form validation
        if(fullname)
        {
            if (fullname.length < 3) 
        {  
            return toast.error("fullname must be at least s3 letters long" )
        }

        }
        
    

        if (!email.length) 
        {
            return toast.error( "Enter Email" )
        }

        if (!emailRegex.test(email)) {
           return toast.error( "invalid" )
        }

        if (!passwordRegex.test(password)) {
            return toast.error( "password should be 6 to 12 characters with numeric with one lowercase and one uppercase letter" )
        }

        userAuthThroughServer( serverRoute, formData )
    };

    const handleGoogleAuth =(e) => {
        e.preventDefault();

        authWithGoogle().then(user => {
            
            let serverRoute= "/google-auth";
            let formData={
                access_token: user.accessToken

            }

            userAuthThroughServer(serverRoute,formData)

        }).catch(err=> {
            toast.error('Trouble login with google')
            return console.log(err);
        })
    }
    return (
        access_token ? 
        <Navigate to="/" />

        :
        <AnimationWrapper keyValue={type}>
              <div className="min-h-screen bg-gradient-to-r from-[#DFF0FD] via-[#c2e9fb] to-[#FFE0F9] flex flex-col">
            <section className="h-cover flex items-center justify-center ">
                <Toaster/>
                <form ref={authForm} onSubmit={handleSubmit} className="w-[80%] max-w-[400px]">
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        {type == "sign-in" ? "welcome back" : "join us today"}
                    </h1>
                    {
                        type !== "sign-in" ?
                            <InputBox
                                name="fullname"
                                type="name"
                                placeholder="Fullname"
                                icon="fi-rr-user"
                            />
                            : ""
                    }


                    <InputBox
                        name="email"
                        type="email"
                        placeholder="Email"
                        icon="fi-rr-envelope"
                    />


                    <InputBox
                        name="password"
                        type="password"
                        placeholder="Password"
                        icon="fi-rr-key"
                    />

                    <button className="btn-dark center mt-14" 
                        type="submit"
                    >

                        {type.replace("-", " ")}

                    </button>

                    <div className="relative  w-full flex items-center gap-2 my-10 opacity-15 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>or</p>
                        <hr className="w-1/2 border-black" />

                    </div>
                    <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center" style={{ background: "#494031", color: "white"}} 
                    onClick={handleGoogleAuth}>
                        <img src={googleIcon} className="w-5" />
                        Continue with google

                    </button>

                    {
                        type == "sign-in" ?
                            <p className="mt-6 text-dark-grey text-xl text-center">
                                Don't have an account?
                                <Link to="/signup" className="underline text-black text-xl ml-1">
                                    Join Us Today!!
                                </Link>
                            </p>
                            :
                            <p className="mt-6 text-dark-grey text-xl text-center ">
                                Already a Member?
                                <Link to="/signin" className="underline text-black text-xl ml-1">
                                    Sign in Here!!
                                </Link>
                            </p>

                    }

                </form>
            </section>
            </div>
        </AnimationWrapper>
    )
}

export default UserAuthForm;
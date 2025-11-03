// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRXQvmGhnrkX5bnN4t9OHoG0092zPCbuU",
  authDomain: "react-js-blog-a2230.firebaseapp.com",
  projectId: "react-js-blog-a2230",
  storageBucket: "react-js-blog-a2230.firebasestorage.app",
  messagingSenderId: "527543523524",
  appId: "1:527543523524:web:f77ac145b97a9c332d9191"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () =>
{
    let user = null ;

    await signInWithPopup(auth,provider)
    .then((result) => {
        user = result.user
    })
    .catch((err) =>
    {
        console.log(err)
    })

    return user;
}
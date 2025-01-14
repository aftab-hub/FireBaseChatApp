// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDoc, query, where } from "firebase/firestore";
import { doc, getFirestore, setDoc } from "firebase/firestore/lite";
import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7v6UbxbDZuxmmIjTmbFutjO9P-UbF0Cg",
  authDomain: "chatapp-2cc9b.firebaseapp.com",
  projectId: "chatapp-2cc9b",
  storageBucket: "chatapp-2cc9b.firebasestorage.app",
  messagingSenderId: "980176781628",
  appId: "1:980176781628:web:0c43b0ff409bc23fa7de39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getFirestore(app)

const signup = async(username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(username, email, password)
        const user = requestAnimationFrame.user
        await setDoc(doc(db, "users", user.uid),{
            id : user.uid,
            username : username.toLowerCase(),
            email : "",
            avatar : "",
            bio : "Hey, There i am using chat app",
            lastSeen : Date.now()
        })
          await setDoc(doc(db, "chats", user.uid),{
            chatData : []
          }) 
        
    } catch (error) {
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(' '))
    }
}

const login = async (email,password)=>{
   try {
     await signInWithEmailAndPassword(auth,email,password)
   } catch (error) {
    console.error(error)
    toast.error(error.code.split('/')[1].split('-').join(' '))
   }
}
const logout = async()=>{
    try {
        await signOut(auth)
    } catch (error) {
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(' '))
    }
}

const resetPass = async (email) =>{
  if (!email) {
     toast.error('Enter your email')
     return null
  }
  try {
    const userRef = collection(db, 'users')
    const q = query(userRef, where('email', "==", email))
    const querySnap = await getDoc(q)
    if (!querySnap.empty) {
        await sendPasswordResetEmail(auth, email)
        toast.success('ResetEmail Sent')

    }else{
        toast.error("Email does not Exists")

    }
  } catch (error) {
    toast.error(error.message)
  }
}

export {signup, login, logout, auth, db, resetPass}
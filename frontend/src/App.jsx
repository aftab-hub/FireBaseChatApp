import React, { useContext, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Login from './Components/pages/login/Login'
import Chat from './Components/pages/chat/Chat'
import ProfileUpdate from './Components/pages/profileUpdate/ProfileUpdate';
import { ToastContainer, toast } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Components/config/firebase';
import { Context } from './Components/context/Context';



const App = () => {
const navigate = useNavigate()

const { loadUserData } = useContext(Context)

  useEffect(()=>{
   onAuthStateChanged(auth, async(user)=>{
       if (user) {
        navigate("/chat")
        console.log(user);
        await loadUserData(user.uid)
       }else{
          navigate("/")
       }
   })
  },[])
  return (
   <>
 
   <ToastContainer/>
   
   <Routes>
    <Route path='/' element={<Login/>}/>
    <Route path='/chat' element={<Chat/>}/>
    <Route path='/profile' element={<ProfileUpdate/>}/>
   </Routes>
   
 
   </>
  )
}

export default App
import React, { useContext, useEffect, useState } from 'react'
import './chat.css'
import LeftSideBar from '../../leftSideBar/LeftSideBar'
import ChatBox from '../../ChatBox/ChatBox'
import RightSideBar from '../../RighSideBar/RightSideBar'
import { Context } from '../../context/Context'
const Chat = () => {

  const {chatData, userData} = useContext(Context)
  const [loading, setLoading] = useState(true)
   
  useEffect(()=>{
    if (chatData && userData) {
      setLoading(false)
    }
  },[])

  return (
   <>
   <div className="chat">
    {
      loading ? <p className='loading'>Loading...</p>
      :
    <div className="chat-container">
      <LeftSideBar/>
      <ChatBox/>
      <RightSideBar/>
    </div>
    }
   </div>
   </>
  )
}

export default Chat
import React, { useContext, useEffect, useState } from 'react'
import './chatbox.css'
import assets from '../../assets/assets'
import { Context } from '../context/Context'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import upload from '../Lib/upload'

const ChatBox = () => {

  const {userData, messagesId, chatUser, messages, setMessages, chatVisible, setChatVisible} = useContext(Context)
  const [input, setInput] = useState('')

  const sendMessage = async()=>{
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId),{
          messages : arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date()
          })
        })
        const userIDs = [chatUser.rId, userData.id]
        userIDs.forEach(async(id) => {
          const userChatsRef = doc(db,'chats', id)
          const userChatsSnapShot = await getDoc(userChatsRef)
          if (userChatsSnapShot.exists()) {
            const userChatData = userChatsSnapShot.data()
            const chatIndex = userChatData.chatsData.findIndex((c)=>c.messageId === messagesId)
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30)
            userChatData.chatsData[chatIndex].updatedAt = Date.now()
            if(userChatData.chatsData[chatIndex].rId === userData.id){
              userChatData.chatsData[chatIndex].messageSeen = false
            }
            await updateDoc(userChatsRef,{
              chatsData : userChatData.chatsData
            })
          }
        });
      }
    } catch (error) {
      toast.error(error.message)
    }
    setInput('')
  }

const sendImage = async(e)=>{
  try {
    const fileUrl = await upload(e.target.files[0])
    if (fileUrl && messagesId) {
      await updateDoc(doc(db, 'messages', messagesId),{
        messages : arrayUnion({
          sId: userData.id,
          image: fileUrl,
          createdAt: new Date()
        })
      })

      const userIDs = [chatUser.rId, userData.id]
      userIDs.forEach(async(id) => {
        const userChatsRef = doc(db,'chats', id)
        const userChatsSnapShot = await getDoc(userChatsRef)
        if (userChatsSnapShot.exists()) {
          const userChatData = userChatsSnapShot.data()
          const chatIndex = userChatData.chatsData.findIndex((c)=>c.messageId === messagesId)
          userChatData.chatsData[chatIndex].lastMessage = "Image"
          userChatData.chatsData[chatIndex].updatedAt = Date.now()
          if(userChatData.chatsData[chatIndex].rId === userData.id){
            userChatData.chatsData[chatIndex].messageSeen = false
          }
          await updateDoc(userChatsRef,{
            chatsData : userChatData.chatsData
          })
        }
      });
    }
  } catch (error) {
    toast.error(error.message)
  }
}

 const convertTimeStamp = (timestamp)=>{
     let date = timestamp.toDate()
     const hour = date.getHour()
     const min = date.getMinutes()
     if (hour > 12) {
      return hour - 12 + ":" + min + " PM" 

     }else{
      return hour + ':' + min + " AM"
     }
 }


useEffect(()=>{
  if (messagesId) {
    const unSub = onSnapshot(doc(db, 'messages', messagesId),(res)=>{
      setMessages(res.data().messages.reverse())
    })
    return ()=>{
      unSub()
    }
  }
},[])

  return chatUser ? (
   <>
   <div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
    <div className="chat-user">
      <img src={chatUser.userData.avatar} alt="" />
      <p>{chatUser.userData.name} {Date.now().chatUser.userData.lastSeen <= 70000 ? <img src={assets.green_dot} className='dot' alt="" /> : null}</p>
      <img src={assets.help_icon} className='help' alt="" />
      <img onClick={()=>setChatVisible(false)} src={assets.arrow_icon} className='arrow' alt="" />
</div>


  <div className="chat-msg">
    {messages.map((msg,index)=>{
    <div className={msg.sId === userData.id ? "sender-msg" : "receiver-msg"}>
      {msg['image']
      ? <img className="msg-img" src={msg.image} alt="" />:
      <p className="msg">{msg.text} </p>
      }
      <div>
        <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
        <p>{convertTimeStamp(msg.createdAt)}</p>
      </div>
    </div>

    })}

  </div>




    <div className="chat-input">
      <input onChange={(e)=>setInput(e.target.value)} value={input} type="text"placeholder='Send a message' />

      {/* this code isfor sending a file */}
      <input onChange={sendImage} type="file" name="" id="image" accept='image/png, image/jpeg' hidden/>
      <label htmlFor="image">
        <img src={assets.gallery_icon} alt="" />
      </label>
      {/* this code is for sending a file */}

      <img onClick={sendMessage} src={assets.send_button} alt="" />
    </div>
   </div>
   </>
  )
  : <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
    <img src={assets.logo_icon} alt="" />
    <p>Chat anytime, anywhere</p>
  </div>
}

export default ChatBox
import React, { useContext, useState } from 'react'
import assests from '../../assets/assets'
import './leftSideBar.css'
import { useNavigate } from 'react-router-dom'
import { db } from '../config/firebase'
import { Context } from '../context/Context'
import { toast } from 'react-toastify'
import { doc, query, collection, getDoc, serverTimestamp, setDoc, arrayUnion, updateDoc,  } from 'firebase/firestore'

const LeftSideBar = () => {
  const {userData, chatsData, chatUser, setChatUser, messagesId, setMessagesId, chatVisible, setChatVisible } = useContext(Context)
  const [user, setUser] = useState(null)
  const [searchQuery, SetSearchQuery] = useState(false)
    const navigate = useNavigate()
    const inputHandler = async(e)=>{
        try {
        const input = e.target.value
        if (input) {
            SetSearchQuery(true)
           const userRef = collection(db, 'users',)
           const q = query(userRef,where('username',"==", input.toLowerCase()))
           const querySnap = await getDoc(q)
           if (!querySnap.emtpy && querySnap.docs[0].data().id !== userData.id) {
              setUser(querySnap.docs[0].data());
              let userExit = false
              chatsData.map((user)=>{
                 if(user.rId === querySnap.docs[0].data().id)
                    userExit = true
              })
              if (!userExit) {
                setUser(querySnap.docs[0].data())
              } 
              
           }else{
               setUser(null)
           }
        } else{
            SetSearchQuery(false)
        }

        } catch (error) {
            
        }
    }

    const addChat = async()=>{
        const messagesRef = collection(db, 'messages')
        const chatRef = collection(db,'chats')
        try {
            const newMessageRef = doc(messagesRef)
            await setDoc(newMessageRef, {
                creatAt : serverTimestamp(),
                messagges : []
            })
            await updateDoc(doc(chatRef, user.id),{
                chatsData : arrayUnion({
                    messageId : newMessageRef.id,
                    lastMessage : '',
                    rId : userData.id,
                    updatadAt : Date.now(),
                    messageSeen : true
                })
            })
            const uSnap = await getDoc(doc(db, 'users', user.id))
            const uData = uSnap.data()
            setChat({
                messagesId : newMessageRef.id,
                lastMessage : "",
                rId : user.id,
                updatedAt: Date.now(),
                messageSeen : true,
                userData : uData
            })
            SetSearchQuery(false)
            setChatVisible(true)
        } catch (error) {
            toast.error(error.message)
        }
    } 
  
     useEffect(() => {
     
    const updateChatUserData = async()=>{
      if (chatUser) {
        const userRef = doc(db,'users',chatUser.userData.id);
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data()
        setChatUser(prev=>({...prev, userData : userData}))
      }
    } 
    
    updateChatUserData()
     }, [])
     
    const setChat = async()=>{ 
        try {
        setMessagesId(item.messagesId)
        setChatUser(item)
        const userChatsRef = doc(db, "chats", userData.id)
        const userChatsSnapShot = await getDoc(userChatsRef)
        const userChatsData = userChatsSnapShot.data()
        const chatIndex = userChatsData.chatsData.findIndex((c)=>c.messageId === item.messageId)
        userChatsData.chatsData[chatIndex].messageSeen = true;
        await updateDoc(userChatsRef, {
            chatsData : userChatsData.chatsData
        }) 
        setChatVisible(true)
        } catch (error) {
            toast.error(error.message)
        }
       
    } 
  return (
    <>
    <div className={`ls ${chatVisible ? 'hidden' : ''}`}>
        <div className="ls-top">
            <div className="ls-nav">
                <img src={assests.logo} className='logo' />
                <div className="menu">
                    <img src={assests.menu_icon}  />
                    <div className="sub-menu">
                        <p onClick={()=>navigate('/profile')}>Edit Profile</p>
                        <hr />
                        <p>Logout</p>
                    </div>
                </div>
            </div>
            <div className="ls-search">
                <img src={assests.search_icon} alt="" />
                <input onChange={(e)=>inputHandler(e)} type="text" placeholder='Search here' name="" id="" />
            </div>
        </div>
        <div className="ls-list">
            {searchQuery && user
            ? <div className='friends add-user' onClick={addChat}>
             <img src={user.avatar} alt="" />
             <p>{user.name}</p>
            </div>
            :
          chatsData.map((item, index)=>(
             <div onClick={()=>setChat(item)} key={index} className={`friends ${item.messageSeen || item.messageId === messagesId ? "" : "border"}`}>
             <img src={item.userData.avatar} alt="" />
             <div>
                 <p>{item.userData.name}</p>
                 <span>{item.userData.lastMessage}</span>
             </div>
         </div>
           ))
            }
        </div>
    </div>
    </>
  )
}

export default LeftSideBar
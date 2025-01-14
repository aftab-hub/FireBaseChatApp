import React, { useContext, useState } from 'react'
import './profileUpdate.css'
import assets from "../../../assets/assets"
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { getDoc } from 'firebase/firestore/lite'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const profileUpdate = () => {

  const navigate = useNavigate()
  const [image, setImage] = useState(false)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [uid, setUid] = useState('')
  const [prevImage, setPrevImage] = useState('')
  const {setUserData} = useContext(Context)
const profileUpdate = async(e)=>{
   e.preventDefault()
   try {
    if (!prevImage && !image) {
      toast.error('Upload profile picture')
    }
    const docRef = doc(db,'users',uid)
    if (image) {
      const storageRef = ref(storage, `avatars/${uid}`);
      await uploadBytes(storageRef, image);
      const imgUrl = await getDownloadURL(storageRef);
      await updateDoc(docRef, {
        avatar: imgUrl,
        name: name,
        bio: bio
      });
      toast.success('Profile updated successfully');
    }else{
      await updateDoc(docRef, {
        name: name,
        bio: bio
      });
    }
    const snap = await getDoc(docRef)
    setUserData(snap.data())
    navigate("/chat")
   } catch (error) {
      console.error(error);
      toast.error(error.message)
      
   }
}

   useEffect(()=>{
    onAuthStateChanged(auth,async(user)=>{
      if(user){
         setUid(user.id)
         const docRef = doc(db,'user', user.id)
         const docSnap = await getDoc(docRef)
         if (docSnap.data().name) {
             setName(docSnap.data().name)
         }
         if (docSnap.data().bio) {
             setBio(docSnap.data().bio)
         }
         if (docSnap.data().avatar) {
             setPrevImage(docSnap.data().avatar)
         }
      }
      else{
        navigate('/')
      }
    })
   })

  return (
    <>
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input onChange={(e)=>setImage(e.target.files[0])} type="file"  id="avatar" accept='.png, .jpg, jpeg' hidden  />
            <img src={ image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
             upload profile image
          </label>
          <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Your name' required />
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder='Write profile bio' required></textarea>
          <button type='submit'>Save</button>
        </form>
        <img className='profile-pic' src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} alt="" />
      </div>
    </div>
    </>
  )
}

export default profileUpdate
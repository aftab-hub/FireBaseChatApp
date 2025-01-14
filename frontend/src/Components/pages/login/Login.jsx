import React, { useState } from 'react'
import assets from '../../../assets/assets'
import './login.css'
import { signup, login, resetPass } from '../../config/firebase'

const Login = () => {
    const [currentState, setCurrentState] = useState('Sign Up')
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
     
    const onSubmitHandler = (e)=>{
        e.preventDefault()
        if (currentState === 'Sign Up') {
         signup(userName,email,password)
        }else{
            login(email,password)
        }
    }

  return (
   <>
   <div className="login">
    <img src={assets.logo_big} className='logo' />
    <form className='login-form' onSubmit={onSubmitHandler}>
        <h2>{currentState}</h2>
        {currentState === 'Sign Up' ? <input type="text" onChange={(e)=>setUserName(e.target.value)} value={userName} className='form-input' placeholder='Username' required /> : null }
        
        <input type="email"  onChange={(e)=>setEmail(e.target.value)} value={email} className='form-input' placeholder='Email Address' required />
        <input type="password"  onChange={(e)=>setPassword(e.target.value)} value={password} className='form-input' placeholder='Password' required />
        <button type='submit'>{currentState === 'Sign Up' ? 'Create Account' : 'Login now'}</button>
        <div className="login-term">
            <input type="checkbox" />
            <p>Agree to the terms of use & privacy policy</p>
        </div>
        <div className="login-forgot">
            {currentState === 'Sign Up' ?
            <p className="login-toggle">Already have an account <span onClick={()=>setCurrentState('Login')}>Login here</span></p>
            : 
            <p className="login-toggle">Create an account <span onClick={()=>setCurrentState('Sign Up')}>Click here</span></p>
        }
        {currentState === 'Login' ? 
            <p className="login-toggle">Forgot Password <span onClick={()=>resetPass(email)}>Reset Password</span></p>
    : null    
    }
        </div>
    </form>
   </div>
   </>
  )
}

export default Login
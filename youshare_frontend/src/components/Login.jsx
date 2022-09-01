import React from 'react';
import sharevid from '../assets/share.mp4'
import logo from '../assets/light logo.png'
import { GoogleLogin } from '@react-oauth/google';
import { loginhandler } from '../utils/utilfuncn';
import { client } from '../client'
import { useNavigate } from 'react-router-dom'


const Login = () => {
  
  const navigate = useNavigate();
  
  return (
    <div className='flex flex-col justify-center h-screen items-center'>
      <div className='relative w-full h-full'>
          <video src={sharevid} loop autoPlay type='video/mp4' muted controls={false} className='w-full h-full object-cover'/>
          <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-amber-800/[.38]'>
              <img src={logo} alt={logo} height='128px' width='200px'/>
              <div>
                <GoogleLogin
                cancel_on_tap_outside={true}
                logo_alignment='center'
                type='icon'
                size='large'
                onSuccess={(resp) => {
                  let userdoc = loginhandler(resp);
                    localStorage.setItem('user',JSON.stringify(userdoc));
                    client.createIfNotExists(userdoc).then(()=>{
                      navigate('/' , {replace : true})
                    })
                }}
                onError={()=>{
                  console.log('error occured');
                }}/>
              </div>
          </div>
      </div>
    </div>
  )
}

export default Login
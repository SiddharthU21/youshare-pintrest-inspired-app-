import React, { useEffect } from 'react'
import { Routes , Route , useNavigate } from 'react-router-dom'
import Login from './components/Login';
import Home from './container/Home';
import { GoogleOAuthProvider } from '@react-oauth/google';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { fetchuser } from './utils/utilfuncn';

const App = () => {

  const token = process.env.REACT_APP_GOOGLE_TOKEN

  const navigate = useNavigate();

  useEffect(() => {
    const user = fetchuser();

    if(!user){
      navigate('/login')
    }

  }, [])
  

  return (
    <>
    <GoogleOAuthProvider clientId={token}>
    <Routes>
      <Route path='login' element={<Login/>}/>
      <Route path='/*' element={<Home/>}/>
    </Routes>
    </GoogleOAuthProvider>
    </>
  )
}

export default App
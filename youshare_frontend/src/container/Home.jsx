import React , { useState , useRef , useEffect } from 'react';
import { CgMenuLeftAlt } from 'react-icons/cg'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Link , Route , Routes } from 'react-router-dom'
import {SideBar , UserProfile} from '../components';
import Pins from './Pins'
import { client } from '../client'
import { userQuery }from '../utils/data'

import logo from '../assets/logo.png'
import { fetchuser } from '../utils/utilfuncn';

const Home = () => {

  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef =  useRef(null);

  const userInfo = fetchuser();
  

  useEffect(()=>{

    const query = userQuery(userInfo?._id);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    })

  },[])

  useEffect(()=>{
      scrollRef.current.scrollTo(0,0);
  },[])


  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
      
      {/* dekstop SideBar */}
      
     <div className='hidden md:flex h-screen flex-initial'>
      <SideBar user={user && user} />
     </div>


      <div className='flex md:hidden flex-row'>

        {/* Navbar with hamburger */}

          <div className='p-2 w-full flex flex-row shadow-md items-center justify-between'>
              <CgMenuLeftAlt fontSize ={35} className='cursor-pointer' onClick={() => setToggleSidebar(true)}/>
              <Link to='/'><img src={logo} alt="logo" className='w-[180px]'/></Link>
              <Link to={`user-profile/${user?._id}`}><img src={user?.image} alt="logo" className='w-[55px] rounded-full'/></Link>
          </div>

        {/* togglable SideBar */}

          { toggleSidebar && (
              <div className='fixed w-2/5 bg-white h-screen overflow-y-auto  shadow-md z-10 animate-slide-in'>
                  <div className='absolute w-full flex justify-end items-center p-2'>
                      <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={()=> setToggleSidebar(false) }/>
                  </div>
                  <SideBar user={user && user} closeToggle={setToggleSidebar}/>
              </div>
          )}

      </div>


     <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          <Route path='/user-profile/:userId' element={<UserProfile/>}/>
          <Route path='/*' element={<Pins user={user && user}/>}/>
        </Routes>
     </div>
     
    </div>
  )
}

export default Home
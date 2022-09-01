import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoMdAdd , IoMdSearch } from 'react-icons/io'
const NavBar = ({searchTerm , setSearchTerm , user}) => {

  const navigate = useNavigate();
  
  if(!user) return null;
  
  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      <div className='flex justify-start items-center w-full px-2 rounded-[25px] bg-white border-[#FFCA1F] border-2  focus-within:shadow-sm'>
        <input type="text" onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search" value={searchTerm} onFocus={() => navigate('/search')}
        className='p-1 w-full bg-white outline-none ml-2'/>
        <IoMdSearch fontSize={21} className="mr-4"/>
      </div>
      <div className='flex gap-3 justify-end'>
        <Link to={`user-profile/${user?._id}`} className="hidden md:block"><img src={user.image} alt="user-image" className='w-14 h-12 rounded-full'/></Link>
        <Link to='create-pin' className="bg-black text-white rounded-full w-12 h-12 md:w-14 md:h-12 flex justify-center items-center">
          <IoMdAdd/>
        </Link>
      </div>
    </div>
  )
}

export default NavBar
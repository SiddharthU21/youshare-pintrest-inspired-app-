import React ,{ useState ,useEffect} from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams , useNavigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'

import { userCreatedPinsQuery , userQuery , userSavedPinsQuery } from '../utils/data'
import { client } from '../client';
import  MasonryLayout  from './MasonryLayout'
import Spinner from './Spinner';

const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology'

const activeBtnStyles = 'bg-[#ff9800] text-white font-semibold p-2 rounded-full w-20 outline-none'

const notActiveBtnStyles = 'bg-primary text-black font-semibold p-2 rounded-full w-20 outline-none'



const UserProfile = () => {

  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams(); 

  useEffect(() => {
    
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    })

  }, [userId])

  useEffect(() => {
    if(text === 'Created'){

      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      })

    } else {
      
      const SavedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(SavedPinsQuery).then((data) => {
        setPins(data);
      })

    }
    
  }, [text,userId])

  const logout = () =>{
    googleLogout();
    localStorage.clear();

    navigate('/login')
  }
  



  if(!user){
    return <Spinner message='Loading profile..'/>
  }

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
           <div className='flex flex-col justify-center items-center'>
                <img src={randomImage} className='w-full h-370 xl:h-510 shadow-lg object-cover' alt="user-banner" />
                <img  className='rounded-full object-cover w-20 h-20 -mt-10 shadow-xl' src={user.image} alt="user-profile" />
                <h1 className='font-bold text-3xl text-center mt-3'>
                  {user.userName}
                </h1>
                <div className='absolute top-0 z-1 right-[2px]'>
                  {userId === user._id && (
                   <button type='button' className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md' onClick={logout}>
                      <AiOutlineLogout color='red' fontSize={25}/>
                   </button> 
                  )}
                </div>
           </div>
            <div className='text-center mb-7 mt-2'>
               <button type='button' className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`} onClick={(e) => {
                  setText(e.target.textContent);
                  setActiveBtn('created');
               }}>
                Created
               </button>
               <button type='button' className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`} onClick={(e) => {
                  setText(e.target.textContent);
                  setActiveBtn('saved');
               }}>
                Saved
               </button>
            </div>
             {pins?.length ? (
                <div className='px-2'>
                  <MasonryLayout pins={pins}/> 
                </div>
              ) : (
                <div className='flex justify-center items-center w-full mt-2 text-xl font-semibold'>
                  No Pins Found!
                </div>
              )
             } 
        </div>
      </div>
    </div>
  )
}

export default UserProfile
import React, { useState } from 'react';
import { Link , Navigate, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { fetchuser } from '../utils/utilfuncn'
import { delPinQuery } from '../utils/data'



import { urlFor , client } from '../client'

const Pin = ({ pin : { postedBy, image , _id , destination , save }}) => {

  const navigate  = useNavigate();
  
  const userInfo  = fetchuser();
 
  // some is just like filter but it returns true only if atleast one element of the array passes the test else false 
  
  const aldreadySaved = save?.some((item) => item?.postedBy?._id === userInfo?._id );

  const [PostHovered, setPostHovered] = useState(false);

  const savePin = (id) => {

      if(!aldreadySaved){

        client
          .patch(id)
          .setIfMissing({ save: [] })
          .insert('after', 'save[-1]', [{
            _key: uuidv4(),
            userId: userInfo?._id,
            postedBy: {
              _type: 'postedBy',
              _ref: userInfo?._id,
            },
          }])
          .commit()
          .then(() => {
            window.location.reload();
        
          })
    };
  }

const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    })
}


  return (
    <div className='m-2'>
      <div
      onMouseEnter={() => setPostHovered(true)}
      onMouseLeave={() => setPostHovered(false)}
      onClick={() => navigate(`/pin-detail/${_id}`)}
      className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
      >
        <img  className="rounded-lg w-full" 
        src={urlFor(image).width(250).url()} 
        alt="user-post"/>

        {PostHovered && (
          <div
          className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 py-2 z-50' style={{ height : '100%'}}>

            <div className='flex items-center justify-between' onClick={(e) => e.stopPropagation}>
              <div className='flex gap-2'>
                {/* href for downloading img */}
                <a href={`${image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation}
                // what stop propgate does is prevents further on click behaviours in this case after download the image on click would navigate it to pin detail which is not necessary
                className='bg-white w-7 h-7 rounded-full flex items-center justify-center text-dark text-lg opacity-75 hover:opacity-100 hover:shadow-md outline-none'>
                    <MdDownloadForOffline/> 
                </a>
              </div>
              {aldreadySaved ? (
                <button type='button' className='bg-[#FFCA1F] opacity-70 hover:opacity-100 text-white text-sm px-6 py-1 rounded-3xl hover:shadow-md outline-none' disabled={aldreadySaved === true}>
                  Saved
                  &#40;By {save?.length}&#41; 
                </button>
              ) : (
                <button 
                onClick={(e) => {
                  e.stopPropagation();
                  savePin(_id);
                }}
                type='button' className='bg-[#FFCA1F] opacity-70 hover:opacity-100 text-white text-sm px-2 py-1 rounded-3xl hover:shadow-md outline-none'>
                  Save
                </button>
              )}
            </div>
             <div className='flex justify-between items-center gap-2 w-full'>
              {destination && (
                <a href={destination}
                target='_blank'
                rel='noreferrer'
                className='bg-white rounded-full flex items-center justify-center gap-2 p-[2px] text-sm pr-3 pl-2 opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                onClick={(e) => e.stopPropagation()}>
                 <BsFillArrowUpRightCircleFill/>
                 {destination.length > 20 ? destination.slice(8,20) : destination.slice(8)}
                </a>
              )}
              {postedBy?._id === userInfo?._id && (
                 <button
                 type='button'
                 onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className='bg-white opacity-70 hover:opacity-100 text-black text-sm px-2 py-1 rounded-3xl hover:shadow-md outline-none'
                 >
                  <AiTwotoneDelete/>
                 </button>
              )}
            </div> 
          </div>
        )}
      </div>
      <Link to={`user-profile/${postedBy?._id}`} className='flex gap-2 items-center mt-2'>
         <img src={postedBy?.image} alt="user" className='w-8 h-8 rounded-full object-cover'/>
         <p className='font-semibold capitalize'>{postedBy?.userName}</p>
      </Link>
    </div>
  )
 
}

export default Pin
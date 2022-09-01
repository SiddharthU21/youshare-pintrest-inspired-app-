import React ,{ useState, useEffect } from 'react'
import { MdOutlineFileDownload } from 'react-icons/md'
import { Link , useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { client , urlFor } from '../client';
import  MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery , pinDetailQuery } from '../utils/data';
import Spinner from './Spinner'


const PinDetail = ({ user }) => {

  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const { pinId } = useParams();

  const addComment = () => {
    if(comment) {
      setAddingComment(true);

      client.patch(pinId)
             .setIfMissing({ comments : []})
             .insert('after' , 'comments[-1]' , [{
                comment,
                _key : uuidv4(),
                postedBy : {
                  _type : 'postedBy',
                  _ref : user._id
                }
             }])
             .commit()
             .then(()=>{
              fetchPinDetails();
              setComment('');
              setAddingComment(false)
             })
    }
  }
 
  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId)
    
    if(query) {
      client.fetch(query)
            .then((data) => {
              setPinDetail(data[0])

              if(data[0]){
                query = pinDetailMorePinQuery(data[0]);
                client.fetch(query).then((res)=>{
                    setPins(res);
                })
              }
            })
    }
  } 

  useEffect(() => {

    fetchPinDetails();

  }, [pinId])
  

  if(!pinDetail) return <Spinner message='Loading Pin'/>

  return (
    <>
    <div className='flex xl:flex-row flex-col m-auto bg-white' style={{ maxWidth : '1500px' , borderRadius : '32px'}}>
      <div className='flex justify-center items-center md:items-start'>
        <img src={pinDetail?.image && urlFor(pinDetail.image).url()} alt="user-post" className='rounded-t-3xl rounded-b-lg'/>
      </div>
      <div className='w-full p-5 flex-1 xl:min-w-620'>
        <div className='flex items-center justify-between'>
          <div className='flex gap-2 items-center'>
                <a href={`${pinDetail.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation}
                className='bg-white w-7 h-7 rounded-full flex items-center justify-center text-dark text-lg opacity-75 hover:opacity-100 hover:scale-125 hover:text-orang outline-none transition-all duration-150'>
                    <MdOutlineFileDownload/> 
                </a>
          </div>
          <a href={pinDetail.destination} className='hover:underline hover:text-orang transition-all duration-150' target='_blank' rel='noreferrer'>
            {pinDetail.destination.slice(0,32)}...
          </a>
        </div>
          <div>
            <div className='flex justify-between'>
                <h1 className='text-4xl font-semibold break-words mt-5'>
                  {pinDetail.title}
                </h1>
                <Link to={`user-profile/${pinDetail.postedBy?.image}`} className='flex gap-2 items-center mt-3 bg-[#FFCA1F] rounded-3xl p-2'>
                  <img src={pinDetail.postedBy?.image} alt="user" className='w-8 h-8 rounded-full object-cover'/>
                  <p className='font-semibold capitalize'>{pinDetail.postedBy?.userName}</p>
                </Link>
              </div>
              <p className='mt-3'>{pinDetail.about}</p>
          </div>

          <h2 className='mt-5 text-2xl'>Comments</h2>

            <div className='max-h-370 overflow-y-auto'>
              {pinDetail?.comments?.map((comment , i) => (
                  <div className='flex gap-2 items-center mt-5 bg-white rounded-lg' key={i}>
                     <img src={comment.postedBy.image} alt="user=profile" className='w-10 h-10 rounded-full cursor-pointer'/>
                     <div className='flex flex-col'>
                      <p className='font-semibold'>
                        {comment.postedBy.userName}
                      </p>
                      <p>{comment.comment}</p>
                     </div>
                  </div>
              ))}
            </div>
              <div className='flex flex-wrap mt-4 gap-3'>
                <Link to={`user-profile/${pinDetail.postedBy?.image}`} className='flex gap-2 items-center mt-3 bg-white rounded-lg'>
                    <img src={pinDetail.postedBy?.image} alt="user" className='w-10 h-10 rounded-full object-cover'/>
                </Link>
                <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Add a Comment' className='flex-1 outline-none border-b-2 border-gray-200 p-2 focus:border-[#Ffca1f] transition-all duration-200 ease-in w-full'/>
                <button type='button' className='bg-[#ff9800] text-white rounded-full font-semibold p-2 w-28 outline-none hover:opacity-75' onClick={addComment}>
                  {addingComment ? 'Posting Comment ...' : 'Post'}
                </button>
             </div>
      </div>
    </div>
    {pins?.length > 0 ? (
      <>
      <h2 className='text-center font-semibold text-2xl mt-8 mb-4'>
        More like this
      </h2>
      <MasonryLayout pins={pins}/>
      </>
    ) : (
      <Spinner message='Loading pins...'/>
    )}
    </>
  )
}

export default PinDetail
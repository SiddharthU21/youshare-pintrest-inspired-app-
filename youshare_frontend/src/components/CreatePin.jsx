import React,{ useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'

import { client } from '../client';
import Spinner from './Spinner'
import { categories } from '../utils/data' 

const CreatePin = ({ user }) => {

  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setwrongImageType] = useState(false);

  const navigate = useNavigate();

 
  const onDrop = (acceptedFiles) => {
    
    const { type , name } = acceptedFiles[0];

    if(type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff' || type === 'image/jpg')
    {
        setwrongImageType(false);
        setLoading(true);
        client.assets
              .upload('image' , acceptedFiles[0] , { contentType : type , filename : name})
              .then((doc) =>{
                setImageAsset(doc);
                setLoading(false);
              })
              .catch((err) =>[
                console.log('image upload error',err)
              ])
    } 
    else {
      setwrongImageType(true);
    }

  }


  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  
  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        category,
      };
      client.create(doc).then(() => {
        navigate('/');
      });
    } else {

      setFields(true);
      setTimeout(
        () => {
          setFields(false);
        },
        2000,
      );
    }
  };

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      { fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please fill in all the fields</p>
      )}
      <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
          <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
              <div className= {`flex justify-center items-center flex-col border-2 border-dashed ${ isDragActive ? 'border-[#FFCA1F]' : 'border-gray-300' } hover:border-[#FFCA1F] p-3 w-full h-420`} {...getRootProps()}>
                  {loading && <Spinner/>}
                  {wrongImageType && <p className='text-red-500'>! Wrong Image type !</p>}
                  <input {...getInputProps()}/>
                  {!imageAsset ? (
                      <div className='flex flex-col items-center justify-center h-full'>
                        <div className='flex flex-col justify-center items-center'>
                          <p className='font-bold text-2xl my-auto'>
                             <AiOutlineCloudUpload/>
                          </p>
                          <p className='text-lg'>Drop or Click to upload</p>
                        </div>
                        <p className='mt-2 text-gray-400'>
                            Use high-quality JPG, SVG, PNG, GIF less than 20 MB
                          </p>
                      </div>
                  
                    ) : (
                      <div className='relative h-full'>
                        <img src={imageAsset?.url} alt="uploaded pic" className='h-full w-full' />
                        <button type='button' className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out' onClick={() =>{
                          setImageAsset(null);
                        }}>
                          <MdDelete/>
                        </button>
                      </div>
                  )}
              </div>
          </div>
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
          {/* {user && (
            <div className='flex my-2 items-center bg-white rounded-lg'>
                <img src={user.image} alt="user-profile" className='w-10 h-10 rounded-full' />
            </div> 
          )} */}
           <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Add Title' className='outline-none w-full text-2xl border-b-2 border-gray-200 p-2 focus:border-[#FF9800] transition-all duration-200 ease-in'/>

           <input type="text" value={about} onChange={(e) => setAbout(e.target.value)} placeholder='Description' className='outline-none text-lg border-b-2 border-gray-200 p-2 focus:border-[#FF9800] transition-all duration-200 ease-in'/>

           <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder='Add Destination Link' className='outline-none text-lg border-b-2 border-gray-200 p-2 focus:border-[#FF9800] transition-all duration-200 ease-in'/>

           <div className='flex flex-col'>
              <div>
                <select onChange={(e) => setCategory(e.target.value)} className='outline-none w-4/5 text-gray-500 border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'>
                  <option value="others">Select Category</option>
                  {categories.map(( category => (
                    <option key={category.name} value={category.name} className='text-base border-0 outline-none capitalize bg-white text-black'>
                      {category.name}
                    </option>
                  )))}
                </select>
                <div className='flex justify-end items-end mt-5'>
                  <button type='button' className='bg-[#FFCA1F] text-white rounded-full font-semibold p-2 w-28 outline-none hover:opacity-75' onClick={savePin}>
                     Post
                  </button>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin
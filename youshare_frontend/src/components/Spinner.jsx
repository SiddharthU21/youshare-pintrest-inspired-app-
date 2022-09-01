import React from 'react'
import {  TailSpin } from 'react-loader-spinner'


const Spinner = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
      <TailSpin
      color='#FFCA1F'
      height={50}
      width={100}
      className='m-5'/>
      <p className='text-sm text-orang text-center px-2 py-1'>{message}</p>
      </div>
  )
}

export default Spinner
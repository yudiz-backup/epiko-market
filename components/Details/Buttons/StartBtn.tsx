import React from 'react'

const StartBtn = (props: any) => {
  const {pass} = props;
  return (
    <div onClick={pass} className='h-9 w-24 bg-gray-200 text-gray-500 text-xs font-semibold flex justify-center items-center cursor-pointer'>
        Start
    </div>
  )
}

export default StartBtn
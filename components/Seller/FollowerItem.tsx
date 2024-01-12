import React from 'react'

const FollowerItem = (props:any) => {
    const {data} = props;
  return (
    <div className='w-1/2 flex gap-5 p-2 hover:bg-gray-100 cursor-pointer'>
        <img className='w-14 h-14' src={data.image_url} alt="" />
        <div className='flex flex-col gap-0 justify-between items-start text-xs font-semibold'>
            <h4>{data.name}</h4>
            <p>{data.price} ETH received</p>
            <span className='text-xs text-gray-400'>{data.days} days ago</span>
        </div>
    </div>
  )
}

export default FollowerItem
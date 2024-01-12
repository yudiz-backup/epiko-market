import React from 'react'

const PreviewCard = ({data, ...otherProps} :any) => {

  return (
    <div className='w-72 h-auto shadow-hero-card p-2 bg-white'>
        <h3 className='py-2 font-bold text-sm text-left'>Preview</h3>
        <img src={data.image_url} className='w-full h-80 cover' />
        <div className='flex justify-between items-center'>
            <div className='flex items-center justify-start gap-2 py-2'>
                <img src={data.seller_img} className='w-8 h-8 rounded-full' />
                <div className='flex flex-col items-start justify-center gap-0'>
                    <p className='text-sm font-bold'>{data.name}</p>
                    <span className='text-xs text-gray-500'>{data.stock} in Stock</span>
                </div>
            </div>
            <div className='flex flex-col justify-center items-center gap-0 px-1 '>
                <span className='text-xs text-gray-400'>{data.saleType}</span>
                <div className='border-2 border-green-500 rounded text-green-500 text-xs px-1 flex justify-center items-center'>
                    <span>{data.price} ETH</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PreviewCard
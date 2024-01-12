import React from 'react'
import ItemSlider from './ItemSlider'

const WrappedItemSlider = (props) => {
  return (
    <div className='w-full bg-gray-50 mt-20 pb-20'>
        <ItemSlider {...props} />
    </div>
  )
}

export default WrappedItemSlider
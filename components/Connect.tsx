import React from 'react'
import { VscArrowRight } from 'react-icons/vsc'

const Connect = () => {
  return (
    <div className="contain flex flex-col justify-around gap-6 py-24 lg:flex-row lg:items-center tk-dystopian">
      <div className="flex flex-col gap-4 w-full lg:w-1/2">
        <p className="text-gray-400 text-xs">Looking to partner with us?</p>
        <h4 className="text-6xl lg:text-7xl font-bold">Let's Connect!</h4>
        <p className="text-gray-400 text-xs">
          If you are interested in building your own NFT project or becoming a strategic partner, reach out to our team to see how we can help.
        </p>
      </div>
      <div>
        <button className=" w-72 h-10 flex cursor-pointer items-center justify-center gap-3 gradient-btn">
          <span>Connect</span>
          <VscArrowRight />
        </button>
      </div>
    </div>
  )
}

export default Connect

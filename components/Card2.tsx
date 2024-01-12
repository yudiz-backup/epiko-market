import React from 'react'

const Card2 = () => {
  return (
    <div className=" h-44 w-36 bg-white flex flex-col justify-center items-center shadow-card">
      <div className=" w-28 flex items-center justify-center border-b-[1px] border-gray-300 py-5">
        <div className="relative">
          <img className="h-16 w-16" src="/assets/Card/seller1.png" alt="" />
          <img
            className="absolute bottom-0 right-0 h-5 w-5"
            src="/assets/icons/Creator Box-Verified acc-01.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 pt-2">
        <h2 className="font-semibold">Payton Harris</h2>
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="font-bold">2.65</span>
          <span className="font-light">ETH</span>
        </div>
      </div>
    </div>
  )
}

export default Card2

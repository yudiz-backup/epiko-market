import React from 'react'
import { BsArrowRight } from 'react-icons/bs'

const EpikoRegal = () => {
  return (
    <div className='contain'>
        <div className=' flex gap-20 regal-bg my-10 px-10'>
            <div className='left w-full lg:w-1/2 flex flex-col gap-5 items-start justify-center'>
                <h4 className='font-bold text-lg'>
                    Check out our P2E mobile gaming app!
                </h4>
                <h1 className='font-black text-7xl text-gradient'>
                    Epiko Regal
                </h1>
                <p className='text-sm pb-5'>
                    Epiko is a blockchain and gaming-based project developed by Wharf Street Studios Limited, incorporated in London. It aims to introduce Games, NFTs and Metaverse to create a first-generation platform offering Indian mythological characters and stories to the world. 
                </p>
                <a href='https://www.epikoregal.com'>
                    <div className='gradient-btn flex justify-center items-center gap-2 w-60'>
                        Learn More <BsArrowRight />
                    </div>
                </a>
            </div>
            <div className='right relative w-full lg:w-1/2'>
                <div className='w-full h-full p-5'>
                    <img src="/assets/img/pentagon.png" alt="" className='w-full' />
                </div>
                <div className='absolute top-0 left-0 w-full h-full p-5'>
                    <img src="/assets/img/regal.png" alt="" className='w-full' />
                </div>
            </div>
        </div>
    </div>
  )
}

export default EpikoRegal
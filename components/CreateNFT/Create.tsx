import React from 'react'
import { useRouter } from 'next/router'
import { BsArrowLeft } from 'react-icons/bs'
import { FiChevronRight } from 'react-icons/fi'

const Create = () => {
  const router = useRouter()
  return (
    <>
      <div className="w-full border-b border-gray-200 pt-32">
        <div className=" contain flex items-center justify-between pt-8">
          <div
            onClick={() => router.push('/')}
            className="flex w-40 items-center justify-center gap-2 normal-btn text-sm"
          >
            <BsArrowLeft />
            Back to home
          </div>
          <div className=" flex items-center justify-center gap-3 text-sm ">
            <span onClick={() => router.push('/')} className='cursor-pointer'>Home</span>
            <FiChevronRight />
            <span className="font-bold cursor-pointer">Create</span>
          </div>
        </div>
      </div>
      <div className="contain">
        <div className="py-5">
          <div className="flex items-center text-eGreen">
            <div className="flex h-9 w-9 items-start justify-end mb-1">
              <img src="/assets/icons/double_arrow.svg" alt="" />
            </div>
            <h2 className="text-2xl font-bold">Create Collectible</h2>
          </div>
        </div>
        <div className="pb-6">
          <p className="text-sm leading-10">
            Switch between options of single and multiple to choose the count of
            your NFTs that has to be created and start creating your fortune
            <br />
            Choose <span className="font-bold">“Single”</span> if you want your
            collectible to be one of a kind or{' '}
            <span className="font-bold">“Multiple”</span> if you want to sell
            one collectible multiple times
          </p>
        </div>
        <div className="mx-auto flex w-full flex-col items-start justify-center gap-4 lg:w-2/3 lg:flex-row">
          <div className="flex h-auto w-full flex-col items-center justify-start bg-gray-100 p-3 lg:w-1/2">
            <div className="h-48 w-full">
              <img
                className="h-auto w-full object-cover"
                src="/assets/img/create_single.png"
                alt=""
              />
            </div>
            <div
              onClick={() => router.push('/single')}
              className="my-5 flex h-8 w-32  items-center justify-center normal-btn text-sm"
            >
              Create Single
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-start bg-gray-100 p-3 lg:w-1/2">
            <div className="h-48 w-full">
              <img
                className="h-auto w-full"
                src="/assets/img/create_multiple.png"
                alt=""
              />
            </div>
            <div
              onClick={() => router.push('/multiple')}
              className="my-5 flex w-32 items-center justify-center gradient-btn text-sm"
            >
              Create Multiple
            </div>
          </div>
        </div>
        <div className="w-full py-5 text-center text-sm">
          We do not own your private keys and cannot access your funds without
          your confirmation..
        </div>
      </div>
    </>
  )
}

export default Create

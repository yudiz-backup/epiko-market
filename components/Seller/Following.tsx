import React from 'react'
import { VscArrowRight } from 'react-icons/vsc'
import Router from 'next/router'
import Link from 'next/link'

const Following = ({ followings }) => {
  console.log('followingsssss', followings)

  return (
    <div className="flex w-full flex-col gap-4">
      {followings.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <img src="/assets/img/nodatafound.svg" />
          <h5 className="font-semibold text-gray-400">No Data Found</h5>
        </div>
      ) : (
        followings?.map((data) => (
          <Link href={`/user/${data?._id}`}>
            <div className="flex cursor-pointer justify-between gap-3 bg-gray-100 py-5 px-7 hover:bg-gray-200">
              <div className="flex gap-3">
                <div className="h-14 w-14 bg-white">
                  <img
                    className="h-full w-full object-cover"
                    src={data?.sProfilePicUrl}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null // prevents looping
                      currentTarget.src = '/assets/img/upload_photo.png'
                    }}
                    alt=""
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <p className="text-sm font-semibold text-gray-600">
                    {/* {data?.sWalletAddress} */}
                    {data?.sWalletAddress?.slice(0, 9) +
                      ' ... ' +
                      data?.sWalletAddress?.slice(
                        data?.sWalletAddress.length - 5
                      )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {data?.aFollowers.length} Followers
                  </p>
                </div>
              </div>
              <div className="flex self-center text-xl">
                <VscArrowRight />
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}

export default Following

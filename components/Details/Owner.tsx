import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const Owner = ({ details }) => {
  const router = useRouter()
  return (
    <>
      <Link href={`/user/${details?._id}`}>
        <div className="flex cursor-pointer items-center justify-start gap-2 border-b-[1px] border-gray-300 pt-5 pb-3">
          <img
            src={details?.sProfilePicUrl}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null // prevents looping
              currentTarget.src = '/assets/img/upload_photo.png'
            }}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex flex-col items-start justify-center gap-0">
            <span className="text-xs text-gray-500">Owner</span>
            <p className=" text-sm">{details?.sUserName}</p>
          </div>
        </div>
      </Link>
    </>
  )
}

export default Owner

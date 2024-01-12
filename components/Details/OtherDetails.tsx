import React from 'react'
import moment from 'moment'

const OtherDetails = ({ details }) => {
  return (
    <>
      <div className="flex items-center justify-start gap-2 border-b-[1px] border-gray-300 pt-5 pb-3">
        <img
          src={details?.sProfilePicUrl}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null // prevents looping
            currentTarget.src = '/assets/img/upload_photo.png'
          }}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex flex-col items-start justify-center gap-0">
          <span className="text-xs text-gray-500">Year Created</span>
          <p className=" text-sm">
            {moment(details?.createdAt).format('YYYY')}
          </p>
        </div>
      </div>
    </>
  )
}

export default OtherDetails

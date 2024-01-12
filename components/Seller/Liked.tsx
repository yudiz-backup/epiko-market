import React from 'react'
import Card from '../Card'
import LikedCard from '../LikedCard'

const Liked = ({ liked }) => {
  console.log('liked', liked)

  return (
    <div className="w-full">
      {liked?.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <img src="/assets/img/nodatafound.svg" />
          <h5 className="font-semibold text-gray-400">No Data Found</h5>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {liked?.map((data: any) => (
            <LikedCard data={data} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Liked

import React from 'react'

const HeroCard = ({ data }: any) => {
  return (
    <div className="mx-auto h-auto w-72 bg-white p-2 shadow-xl lg:w-80">
      <img
        src={data ? `https://ipfs.io/ipfs/${data?.sHash}` : ''}
        className="cover h-80 w-full object-cover"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-2 py-2">
          <img
            src={data?.oUser?.[0]?.sProfilePicUrl}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null // prevents looping
              currentTarget.src = '/assets/img/upload_photo.png'
            }}
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="flex flex-col items-start justify-center gap-0">
            <p className="text-sm font-bold">{data?.sName}</p>
            <span className="text-xs text-gray-500">
              {data?.nQuantity} in Stock
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-0 px-1 ">
          <span className="text-xs text-gray-400">Highest bid</span>
          <div className="flex items-center justify-center rounded border-2 border-green-500 px-1 text-xs text-green-500">
            <span>
              {data?.nBasePrice?.$numberDecimal} {data?.ePriceType}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroCard

import React from 'react'
import moment from 'moment'

const NotificationItem = ({ data }: any) => {
  return data?.sAction === 'Follow' ? (
    <div className="flex w-full cursor-pointer gap-5 p-2 hover:bg-gray-100">
      <div className="flex flex-col items-start justify-between gap-2 p-2 text-xs font-semibold">
        <h4> @{data?.oUser[0].sUserName} Followed You</h4>

        <span className="text-xs text-gray-400">
          {moment(data?.createdAt).fromNow()}
        </span>
      </div>
    </div>
  ) : data?.sAction === 'Like' ? (
    <div className="flex w-full cursor-pointer items-center gap-5 p-2 hover:bg-gray-100">
      <img
        className="h-14 w-14"
        src={`https://ipfs.io/ipfs/${data?.oNFT?.[0]?.sHash}`}
        alt=""
      />
      <div className="flex flex-col items-start gap-2 text-xs font-semibold">
        <p>Liked By {data?.oUser?.[0]?.sUserName}</p>
        <span className="text-xs text-gray-400">
          {moment(data?.createdAt).fromNow()}
        </span>
      </div>
    </div>
  ) : data?.sAction === 'Bid' ? (
    <div className="flex w-full cursor-pointer items-center gap-5 p-2 hover:bg-gray-100">
      <img
        className="h-14 w-14"
        src={`https://ipfs.io/ipfs/${data?.oNFT?.[0]?.sHash}`}
        alt=""
      />
      <div className="flex flex-col items-start gap-2 text-xs font-semibold">
        <p>{data?.oUser?.[0]?.sUserName} Placed a Bid</p>
        <span className="text-xs text-gray-400">
          {moment(data?.createdAt).fromNow()}
        </span>
      </div>
    </div>
  ) : (
    <div className="flex w-full cursor-pointer gap-5 p-2 hover:bg-gray-100">
      <img className="h-14 w-14" src={data.image_url} alt="" />
      <div className="flex flex-col items-start justify-between gap-0 text-xs font-semibold">
        <h4>{data.name}</h4>
        <p>{data.price} ETH received</p>
        <span className="text-xs text-gray-400">
          {moment(data?.createdAt).fromNow()}
        </span>
      </div>
    </div>
  )
}

export default NotificationItem

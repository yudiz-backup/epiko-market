import React from 'react'
import { useWeb3React } from '@web3-react/core'
import moment from 'moment'

const Bid = ({ data }) => {
  const { account, library: web3 } = useWeb3React()
  return data?.length === 0 ? (
    <div className="py-6 text-center text-sm">No Bid Found</div>
  ) : (
    data?.map((bid) => (
      <div key={bid?._id}>
        <div className="flex items-center justify-start gap-2 border-b-[1px] border-gray-300 pt-5 pb-3">
          <img
            src={bid?.oBidder?.[0]?.sProfilePicUrl}
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col items-start justify-center gap-0">
            <span className="text-xs text-gray-500">{moment(bid?.sCreated, 'YYYYMMDD').fromNow()}</span>
            <p className=" text-sm">
              Bid placed by {bid?.oBidder?.[0]?.sUserName} for {web3?.utils?.fromWei(bid?.nBidPrice?.$numberDecimal)}{' '}OMI
            </p>
          </div>
        </div>
      </div>
    ))
  )
}

export default Bid

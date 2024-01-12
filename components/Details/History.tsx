import { useWeb3React } from '@web3-react/core'
import React from 'react'
import moment from 'moment'

const History = ({ data }) => {
  const { account, library: web3 } = useWeb3React()
  console.log('historydata', data)

  return data?.length === 0 ? (
    <div className="py-6 text-center text-sm">No History Found</div>
  ) : (
    data?.map((bid) => (
      <div key={bid?._id}>
        <div className="flex items-center justify-start gap-2 border-b-[1px] border-gray-300 pt-5 pb-3">
          <img
            src={bid?.oBidder?.[0]?.sProfilePicUrl}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex flex-col items-start justify-center gap-0">
            <span className="text-xs text-gray-500">
              {moment(bid?.sCreated, 'YYYYMMDD').fromNow()}
            </span>
            {/* moment(bid?.sCreated, "YYYYMMDD").fromNow(); */}
            <p className=" text-sm">
              Bought by {bid?.oBidder?.[0]?.sUserName} for{' '}
              {web3?.utils?.fromWei(bid?.nBidPrice?.$numberDecimal)} OMI
              {/* bid?.nBidPrice?.$numberDecimal */}
            </p>
          </div>
        </div>
      </div>
    ))
  )
}

export default History

import axios from 'axios'
import React, { useState } from 'react'
import { GrClose } from 'react-icons/gr'
import url from "../../data";
import { useStateValue } from '../../context/context'

const StepOne = (props: any) => {
  const { closeBid, gotoNextSteps } = props
  const [bid, setBid] = useState()
  const [{ balance }] = useStateValue()
  const token = localStorage.getItem('auth_pass')
  const setBidding = () => {
    axios
      .post(`${url}/bid/create`,
        {
          eBidStatus: 'Bid',
          oRecipient: '', // ID OF NFT OWNER
          oNFTId: '', // ID OF N FT
          nBidPrice: bid, // BID PRICE
          sTransactionHash: '',
          nQuantity: '',
          nTokenID: '',
          sOwnerEmail: '',
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {})
  }

  return (
    <>
      <div className="h-auto w-[400px] bg-gray-100 px-7">
        <div className=" flex w-full items-center justify-between pt-7 pb-5">
          <h2 className="text-xl font-bold uppercase text-eGreen">
            Place a bid
          </h2>
          <div
            className="cursor-pointer rounded-full bg-gray-200 p-1"
            onClick={closeBid}
          >
            <GrClose />
          </div>
        </div>
        <div className="flex flex-col items-start justify-center gap-1 pb-3 text-sm">
          <p className="text-xs text-[#9A9A9A]">
            You are about to place a bid for
          </p>
          <p className="text-lg font-bold">Samurai,</p>
          <p className="text-sm text-black">
            Limited Edition by{' '}
            <span className="cursor-pointer font-semibold text-[#EE8FFF]">
              CR
            </span>
          </p>
        </div>
        <div className="flex h-auto w-full flex-col gap-2 border border-gray-300 p-4">
          <div className="flex items-center justify-between text-sm text-[#9A9A9A]">
            <span>Your Bid</span>
            {/* <span>Crypto Type</span> */}
          </div>
          <div className="flex border border-gray-300">
            <div className="h-10 w-2/3 border-r border-gray-300">
              <input
                className="h-full w-full px-3 text-sm"
                type="number"
                placeholder="Enter price for one piece"
                name="bid"
                id="bid"
                onChange={(e) => setBid(e.target.value)}
              />
            </div>
            {/* <div className="custom-select w-1/3">
              <select className="h-full w-full px-1 text-right">
                <option value="omi">OMI</option>
                <option value="eth">ETH</option>
              </select>
            </div> */}
          </div>
          <div className="flex items-center justify-between text-sm text-[#9A9A9A]">
            <span>Your balance</span>
            <span>{balance} OMI</span>
          </div>
          <div className="flex items-center justify-between text-sm text-[#9A9A9A]">
            <span>Your bidding balance</span>
            <span>0 OMI</span>
          </div>
          <div className="flex items-center justify-between text-sm text-[#9A9A9A]">
            <span>Service fee</span>
            <span>0</span>
          </div>
          <div className="flex items-center justify-between text-sm font-bold text-black">
            <span>Total bid amount</span>
            <span>{bid ? bid : 0}</span>
          </div>
        </div>
        <div className="flex items-center justify-center py-6">
          <div
            onClick={setBidding}
            className="shadow-place-bid-btn flex w-60 items-center justify-center gradient-btn"
          >
            Place a Bid
          </div>
        </div>
      </div>
    </>
  )
}

export default StepOne

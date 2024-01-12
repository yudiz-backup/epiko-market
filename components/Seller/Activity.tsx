import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import actionTypes from '../../context/action-types'
import { useStateValue } from '../../context/context'
import Data from '../Navbar/data'
import NotificationItem from '../Navbar/NotificationItem'
import url from "../../data";

const Activity = () => {
  const [checkMinted, setCheckMinted] = useState(false)
  const [checkBids, setCheckBids] = useState(false)
  const [{ activity }, dispatch] = useStateValue()

  useEffect(() => {
    const token = localStorage.getItem('auth_pass')
    if(token) {
      axios
      .get(`${url}/user/activity`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        dispatch({
          type: actionTypes.SET_ACTIVITY,
          payload: response?.data?.data?.data,
        })
      })
      .catch((error) => {
        console.error(error)
      })
    }
  }, [])

  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row">
      <div className="h-auto w-full">
        {activity?.length === 0 ? (
          <div className="w-full font-semibold">NO USER ACTIVITY FOUND</div>
        ) : (
          activity?.map((data, index) => (
            <div key={index} className="shadow-notification mb-2">
              <NotificationItem data={data} />
            </div>
          ))
        )}
      </div>

      {activity.length !== 0 && (
        <div className="shadow-notification h-60 w-full px-10 md:w-[60%]">
          <h2 className="py-7 text-lg font-black">Filters</h2>
          <div className="flex flex-col gap-2">
            <div
              className=" flex items-center justify-start gap-2 pb-3 text-sm"
              onClick={() => setCheckMinted(!checkMinted)}
            >
              <input
                type="checkbox"
                name=""
                id="minted"
                onChange={() => setCheckMinted(!checkMinted)}
              />
              <span
                className={`checkbox flex items-center justify-center ${
                  checkMinted ? 'checkbox--active' : ''
                }`}
                aria-hidden="true"
              >
                <AiOutlineCheck />
              </span>
              <p onClick={() => setCheckMinted(!checkMinted)}>Minted</p>
            </div>
            <div
              className=" flex items-center justify-start gap-2 text-sm"
              onClick={() => setCheckBids(!checkBids)}
            >
              <input
                type="checkbox"
                name=""
                id="bids"
                onChange={() => setCheckBids(!checkBids)}
              />
              <span
                className={`checkbox flex items-center justify-center ${
                  checkBids ? 'checkbox--active' : ''
                }`}
                aria-hidden="true"
              >
                <AiOutlineCheck />
              </span>
              <p onClick={() => setCheckBids(!checkBids)}>Bids</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Activity

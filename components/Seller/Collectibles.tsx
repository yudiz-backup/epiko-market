import axios from 'axios'
import React, { useEffect, useState } from 'react'
import actionTypes from '../../context/action-types'
import { useStateValue } from '../../context/context'
import url from '../../data'
import Card from '../Card'
import ProfileCard from '../ProfileCard'

const Collectibles = ({ user, collectibles }) => {
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    user !== undefined &&
      axios.get(`${url}/user/getUserDetails/${user}`).then((response) => {
        console.log(
          'responsefromuseridd',
          setUserInfo(response?.data?.data?.data)
        )
      })
  }, [user])
  return (
    <div className="w-full">
      {collectibles.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <img src="/assets/img/nodatafound.svg" />
          <h5 className="font-semibold text-gray-400">No Data Found</h5>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collectibles?.map((data: any) => (
            <ProfileCard userInfo={userInfo} data={data} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Collectibles

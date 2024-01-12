import React, { useEffect, useState } from 'react'
import Data from '../data'
import Card from '../Card'
import { useStateValue } from '../../context/context'
import axios from 'axios'
import actionTypes from '../../context/action-types'
import url from '../../data'
import ProfileCard from '../ProfileCard'

const Created = ({ user, createdNft }) => {
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
      {createdNft.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <img src="/assets/img/nodatafound.svg" />
          <h5 className="font-semibold text-gray-400">No Data Found</h5>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {createdNft?.map((data: any) => (
            <ProfileCard userInfo={userInfo} data={data} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Created

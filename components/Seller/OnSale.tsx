import axios from 'axios'
import React, { useEffect, useState } from 'react'
import actionTypes from '../../context/action-types'
import { useStateValue } from '../../context/context'
import Card from '../Card'
// import Data from '../data'
import url from '../../data'
import ProfileCard from '../ProfileCard'

const OnSale = ({ user, onSale }) => {
  const [{ onSaleNft }, dispatch] = useStateValue()
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

  const getOnSaleNFT = () => {
    const token = localStorage.getItem('auth_pass')

    token !== null &&
      axios
        .post(
          `${url}/nft/myNfts`,
          {
            length: 1,
            start: 1,
            sTextsearch: '',
            sCategory: 'All',
            sSortingType: '',
            sSellingType: 'Auction',
          },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((response) =>
          dispatch({
            type: actionTypes.SET_NFT_CREATED_BY_USER,
            payload: response?.data?.data?.data,
          })
        )
        .catch((error) => {
          console.error(error)
          localStorage.removeItem('auth_pass')
        })
  }

  const token = localStorage.getItem('auth_pass')

  return (
    <div className="w-full">
      {onSale === 0 || onSale?.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <img src="/assets/img/nodatafound.svg" />
          <h5 className="font-semibold text-gray-400">No Data Found</h5>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {onSale?.map((data: any) => (
            <ProfileCard userInfo={userInfo} data={data} />
          ))}
        </div>
      )}
      {/* {token === null && (
        <div className="w-full">
          <h3 className="text-center text-lg font-semibold uppercase">
            Please Login to your account
          </h3>
        </div>
      )}
      {token !== null && onSaleNft == 0 ? (
        <div className="w-full">
          <h3 className="text-center text-lg font-semibold uppercase">
            OOPS! No NFT Found
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {onSale !== 0 &&
            onSaleNft?.map((data: any) => <Card data={data} />)}
        </div>
      )} */}
    </div>
  )
}

export default OnSale

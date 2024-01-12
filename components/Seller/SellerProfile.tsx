import React, { useEffect, useState } from 'react'
import { BiGlobe } from 'react-icons/bi'
import { HiUserAdd, HiUserRemove } from 'react-icons/hi'
import BasicTabs from './Tabs'
import dynamic from 'next/dynamic'
import { useStateValue } from '../../context/context'
import axios from 'axios'
import actionTypes from '../../context/action-types'
import { Router, useRouter } from 'next/router'
import url from '../../data'
// const BasicTabs = dynamic(() => import('./Tabs'))
// import { dividerClasses } from '@mui/material'

const SellerProfile = ({ userProfile }) => {
  const token = localStorage.getItem('auth_pass')
  const [{ onSaleNft, profile }, dispatch] = useStateValue()
  const [follow, setFollow] = useState(false)

  useEffect(() => {
    getCreatedNFT()
  }, [])
  useEffect(() => {
    getOnSaleNFT()
  }, [])

  useEffect(() => {
    userProfile?.aFollowers?.filter((data) =>
      data?.sUserName === profile?.sUserName
        ? setFollow(true)
        : setFollow(false)
    )
  }, [userProfile, profile])

  const getCreatedNFT = () => {
    axios
      .post(`${url}/nft/nftListing`, {
        length: 10,
        start: 0,
        sTextsearch: '',
        sCategory: 'All',
        sSortingType: 'Recently Added',
        sSellingType: '',
      })
      .then((response) => {
        dispatch({
          type: actionTypes.SET_NFT_CREATED_BY_USER,
          payload: response?.data?.data?.data,
        })
      })
  }

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
            type: actionTypes.SET_NFT_ONSALE,
            payload: response?.data?.data?.data,
          })
        )
        .catch((error) => {
          console.error(error)
          localStorage.removeItem('auth_pass')
        })
  }

  const unfollowUser = (userid) => {
    axios
      .put(
        `${url}/user/unfollow`,
        {
          followId: userid,
        },
        {
          headers: { Authorization: token },
        }
      )
      .then((response) => response.status === 200 && setFollow(false))
      .catch((error) => {
        console.log(error)
      })
  }
  const followUser = (userid) => {
    axios
      .put(
        `${url}/user/follow`,
        {
          followId: userid,
        },
        {
          headers: { Authorization: token },
        }
      )
      .then((response) => {
        console.log(response)
        response.status === 200 && setFollow(true)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className="flex flex-col items-center">
      <div className="h-96 w-full pt-10">
        <img
          className="h-full w-full object-cover"
          alt=""
          src={userProfile?.sCoverPicUrl}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null // prevents looping
            currentTarget.src = '/assets/img/bg_cover.png'
          }}
        />
      </div>
      <div className="shadow-profile -mt-36 flex w-[80%] flex-col items-center bg-white p-8 md:w-[40%] lg:hidden lg:w-full">
        <img
          className=" w-full object-cover"
          src={userProfile?.sProfilePicUrl}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null // prevents looping
            currentTarget.src = '/assets/img/upload_photo.png'
          }}
          alt=""
        />
        <div className="flex flex-col items-center justify-start py-6">
          <h3 className="text-xl font-bold">{userProfile?.sUserName}</h3>
          <h4 className="pb-3 text-xs font-semibold">x8fhdifhd8hgg...hid</h4>
          <p className="p-2 pb-4 text-center text-xs text-gray-500">
            {userProfile?.sBio}
          </p>
          <a
            href={userProfile?.sPortfolioUrl}
            className="flex items-center justify-center gap-1 text-sm"
          >
            <BiGlobe /> {userProfile?.sPortfolioUrl}
          </a>
        </div>

        {follow ? (
          <div
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-1 bg-gray-500 text-white"
            onClick={() => unfollowUser(userProfile?._id)}
          >
            <HiUserRemove className="text-2xl" />
            <span className="text-sm">Unfollow</span>
          </div>
        ) : (
          <div
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-1 bg-ePinkX text-white"
            onClick={() => followUser(userProfile?._id)}
          >
            <HiUserAdd className="text-2xl" />
            <span className="text-sm">Follow</span>
          </div>
        )}
      </div>
      <div className="contain flex items-start justify-start gap-10">
        <div className="shadow-profile -mt-36 hidden min-h-[500px] w-1/4 flex-col items-center bg-white p-8 lg:flex">
          <img
            className="h-40 w-full object-cover"
            src={userProfile?.sProfilePicUrl}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null // prevents looping
              currentTarget.src = '/assets/img/upload_photo.png'
            }}
            alt=""
          />
          <div className="flex flex-col items-center justify-start py-6">
            <h3 className="text-xl font-bold">{userProfile?.sUserName}</h3>
            <h4 className="pb-3 text-xs font-semibold">x8fhdifhd8hgg...hid</h4>
            <p className="p-2 pb-4 text-center text-xs text-gray-500">
              {userProfile?.sBio}
            </p>
            <a
              href={userProfile?.sPortfolioUrl}
              className="flex items-center justify-center gap-1 text-sm"
            >
              <BiGlobe /> {userProfile?.sPortfolioUrl}
            </a>
          </div>
          {follow ? (
            <div
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-1 bg-gray-500 text-white"
              onClick={() => unfollowUser(userProfile?._id)}
            >
              <HiUserRemove className="text-2xl" />
              <span className="text-sm">Unfollow</span>
            </div>
          ) : (
            <div
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-1 bg-ePinkX text-white"
              onClick={() => followUser(userProfile?._id)}
            >
              <HiUserAdd className="text-2xl" />
              <span className="text-sm">Follow</span>
            </div>
          )}
        </div>
        <div className="h-auto w-full lg:w-3/4">
          <BasicTabs
            user={userProfile?._id}
            createdNft={userProfile?.oCreated}
            followers={userProfile?.aFollowers}
            following={userProfile?.aFollowing}
            liked={userProfile?.oLiked}
          />
        </div>
      </div>
    </div>
  )
}

export default SellerProfile

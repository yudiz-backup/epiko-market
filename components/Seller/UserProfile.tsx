import React, { useEffect } from 'react'
import { BiGlobe } from 'react-icons/bi'
import { HiUserAdd } from 'react-icons/hi'
import BasicTabs from './Tabs'
import dynamic from 'next/dynamic'
import { useStateValue } from '../../context/context'
import axios from 'axios'
import actionTypes from '../../context/action-types'
import { FiEdit } from 'react-icons/fi'
import { useRouter } from 'next/router'
import url from '../../data'
// const BasicTabs = dynamic(() => import('./Tabs'))
// import { dividerClasses } from '@mui/material'

const UserProfile = ({ profile }) => {
  const [{ onSaleNft, createdNft }, dispatch] = useStateValue()
  const id: any = localStorage.getItem('auth_pass')
  const shortenedId = id?.slice(0, 9) + ' ... ' + id?.slice(id.length - 5)
  const router = useRouter()
  console.log('profile', profile)

  useEffect(() => {
    getCreatedNFT()
  }, [])
  useEffect(() => {
    getOnSaleNFT()
  }, [])

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

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-96 w-full pt-10">
        <img
          className="h-full w-full object-cover"
          alt=""
          src={profile?.sCoverPicUrl}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null // prevents looping
            currentTarget.src = '/assets/img/bg_cover.png'
          }}
        />
        <div
          className="absolute top-40 hidden cursor-pointer items-center gap-3 place-self-end rounded-sm border border-white px-5 py-3 text-xs text-white lg:top-auto lg:bottom-6 lg:right-[15%] lg:flex"
          onClick={() => router.push('/profile-edit')}
        >
          <span>Edit Profile</span>
          <FiEdit />
        </div>
      </div>
      <div className="shadow-profile z-10 -mt-36 flex w-[70%] flex-col items-center bg-white p-8 sm:w-[60%] md:w-[40%] lg:hidden">
        <img
          className="lg:w-30 h-40 w-40 object-cover lg:h-32"
          src={profile?.sProfilePicUrl}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null // prevents looping
            currentTarget.src = '/assets/img/upload_photo.png'
          }}
          alt=""
        />
        <div className="flex flex-col items-center justify-start py-6">
          <h3 className="text-xl font-bold">{profile?.sUserName}</h3>
          <h4 className="pb-3 text-xs font-semibold">{shortenedId}</h4>
          <p className="p-2 pb-4 text-center text-xs text-gray-500">
            {profile?.sBio}
          </p>
          <a
            href={profile?.sPortfolioUrl}
            className="flex items-center justify-center gap-1 text-sm"
          >
            <BiGlobe /> {profile?.sPortfolioUrl}
          </a>
        </div>
      </div>
      <div className="contain flex gap-6">
        <div className="shadow-profile hidden h-[500px] w-1/4 -translate-y-1/3 flex-col items-center bg-white p-8 lg:flex">
          <img
            className="h-40 w-full object-cover"
            src={profile?.sProfilePicUrl}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null // prevents looping
              currentTarget.src = '/assets/img/upload_photo.png'
            }}
            alt=""
          />
          <div className="flex flex-col items-center justify-start py-6">
            <h3 className="text-xl font-bold">{profile?.sUserName}</h3>
            <h4 className="pb-3 text-xs font-semibold">{shortenedId}</h4>
            <p className="p-2 pb-4 text-center text-xs text-gray-500">
              {profile?.sBio}
            </p>
            <a
              href={profile?.sPortfolioUrl}
              className="flex items-center justify-center gap-1 text-sm"
            >
              <BiGlobe /> {profile?.sPortfolioUrl}
            </a>
          </div>
        </div>
        <div className="h-auto w-full lg:w-3/4">
          <BasicTabs
            user={profile?._id}
            createdNft={profile?.oCreated}
            followers={profile?.aFollowers}
            following={profile?.aFollowing}
            liked={profile?.oLiked}
          />
        </div>
      </div>
    </div>
  )
}

export default UserProfile

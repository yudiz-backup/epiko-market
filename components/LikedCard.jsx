import React, { useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import Router from 'next/router'
import axios from 'axios'
import { useStateValue } from '../context/context'
import url from '../data'
import Link from 'next/link'

const LikedCard = ({ data }) => {
  const [{ profile }, dispatch] = useStateValue()
  const token = localStorage.getItem('auth_pass')
  const [like, setLike] = useState(false)
  const [likeNum, setLikeNum] = useState(data?.aLikes.length)
  const [userInfo, setUserInfo] = useState({})

  console.log('likedcarddataaa', data)

  useEffect(() => {
    axios
      .get(`${url}/user/getUserDetails/${data?.oCurrentOwner}`)
      .then((response) => {
        console.log(
          'responsefromuseridd',
          setUserInfo(response?.data?.data?.data)
        )
      })
  }, [data])

  useEffect(() => {
    data?.aLikes?.filter((id) =>
      id == profile?._id ? setLike(true) : setLike(false)
    )
  }, [data, profile?._id])

  const likeNft = () => {
    axios
      .put(
        `${url}/nft/like`,
        {
          nNftId: data?._id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        if (response?.status === 200) {
          setLike(true)
          setLikeNum(likeNum + 1)
        }
      })
      .catch((err) => console.log(err))
  }

  const unlikeNft = () => {
    axios
      .put(
        `${url}/nft/unlike`,
        {
          nNftId: data?._id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        if (response?.status === 200) {
          setLike(false)
          setLikeNum(likeNum - 1)
        }
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className="card-big flex w-full cursor-pointer flex-col gap-1 sm:h-[420px]">
      <div className="relative h-80 w-full overflow-hidden">
        <Link href={`/item/${data?._id}`}>
          <img
            src={data ? `https://ipfs.io/ipfs/${data?.sHash}` : ''}
            className="cover h-full w-full object-cover"
            alt=""
          />
        </Link>

        {like ? (
          <div
            className="like-box absolute bottom-0 right-0 flex h-9 w-16 items-center justify-center bg-[#f08cfc] text-white"
            onClick={unlikeNft}
          >
            <div className="flex gap-1">
              <div className="flex items-center  justify-center gap-1">
                <AiFillHeart /> {likeNum}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="like-box absolute bottom-0 right-0 flex h-9 w-16 items-center justify-center bg-gray-700 text-white"
            onClick={likeNft}
          >
            <div className="flex gap-1">
              <div className="flex items-center  justify-center gap-1">
                <AiOutlineHeart /> {likeNum}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="h-1/3 w-full bg-eGray p-2">
        <div className="flex w-full flex-col gap-1 border-b-[1px] border-gray-300 px-1 pb-2">
          <Link href={`/item/${data?._id}`}>
            <div className="flex h-1/2 w-full items-center justify-start">
              <h1 className="card-name font-bold">{data?.sName}</h1>
            </div>
          </Link>
          <div className="h-1/2 w-full">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <div className="h-6 w-6 overflow-hidden rounded-full">
                  <img
                    src={userInfo?.sProfilePicUrl}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null // prevents looping
                      currentTarget.src = '/assets/img/upload_photo.png'
                    }}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <Link href={`/user/${userInfo?._id}`}>
                  <h3 className="whitespace-nowrap text-xs font-light text-gray-800 no-underline">
                    {userInfo?.sUserName}
                  </h3>
                </Link>
              </div>
              <div>{data?.nQuantity} in stock</div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-1 py-2 px-1">
          <div className="flex w-full items-center text-xs font-light">
            Reserve Price
          </div>
          <div className="h-2/3">
            <div className="inline w-auto border-2 border-green-500 p-[4px] text-xs text-green-500">
              {data?.nBasePrice?.$numberDecimal} {data?.ePriceType}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LikedCard

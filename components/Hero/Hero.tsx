import Link from 'next/link'
import React, { useEffect } from 'react'
import { IoCreateOutline } from 'react-icons/io5'
import { BsArrowUpRight } from 'react-icons/bs'
import CardHolder from './CardHolder'
import CardSwiper from './CardSwiper'
import axios from 'axios'
import url from '../../data'
import actionTypes from '../../context/action-types'
import { useStateValue } from '../../context/context'

const Hero = () => {
  const [{ createdNft }, dispatch] = useStateValue()
  useEffect(() => {
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
  }, [])

  return (
    <>
      <main className="py-16 md:py-20">
        <div className="contain tk-dystopian flex flex-col justify-between gap-10 lg:flex-row">
          <div className="right flex w-full flex-col items-start gap-5 pt-20 lg:w-3/5">
            <div>
              <img
                src="/assets/img/hero_subtitle.png"
                className="h-10 object-contain md:h-14"
                alt=""
              />
            </div>
            <div>
              <img src="/assets/img/hero_title.svg" className="h-32" alt="" />
            </div>
            <div className=" text-md tk-dystopian my-2 font-bold text-gray-500">
              <p className="pb-2">
                Digital marketplace for crypto collectibles and non-fungible
                tokens.{' '}
              </p>
              <p>Buy, sell and discover exclusive Indian digital assets.</p>
            </div>
            <div className="flex gap-5">
              <Link href="/discover">
                <div className="gradient-btn flex h-10 w-36 cursor-pointer items-center justify-center gap-2">
                  {/* bg-gradient-to-r from-[#38DEFF] via-[#EE8FFF] to-[#FFCF14] text-white */}
                  <span className=" text-sm">Discover</span>
                  <BsArrowUpRight className=" text-xl" />
                </div>
              </Link>
              <Link href="/create">
                <div className="shadow-button green-btn flex h-10 w-36 cursor-pointer items-center justify-center gap-2">
                  <span className=" text-sm">Create</span>
                  <IoCreateOutline className=" text-xl" />
                </div>
              </Link>
            </div>
            <div className="mt-10 flex gap-10 text-eGreen md:gap-14">
              <div>
                <h3 className="text-4xl font-semibold md:text-5xl">
                  32k<span className=" text-eAquaDark">+</span>
                </h3>
                <p className="text-md text-gray-400">artwork</p>
              </div>
              <div>
                <h3 className="text-4xl font-semibold md:text-5xl">
                  25k<span className=" text-[#EE8FFF]">+</span>
                </h3>
                <p className="text-md text-gray-400">auctions</p>
              </div>
              <div>
                <h3 className="text-4xl font-semibold md:text-5xl">
                  12k<span className=" text-[#FFD944]">+</span>
                </h3>
                <p className="text-md text-gray-400">artists</p>
              </div>
            </div>
          </div>
          <div className="left hidden w-2/5 lg:block">
            <CardHolder cardData={createdNft} />
          </div>
        </div>
      </main>
      <div className="left flex h-[500px] w-full bg-gray-100 pt-10 lg:hidden">
        <CardSwiper cardData={createdNft} />
      </div>
    </>
  )
}

export default Hero
